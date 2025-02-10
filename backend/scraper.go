package main

import (
	"context"
	"database/sql"
	"fmt"
	"go-rss-scraper/database"
	database_internal "go-rss-scraper/internal/database"
	"go-rss-scraper/utils"
	"log"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
)

func StartScraper(
	db *database_internal.Queries,
	concurrency int,
	fetchInterval time.Duration,
) {
	log.Printf("Starting scraper with concurrency: %v and fetch interval: %v", concurrency, fetchInterval)

	ticker := time.NewTicker(fetchInterval)
	for ; ; <-ticker.C {
		feeds, err := db.GetNextFeedsToFetch(context.Background(), int32(concurrency))

		if err != nil {
			log.Printf("Error getting next feeds to fetch: %v", err)
			continue
		}

		wg := sync.WaitGroup{}
		for _, feed := range feeds {
			wg.Add(1)
			go scrapeFeed(feed, db, &wg)
		}
		wg.Wait()
	}
}

func scrapeFeed(feed database_internal.Feed, db *database_internal.Queries, wg *sync.WaitGroup) {
	defer wg.Done()

	_, err := db.MarkFeedAsFetched(context.Background(), feed.ID)
	if err != nil {
		log.Printf("Error marking feed as fetched: %v", err)
		return
	}

	rssFeed, err := utils.URLToFeed(feed.Url)
	if err != nil {
		log.Printf("Error fetching feed at: %v", feed.Url)
		return
	}

	for _, item := range rssFeed.Channel.Items {

		// Parse the date
		parsedTime, err := utils.ParseDate(item.PubDate)
		if err != nil {
			fmt.Println("Error parsing date:", err)
			return
		}

		// Convert the string to sql.NullString
		nullDescription := sql.NullString{
			String: "",
			Valid:  false,
		}

		if item.Description != "" {
			nullDescription = sql.NullString{
				String: item.Description,
				Valid:  true,
			}
		}
		_, err = database.CreatePostsHandler(db, database_internal.Post{
			ID:          uuid.New(),
			CreatedAt:   time.Now().UTC(),
			UpdatedAt:   time.Now().UTC(),
			Title:       item.Title,
			PublishedAt: parsedTime,
			Url:         item.Link,
			Description: nullDescription,
			FeedID:      feed.ID,
		})

		if err != nil {
			if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
				continue
			}
			log.Printf("Error creating post: %v", err)
			continue
		}
	}
	log.Printf("Found %v posts by fetching feed: %v", len(rssFeed.Channel.Items), feed.Name)
}
