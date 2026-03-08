import path from "path";
import fs from "fs";
import { getUploadsDir } from "./storage";

// Dynamic imports for Node-only modules (used only in API routes)
export async function extractTextFromResume(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  const buffer = fs.readFileSync(filePath);

  if (ext === ".pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return data.text?.trim() || "";
  }

  if (ext === ".docx" || ext === ".doc") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value?.trim() || "";
  }

  if (ext === ".txt") {
    return buffer.toString("utf-8").trim();
  }

  throw new Error(`Unsupported file type: ${ext}. Use PDF, DOCX, or TXT.`);
}

export function getResumeSavePath(originalName: string): string {
  const dir = getUploadsDir();
  const base = path.basename(originalName, path.extname(originalName));
  const safe = base.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 80);
  const ext = path.extname(originalName).toLowerCase();
  const name = `${safe}_${Date.now()}${ext}`;
  return path.join(dir, name);
}
