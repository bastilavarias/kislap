package auth

import (
	"context"
	"crypto/sha256"
	"encoding/json"
	"errors"
	"flash/models"
	"flash/shared/jwt"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"gorm.io/gorm"
)

type Service struct {
	DB      *gorm.DB
	Context *gin.Context
}

type LoginResponse struct {
	AccessToken  string
	RefreshToken string
	User         models.User
}

func (service Service) Login(email string, password string) (*LoginResponse, error) {
	var user models.User

	dbUser := service.DB.Where("email = ?", email).First(&user)
	if errors.Is(dbUser.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("user not found")
	} else if dbUser.Error != nil {
		return nil, dbUser.Error
	}

	if user.Password == nil {
		return nil, errors.New("user has no password set")
	}

	userPassword := []byte(*user.Password)

	if err := bcrypt.CompareHashAndPassword(userPassword, []byte(password)); err != nil {
		return nil, errors.New("invalid password")
	}

	return service.generateTokens(&user)
}

func (service Service) Refresh(userID uint64, oldRefreshToken string) (*LoginResponse, error) {
	var user models.User

	if err := service.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	if user.RefreshToken == nil {
		return nil, errors.New("no refresh token stored")
	}

	digest := sha256.Sum256([]byte(oldRefreshToken))
	if bcrypt.CompareHashAndPassword([]byte(*user.RefreshToken), digest[:]) != nil {
		return nil, errors.New("invalid refresh token")
	}

	return service.generateTokens(&user)
}

func (service Service) GithubLogin(code string) (*LoginResponse, error) {
	var githubOAuthConfig = &oauth2.Config{
		RedirectURL:  os.Getenv("GITHUB_REDIRECT_URL"),
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		Scopes:       []string{"user:email"},
		Endpoint:     github.Endpoint,
	}

	token, err := githubOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		return nil, err
	}

	client := githubOAuthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://api.github.com/user")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var githubUser struct {
		ID        int64  `json:"id"`
		Name      string `json:"name"`
		Email     string `json:"email"`
		Login     string `json:"login"`
		AvatarURL string `json:"avatar_url"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&githubUser); err != nil {
		return nil, err
	}

	if githubUser.Email == "" {
		emailResp, _ := client.Get("https://api.github.com/user/emails")
		defer emailResp.Body.Close()
		var emails []struct {
			Email   string `json:"email"`
			Primary bool   `json:"primary"`
		}
		json.NewDecoder(emailResp.Body).Decode(&emails)
		for _, e := range emails {
			if e.Primary {
				githubUser.Email = e.Email
				break
			}
		}
	}

	firstName, lastName := parseGitHubName(githubUser.Name)
	var user models.User
	err = service.DB.Where("email = ?", githubUser.Email).First(&user).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		registeredUser := &models.User{
			FirstName: firstName,
			LastName:  lastName,
			Email:     githubUser.Email,
			Role:      "default",
			ImageURL:  &githubUser.AvatarURL,
		}
		emptyPassword := ""
		registeredUser.Password = &emptyPassword
		user = *registeredUser
	} else if err != nil {
		return nil, err
	}

	return service.generateTokens(&user)
}

func (service Service) generateTokens(user *models.User) (*LoginResponse, error) {
	accessTokenLifeSpan := 300
	accessToken, err := jwt.GenerateToken(*user, &accessTokenLifeSpan)
	if err != nil {
		return nil, err
	}

	refreshTokenLifeSpan := 604800
	refreshToken, err := jwt.GenerateToken(*user, &refreshTokenLifeSpan)
	if err != nil {
		return nil, err
	}

	hashedToken, err := jwt.HashToken(refreshToken)
	if err != nil {
		return nil, err
	}

	user.RefreshToken = &hashedToken
	if err := service.DB.Save(&user).Error; err != nil {
		return nil, err
	}

	return &LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         *user,
	}, nil
}

func parseGitHubName(fullName string) (string, string) {
	parts := strings.SplitN(fullName, " ", 2)
	first := parts[0]
	last := ""
	if len(parts) > 1 {
		last = parts[1]
	}
	return first, last
}
