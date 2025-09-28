package prompt

import "fmt"

const rawPrompt = `
You are a parser that converts resume-like text into structured JSON. 
The input is raw extracted text from a PDF. 
Return ONLY a single **valid JSON object**, without explanations, markdown, or comments.

Follow this schema:

{
    "name": "string",
    "introduction": "string" (This could be their job title now or anything.),
    "about": "string",
    "email": "string",
    "phone": "string",
    "website": "string",
    "github": "string",
    "linkedin": "string",
    "twitter": "string",

    "work_experiences": [
      {
        "company": "string",
        "role": "string",
        "location": "string",
        "start_date": "string",
        "end_date": "string",
        "about": "string" (Get any information you could get about their job experience. Don't leave this empty.)
      }
    ],

    "education": [
      {
        "school": "string",
        "level": "string",
        "degree": "string" (If this is empty, fill this with the education 'level'.),
        "location": "string",
        "year_start": string,
        "year_end": string,
        "about": "string"
      }
    ],

    "skills": [
      {
        "name": "string",
      }
    ],

    "showcases": [
      {
        "name": "string",
        "description": "string",
        "role": "string",
        "technologies": [
          {
            "name": "string"
          }
        ]
      }
    ]
  }

Input:
"""%s"""
Output only JSON:

---

Things to consider: Instead of returning empty string on results, put null.
`

func ResumeToJSON(content string) string {
	return fmt.Sprintf(rawPrompt, content)
}
