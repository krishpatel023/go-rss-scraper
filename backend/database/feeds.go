package database

import (
	"fmt"
	"go-rss-scraper/internal/database"
	"go-rss-scraper/utils"
	"net/http"
	"time"

	"github.com/google/uuid"
)

// Feed Model
type Feeds struct {
	ID        uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Name      string    `json:"name"`
	Url       string    `json:"url"`
	UserID    uuid.UUID `json:"user_id"`
}

func FeedsNamingConversion(dbFeed database.Feed) Feeds {
	return Feeds{
		ID:        dbFeed.ID,
		CreatedAt: dbFeed.CreatedAt,
		UpdatedAt: dbFeed.UpdatedAt,
		Name:      dbFeed.Name,
		Url:       dbFeed.Url,
		UserID:    dbFeed.UserID,
	}
}

// Create Feed
func (apiCfg *ApiConfig) FeedCreateHandler(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		Name string `json:"name"`
		URL  string `json:"url"`
	}

	// It gets the params from the request
	params := utils.GetParams[parameters](r, w)
	if params == nil {
		return
	}

	feed, err := apiCfg.DB.CreateFeed(r.Context(), database.CreateFeedParams{
		ID:        uuid.New(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Name:      params.Name,
		Url:       params.URL,
		UserID:    user.ID,
	})

	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Couldn't create feed %v", err))
		return
	}

	// FeedsNamingConversion just adds OUR naming that we need and not the generated from sqlc
	utils.RespondWithJSON(w, 201, FeedsNamingConversion(feed))
}

// Get All Feeds
func (apiCfg *ApiConfig) FeedGetAllHandler(w http.ResponseWriter, r *http.Request) {
	feeds, err := apiCfg.DB.GetAllFeeds(r.Context())

	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Couldn't get feeds %v", err))
		return
	}

	// Convert to FeedsNamingConversion
	converted_feeds := []Feeds{}

	for _, feed := range feeds {
		converted_feeds = append(converted_feeds, FeedsNamingConversion(feed))
	}

	utils.RespondWithJSON(w, 200, converted_feeds)
}
