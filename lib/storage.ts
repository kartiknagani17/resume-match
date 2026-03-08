import path from "path";
import fs from "fs";
import os from "os";

export function getStoragePath(): string {
  return path.resolve(process.env.STORAGE_PATH || os.tmpdir());
}

export function getUploadsDir(): string {
  const dir = path.join(getStoragePath(), "uploads");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function getExportsDir(): string {
  const dir = path.join(getStoragePath(), "exports");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}
