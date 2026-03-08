import { NextRequest, NextResponse } from "next/server";
import { extractJobSearchQuery } from "@/lib/gemini";
import { searchJobs } from "@/lib/jobs";
import { getResumeSavePath, extractTextFromResume } from "@/lib/resumeParser";
import fs from "fs";

const ALLOWED_TYPES = [".pdf", ".docx", ".doc", ".txt"];
const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;
    const resumeTextFromForm = (formData.get("resumeText") as string)?.trim();

    console.log("[jobs] incoming request", {
      hasFile: !!file,
      fileName: file && "name" in file ? file.name : undefined,
      fileSize: file && "size" in file ? file.size : undefined,
      resumeTextFromFormLength: resumeTextFromForm?.length ?? 0,
    });

    let resumeText: string;

    if (file && file instanceof File && file.size > 0) {
      const ext = file.name.includes(".") ? "." + file.name.split(".").pop()?.toLowerCase() : "";
      if (!ALLOWED_TYPES.includes(ext)) {
        return NextResponse.json(
          { error: "Unsupported format. Use PDF, DOCX, or TXT." },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "File too large. Max 10 MB." },
          { status: 400 }
        );
      }
      const bytes = await file.arrayBuffer();
      const savePath = getResumeSavePath(file.name);
      fs.writeFileSync(savePath, Buffer.from(bytes));
      resumeText = await extractTextFromResume(savePath);
      try { fs.unlinkSync(savePath); } catch { /* ignore */ }
    } else if (resumeTextFromForm && resumeTextFromForm.length >= 50) {
      resumeText = resumeTextFromForm;
    } else {
      return NextResponse.json(
        { error: "Upload a resume file or provide resume text (at least 50 characters)." },
        { status: 400 }
      );
    }

    console.log("[jobs] extracted resume text", { length: resumeText.length });

    const { jobTitle, skills, location } = await extractJobSearchQuery(resumeText);
    console.log("[jobs] extracted search query details", {
      jobTitle,
      skillsPreview: skills.slice(0, 5),
      location,
    });

    const baseTitle = /job/i.test(jobTitle) ? jobTitle : `${jobTitle} jobs`;
    let searchQuery: string;
    if (location) {
      searchQuery = `${baseTitle} in ${location}`;
    } else {
      const skillsFragment = skills.slice(0, 3).join(" ");
      searchQuery = `${baseTitle} ${skillsFragment}`.trim();
    }

    const jobs = await searchJobs(searchQuery, { page: 1, numPages: 1 });
    console.log("[jobs] JSearch result", {
      searchQuery,
      jobsCount: jobs.length,
    });
    return NextResponse.json({
      query: searchQuery,
      jobTitle,
      skills,
      location,
      jobs: jobs.map((j) => ({
        id: j.job_id,
        title: j.job_title,
        company: j.employer_name,
        link: j.job_apply_link || null,
        snippet: (j.job_description || "").slice(0, 200),
        location: [j.job_city, j.job_country].filter(Boolean).join(", ") || null,
      })),
    });
  } catch (err) {
    console.error("jobs API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Job search failed" },
      { status: 500 }
    );
  }
}
