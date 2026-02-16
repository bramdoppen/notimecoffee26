"use client";

import { useState } from "react";

export function BlogNewsletterCta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Wire up newsletter API (Mailchimp, ConvertKit, etc.)
    setStatus("success");
    setEmail("");
  }

  return (
    <section className="bg-forest-600 py-(--space-16)">
      <div className="container-site text-center">
        <h2 className="font-display text-3xl lg:text-4xl text-crema-100 mb-(--space-3)">
          Never miss a story
        </h2>
        <p className="text-lg text-crema-200 mb-(--space-6) max-w-lg mx-auto">
          Brewing tips, origin stories, and what&apos;s new — straight to your
          inbox.
        </p>

        {status === "success" ? (
          <p className="text-crema-100 font-medium">
            ✓ You&apos;re in! Check your inbox.
          </p>
        ) : (
          <form
            className="flex flex-col sm:flex-row gap-(--space-3) max-w-md mx-auto"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 rounded-lg text-espresso-600 bg-white placeholder:text-pebble focus:outline-2 focus:outline-crema-200"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-terracotta-500 text-white font-medium rounded-lg hover:bg-terracotta-600 transition-colors min-h-[44px]"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
