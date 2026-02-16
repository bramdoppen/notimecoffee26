"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type AnnouncementBarProps = {
  message: string;
  link?: string;
  linkText?: string;
  backgroundColor?: string;
};

function AnnouncementBar({ message, link, linkText, backgroundColor }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-10 flex items-center justify-center px-4 text-sm text-white"
      style={{ backgroundColor: backgroundColor || "var(--color-terracotta-500)" }}
      role="banner"
    >
      <p className="text-center truncate">
        {message}
        {link && linkText && (
          <>
            {" "}
            <a
              href={link}
              className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity"
            >
              {linkText}
            </a>
          </>
        )}
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 p-1 hover:opacity-80 transition-opacity"
        aria-label="Dismiss announcement"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}

export { AnnouncementBar, type AnnouncementBarProps };
