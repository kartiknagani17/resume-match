import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const model = "gemini-2.5-flash";

function getClient() {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey });
}

/** Parse JSON from Gemini; strip markdown and try a few safe recovery steps. */
function parseJson<T>(raw: string): T {
  let text = raw.trim();

  // If the model decided to wrap the response in a code block, unwrap it.
  const codeBlockMatch = text.match(/^```(?:json)?\s*([\s\S]*?)```\s*$/);
  if (codeBlockMatch) text = codeBlockMatch[1].trim();

  // Helper that actually attempts to JSON.parse with a friendlier error.
  const tryParse = (candidate: string): T => {
    try {
      return JSON.parse(candidate) as T;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // For genuinely truncated / incomplete JSON we surface a simple message.
      if (/unterminated string|unexpected end of json input|position \d+/i.test(msg)) {
        throw new Error("The analysis response was incomplete or invalid. Please try again.");
      }
      throw new Error(`Could not parse AI response as JSON. ${msg}`);
    }
  };

  // 1) First, try to parse as-is.
  try {
    return tryParse(text);
  } catch {
    // 2) Try fixing obvious unquoted property names.
    const fixed = text.replace(/([,{]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
    try {
      return tryParse(fixed);
    } catch {
      // 3) As a last resort, try to extract the first well-formed object-looking
      //    chunk (between the first '{' and the last '}') in case there is
      //    extra explanation text before/after the JSON.
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end > start) {
        const sliced = text.slice(start, end + 1);
        return tryParse(sliced);
      }
      // If we get here, we really couldn't salvage it.
      throw new Error("The analysis response was incomplete or invalid. Please try again.");
    }
  }
}

export interface AlignmentResult {
  alignmentScore: number;
  explanation: string;
  keywords: Array<{ keyword: string; tip: string }>;
}

export async function analyzeResumeVsJob(
  resumeText: string,
  jobDescription: string
): Promise<AlignmentResult> {
  const ai = getClient();
  const prompt = `You are an expert resume and career coach. Analyze how well the following resume matches the given job description.

RESUME:
${resumeText.slice(0, 28000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 8000)}

Respond with a JSON object only (no markdown, no code block), with exactly these keys:
- "alignmentScore": number from 0 to 100 (how well the resume fits the job).
- "explanation": string, 2-4 short sentences. Do not use unescaped double quotes inside strings.
- "keywords": array of objects, each with "keyword" (string) and "tip" (string). List 5-10 items; keep each tip to one short sentence. Escape any quotes inside strings with backslash.

Output valid JSON only.`;

  const maxAttempts = 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          temperature: 0.3,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          // Disable thinking for this structured-output task so all tokens
          // go to the actual JSON response instead of internal reasoning.
          thinkingConfig: { thinkingBudget: 0 },
        },
      });
      const text = res.text?.trim();
      if (!text) throw new Error("Empty response from Gemini");

      const parsed = parseJson<AlignmentResult>(text);
      parsed.alignmentScore = Math.min(100, Math.max(0, Number(parsed.alignmentScore) || 0));
      if (!Array.isArray(parsed.keywords)) parsed.keywords = [];
      return parsed;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (attempt < maxAttempts) continue; // Retry once on any failure (e.g. truncated/invalid JSON)
      throw lastError;
    }
  }

  throw lastError ?? new Error("Analysis failed");
}

export interface JobSearchQuery {
  jobTitle: string;
  skills: string[];
  location?: string;
}

export async function extractJobSearchQuery(resumeText: string): Promise<JobSearchQuery> {
  const ai = getClient();
  const prompt = `Extract from this resume the best job title and top skills for job search. Reply with valid JSON only (no markdown, no code block). Use exactly these keys: "jobTitle" (string), "skills" (array of up to 8 strings), "location" (string or empty). Keep values short; escape any quotes inside strings.

Example: {"jobTitle":"Software Engineer","skills":["JavaScript","React"],"location":"New York"}

RESUME:
${resumeText.slice(0, 12000)}`;

  const fallback: JobSearchQuery = { jobTitle: "Software Developer", skills: [], location: "" };
  const maxAttempts = 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          temperature: 0.2,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 0 },
        },
      });
      const text = res.text?.trim();
      if (!text) return fallback;

      const parsed = parseJson<JobSearchQuery>(text);
      const jobTitle = (parsed.jobTitle || fallback.jobTitle).trim() || fallback.jobTitle;
      const skills = Array.isArray(parsed.skills) ? parsed.skills.slice(0, 8) : [];
      const location = (parsed.location ?? "").trim();

      console.log("[jobs] extractJobSearchQuery", {
        jobTitle,
        skillsPreview: skills.slice(0, 5),
        location,
        resumeLength: resumeText.length,
      });

      return { jobTitle, skills, location };
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (attempt < maxAttempts) continue;
      throw lastError;
    }
  }

  throw lastError ?? new Error("Could not extract job search details.");
}
