package database

import (
	"go-rss-scraper/internal/database"
	"go-rss-scraper/utils"
	"net/http"
)

func (apiCfg *ApiConfig) SignUpHandler(w http.ResponseWriter, r *http.Request) {

	// Get Params
	type parameters struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Name     string `json:"name"`
	}

	// It gets the params from the request
	params := utils.GetParams[parameters](r, w)
	if params == nil {
		return
	}

	// Create User
	user, err := apiCfg.UserCreateHandler(UserCreationParameters{
		Name: params.Name,
	})
	if err != nil {
		utils.RespondWithError(w, 400, "Couldn't create user")
		return
	}

	// Hashing of Password
	hashed_pass, err := utils.HashPassword(params.Password)
	if err != nil {
		utils.RespondWithError(w, 400, "Couldn't hash password")
		return
	}

	// Sign Up
	_, err = apiCfg.DB.SignUp(r.Context(), database.SignUpParams{
		Email:    params.Email,
		Password: hashed_pass,
		UserID:   user.ID,
	})
	if err != nil {
		utils.RespondWithError(w, 400, "Couldn't sign up user")
		return
	}

	// Respond
	utils.RespondWithJSON(w, 201, user)
}

func (apiCfg *ApiConfig) LoginHandler(w http.ResponseWriter, r *http.Request) {

	//  Get Params
	type parameters struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// It gets the params from the request
	params := utils.GetParams[parameters](r, w)
	if params == nil {
		return
	}

	// Get the user from AUTH
	auth, err := apiCfg.DB.GetUserAuthByEmail(r.Context(), params.Email)
	if err != nil {
		utils.RespondWithError(w, 400, "User not found")
		return
	}

	// Check Password
	err = utils.CheckPassword(auth.Password, params.Password)
	if err != nil {
		utils.RespondWithError(w, 400, "Incorrect Password")
		return
	}

	// Get User
	user, err := apiCfg.DB.GetUserByUserID(r.Context(), auth.UserID)
	if err != nil {
		utils.RespondWithError(w, 400, "Couldn't get user")
		return
	}

	// Respond
	utils.RespondWithJSON(w, 200, UserNamingConversion(user))
}
