"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type NewsletterSectionProps = {
  heading?: string;
  description?: string;
  buttonText?: string;
};

function NewsletterSection({
  heading = "Stay in the Loop",
  description = "New brews, events, and the occasional coffee wisdom. No spam, we promise.",
  buttonText = "Subscribe",
}: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    // TODO: Wire up to newsletter API (Mailchimp, ConvertKit, etc.)
    // For now, simulate success
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setEmail("");
  }

  return (
    <section className="py-(--space-12) lg:py-(--space-16) bg-forest-600">
      <div className="container-site max-w-[600px] mx-auto text-center">
        <h2 className="font-display text-3xl lg:text-4xl text-crema-100">
          {heading}
        </h2>
        {description && (
          <p className="mt-(--space-3) text-base text-sage-300">
            {description}
          </p>
        )}
        {status === "success" ? (
          <div className="mt-(--space-6) p-(--space-4) bg-forest-500 rounded-(--radius-md)">
            <p className="text-crema-100 font-medium">
              ☕ You're in! Check your inbox for a welcome brew.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-(--space-6) flex flex-col sm:flex-row gap-(--space-2)"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === "loading"}
              className={cn(
                "flex-1 px-4 py-3 text-base rounded-(--radius-md)",
                "bg-white text-charcoal placeholder:text-pebble",
                "focus:outline-2 focus:outline-terracotta-500 focus:outline-offset-0",
                "disabled:opacity-50"
              )}
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className={cn(
                "px-6 py-3 text-base font-medium rounded-(--radius-md)",
                "bg-terracotta-500 text-white",
                "hover:bg-terracotta-400 transition-colors duration-(--transition-fast)",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {status === "loading" ? "Subscribing..." : buttonText}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-(--space-2) text-sm text-terracotta-300">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}

export { NewsletterSection, type NewsletterSectionProps };
