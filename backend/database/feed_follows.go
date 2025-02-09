package database

import (
	"fmt"
	"go-rss-scraper/internal/database"
	"go-rss-scraper/utils"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/google/uuid"
)

// Feed Follow Model
type FeedsFollow struct {
	ID        uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	FeedID    uuid.UUID `json:"feed_id"`
	UserID    uuid.UUID `json:"user_id"`
}

func FeedsFollowNamingConversion(dbFeedFollow database.FeedFollow) FeedsFollow {
	return FeedsFollow{
		ID:        dbFeedFollow.ID,
		CreatedAt: dbFeedFollow.CreatedAt,
		UpdatedAt: dbFeedFollow.UpdatedAt,
		FeedID:    dbFeedFollow.FeedID,
		UserID:    dbFeedFollow.UserID,
	}
}

// Create Feed Follow
func (apiCfg *ApiConfig) FeedFollowCreateHandler(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		FeedID uuid.UUID `json:"feed_id"`
	}

	// It gets the params from the request
	params := utils.GetParams[parameters](r, w)
	if params == nil {
		return
	}

	feed_follow, err := apiCfg.DB.CreateFeedFollow(r.Context(), database.CreateFeedFollowParams{
		ID:        uuid.New(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		FeedID:    params.FeedID,
		UserID:    user.ID,
	})

	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Couldn't follow feed %v", err))
		return
	}

	// FeedsFollowNamingConversion just adds OUR naming that we need and not the generated from sqlc
	utils.RespondWithJSON(w, 201, FeedsFollowNamingConversion(feed_follow))
}

// Get feeds that a user follows
func (apiCfg *ApiConfig) FeedFollowGetHandler(w http.ResponseWriter, r *http.Request, user database.User) {
	feeds_user_follows, err := apiCfg.DB.GetAllFeedUserFollows(r.Context(), user.ID)

	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Couldn't get feeds %v", err))
		return
	}

	// Convert to FeedsNamingConversion
	converted_feeds := []FeedsFollow{}

	for _, feed := range feeds_user_follows {
		converted_feeds = append(converted_feeds, FeedsFollowNamingConversion(feed))
	}

	utils.RespondWithJSON(w, 200, converted_feeds)
}

// Delete Feed Follow - unfollow
func (apiCfg *ApiConfig) FeedFollowDeleteHandler(w http.ResponseWriter, r *http.Request, user database.User) {

	id := chi.URLParam(r, "feedFollowID")
	parsed_id, err := uuid.Parse(id)

	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Couldn't parse feed follow id %v", err))
		return
	}

	err = apiCfg.DB.DeleteFeedFollow(r.Context(), database.DeleteFeedFollowParams{
		ID:     parsed_id,
		UserID: user.ID,
	})

	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Couldn't unfollow feed %v", err))
		return
	}

	utils.RespondWithJSON(w, 200, struct{}{})
}
