export async function submitNetlifyForm(formData: FormData) {
  // Posts to the static form-detection mirror rather than "/" — Next.js
  // pages are rendered dynamically, so Netlify's build-time scanner can't
  // see the real React forms. See public/__forms.html for the mirror.
  const res = await fetch("/__forms.html", { method: "POST", body: formData });
  if (!res.ok) {
    throw new Error(`Form submission failed with status ${res.status}`);
  }
}
