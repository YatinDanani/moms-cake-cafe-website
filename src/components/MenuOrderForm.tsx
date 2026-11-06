"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { submitNetlifyForm } from "@/lib/netlifyForms";
import { STORE_OPEN, formatTimeLabel, minLeadDate, storeCloseTime } from "@/lib/pickupHours";
import type { MenuItem } from "@/lib/siteOverrides";
import { CloseIcon } from "./Icons";

const fieldClass =
  "w-full rounded-xl border border-cocoa/15 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coffee";
const labelClass = "block text-sm font-semibold mb-1.5";
const MIN_LEAD_DAYS = 1;
const ASSORTED_CUPCAKES = "Assorted Cupcakes";
type Status = "idle" | "sending" | "sent" | "error";
type Section = { category: string; items: MenuItem[] };
type CartLine = {
  id: string;
  itemName: string;
  size: string;
  quantity: number;
  assortment: Record<string, number>;
};

let nextLineId = 0;
function newLineId() {
  nextLineId += 1;
  return `line-${nextLineId}`;
}

function newLine(itemName: string, sections: Section[]): CartLine {
  const item = sections.flatMap((s) => s.items).find((i) => i.name === itemName);
  const firstSize = item?.sizes[0];
  return {
    id: newLineId(),
    itemName,
    size: firstSize ? firstSize.label || "Standard" : "",
    quantity: 1,
    assortment: {},
  };
}

function boxTarget(sizeLabel: string): number {
  const match = sizeLabel.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function assortedFlavors(sections: Section[]): MenuItem[] {
  return sections.find((s) => s.category === "Cupcakes")?.items.filter((i) => i.name !== ASSORTED_CUPCAKES) ?? [];
}

function summarizeLine(line: CartLine, sections: Section[]): string {
  const item = sections.flatMap((s) => s.items).find((i) => i.name === line.itemName);
  if (!item) return "";
  const sizeOption = item.sizes.find((s) => (s.label || "Standard") === line.size);
  if (line.itemName === ASSORTED_CUPCAKES) {
    const parts = Object.entries(line.assortment)
      .filter(([, qty]) => qty > 0)
      .map(([flavor, qty]) => `${qty} ${flavor}`)
      .join(", ");
    return `${line.size} Assorted Cupcakes${parts ? ` (${parts})` : ""} — ${sizeOption?.price ?? ""}`;
  }
  const sizeLabel = sizeOption?.label ? ` (${sizeOption.label})` : "";
  return `${line.quantity} × ${line.itemName}${sizeLabel} — ${sizeOption?.price ?? ""}`;
}

export function MenuOrderForm({
  sections,
  initialItem,
}: {
  sections: Section[];
  initialItem?: string;
}) {
  const allItems = sections.flatMap((s) => s.items);
  const startingItem = allItems.some((i) => i.name === initialItem)
    ? (initialItem as string)
    : (allItems[0]?.name ?? "");

  const [status, setStatus] = useState<Status>("idle");
  const [dateError, setDateError] = useState("");
  const [pickupError, setPickupError] = useState("");
  const [cartError, setCartError] = useState("");
  const [lines, setLines] = useState<CartLine[]>(() =>
    startingItem ? [newLine(startingItem, sections)] : []
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

  function updateLine(id: string, patch: Partial<CartLine>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function setLineItem(id: string, itemName: string) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...newLine(itemName, sections), id } : l)));
  }

  function addLine() {
    setLines((prev) => [...prev, newLine(allItems[0]?.name ?? "", sections)]);
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  function setFlavorQty(lineId: string, flavor: string, qty: number) {
    setLines((prev) =>
      prev.map((l) =>
        l.id === lineId ? { ...l, assortment: { ...l.assortment, [flavor]: Math.max(0, qty) } } : l
      )
    );
  }

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

    if (lines.length === 0) {
      setCartError("Add at least one item to your order.");
      return;
    }
    for (const line of lines) {
      if (line.itemName === ASSORTED_CUPCAKES) {
        const target = boxTarget(line.size);
        const chosen = Object.values(line.assortment).reduce((sum, n) => sum + n, 0);
        if (chosen !== target) {
          setCartError(
            `Your ${line.size} assorted cupcakes box has ${chosen} of ${target} cupcakes chosen. Pick exactly ${target}.`
          );
          return;
        }
      }
    }
    setCartError("");

    formData.set("orderSummary", lines.map((l) => summarizeLine(l, sections)).join("\n"));

    setStatus("sending");
    try {
      await submitNetlifyForm(formData);
      setStatus("sent");
      form.reset();
      setLines(startingItem ? [newLine(startingItem, sections)] : []);
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
      <input type="hidden" name="orderSummary" />
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>

      <div className="space-y-4">
        {lines.map((line) => {
          const item = allItems.find((i) => i.name === line.itemName);
          const isAssorted = line.itemName === ASSORTED_CUPCAKES;
          const flavors = isAssorted ? assortedFlavors(sections) : [];
          const target = isAssorted ? boxTarget(line.size) : 0;
          const chosen = isAssorted
            ? Object.values(line.assortment).reduce((sum, n) => sum + n, 0)
            : 0;

          return (
            <div key={line.id} className="rounded-xl border border-cocoa/10 bg-white p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Item</label>
                    <select
                      value={line.itemName}
                      onChange={(e) => setLineItem(line.id, e.target.value)}
                      className={fieldClass}
                    >
                      {sections.map((section) => (
                        <optgroup key={section.category} label={section.category}>
                          {section.items.map((i) => (
                            <option key={i.name} value={i.name}>
                              {i.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Size</label>
                    <select
                      value={line.size}
                      onChange={(e) => updateLine(line.id, { size: e.target.value, assortment: {} })}
                      className={fieldClass}
                    >
                      {item?.sizes.map((size) => (
                        <option key={size.label || "default"} value={size.label || "Standard"}>
                          {size.price}
                          {size.label && ` · ${size.label}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {lines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    aria-label="Remove item"
                    className="mt-7 h-9 w-9 shrink-0 flex items-center justify-center rounded-full text-cocoa/50 hover:bg-tan/60 hover:text-coffee transition-colors"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              {isAssorted ? (
                <div>
                  <div className="flex items-center justify-between">
                    <span className={labelClass}>Choose your flavors</span>
                    <span
                      className={`text-xs font-semibold ${
                        chosen === target ? "text-coffee" : "text-cocoa/50"
                      }`}
                    >
                      {chosen} / {target} picked
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {flavors.map((flavor) => (
                      <div
                        key={flavor.name}
                        className="flex items-center justify-between gap-3 rounded-lg border border-cocoa/10 px-3 py-2"
                      >
                        <span className="text-sm">{flavor.name}</span>
                        <input
                          type="number"
                          min="0"
                          value={line.assortment[flavor.name] ?? 0}
                          onChange={(e) =>
                            setFlavorQty(line.id, flavor.name, parseInt(e.target.value, 10) || 0)
                          }
                          className="w-16 rounded-lg border border-cocoa/15 px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-coffee"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-[140px]">
                  <label className={labelClass}>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={line.quantity}
                    onChange={(e) => updateLine(line.id, { quantity: parseInt(e.target.value, 10) || 1 })}
                    className={fieldClass}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addLine}
        className="text-sm font-semibold text-coffee hover:text-coffee-dark"
      >
        + Add another item
      </button>

      {lines.length > 0 && (
        <div className="rounded-xl bg-tan/40 p-4">
          <p className={labelClass}>Your order</p>
          <ul className="text-sm text-cocoa/80 space-y-1">
            {lines.map((line) => (
              <li key={line.id}>{summarizeLine(line, sections)}</li>
            ))}
          </ul>
        </div>
      )}
      {cartError && <p className="text-sm text-coffee font-medium">{cartError}</p>}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>Name</label>
          <input id="name" name="name" type="text" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" required className={fieldClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className={labelClass}>Phone</label>
          <input id="phone" name="phone" type="tel" className={fieldClass} />
        </div>
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
          className={`${fieldClass} sm:max-w-[200px]`}
        />
        <p className="mt-1.5 text-xs text-cocoa/60">Within store hours for the date you choose.</p>
        {pickupError && <p className="mt-1 text-xs text-coffee font-medium">{pickupError}</p>}
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
