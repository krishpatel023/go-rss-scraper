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
	// Create User
	v1Router.Post("/users", apiCfg.UserCreateHandler)

	// Get User using API Key
	v1Router.Get("/users", apiCfg.UserGetHandler)
}
