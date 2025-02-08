package main

import (
	"go-rss-scraper/database"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	// load .env file and get PORT
	godotenv.Load(".env")
	portString := os.Getenv("PORT")

	if portString == "" {
		log.Fatal("$PORT must be set in env")
	}

	// Connect the DB and get API Config
	apiCfg, err := database.ConnectDB()
	if err != nil {
		log.Fatal(err)
	}
	defer database.CloseDB()

	// setup router and routes
	router := RoutesManager(&apiCfg)

	// Server starting
	server := &http.Server{
		Addr:    ":" + portString,
		Handler: router,
	}

	log.Printf("Server starting on PORT: %v", portString)
	err = server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
