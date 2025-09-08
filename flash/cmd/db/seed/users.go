package seed

import (
	"context"
	"log"

	"flash/ent"
	"golang.org/x/crypto/bcrypt"
)

func SeedUsers(client *ent.Client) {
	ctx := context.Background()

	users := []struct {
		FirstName, LastName, Email, Password, Role string
	}{
		{"Alice", "Smith", "alice@example.com", "password123", "member"},
		{"Bob", "Johnson", "bob@example.com", "password123", "member"},
		{"Admin", "User", "admin@example.com", "adminpass", "admin"},
	}

	for _, u := range users {
		// hash password
		hashed, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Printf("failed hashing password for %s: %v", u.Email, err)
			continue
		}

		_, err = client.User.
			Create().
			SetFirstName(u.FirstName).
			SetLastName(u.LastName).
			SetEmail(u.Email).
			SetPassword(string(hashed)).
			SetRole(u.Role).
			Save(ctx)

		if err != nil {
			log.Printf("failed creating user %s: %v", u.Email, err)
		} else {
			log.Printf("Created user %s", u.Email)
		}
	}
}
