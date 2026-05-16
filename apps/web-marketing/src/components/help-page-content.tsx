import { useMemo, useState, type FormEvent } from "react";
import { LifeBuoy, Mail, MessageCircle, Send, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

type HelpPageContentProps = {
  apiBaseUrl: string;
  contactEmail: string;
};

type FormState = {
  title: string;
  name: string;
  email: string;
  mobileNumber: string;
  description: string;
};

const initialFormState: FormState = {
  title: "",
  name: "",
  email: "",
  mobileNumber: "",
  description: "",
};

export function HelpPageContent({ apiBaseUrl, contactEmail }: HelpPageContentProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const sourcePage = useMemo(() => {
    if (typeof window === "undefined") {
      return "/help";
    }

    return window.location.pathname || "/help";
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/help-inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          name: form.name,
          email: form.email,
          mobile_number: form.mobileNumber || null,
          description: form.description,
          source_page: sourcePage,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          result?.message ||
          result?.error ||
          "We could not send your help request right now. Please try again in a bit.";

        throw new Error(message);
      }

      setSuccessMessage("Your message is in. We will review it and get back to you through email.");
      setForm(initialFormState);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong while sending your request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="w-full max-w-full overflow-x-hidden bg-white text-black">
      <section className="relative overflow-hidden border-b-4 border-black bg-white px-4 pb-24 pt-16 md:pt-24">
        <div className="absolute inset-0 bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.045]" />
        <div className="container mx-auto max-w-7xl">
          <div className="relative max-w-6xl">
            <p className="inline-flex items-center gap-2 border-4 border-black bg-secondary px-4 py-2 font-mono text-sm font-black uppercase text-black shadow-[6px_6px_0_#000]">
              <LifeBuoy className="h-4 w-4" />
              Support desk
            </p>
            <h1 className="mt-6 max-w-6xl text-5xl font-black uppercase leading-[0.9] tracking-normal md:text-7xl lg:text-8xl">
              Tell us what is blocking your launch.
            </h1>
            <p className="mt-7 max-w-3xl text-xl font-semibold leading-relaxed text-zinc-700">
              Send one clear request for publishing problems, account access, or builder issues. It lands in the admin inbox with enough context to act on.
            </p>
          </div>

          <div className="relative mt-12 grid grid-flow-dense gap-0 border-4 border-black bg-white shadow-[10px_10px_0_#000] md:grid-cols-3">
            {["Publishing problem", "Account or access", "Builder or content"].map((item) => (
              <div key={item} className="border-b-4 border-black bg-secondary p-5 transition hover:bg-white md:border-b-0 md:border-r-4 md:last:border-r-0">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-black">Use this for</p>
                <h2 className="mt-3 text-2xl font-black uppercase leading-tight">{item}</h2>
              </div>
            ))}
          </div>

          <div className="relative mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="border-4 border-black bg-white p-6 shadow-[12px_12px_0_#000] md:p-8">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-sm font-black uppercase tracking-[0.18em] text-primary">Support request</p>
                  <h2 className="mt-3 text-3xl font-black uppercase tracking-normal text-black">Compact, direct, and easy to review</h2>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-bold uppercase text-black">Title</span>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(event) => updateField("title", event.target.value)}
                      placeholder="Billing question, publishing issue, account help..."
                      className="h-12 w-full border-4 border-black bg-white px-4 text-sm font-semibold text-black outline-none transition focus:bg-secondary/30 focus:shadow-[4px_4px_0_#000]"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold uppercase text-black">Name</span>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Your name"
                      className="h-12 w-full border-4 border-black bg-white px-4 text-sm font-semibold text-black outline-none transition focus:bg-secondary/30 focus:shadow-[4px_4px_0_#000]"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold uppercase text-black">Email</span>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="you@example.com"
                      className="h-12 w-full border-4 border-black bg-white px-4 text-sm font-semibold text-black outline-none transition focus:bg-secondary/30 focus:shadow-[4px_4px_0_#000]"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold uppercase text-black">Mobile number</span>
                    <input
                      type="tel"
                      value={form.mobileNumber}
                      onChange={(event) => updateField("mobileNumber", event.target.value)}
                      placeholder="Optional"
                      className="h-12 w-full border-4 border-black bg-white px-4 text-sm font-semibold text-black outline-none transition focus:bg-secondary/30 focus:shadow-[4px_4px_0_#000]"
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-bold uppercase text-black">Description</span>
                  <textarea
                    required
                    rows={7}
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder="Tell us what happened, what you expected, and anything that would help us reproduce it."
                    className="w-full border-4 border-black bg-white px-4 py-3 text-sm font-semibold text-black outline-none transition focus:bg-secondary/30 focus:shadow-[4px_4px_0_#000]"
                  />
                </label>

                {errorMessage ? (
                  <div className="border-2 border-black bg-red-100 px-4 py-3 text-sm font-bold text-red-800">
                    {errorMessage}
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="border-2 border-black bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">
                    {successMessage}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-zinc-600">
                    We cap this form to 3 requests per day per IP to reduce spam.
                  </p>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="h-12 rounded-none border-4 border-black bg-black px-7 font-black uppercase text-white shadow-[6px_6px_0_#facc15] hover:bg-primary hover:text-white"
                  >
                    {isSubmitting ? "Sending..." : "Send help request"}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="border-4 border-black bg-black p-6 text-white shadow-[10px_10px_0_#facc15]">
                <p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-secondary">Contact us</p>
                <div className="mt-5 space-y-4">
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex min-w-0 items-center gap-3 border-4 border-white bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-secondary"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 [overflow-wrap:anywhere]">{contactEmail}</span>
                  </a>
                  <a
                    href="https://discord.gg/YcmUebEWhT"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 border-4 border-white bg-transparent px-4 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Join the Kislap Discord</span>
                  </a>
                </div>
              </div>

              <div className="border-4 border-black bg-secondary p-6 shadow-[8px_8px_0_#000]">
                <p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-black">What helps us reply faster</p>
                <div className="mt-5 space-y-4">
                  {[
                    "Use a short title that matches the actual problem.",
                    "Describe what you expected and what happened instead.",
                    "Add the page or feature you were using when it happened.",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm font-bold leading-relaxed text-black">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
