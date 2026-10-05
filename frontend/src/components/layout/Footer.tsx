import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";

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
    <footer className="bg-primary-container text-on-primary-container pt-16 pb-8 border-t-[12px] border-secondary">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border-2 border-surface">
                <img
                  src="/photos/LOGO.jpeg"
                  alt="CFSMCCA logo"
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div>
                <h3 className="font-headline-md font-bold text-lg text-primary-fixed">CFSMCCA</h3>
                <p className="font-body-sm text-xs text-primary-fixed-dim">Christian Family Social Media Association</p>
              </div>
            </div>
            <p className="font-body-md text-primary-fixed-dim mb-6 max-w-md">
              {t("footer.description")}
            </p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com/cfsmcca" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface/10 flex items-center justify-center text-primary-fixed hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/cfsmcca" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface/10 flex items-center justify-center text-primary-fixed hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/@cfsmcca" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface/10 flex items-center justify-center text-primary-fixed hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-headline-md font-bold text-primary-fixed mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-3 font-body-md text-primary-fixed-dim">
              <li><Link to="/about" className="hover:text-secondary-fixed transition-colors">{t("nav.about")}</Link></li>
              <li><Link to="/news" className="hover:text-secondary-fixed transition-colors">{t("nav.news")}</Link></li>
              <li><Link to="/gallery" className="hover:text-secondary-fixed transition-colors">{t("nav.gallery")}</Link></li>
              <li><Link to="/register" className="hover:text-secondary-fixed transition-colors">{t("nav.register")}</Link></li>
              <li><Link to="/contact" className="hover:text-secondary-fixed transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline-md font-bold text-primary-fixed mb-4">{t("footer.newsletterTitle")}</h4>
            <p className="font-body-sm text-primary-fixed-dim mb-4">{t("footer.newsletterSubtitle")}</p>
            <form className="flex gap-2" onSubmit={handleSubscribe}>
              <input 
                type="email"
                placeholder={t("footer.newsletterPlaceholder")}
                className="w-full bg-surface/10 border border-primary-fixed-dim/30 rounded-lg px-4 py-2 text-primary-fixed placeholder:text-primary-fixed-dim/50 focus:outline-none focus:border-secondary-fixed transition-colors"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (submitted) setSubmitted(false);
                }}
                required
              />
              <button type="submit" className="bg-secondary-fixed text-on-secondary-fixed px-4 py-2 rounded-lg font-bold hover:bg-secondary-fixed-dim transition-colors">
                {t("footer.newsletterButton")}
              </button>
            </form>
            {submitted && (
              <p className="text-xs text-secondary-fixed mt-2" role="status" aria-live="polite">
                {t("footer.newsletterSuccess")}
              </p>
            )}
          </div>
        </div>
        
        <div className="border-t border-primary-fixed-dim/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body-sm text-primary-fixed-dim text-sm">© {year} CFSMCCA. {t("footer.rights")}</p>
          <div className="flex gap-6 font-body-sm text-sm text-primary-fixed-dim">
            <Link to="/about" className="hover:text-secondary-fixed transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-secondary-fixed transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
