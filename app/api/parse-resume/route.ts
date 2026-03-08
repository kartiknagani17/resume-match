import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { getResumeSavePath, extractTextFromResume } from "@/lib/resumeParser";

const ALLOWED_TYPES = [".pdf", ".docx", ".doc", ".txt"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Missing or invalid file field: resume" },
        { status: 400 }
      );
    }

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

    let text: string;
    try {
      text = await extractTextFromResume(savePath);
    } finally {
      try { fs.unlinkSync(savePath); } catch { /* ignore */ }
    }

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: "Could not extract enough text from the file. Ensure it's a valid resume (PDF/DOCX)." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("parse-resume error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to parse resume" },
      { status: 500 }
    );
  }
}
