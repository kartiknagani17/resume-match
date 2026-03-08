import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { getResumeSavePath, extractTextFromResume } from "@/lib/resumeParser";
import { analyzeResumeVsJob } from "@/lib/gemini";

const ALLOWED_TYPES = [".pdf", ".docx", ".doc", ".txt"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;
    const jobDescription = (formData.get("jobDescription") as string)?.trim() || "";

    if (!jobDescription || jobDescription.length < 50) {
      return NextResponse.json(
        { error: "Please provide a job description (at least 50 characters)." },
        { status: 400 }
      );
    }

    let resumeText: string;

    if (file && file instanceof File && file.size > 0) {
      const ext = file.name.includes(".") ? "." + file.name.split(".").pop()?.toLowerCase() : "";
      if (!ALLOWED_TYPES.includes(ext)) {
        return NextResponse.json(
          { error: "Unsupported resume format. Use PDF, DOCX, or TXT." },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "Resume file too large. Max 10 MB." },
          { status: 400 }
        );
      }
      const bytes = await file.arrayBuffer();
      const savePath = getResumeSavePath(file.name);
      fs.writeFileSync(savePath, Buffer.from(bytes));
      resumeText = await extractTextFromResume(savePath);
      try { fs.unlinkSync(savePath); } catch { /* ignore */ }
    } else {
      const textFromForm = (formData.get("resumeText") as string)?.trim();
      if (!textFromForm || textFromForm.length < 50) {
        return NextResponse.json(
          { error: "Please upload a resume file or paste resume text (at least 50 characters)." },
          { status: 400 }
        );
      }
      resumeText = textFromForm;
    }

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        { error: "Could not extract enough text from the resume." },
        { status: 400 }
      );
    }

    const result = await analyzeResumeVsJob(resumeText, jobDescription);
    return NextResponse.json(result);
  } catch (err) {
    console.error("analyze error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
