import type { Metadata } from "next";
import { CustomCakeForm } from "@/components/CustomCakeForm";

export const metadata: Metadata = {
  title: "Custom Cakes | Mom's Cake Café",
  description: "Request a custom cake for a birthday, wedding, or celebration at Mom's Cake Café.",
};

const steps = [
  { title: "Tell us the occasion", text: "Date, guest count, and the flavors you're drawn to." },
  { title: "We review & quote", text: "Final pricing depends on your design. Expect a reply within two business days." },
  { title: "You pick it up", text: "Fresh from the kitchen, boxed and ready for the day." },
];

export default function CustomCakesPage() {
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 pt-16 pb-10 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold">Order a custom cake</h1>
          <p className="mt-4 text-cocoa/75">
            Every custom order starts as a conversation. Fill in what you
            know: flavor, size, date, inspiration, and we&apos;ll take it from there.
          </p>
        </div>
      </section>

      <section className="bg-tan">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-12 grid sm:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div key={s.title} className="bg-cream rounded-3xl p-6">
              <span className="font-display text-sm font-semibold text-coffee">
                Step {i + 1}
              </span>
              <p className="mt-2 font-display text-lg font-semibold">{s.title}</p>
              <p className="mt-2 text-sm text-cocoa/70">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 py-16">
          <CustomCakeForm />
        </div>
      </section>
    </>
  );
}
