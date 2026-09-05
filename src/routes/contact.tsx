import { FormEvent, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Check,
  Lightbulb,
  Mail,
  MapPin,
  Megaphone,
  PenLine,
  Phone,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Button } from "@/components/ui/button";
import motherBaby from "@/assets/mother-baby-lineart.png";

const title = "Connect With Seedova — Patient & Partner Support";
const description =
  "Contact Seedova for fertility-care support, clinic representation, partnerships, or feedback.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const helpItems = [
  {
    title: "Patient Support",
    body: "Questions about finding fertility care or using Seedova.",
    icon: UserRound,
    tone: "bg-contact-rose text-contact-red",
  },
  {
    title: "Healthcare Providers",
    body: "Want your clinic or hospital represented on Seedova?",
    icon: Building2,
    tone: "bg-contact-mint text-primary",
  },
  {
    title: "Promote & Partner",
    body: "Interested in promoting your clinic, healthcare service or collaborating with Seedova?",
    icon: Megaphone,
    tone: "bg-contact-peach text-foreground",
  },
  {
    title: "Feedback",
    body: "Help us make fertility care easier to navigate.",
    icon: Lightbulb,
    tone: "bg-contact-mint text-foreground",
  },
] as const;

const contactOptions = [
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "whatsapp", label: "WhatsApp", icon: Phone },
] as const;

function ContactPage() {
  const [preferred, setPreferred] = useState("email");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    toast.success("Thanks for reaching out. We’ll be in touch soon.");
    form.reset();
    setPreferred("email");
  };

  return (
    <div className="min-h-screen bg-contact-page">
      <Navbar />
      <main className="mx-auto max-w-[1480px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="grid overflow-hidden rounded-[28px] border border-border/50 bg-card shadow-[var(--shadow-contact)] lg:min-h-[760px] lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative z-10 bg-card px-6 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-9 xl:px-14">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">Connect with us</p>
            <h1 className="mt-2 font-sans text-4xl font-bold leading-tight text-foreground sm:text-[2.55rem]">Let’s Connect</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
              Have a question, suggestion, partnership idea, or need help finding the right fertility care? We’re here to listen.
            </p>

            <form onSubmit={submit} className="mt-7 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" required icon={UserRound}>
                  <input required name="name" autoComplete="name" placeholder="Enter your full name" className="contact-control" />
                </Field>
                <Field label="Email Address" required icon={Mail}>
                  <input required type="email" name="email" autoComplete="email" placeholder="Enter your email address" className="contact-control" />
                </Field>
                <Field label="Phone Number" icon={Phone}>
                  <input type="tel" name="phone" autoComplete="tel" placeholder="+91 98765 43210" className="contact-control" />
                </Field>
                <Field label="I’m contacting you about" required>
                  <select required name="subject" defaultValue="" className="contact-control appearance-none pr-10">
                    <option value="" disabled>Select an option</option>
                    <option>Patient support</option>
                    <option>Healthcare provider</option>
                    <option>Promote or partner</option>
                    <option>Feedback</option>
                  </select>
                </Field>
              </div>

              <Field label="Location" icon={MapPin}>
                <input name="location" autoComplete="address-level1" placeholder="City / State" className="contact-control" />
              </Field>

              <Field label="Your Message" required icon={PenLine} alignTop>
                <textarea required name="message" placeholder="Tell us how we can help..." rows={3} className="contact-control min-h-24 resize-y py-3" />
              </Field>

              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-foreground">Preferred way to hear from us</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {contactOptions.map((option) => {
                    const Icon = option.icon;
                    const selected = preferred === option.value;
                    return (
                      <label key={option.value} className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 text-sm transition-colors ${selected ? "border-primary bg-secondary/70 text-foreground" : "border-input bg-card text-foreground hover:bg-secondary/40"}`}>
                        <input type="radio" name="preferred" value={option.value} checked={selected} onChange={() => setPreferred(option.value)} className="sr-only" />
                        <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${selected ? "border-primary" : "border-muted-foreground/60"}`}>
                          {selected ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                        </span>
                        <Icon className={`h-4 w-4 ${option.value === "whatsapp" ? "text-contact-whatsapp" : "text-foreground"}`} aria-hidden />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-muted-foreground">
                <input required type="checkbox" name="consent" className="peer sr-only" />
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-muted-foreground/70 bg-card text-primary-foreground peer-checked:border-primary peer-checked:bg-primary">
                  <Check className="h-3.5 w-3.5 opacity-0 peer-checked:opacity-100" aria-hidden />
                </span>
                I agree to be contacted by Seedova regarding my enquiry.
              </label>

              <Button type="submit" className="h-12 min-w-56 rounded-md px-7 text-base shadow-none">
                Send Message <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </form>
          </section>

          <aside className="relative min-h-[850px] overflow-hidden bg-contact-panel px-6 py-9 sm:px-10 lg:min-h-0 lg:px-8 xl:px-10">
            <div aria-hidden className="absolute -right-20 -top-28 h-80 w-72 rounded-[48%] bg-contact-peach/65" />
            <div aria-hidden className="absolute -right-28 top-52 h-96 w-72 rounded-[52%] bg-contact-mint/75" />
            <div aria-hidden className="absolute -bottom-32 -left-20 h-72 w-[440px] rotate-6 rounded-[50%] bg-contact-peach/65" />
            <div aria-hidden className="absolute -bottom-36 right-[-15%] h-80 w-[440px] -rotate-12 rounded-[50%] bg-contact-sage/70" />

            <div className="relative z-10 max-w-[410px]">
              <h2 className="font-sans text-3xl font-bold leading-tight text-foreground">How can we help?</h2>
              <p className="mt-2 max-w-sm text-sm leading-5 text-muted-foreground">
                Whether you’re a patient, healthcare provider, or partner — we’d love to hear from you.
              </p>
              <div className="mt-6 space-y-5">
                {helpItems.map((item) => (
                  <div key={item.title} className="grid grid-cols-[56px_minmax(0,1fr)] items-start gap-4">
                    <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ${item.tone}`}>
                      <item.icon className="h-7 w-7" strokeWidth={1.65} aria-hidden />
                    </span>
                    <div className="min-w-0 pt-1">
                      <h3 className="font-sans text-base font-bold text-foreground">{item.title}</h3>
                      <p className="mt-0.5 text-[13px] leading-[1.45] text-muted-foreground">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute right-5 top-8 z-10 hidden rotate-[-5deg] text-center font-[family-name:var(--font-script)] text-[25px] leading-[1.05] text-foreground xl:block">
              Better<br />Information<br />Brighter<br />Journeys
              <span className="mt-1 block text-3xl">♡</span>
            </div>

            <img
              src={motherBaby}
              alt="A mother gently cradling her sleeping baby"
              width={1024}
              height={1280}
              className="absolute bottom-[-3%] right-[-3%] z-[2] h-auto w-[70%] max-w-[510px] object-contain sm:w-[58%] lg:w-[68%] xl:w-[64%]"
            />

            <p className="absolute bottom-12 left-7 z-10 max-w-44 -rotate-3 font-[family-name:var(--font-script)] text-2xl leading-tight text-foreground sm:left-10">
              Together for<br />a brighter tomorrow ♡
            </p>
            <p className="absolute bottom-8 right-5 z-10 hidden text-right text-[9px] uppercase leading-5 tracking-[0.2em] text-muted-foreground sm:block">
              Real people<br />Real support<br />Brighter tomorrows
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Field({ label, required, icon: Icon, alignTop = false, children }: { label: string; required?: boolean; icon?: typeof UserRound; alignTop?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}{required ? <span className="text-contact-required"> *</span> : null}
      </span>
      <span className="relative block">
        {Icon ? <Icon className={`pointer-events-none absolute left-3.5 h-5 w-5 text-muted-foreground ${alignTop ? "top-3.5" : "top-1/2 -translate-y-1/2"}`} strokeWidth={1.7} aria-hidden /> : null}
        <span className={Icon ? "[&>*]:pl-11" : ""}>{children}</span>
      </span>
    </label>
  );
}
