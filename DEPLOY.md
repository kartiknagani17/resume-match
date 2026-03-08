# Deploy Resume Match to Vercel

Everything in this repo is ready. Do these steps:

## 1. Push to GitHub

Create a new repository on [github.com/new](https://github.com/new) (e.g. name: `resume-match`). Then run:

```bash
cd e:\resume-job-matcher
git remote add origin https://github.com/YOUR_USERNAME/resume-match.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub).
2. Click **Add New** → **Project**.
3. Import your **resume-match** (or whatever you named it) repository.
4. Before deploying, open **Environment Variables** and add:
   - `GEMINI_API_KEY` = your key from [Google AI Studio](https://aistudio.google.com/)
   - `RAPIDAPI_KEY` = your key from [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
5. Click **Deploy**.

Your app will be live at `https://your-project.vercel.app`.
