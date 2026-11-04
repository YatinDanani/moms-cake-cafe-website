"use client";

import { useState, type ComponentType, type FormEvent } from "react";
import { submitNetlifyForm } from "@/lib/netlifyForms";
import { eventTypes } from "@/lib/content";
import {
  CakeSliceIcon,
  RingsIcon,
  BuildingIcon,
  UsersIcon,
  CalendarHeartIcon,
  GraduationCapIcon,
  DotsIcon,
} from "./Icons";

type Status = "idle" | "sending" | "sent" | "error";
type IconComponent = ComponentType<{ className?: string }>;

const eventTypeIcons: Record<(typeof eventTypes)[number], IconComponent> = {
  Birthday: CakeSliceIcon,
  Wedding: RingsIcon,
  Corporate: BuildingIcon,
  Meeting: UsersIcon,
  Anniversary: CalendarHeartIcon,
  Graduation: GraduationCapIcon,
  Other: DotsIcon,
};

const fieldClass =
  "w-full rounded-xl border border-cocoa/15 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coffee";
const labelClass = "block text-sm font-semibold mb-1.5";

export function CateringForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [eventType, setEventType] = useState<(typeof eventTypes)[number]>(eventTypes[0]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitNetlifyForm(new FormData(e.currentTarget));
      setStatus("sent");
      e.currentTarget.reset();
      setEventType(eventTypes[0]);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      name="catering-inquiry"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <input type="hidden" name="form-name" value="catering-inquiry" />
      <input type="hidden" name="eventType" value={eventType} />
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>

      <div>
        <span className={labelClass}>Event type</span>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {eventTypes.map((type) => {
            const Icon = eventTypeIcons[type];
            const active = eventType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setEventType(type)}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 px-3 py-4 text-sm font-medium transition-colors ${
                  active
                    ? "border-coffee bg-tan/60 text-coffee"
                    : "border-cocoa/15 text-cocoa hover:border-cocoa/30"
                }`}
              >
                <Icon className="h-5 w-5" />
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>Full name</label>
          <input id="name" name="name" type="text" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" required className={fieldClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label htmlFor="phone" className={labelClass}>Phone</label>
          <input id="phone" name="phone" type="tel" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="eventDate" className={labelClass}>Event date</label>
          <input id="eventDate" name="eventDate" type="date" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="guestCount" className={labelClass}>Guest count</label>
          <input id="guestCount" name="guestCount" type="number" min="1" required className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor="venue" className={labelClass}>Venue (optional)</label>
        <input
          id="venue"
          name="venue"
          type="text"
          placeholder="Where will the event take place?"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="budget" className={labelClass}>Budget range (optional)</label>
        <input id="budget" name="budget" type="text" placeholder="e.g. $300 – $800" className={fieldClass} />
      </div>

      <div>
        <label htmlFor="details" className={labelClass}>Tell us about your event</label>
        <textarea
          id="details"
          name="details"
          required
          rows={5}
          placeholder="Describe what you're envisioning: theme, menu preferences, special requests..."
          className={fieldClass}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center rounded-full bg-coffee px-6 py-3 text-base font-semibold text-cream hover:bg-coffee-dark transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Request a quote"}
      </button>
      {status === "sent" && (
        <p className="text-sm text-coffee font-medium">
          Request sent. We&apos;ll follow up with a few options.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-coffee font-medium">
          Something went wrong sending that. Try again, or email us directly.
        </p>
      )}
    </form>
  );
}
