package database

import (
	"context"
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

type UserCreationParameters struct {
	Name string `json:"name"`
}

// Create User - Linked with Auth - SignUpHandler
func (apiCfg *ApiConfig) UserCreateHandler(data UserCreationParameters) (User, error) {

	user, err := apiCfg.DB.CreateUser(context.Background(), database.CreateUserParams{
		ID:        uuid.New(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Name:      data.Name,
	})

	if err != nil {
		return User{}, err
	}

	// UserNamingConversion just adds OUR naming that we need and not the generated from sqlc
	return UserNamingConversion(user), nil
}

// Get User
func (apiCfg *ApiConfig) UserGetHandler(w http.ResponseWriter, r *http.Request, user database.User) {
	// UserNamingConversion just adds OUR naming that we need and not the generated from sqlc
	utils.RespondWithJSON(w, 200, UserNamingConversion(user))
}
