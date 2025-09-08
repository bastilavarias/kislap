package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

type User struct {
	ent.Schema
}

func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("first_name").NotEmpty(),
		field.String("last_name").NotEmpty(),
		field.String("email").Unique().NotEmpty(),
		field.String("password").Sensitive().NotEmpty(),
		field.String("mobile_number").Optional().Nillable(),
		field.String("role").
			Default("default"), // new field
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}
