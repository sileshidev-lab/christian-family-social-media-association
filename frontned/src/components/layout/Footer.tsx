import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("cfsmcca_newsletter");
        const list = raw ? (JSON.parse(raw) as { email: string; createdAt: string }[]) : [];
        list.push({ email, createdAt: new Date().toISOString() });
        localStorage.setItem("cfsmcca_newsletter", JSON.stringify(list));
      } catch {
        localStorage.setItem(
          "cfsmcca_newsletter",
          JSON.stringify([{ email, createdAt: new Date().toISOString() }])
        );
      }
    }
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="bg-card text-card-foreground">
      <div className="ethiopian-border" />
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-12 footer-compact">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.9fr_1.1fr_1fr] lg:gap-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="logo-circle bg-background overflow-hidden">
                <img
                  src="/photos/LOGO.jpeg"
                  alt="CFSMCCA logo"
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <h3 className="section-title text-xl">Christian Family Social Media Association</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer.description")}
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">{t("footer.quickLinks")}</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-primary">
                {t("nav.about")}
              </Link>
              <Link to="/news" className="hover:text-primary">
                {t("nav.news")}
              </Link>
              <Link to="/gallery" className="hover:text-primary">
                {t("nav.gallery")}
              </Link>
              <Link to="/register" className="hover:text-primary">
                {t("nav.register")}
              </Link>
              <Link to="/contact" className="hover:text-primary">
                {t("nav.contact")}
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">{t("footer.newsletterTitle")}</h4>
            <p className="text-sm text-muted-foreground">{t("footer.newsletterSubtitle")}</p>
            <form className="flex flex-col gap-2 sm:flex-row sm:items-center" onSubmit={handleSubscribe}>
              <Input
                type="email"
                placeholder={t("footer.newsletterPlaceholder")}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (submitted) setSubmitted(false);
                }}
                required
              />
              <Button type="submit" size="sm" className="sm:shrink-0">
                {t("footer.newsletterButton")}
              </Button>
            </form>
            {submitted && (
              <p className="text-xs text-accent" role="status" aria-live="polite">
                {t("footer.newsletterSuccess")}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">{t("footer.contactInfo")}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+251911000000" className="hover:text-primary">
                  +251 911 000 000
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@cfsmcca.org" className="hover:text-primary">
                  info@cfsmcca.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {year} Christian Family Social Media Content Creators Association. {t("footer.rights")}
      </div>
    </footer>
  );
};

export default Footer;
