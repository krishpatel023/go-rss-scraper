package database

import (
	"database/sql"
	"fmt"
	"go-rss-scraper/internal/database"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

type ApiConfig struct {
	DB *database.Queries
}

func ConnectDB() (ApiConfig, error) {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("[Backend]: Error in connecting to Database!")
		return ApiConfig{}, fmt.Errorf("error loading .env: %w", err)
	}
	connStr := os.Getenv("DATABASE_URL")

	// Open DB Connection
	conn, err := sql.Open("postgres", connStr)
	if err != nil {
		fmt.Println("[Backend]: Error in connecting to Database!")
		return ApiConfig{}, fmt.Errorf("error: %w", err)
	}

	apiCfg := ApiConfig{
		DB: database.New(conn),
	}

	// Connection check
	err = conn.Ping()
	if err != nil {
		conn.Close()
		fmt.Println("[Backend]: Error in connecting to Database!")
		return ApiConfig{}, fmt.Errorf("database ping failed : %w", err)
	}

	// Setting DB to global variable
	DB = conn
	fmt.Println("[Backend]: Database connected!")
	return apiCfg, nil
}

func CloseDB() error {
	if DB != nil {
		if err := DB.Close(); err != nil {
			return fmt.Errorf("error closing database connection: %w", err)
		}
		log.Println("[Backend]: Database disconnected!")
	}
	return nil
}
