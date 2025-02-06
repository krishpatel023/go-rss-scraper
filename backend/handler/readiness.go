package handler

import (
	"go-rss-scraper/utils"
	"net/http"
)

// Readiness handler
func ReadinessHandler(w http.ResponseWriter, r *http.Request) {
	response := map[string]string{"status": "ok"}
	utils.RespondWithJSON(w, http.StatusOK, response)
}
