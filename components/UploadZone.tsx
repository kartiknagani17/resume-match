"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadZoneProps {
  label: string;
  accept?: string;
  onFile: (file: File | null) => void;
  file: File | null;
  id?: string;
}

export function UploadZone({
  label,
  accept = ".pdf,.docx,.doc,.txt",
  onFile,
  file,
  id = "upload",
}: UploadZoneProps) {
  const [drag, setDrag] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      const f = e.dataTransfer.files[0];
      if (f) onFile(f);
    },
    [onFile]
  );
  const handleDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setDrag(true);  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setDrag(false); }, []);
  const handleChange    = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onFile(e.target.files?.[0] ?? null),
    [onFile]
  );

  const zoneClass = file
    ? "upload-zone upload-filled"
    : drag
    ? "upload-zone upload-drag"
    : "upload-zone";

  return (
    <motion.div
      className={zoneClass}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={id} className="block px-6 py-8 cursor-pointer">
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="sr-only"
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="filled"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4"
            >
              {/* Check icon */}
              <motion.div
                className="w-12 h-12 rounded-xl bg-score-great/10 flex items-center justify-center shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 20, delay: 0.05 }}
              >
                <svg viewBox="0 0 20 20" fill="#16A34A" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-sm truncate">{file.name}</p>
                <p className="text-text-muted text-xs mt-0.5">
                  {(file.size / 1024 / 1024).toFixed(2)} MB · Click or drop to replace
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center text-center gap-3"
            >
              {/* Upload icon */}
              <motion.div
                className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center"
                animate={drag ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <svg viewBox="0 0 20 20" fill="#2563EB" className="w-5 h-5">
                  <path fillRule="evenodd" d="M13 7.5a.75.75 0 0 1 .75-.75H16.5a.75.75 0 0 1 .75.75v8.25a.75.75 0 0 1-.75.75H3.5a.75.75 0 0 1-.75-.75V7.5a.75.75 0 0 1 .75-.75H6.25a.75.75 0 0 1 0 1.5H4.25v6.75h11.5V8.25H13.75A.75.75 0 0 1 13 7.5ZM10 2a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0v-6.5A.75.75 0 0 1 10 2Z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M7.72 3.47a.75.75 0 0 1 1.06 0L10 4.69l1.22-1.22a.75.75 0 1 1 1.06 1.06L10 6.81 7.72 4.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </motion.div>

              <div>
                <p className="font-semibold text-text-primary text-sm">
                  {drag ? "Drop to upload" : label}
                </p>
                <p className="text-text-muted text-xs mt-0.5">PDF, DOCX or TXT — up to 10 MB</p>
              </div>

              {!drag && (
                <span className="mt-1 inline-flex items-center px-3 py-1 rounded-full bg-white border border-border text-xs font-medium text-text-secondary">
                  Browse files
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </label>
    </motion.div>
  );
}
