"use client";

import { useState, type FormEvent } from "react";
import { business } from "@/lib/content";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const message = String(form.get("message") ?? "");

    const subject = `Message from ${name || "the website"}`;
    const body = `${message}\n\nFrom: ${name}\nReply to: ${email}`;
    window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-1.5">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coffee"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coffee"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-semibold mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coffee"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center rounded-full bg-coffee px-6 py-3 text-base font-semibold text-cream hover:bg-coffee-dark transition-colors"
      >
        Send message
      </button>
      {sent && (
        <p className="text-sm text-coffee font-medium">
          Opening your email app with this message filled in — send it from there to reach us.
        </p>
      )}
    </form>
  );
}
