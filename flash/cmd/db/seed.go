package main

import (
	"flash/cmd/db/seed"
	"flash/database"
	"log"
)

func main() {
	log.Println("Seeding database...")

	client := database.InitDatabase()
	defer client.Close()

	seed.SeedUsers(client)

	log.Println("Seeding complete ✅")
}
