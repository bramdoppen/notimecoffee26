"use client";

import { cn } from "@/lib/utils";

export function FooterNewsletterForm() {
  return (
    <form
      className="flex gap-(--space-2)"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="your@email.com"
        required
        className={cn(
          "flex-1 px-3 py-2 text-sm rounded-(--radius-md)",
          "bg-white text-charcoal placeholder:text-pebble",
          "focus:outline-2 focus:outline-forest-500 focus:outline-offset-0"
        )}
      />
      <button
        type="submit"
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-(--radius-md)",
          "bg-terracotta-500 text-white",
          "hover:bg-terracotta-400 transition-colors duration-(--transition-fast)"
        )}
      >
        Subscribe
      </button>
    </form>
  );
}
