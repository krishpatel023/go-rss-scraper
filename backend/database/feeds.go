package database

import (
	"database/sql"
	"fmt"
	"go-rss-scraper/internal/database"
	"go-rss-scraper/utils"
	"net/http"
	"time"

	"github.com/go-chi/chi"
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

func (apiCfg *ApiConfig) ValidateRSSFeedURL(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		URL string `json:"url"`
	}

	// It gets the params from the request
	params := utils.GetParams[parameters](r, w)
	if params == nil {
		return
	}

	// It validates the RSS feed URL
	_, err := utils.URLToFeed(params.URL)
	if err != nil {
		utils.RespondWithError(w, 400, "Couldn't validate feed URL")
		return
	}

	// It checks if the RSS feed URL is already in the database
	feed, err := apiCfg.DB.GetFeedByURL(r.Context(), params.URL)
	if err != nil && err != sql.ErrNoRows {
		utils.RespondWithError(w, 400, "Couldn't validate feed URL")
		return
	}

	if feed.ID != uuid.Nil {
		utils.RespondWithError(w, 400, "Feed already exists.")
		return
	}

	utils.RespondWithJSON(w, 200, map[string]string{
		"message": "Feed URL is valid",
	})
}

func (apiCfg *ApiConfig) GetFeedByIDHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "feedID")
	parsed_id, err := uuid.Parse(id)

	if err != nil {
		utils.RespondWithError(w, 400, "Couldn't parse feed's UUID")
		return
	}

	// Get the posts by feed ID
	feed, err := apiCfg.DB.GetFeedByID(r.Context(), parsed_id)
	if err != nil {
		utils.RespondWithError(w, 400, "Couldn't get posts by feed ID")
		return
	}

	utils.RespondWithJSON(w, 200, FeedsNamingConversion(feed))
}
