package handler

import (
	"go-rss-scraper/utils"
	"net/http"
)

func ErrorHandler(w http.ResponseWriter, r *http.Request) {
	utils.RespondWithError(w, 400, "Something went wrong")
}
