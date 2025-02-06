package main

import (
	"go-rss-scraper/handler"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	// load .env file and get PORT
	godotenv.Load(".env")
	portString := os.Getenv("PORT")

	if portString == "" {
		log.Fatal("$PORT must be set in env")
	}

	// start the server
	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	v1Router := chi.NewRouter()
	v1Router.Get("/health", handler.ReadinessHandler)
	v1Router.Get("/err", handler.ErrorHandler)

	router.Mount("/v1", v1Router)

	// Server starting
	server := &http.Server{
		Addr:    ":" + portString,
		Handler: router,
	}

	log.Printf("Server starting on PORT: %v", portString)
	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
