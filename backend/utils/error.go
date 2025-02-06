package utils

import (
	"log"
	"net/http"
)

func RespondWithError(w http.ResponseWriter, code int, msg string) {

	// Error message above the 499 are server side and things that we need to look at
	// Thus logging it is a good practice
	if code > 499 {
		log.Println("Responding with 5XX error:", msg)
	}

	type errResponse struct {
		Error string `json:"error"`
	}

	RespondWithJSON(w, code, errResponse{
		Error: msg,
	})
}
