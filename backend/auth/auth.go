package auth

import (
	"errors"
	"net/http"
	"strings"
)

// ExtractAPIKeyFromHeader will extract API Key from headers of the HTTP request
func ExtractAPIKeyFromHeader(headers http.Header) (string, error) {

	val := headers.Get("Authorization")
	if val == "" {
		return "", errors.New("no authentication info found")
	}

	// Split string on SPACES
	vals := strings.Split(val, " ")
	if len(vals) != 2 {
		return "", errors.New("malformed auth header")
	}

	if vals[0] != "ApiKey" {
		return "", errors.New("malformed first part of auth header")
	}

	return vals[1], nil
}
