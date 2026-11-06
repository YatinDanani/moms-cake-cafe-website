"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { submitNetlifyForm } from "@/lib/netlifyForms";
import { STORE_OPEN, formatTimeLabel, minLeadDate, storeCloseTime } from "@/lib/pickupHours";
import type { MenuItem } from "@/lib/siteOverrides";

const fieldClass =
  "w-full rounded-xl border border-cocoa/15 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coffee";
const labelClass = "block text-sm font-semibold mb-1.5";
const MIN_LEAD_DAYS = 1;
type Status = "idle" | "sending" | "sent" | "error";
type Section = { category: string; items: MenuItem[] };

export function MenuOrderForm({
  sections,
  initialItem,
}: {
  sections: Section[];
  initialItem?: string;
}) {
  const allItems = sections.flatMap((s) => s.items);
  const [status, setStatus] = useState<Status>("idle");
  const [dateError, setDateError] = useState("");
  const [pickupError, setPickupError] = useState("");
  const [itemName, setItemName] = useState(
    allItems.some((i) => i.name === initialItem) ? (initialItem as string) : (allItems[0]?.name ?? "")
  );
  const dateInputRef = useRef<HTMLInputElement>(null);
  const pickupTimeInputRef = useRef<HTMLInputElement>(null);
  const minDateRef = useRef("");

  useEffect(() => {
    const minDate = minLeadDate(MIN_LEAD_DAYS);
    minDateRef.current = minDate;
    if (dateInputRef.current) dateInputRef.current.min = minDate;
    if (pickupTimeInputRef.current) {
      pickupTimeInputRef.current.min = STORE_OPEN;
      pickupTimeInputRef.current.max = storeCloseTime("");
    }
  }, []);

  const selectedItem = allItems.find((i) => i.name === itemName);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const date = String(formData.get("date") ?? "");
    const minDate = minDateRef.current;
    if (date && minDate && date < minDate) {
      setDateError(`Please choose a date at least ${MIN_LEAD_DAYS} day out.`);
      return;
    }
    setDateError("");

    const pickupTime = String(formData.get("pickupTime") ?? "");
    const closeTime = storeCloseTime(date);
    if (pickupTime && (pickupTime < STORE_OPEN || pickupTime > closeTime)) {
      setPickupError(
        `Please choose a pickup time between ${formatTimeLabel(STORE_OPEN)} and ${formatTimeLabel(closeTime)}.`
      );
      return;
    }
    setPickupError("");

    setStatus("sending");
    try {
      await submitNetlifyForm(formData);
      setStatus("sent");
      form.reset();
      setItemName(allItems[0]?.name ?? "");
    } catch {
      setStatus("error");
    }
  }

  if (allItems.length === 0) {
    return (
      <p className="text-center text-cocoa/70">
        The menu isn&apos;t available to order from right now. Please call or email instead.
      </p>
    );
  }

  return (
    <form
      name="signature-cake-order"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <input type="hidden" name="form-name" value="signature-cake-order" />
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cake" className={labelClass}>Item</label>
          <select
            id="cake"
            name="cake"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className={fieldClass}
          >
            {sections.map((section) => (
              <optgroup key={section.category} label={section.category}>
                {section.items.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="size" className={labelClass}>Size</label>
          <select id="size" name="size" className={fieldClass} key={itemName}>
            {selectedItem?.sizes.map((size) => (
              <option key={size.label || "default"} value={size.label || "Standard"}>
                {size.price}
                {size.label && ` · ${size.label}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="quantity" className={labelClass}>Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            defaultValue="1"
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="name" className={labelClass}>Name</label>
          <input id="name" name="name" type="text" required className={fieldClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone</label>
          <input id="phone" name="phone" type="tel" className={fieldClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="date" className={labelClass}>Pickup date</label>
          <input
            ref={dateInputRef}
            id="date"
            name="date"
            type="date"
            required
            onChange={(e) => {
              setDateError("");
              setPickupError("");
              const closeTime = storeCloseTime(e.target.value);
              if (pickupTimeInputRef.current) {
                pickupTimeInputRef.current.min = STORE_OPEN;
                pickupTimeInputRef.current.max = closeTime;
              }
            }}
            className={fieldClass}
          />
          {dateError && <p className="mt-1 text-xs text-coffee font-medium">{dateError}</p>}
        </div>
        <div>
          <label htmlFor="pickupTime" className={labelClass}>Pickup time</label>
          <input
            ref={pickupTimeInputRef}
            id="pickupTime"
            name="pickupTime"
            type="time"
            required
            onChange={() => setPickupError("")}
            className={fieldClass}
          />
          <p className="mt-1.5 text-xs text-cocoa/60">Within store hours for the date you choose.</p>
          {pickupError && <p className="mt-1 text-xs text-coffee font-medium">{pickupError}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Any special requests? (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="e.g. Happy Birthday Sarah written on the cake"
          className={fieldClass}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center rounded-full bg-coffee px-6 py-3 text-base font-semibold text-cream hover:bg-coffee-dark transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send order request"}
      </button>
      {status === "sent" && (
        <p className="text-sm text-coffee font-medium">
          Order request sent. We&apos;ll confirm by email or phone.
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
