package database

import (
	"context"
	"log"

	"entgo.io/ent/dialect"
	"entgo.io/ent/dialect/sql"
	"flash/ent"
	_ "github.com/go-sql-driver/mysql"
)

func InitDatabase() *ent.Client {
	dsn := "root:@tcp(localhost:3306)/kislap?parseTime=True"
	drv, err := sql.Open(dialect.MySQL, dsn)
	if err != nil {
		log.Fatalf("failed opening connection to mysql: %v", err)
	}
	client := ent.NewClient(ent.Driver(drv))
	if err := client.Schema.Create(context.Background()); err != nil {
		log.Fatalf("failed creating schema resources: %v", err)
	}

	return client
}
