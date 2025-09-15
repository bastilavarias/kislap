package main

import (
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/joho/godotenv"

	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	_ = godotenv.Load()

	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// ✅ multiStatements allows multiple queries in one file (important!)
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?multiStatements=true&parseTime=true",
		dbUser, dbPass, dbHost, dbPort, dbName)

	// Handle migration creation (doesn’t need DB connection)
	if len(os.Args) >= 2 && os.Args[1] == "create" {
		if len(os.Args) < 3 {
			log.Fatal("usage: migrate create <name>")
		}
		createMigration(os.Args[2])
		return
	}

	// Open DB connection
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("could not connect to DB: %v", err)
	}
	defer db.Close()

	driver, err := mysql.WithInstance(db, &mysql.Config{})
	if err != nil {
		log.Fatalf("could not create migrate driver: %v", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations",
		"mysql", driver,
	)
	if err != nil {
		log.Fatalf("could not init migrate: %v", err)
	}

	if len(os.Args) < 2 {
		log.Fatal("please provide migrate command: up | down | reset | refresh | redo | drop | force | steps | create")
	}

	cmd := os.Args[1]
	switch cmd {

	case "up":
		if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
			log.Fatalf("migration up failed: %v", err)
		}
		fmt.Println("✅ migrations applied")

	case "down":
		// Laravel-style rollback (just last migration)
		if err := m.Steps(-1); err != nil && !errors.Is(err, migrate.ErrNoChange) {
			log.Fatalf("rollback failed: %v", err)
		}
		fmt.Println("✅ rolled back last migration")

	case "reset":
		// Rollback all migrations
		if err := m.Down(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
			log.Fatalf("reset failed: %v", err)
		}
		fmt.Println("✅ all migrations rolled back")

	case "refresh":
		// Reset + re-run all
		if err := m.Down(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
			log.Fatalf("refresh reset failed: %v", err)
		}
		if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
			log.Fatalf("refresh migrate up failed: %v", err)
		}
		fmt.Println("✅ migrations refreshed")

	case "redo":
		// Rollback last migration then reapply
		if err := m.Steps(-1); err != nil && !errors.Is(err, migrate.ErrNoChange) {
			log.Fatalf("redo rollback failed: %v", err)
		}
		if err := m.Steps(1); err != nil && !errors.Is(err, migrate.ErrNoChange) {
			log.Fatalf("redo apply failed: %v", err)
		}
		fmt.Println("✅ redid last migration")

	case "drop":
		if err := m.Drop(); err != nil {
			log.Fatalf("drop failed: %v", err)
		}
		fmt.Println("✅ database dropped")

	case "force":
		if len(os.Args) < 3 {
			log.Fatal("usage: migrate force <version>")
		}
		version, err := strconv.Atoi(os.Args[2])
		if err != nil {
			log.Fatalf("invalid version: %v", err)
		}
		if err := m.Force(version); err != nil {
			log.Fatalf("force failed: %v", err)
		}
		fmt.Println("✅ force applied")

	case "steps":
		if len(os.Args) < 3 {
			log.Fatal("usage: migrate steps <n>")
		}
		steps, err := strconv.Atoi(os.Args[2])
		if err != nil {
			log.Fatalf("invalid steps: %v", err)
		}
		if err := m.Steps(steps); err != nil && !errors.Is(err, migrate.ErrNoChange) {
			log.Fatalf("steps failed: %v", err)
		}
		fmt.Printf("✅ applied %d steps\n", steps)

	default:
		log.Fatalf("unknown command: %s", cmd)
	}
}

// createMigration generates new up/down SQL files
func createMigration(name string) {
	timestamp := time.Now().Unix()
	migrationsDir := "migrations"

	upFile := filepath.Join(migrationsDir, fmt.Sprintf("%d_%s.up.sql", timestamp, name))
	downFile := filepath.Join(migrationsDir, fmt.Sprintf("%d_%s.down.sql", timestamp, name))

	if err := os.MkdirAll(migrationsDir, 0755); err != nil {
		log.Fatalf("could not create migrations dir: %v", err)
	}

	if err := os.WriteFile(upFile, []byte("-- +migrate Up\n"), 0644); err != nil {
		log.Fatalf("could not create up migration: %v", err)
	}
	if err := os.WriteFile(downFile, []byte("-- +migrate Down\n"), 0644); err != nil {
		log.Fatalf("could not create down migration: %v", err)
	}

	fmt.Printf("✅ created migration:\n  %s\n  %s\n", upFile, downFile)
}
