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
    <div className="pb-24 pt-16 md:pt-24">
      <section className="relative overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[360px] max-w-6xl rounded-full bg-primary/8 blur-[120px]" />

        <div className="container relative z-10 mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
              <LifeBuoy className="h-4 w-4" />
              Help
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Tell us what you need help with.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              Send one clear request and we will route it through the admin inbox. Use this for product help,
              account questions, or anything blocking your launch.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-zinc-200 bg-background/95 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/85 dark:shadow-[0_18px_50px_rgba(0,0,0,0.35)] md:p-8">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Support request</p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Compact, direct, and easy to review</h2>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Title</span>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(event) => updateField("title", event.target.value)}
                      placeholder="Billing question, publishing issue, account help..."
                      className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Name</span>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Your name"
                      className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Email</span>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Mobile number</span>
                    <input
                      type="tel"
                      value={form.mobileNumber}
                      onChange={(event) => updateField("mobileNumber", event.target.value)}
                      placeholder="Optional"
                      className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Description</span>
                  <textarea
                    required
                    rows={7}
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder="Tell us what happened, what you expected, and anything that would help us reproduce it."
                    className="w-full rounded-[1.5rem] border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
                    {errorMessage}
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                    {successMessage}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    We cap this form to 3 requests per day per IP to reduce spam.
                  </p>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="h-12 rounded-full px-7 shadow-lg shadow-primary/15 hover:shadow-primary/25"
                  >
                    {isSubmitting ? "Sending..." : "Send help request"}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-zinc-200 bg-card/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-zinc-800 dark:bg-zinc-950/70">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Contact us</p>
                <div className="mt-5 space-y-4">
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{contactEmail}</span>
                  </a>
                  <a
                    href="https://discord.gg/YcmUebEWhT"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Join the Kislap Discord</span>
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-950/70">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">What helps us reply faster</p>
                <div className="mt-5 space-y-4">
                  {[
                    "Use a short title that matches the actual problem.",
                    "Describe what you expected and what happened instead.",
                    "Add the page or feature you were using when it happened.",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
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
    </div>
  );
}
