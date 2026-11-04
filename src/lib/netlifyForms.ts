export async function submitNetlifyForm(formData: FormData) {
  const res = await fetch("/", { method: "POST", body: formData });
  if (!res.ok) {
    throw new Error(`Form submission failed with status ${res.status}`);
  }
}
