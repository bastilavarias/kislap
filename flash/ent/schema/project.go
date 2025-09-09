package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"time"
)

type Project struct {
	ent.Schema
}

func (Project) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			NotEmpty(),
		field.String("description").
			Optional(),
		field.String("slug").
			Unique(),
		field.String("sub_domain").
			Optional(),
		field.String("theme").
			Default("default"),
		field.String("layout").
			Default("default"),
		field.Enum("type").
			Values("portfolio", "biz", "links", "waitlist").
			Default("portfolio"),
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}
