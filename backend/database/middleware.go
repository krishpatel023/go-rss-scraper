package database

import (
	"fmt"
	"go-rss-scraper/auth"
	"go-rss-scraper/internal/database"
	"go-rss-scraper/utils"
	"net/http"
)

type AuthHandler func(http.ResponseWriter, *http.Request, database.User)

func (apiCfg *ApiConfig) MiddlewareAuth(handler AuthHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		apiKey, err := auth.ExtractAPIKeyFromHeader(r.Header)
		if err != nil {
			utils.RespondWithError(w, 403, fmt.Sprintf("Auth Error. Error extracting API Key %v", err))
			return
		}

		user, err := apiCfg.DB.GetUserByAPIKey(r.Context(), apiKey)

		if err != nil {
			utils.RespondWithError(w, 400, fmt.Sprintf("Couldn't get user %v", err))
			return
		}

		handler(w, r, user)
	}
}
