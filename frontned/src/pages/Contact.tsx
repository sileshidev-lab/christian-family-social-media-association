import { useState, type FormEvent } from "react";
import { formatISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { contactService } from "@/services/dataService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ContactPage = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    contactService.create({
      id: Math.random().toString(36).slice(2, 10),
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      message: String(formData.get("message")),
      createdAt: formatISO(new Date()),
      isRead: false
    });
    event.currentTarget.reset();
    setSubmitted(true);
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
                <Button type="submit">{t("contact.send")}</Button>
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
