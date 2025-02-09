package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// GetParams decodes JSON request body into the provided struct.
func GetParams[T any](r *http.Request, w http.ResponseWriter) *T {
	decoder := json.NewDecoder(r.Body)
	params := new(T)

	err := decoder.Decode(params)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, fmt.Sprintf("Error parsing JSON: %v", err))
		return nil
	}

	return params
}
