import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { messageApi } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ContactPage = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    try {
      await messageApi.create({
        name: String(formData.get("name")),
        email: String(formData.get("email")),
        message: String(formData.get("message"))
      });
      event.currentTarget.reset();
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container section-compact">
      <div className="space-y-6">
        <div>
          <h1 className="section-title text-2xl md:text-3xl">{t("contact.title")}</h1>
          <p className="text-muted-foreground">{t("contact.subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] items-start">
          <div>
            {submitted ? (
              <p className="text-sm text-primary" role="status" aria-live="polite">
                Message sent successfully.
              </p>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="space-y-2">
                  <Label htmlFor="name">{t("contact.name")}</Label>
                  <Input id="name" name="name" autoComplete="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("contact.email")}</Label>
                  <Input id="email" name="email" type="email" autoComplete="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t("contact.message")}</Label>
                  <Textarea id="message" name="message" required />
                </div>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Sending..." : t("contact.send")}
                </Button>
              </form>
            )}
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">{t("contact.address")}</p>
              <p>Addis Ababa, Ethiopia</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">{t("contact.phone")}</p>
              <a href="tel:+251911000000" className="text-foreground hover:text-primary">
                +251 911 000 000
              </a>
            </div>
            <div>
              <p className="font-semibold text-foreground">{t("contact.emailLabel")}</p>
              <a href="mailto:info@cfsmcca.org" className="text-foreground hover:text-primary">
                info@cfsmcca.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
