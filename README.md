# Resume Match

Match your resume to job descriptions, get keyword suggestions, and find jobs that fit your profile. Built with Next.js, Gemini 2.5 Flash, and JSearch.

## Setup

1. **Clone** the project and install dependencies:
   ```bash
   npm install
   ```

2. **Environment variables** — copy `.env.example` to `.env.local` and fill in:
   - **GEMINI_API_KEY** — from [Google AI Studio](https://aistudio.google.com/)
   - **RAPIDAPI_KEY** — from [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) (free tier: 200 requests/month)
   - **STORAGE_PATH** (optional) — defaults to system temp dir; set only if you need a custom path locally.

3. **Run locally:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo.
3. Add environment variables in the Vercel dashboard:
   - `GEMINI_API_KEY`
   - `RAPIDAPI_KEY`
4. Deploy. No `STORAGE_PATH` needed on Vercel (temp storage is used automatically).

## Features

- **Analyze resume vs job** — Upload resume (PDF/DOCX/TXT) and paste job description. Get alignment score (0–100%), explanation, and suggested keywords to add.
- **Keyword suggestor** — Keywords from the job description that are missing or weak in your resume, with short tips.
- **Find jobs** — Upload your resume; we extract role and skills and search job boards via JSearch.

## Tech stack

- Next.js 14 (App Router), React, TypeScript
- Tailwind CSS, Framer Motion
- Google Gemini 2.5 Flash (`@google/genai`)
- JSearch (RapidAPI) for job search
- pdf-parse, mammoth for resume text extraction

## Build

```bash
npm run build
npm start
```
