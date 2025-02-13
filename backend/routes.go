package main

import (
	"go-rss-scraper/database"
	"go-rss-scraper/handler"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
)

// Handles router creation and mounting
func RoutesManager(apiCfg *database.ApiConfig) *chi.Mux {

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	// v1 router - sub-router for /v1
	// easy when adding new versions
	v1Router := chi.NewRouter()

	DefaultRoutes(v1Router)
	UserRoutes(v1Router, apiCfg)
	FeedRoutes(v1Router, apiCfg)
	FeedFollowRoutes(v1Router, apiCfg)
	PostsRoutes(v1Router, apiCfg)
	AuthRoutes(v1Router, apiCfg)

	router.Mount("/v1", v1Router)
	return router
}

// Default routes - health and error
func DefaultRoutes(v1Router *chi.Mux) {
	v1Router.Get("/health", handler.ReadinessHandler)
	v1Router.Get("/err", handler.ErrorHandler)
}

// User routes - all about users
func UserRoutes(v1Router *chi.Mux, apiCfg *database.ApiConfig) {
	// Get User using API Key
	v1Router.Get("/users", apiCfg.MiddlewareAuth(apiCfg.UserGetHandler))
}

// Feed routes - all about feeds
func FeedRoutes(v1Router *chi.Mux, apiCfg *database.ApiConfig) {
	// Create Feed
	v1Router.Post("/feeds", apiCfg.MiddlewareAuth(apiCfg.FeedCreateHandler))

	// Get All Feeds
	v1Router.Get("/feeds", apiCfg.FeedGetAllHandler)

	// Validate RSS Feed URL
	v1Router.Post("/feeds/validate-rss", apiCfg.ValidateRSSFeedURL)
}

// Feed Follow routes - all about feed follows
func FeedFollowRoutes(v1Router *chi.Mux, apiCfg *database.ApiConfig) {
	// Create Feed Follow
	v1Router.Post("/feed_follows", apiCfg.MiddlewareAuth(apiCfg.FeedFollowCreateHandler))

	// Get All Feed That User Follows
	v1Router.Get("/feed_follows", apiCfg.MiddlewareAuth(apiCfg.FeedFollowGetHandler))

	// Delete Feed Follow - unfollow
	v1Router.Delete("/feed_follows/{feedFollowID}", apiCfg.MiddlewareAuth(apiCfg.FeedFollowDeleteHandler))
}

// Posts routes
func PostsRoutes(v1Router *chi.Mux, apiCfg *database.ApiConfig) {
	// Get Posts For User
	v1Router.Get("/users/latest_posts", apiCfg.MiddlewareAuth(apiCfg.GetPostsForUserHandler))
}

// Auth routes
func AuthRoutes(v1Router *chi.Mux, apiCfg *database.ApiConfig) {
	// SignUp
	v1Router.Post("/auth/signup", apiCfg.SignUpHandler)

	// Login
	v1Router.Post("/auth/login", apiCfg.LoginHandler)
}
