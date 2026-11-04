"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Menu } from "@/lib/siteOverrides";
import { compressImage } from "@/lib/compressImage";
import { CloseIcon } from "./Icons";

type PhotoSlot = { key: string; label: string };
type SaveStatus = "idle" | "saved" | "error";

const inputClass =
  "w-full rounded-lg border border-cocoa/15 bg-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-coffee";

export function AdminDashboard({
  initialMenu,
  photoSlots,
  photoVersions,
}: {
  initialMenu: Menu;
  photoSlots: readonly PhotoSlot[];
  photoVersions: Record<string, number>;
}) {
  const router = useRouter();
  const [menu, setMenu] = useState<Menu>(() =>
    initialMenu.map((c) => ({
      category: c.category,
      note: c.note ?? "",
      items: c.items.map((it) => ({
        name: it.name,
        description: it.description ?? "",
        photo: it.photo ?? "",
        sizes: it.sizes.map((s) => ({ ...s })),
      })),
    }))
  );
  const [savingMenu, setSavingMenu] = useState(false);
  const [menuStatus, setMenuStatus] = useState<SaveStatus>("idle");
  const [uploadingItemPhoto, setUploadingItemPhoto] = useState<string | null>(null);

  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [photoStatus, setPhotoStatus] = useState<Record<string, SaveStatus>>({});

  function setCategoryField(catIdx: number, field: "category" | "note", value: string) {
    setMenu((prev) => prev.map((c, i) => (i === catIdx ? { ...c, [field]: value } : c)));
  }

  function setItemField(catIdx: number, itemIdx: number, field: "name" | "description", value: string) {
    setMenu((prev) =>
      prev.map((c, i) =>
        i !== catIdx
          ? c
          : { ...c, items: c.items.map((it, j) => (j === itemIdx ? { ...it, [field]: value } : it)) }
      )
    );
  }

  function setItemPhoto(catIdx: number, itemIdx: number, photo: string) {
    setMenu((prev) =>
      prev.map((c, i) =>
        i !== catIdx
          ? c
          : { ...c, items: c.items.map((it, j) => (j === itemIdx ? { ...it, photo } : it)) }
      )
    );
  }

  async function handleItemPhotoUpload(catIdx: number, itemIdx: number, file: File) {
    const uploadKey = `${catIdx}-${itemIdx}`;
    setUploadingItemPhoto(uploadKey);
    try {
      const formData = new FormData();
      formData.append("file", await compressImage(file));
      const res = await fetch("/api/admin/upload-photo", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { key } = await res.json();
      setItemPhoto(catIdx, itemIdx, key);
    } catch {
      window.alert("Couldn't upload that photo. Try again.");
    } finally {
      setUploadingItemPhoto(null);
    }
  }

  function setSizeField(
    catIdx: number,
    itemIdx: number,
    sizeIdx: number,
    field: "label" | "price",
    value: string
  ) {
    setMenu((prev) =>
      prev.map((c, i) =>
        i !== catIdx
          ? c
          : {
              ...c,
              items: c.items.map((it, j) =>
                j !== itemIdx
                  ? it
                  : { ...it, sizes: it.sizes.map((s, k) => (k === sizeIdx ? { ...s, [field]: value } : s)) }
              ),
            }
      )
    );
  }

  function addSize(catIdx: number, itemIdx: number) {
    setMenu((prev) =>
      prev.map((c, i) =>
        i !== catIdx
          ? c
          : {
              ...c,
              items: c.items.map((it, j) =>
                j !== itemIdx ? it : { ...it, sizes: [...it.sizes, { label: "", price: "" }] }
              ),
            }
      )
    );
  }

  function removeSize(catIdx: number, itemIdx: number, sizeIdx: number) {
    setMenu((prev) =>
      prev.map((c, i) =>
        i !== catIdx
          ? c
          : {
              ...c,
              items: c.items.map((it, j) =>
                j !== itemIdx ? it : { ...it, sizes: it.sizes.filter((_, k) => k !== sizeIdx) }
              ),
            }
      )
    );
  }

  function addItem(catIdx: number) {
    setMenu((prev) =>
      prev.map((c, i) =>
        i !== catIdx
          ? c
          : {
              ...c,
              items: [...c.items, { name: "", description: "", photo: "", sizes: [{ label: "", price: "" }] }],
            }
      )
    );
  }

  function removeItem(catIdx: number, itemIdx: number) {
    if (!window.confirm("Remove this item?")) return;
    setMenu((prev) =>
      prev.map((c, i) => (i !== catIdx ? c : { ...c, items: c.items.filter((_, j) => j !== itemIdx) }))
    );
  }

  function addCategory() {
    setMenu((prev) => [...prev, { category: "", note: "", items: [] }]);
  }

  function removeCategory(catIdx: number) {
    if (!window.confirm("Remove this whole category and all its items?")) return;
    setMenu((prev) => prev.filter((_, i) => i !== catIdx));
  }

  async function handleSaveMenu() {
    setSavingMenu(true);
    setMenuStatus("idle");
    try {
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menu }),
      });
      if (!res.ok) throw new Error();
      setMenuStatus("saved");
      router.refresh();
    } catch {
      setMenuStatus("error");
    } finally {
      setSavingMenu(false);
    }
  }

  async function handlePhotoChange(slotKey: string, file: File) {
    setUploadingSlot(slotKey);
    setPhotoStatus((s) => ({ ...s, [slotKey]: "idle" }));
    try {
      const formData = new FormData();
      formData.append("slot", slotKey);
      formData.append("file", await compressImage(file));
      const res = await fetch("/api/admin/photo", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      setPhotoStatus((s) => ({ ...s, [slotKey]: "saved" }));
      router.refresh();
    } catch {
      setPhotoStatus((s) => ({ ...s, [slotKey]: "error" }));
    } finally {
      setUploadingSlot(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-cocoa">Admin</h1>
        <button onClick={handleLogout} className="text-sm font-semibold text-coffee hover:text-coffee-dark">
          Log out
        </button>
      </div>

      <section>
        <h2 className="font-display text-xl font-semibold text-cocoa mb-4">Menu</h2>
        <div className="space-y-6">
          {menu.map((cat, ci) => (
            <div key={ci} className="bg-white rounded-2xl border border-cocoa/10 p-5">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={cat.category}
                    onChange={(e) => setCategoryField(ci, "category", e.target.value)}
                    placeholder="Category name"
                    className={`${inputClass} font-display text-lg font-semibold`}
                  />
                  <input
                    type="text"
                    value={cat.note}
                    onChange={(e) => setCategoryField(ci, "note", e.target.value)}
                    placeholder="Category note (optional)"
                    className={`${inputClass} text-sm`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCategory(ci)}
                  className="text-xs text-coffee hover:text-coffee-dark shrink-0 mt-1.5 whitespace-nowrap"
                >
                  Delete category
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {cat.items.map((item, ii) => (
                  <div key={ii} className="bg-tan/40 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      {item.photo ? (
                        <div className="relative shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element -- admin-only, dynamic uploaded content */}
                          <img
                            src={`/api/photos/${item.photo}`}
                            alt=""
                            className="h-16 w-16 rounded-lg object-cover border border-cocoa/10"
                          />
                          <button
                            type="button"
                            onClick={() => setItemPhoto(ci, ii, "")}
                            aria-label="Remove photo"
                            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full bg-cocoa/70 text-cream hover:bg-coffee"
                          >
                            <CloseIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="shrink-0 h-16 w-16 flex items-center justify-center rounded-lg border-2 border-dashed border-cocoa/20 text-center text-[11px] leading-tight text-cocoa/50 hover:border-coffee hover:text-coffee transition-colors cursor-pointer">
                          {uploadingItemPhoto === `${ci}-${ii}` ? "…" : "Add photo"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingItemPhoto === `${ci}-${ii}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleItemPhotoUpload(ci, ii, file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      )}
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => setItemField(ci, ii, "name", e.target.value)}
                          placeholder="Item name"
                          className={`${inputClass} font-semibold`}
                        />
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => setItemField(ci, ii, "description", e.target.value)}
                          placeholder="Description (optional)"
                          className={`${inputClass} text-sm`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(ci, ii)}
                        className="text-xs text-coffee hover:text-coffee-dark shrink-0 mt-1.5 whitespace-nowrap"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 space-y-2">
                      {item.sizes.map((size, si) => (
                        <div key={si} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={size.label}
                            onChange={(e) => setSizeField(ci, ii, si, "label", e.target.value)}
                            placeholder="Size (optional)"
                            className={`${inputClass} w-32 text-sm`}
                          />
                          <input
                            type="text"
                            value={size.price}
                            onChange={(e) => setSizeField(ci, ii, si, "price", e.target.value)}
                            placeholder="Price"
                            className={`${inputClass} w-24 text-sm`}
                          />
                          {item.sizes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSize(ci, ii, si)}
                              aria-label="Remove size"
                              className="text-cocoa/40 hover:text-coffee"
                            >
                              <CloseIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSize(ci, ii)}
                        className="text-xs font-semibold text-coffee hover:text-coffee-dark"
                      >
                        + Add size
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem(ci)}
                  className="text-sm font-semibold text-coffee hover:text-coffee-dark"
                >
                  + Add item
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCategory}
            className="text-sm font-semibold text-coffee hover:text-coffee-dark"
          >
            + Add category
          </button>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSaveMenu}
            disabled={savingMenu}
            className="inline-flex items-center rounded-full bg-coffee px-6 py-3 text-base font-semibold text-cream hover:bg-coffee-dark transition-colors disabled:opacity-60"
          >
            {savingMenu ? "Saving…" : "Save menu"}
          </button>
          {menuStatus === "saved" && <span className="text-sm text-coffee font-medium">Saved.</span>}
          {menuStatus === "error" && (
            <span className="text-sm text-coffee font-medium">Couldn&apos;t save. Try again.</span>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-cocoa mb-4">Photos</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {photoSlots.map((slot) => (
            <div key={slot.key} className="bg-white rounded-xl border border-cocoa/10 p-4">
              <p className="font-semibold text-cocoa mb-2">{slot.label}</p>
              {photoVersions[slot.key] ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin-only, dynamic uploaded content
                <img
                  src={`/api/photos/${slot.key}?v=${photoVersions[slot.key]}`}
                  alt={slot.label}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              ) : (
                <p className="text-sm text-cocoa/60 mb-3">No photo set. Using the site&apos;s placeholder.</p>
              )}
              <label className="inline-flex items-center rounded-full border-2 border-cocoa/15 px-4 py-2 text-sm font-semibold text-cocoa hover:border-coffee hover:text-coffee transition-colors cursor-pointer">
                {uploadingSlot === slot.key ? "Uploading…" : "Replace photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingSlot === slot.key}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoChange(slot.key, file);
                    e.target.value = "";
                  }}
                />
              </label>
              {photoStatus[slot.key] === "saved" && (
                <span className="ml-3 text-sm text-coffee font-medium">Saved.</span>
              )}
              {photoStatus[slot.key] === "error" && (
                <span className="ml-3 text-sm text-coffee font-medium">Failed. Try again.</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
