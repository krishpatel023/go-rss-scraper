package database

import (
	"fmt"
	"go-rss-scraper/internal/database"
	"go-rss-scraper/utils"
	"net/http"
	"time"

	"github.com/google/uuid"
)

// User Model
type User struct {
	ID        uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Name      string    `json:"name"`
	APIKey    string    `json:"api_key"`
}

func UserNamingConversion(dbUser database.User) User {
	return User{
		ID:        dbUser.ID,
		CreatedAt: dbUser.CreatedAt,
		UpdatedAt: dbUser.UpdatedAt,
		Name:      dbUser.Name,
		APIKey:    dbUser.ApiKey,
	}
}

// Create User
func (apiCfg *ApiConfig) UserCreateHandler(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Name string `json:"name"`
	}

	// It gets the params from the request
	params := utils.GetParams[parameters](r, w)
	if params == nil {
		return
	}

	user, err := apiCfg.DB.CreateUser(r.Context(), database.CreateUserParams{
		ID:        uuid.New(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Name:      params.Name,
	})

	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Couldn't create user %v", err))
		return
	}

	// UserNamingConversion just adds OUR naming that we need and not the generated from sqlc
	utils.RespondWithJSON(w, 201, UserNamingConversion(user))
}

// Get User
func (apiCfg *ApiConfig) UserGetHandler(w http.ResponseWriter, r *http.Request, user database.User) {
	// UserNamingConversion just adds OUR naming that we need and not the generated from sqlc
	utils.RespondWithJSON(w, 200, UserNamingConversion(user))
}
