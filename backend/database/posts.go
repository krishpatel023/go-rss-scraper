package database

import (
	"context"
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
type Posts struct {
	ID          uuid.UUID      `json:"id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	Title       string         `json:"title"`
	PublishedAt time.Time      `json:"published_at"`
	Url         string         `json:"url"`
	Description sql.NullString `json:"description"`
	FeedID      uuid.UUID      `json:"feed_id"`
}

func PostsNamingConversion(dbPost database.Post) Posts {
	return Posts{
		ID:          dbPost.ID,
		CreatedAt:   dbPost.CreatedAt,
		UpdatedAt:   dbPost.UpdatedAt,
		Title:       dbPost.Title,
		PublishedAt: dbPost.PublishedAt,
		Url:         dbPost.Url,
		Description: dbPost.Description,
		FeedID:      dbPost.FeedID,
	}
}

func CreatePostsHandler(db *database.Queries, post database.Post) (Posts, error) {
	created_post, err := db.CreatePost(context.Background(), database.CreatePostParams(PostsNamingConversion(post)))
	if err != nil {
		return Posts{}, err
	}

	return PostsNamingConversion(created_post), nil
}

func (apiCfg *ApiConfig) GetPostsForUserHandler(w http.ResponseWriter, r *http.Request, user database.User) {
	posts, err := apiCfg.DB.GetPostsForUser(r.Context(), database.GetPostsForUserParams{
		UserID: user.ID,
		Limit:  10,
	})
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Couldn't get posts for user. Error: %v", err))
		return
	}

	converted_posts := []Posts{}
	for _, post := range posts {
		converted_posts = append(converted_posts, PostsNamingConversion(post))
	}

	utils.RespondWithJSON(w, 201, converted_posts)

}

func (apiCfg *ApiConfig) GetPostsByFeedIDHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "feedID")
	parsed_id, err := uuid.Parse(id)

	if err != nil {
		utils.RespondWithError(w, 400, "Couldn't parse feed's UUID")
		return
	}

	// Get the posts by feed ID
	posts, err := apiCfg.DB.GetAllPostsByFeedID(r.Context(), parsed_id)
	if err != nil {
		utils.RespondWithError(w, 400, "Couldn't get posts by feed ID")
		return
	}

	converted_posts := []Posts{}
	for _, post := range posts {
		converted_posts = append(converted_posts, PostsNamingConversion(post))
	}

	utils.RespondWithJSON(w, 200, converted_posts)
}
