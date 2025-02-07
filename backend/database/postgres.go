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

func ConnectDB() ApiConfig {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	connStr := os.Getenv("DATABASE_URL")

	// Open DB Connection
	conn, err := sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}

	apiCfg := ApiConfig{
		DB: database.New(conn),
	}

	// Connection check
	_, err = conn.Exec("SELECT 1")
	if err != nil {
		conn.Close()
		fmt.Println("database ping failed: %w", err)
	}

	// Setting DB to global variable
	DB = conn
	fmt.Println("[Backend]: Database connected!")
	return apiCfg
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
