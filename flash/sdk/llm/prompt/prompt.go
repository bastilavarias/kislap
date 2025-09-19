package prompt

import "fmt"

const rawPrompt = `
You are a parser that converts resume-like text into structured JSON. 
The input is raw extracted text from a PDF. 
Return ONLY valid JSON, without explanations or comments. 

Follow this schema:

{
    "name": "string",
    "job_title": "string",
    "introduction": "string",
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
        "start_date": "YYYY-MM-DD",
        "end_date": "YYYY-MM-DD",
        "about": "string"
      }
    ],

    "education": [
      {
        "school": "string",
        "level": "string",
        "degree": "string",
        "location": "string",
        "year_start": int,
        "year_end": int,
        "about": "string"
      }
    ],

    "skills": [
      {
        "name": "string",
        "url": "string"
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
