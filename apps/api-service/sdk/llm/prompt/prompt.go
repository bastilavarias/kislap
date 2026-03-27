package prompt

import "fmt"

const resumeToJSONPrompt = `
You are a parser that converts resume-like text into structured JSON. 
The input is raw extracted text from a PDF. 
Return ONLY a single **valid JSON object**, without explanations, markdown, or comments.

Follow this schema:

{
    "name": "string",
    "job_title": "string" 
    "introduction": "string" (This could be their short introduction.),
    "about": "string", (This could be their long message about themselves.),
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
        "url": "string" (website url if any),
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
        "url": "string" (website url if any),
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
	return fmt.Sprintf(resumeToJSONPrompt, content)
}

const resumeImageToJSONPrompt = `
You are a parser that converts resume-like image into structured JSON. 
The input is raw extracted text from a PDF. 
Return ONLY a single **valid JSON object**, without explanations, markdown, or comments.

Follow this schema:

{
    "name": "string",
    "job_title": "string" 
    "introduction": "string" (This could be their short introduction.),
    "about": "string", (This could be their long message about themselves.),
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
        "url": "string" (website url if any),
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
        "url": "string" (website url if any),
        "technologies": [
          {
            "name": "string"
          }
        ]
      }
    ]
  }

The URL of the resume image is:
"""%s"""
Output only JSON:

---

Things to consider: Instead of returning empty string on results, put null.
`

func ObjectStorageFileToContent(content string) string {
	return fmt.Sprintf(resumeImageToJSONPrompt, content)
}

const menuToJSONPrompt = `
You are a parser that converts restaurant or cafe menu text into structured JSON.
The input may contain one or more menu pages merged together.
If an image is attached, also analyze the menu's visual style and infer a theme object.
Return ONLY a single valid JSON object, without explanations, markdown, or comments.

Follow this schema:

{
  "name": "string",
  "description": "string",
  "phone": "string",
  "email": "string",
  "website_url": "string",
  "whatsapp": "string",
  "address": "string",
  "city": "string",
  "country": "string",
  "google_maps_url": "string",
  "currency": "string",
  "parsed_theme": {
    "source_summary": {
      "style": "string",
      "primary_colors": ["string"],
      "notes": "string"
    },
    "styles": {
      "light": {
        "background": "string",
        "foreground": "string",
        "card": "string",
        "card-foreground": "string",
        "popover": "string",
        "popover-foreground": "string",
        "primary": "string",
        "primary-foreground": "string",
        "secondary": "string",
        "secondary-foreground": "string",
        "muted": "string",
        "muted-foreground": "string",
        "accent": "string",
        "accent-foreground": "string",
        "destructive": "string",
        "border": "string",
        "input": "string",
        "ring": "string",
        "chart-1": "string",
        "chart-2": "string",
        "chart-3": "string",
        "chart-4": "string",
        "chart-5": "string",
        "sidebar": "string",
        "sidebar-foreground": "string",
        "sidebar-primary": "string",
        "sidebar-primary-foreground": "string",
        "sidebar-accent": "string",
        "sidebar-accent-foreground": "string",
        "sidebar-border": "string",
        "sidebar-ring": "string",
        "font-sans": "string",
        "font-serif": "string",
        "font-mono": "string",
        "radius": "string",
        "shadow-color": "string",
        "shadow-opacity": "string",
        "shadow-blur": "string",
        "shadow-spread": "string",
        "shadow-offset-x": "string",
        "shadow-offset-y": "string",
        "letter-spacing": "string",
        "spacing": "string"
      },
      "dark": {
        "background": "string",
        "foreground": "string",
        "card": "string",
        "card-foreground": "string",
        "popover": "string",
        "popover-foreground": "string",
        "primary": "string",
        "primary-foreground": "string",
        "secondary": "string",
        "secondary-foreground": "string",
        "muted": "string",
        "muted-foreground": "string",
        "accent": "string",
        "accent-foreground": "string",
        "destructive": "string",
        "border": "string",
        "input": "string",
        "ring": "string",
        "chart-1": "string",
        "chart-2": "string",
        "chart-3": "string",
        "chart-4": "string",
        "chart-5": "string",
        "sidebar": "string",
        "sidebar-foreground": "string",
        "sidebar-primary": "string",
        "sidebar-primary-foreground": "string",
        "sidebar-accent": "string",
        "sidebar-accent-foreground": "string",
        "sidebar-border": "string",
        "sidebar-ring": "string",
        "font-sans": "string",
        "font-serif": "string",
        "font-mono": "string",
        "radius": "string",
        "shadow-color": "string",
        "shadow-opacity": "string",
        "shadow-blur": "string",
        "shadow-spread": "string",
        "shadow-offset-x": "string",
        "shadow-offset-y": "string",
        "letter-spacing": "string",
        "spacing": "string"
      },
      "css": {},
      "meta": {
        "badge": "string"
      }
    }
  },
  "categories": [
    {
      "name": "string",
      "description": "string",
      "items": [
        {
          "name": "string",
          "description": "string",
          "price": "string",
          "badge": "string"
        }
      ]
    }
  ]
}

Rules:
- Group items under the most likely category.
- If the business name is obvious, use it.
- If some fields are not present, return null.
- Keep prices as strings exactly as they appear when possible.
- Do not invent social links, opening hours, or gallery data.
- For parsed_theme, infer the visual brand direction from the attached menu image if available. If no image is available, infer conservatively from cuisine, wording, and menu structure.
- Prefer valid CSS color values, ideally oklch(...) for color tokens.
- Return a complete light theme and a usable dark theme variation.
- Fonts should be realistic CSS font-family strings, not made-up font names.
- Radius, spacing, shadow, and letter-spacing should be practical CSS values.

Input:
"""%s"""
Output only JSON:
`

func MenuToJSON(content string) string {
	return fmt.Sprintf(menuToJSONPrompt, content)
}
