import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NavLink from "./NavLink";
import { cn } from "@/lib/utils";

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    document.documentElement.lang = i18n.language === "am" ? "am" : "en";
    document.body.classList.toggle("amharic", i18n.language === "am");
  }, [i18n.language]);

  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/news", label: t("nav.news") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/register", label: t("nav.register") },
    { to: "/contact", label: t("nav.contact") }
  ];

  return (
    <header className="bg-surface dark:bg-surface-dim border-b border-outline-variant dark:border-outline shadow-sm w-full top-0 sticky z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto h-16">
        <Link to="/" className="font-headline-md text-headline-md font-bold text-primary dark:text-inverse-primary">
          CFSMCCA
        </Link>

        <nav className="hidden md:flex gap-6 items-center" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} label={item.label} />
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span 
              className={cn("font-bold cursor-pointer transition-colors", i18n.language === "en" ? "text-primary underline decoration-secondary-container decoration-2" : "text-on-surface-variant hover:text-primary")}
              onClick={() => i18n.changeLanguage("en")}
            >
              EN
            </span>
            <span className="text-on-surface-variant">|</span>
            <span 
              className={cn("font-bold cursor-pointer transition-colors", i18n.language === "am" ? "text-primary underline decoration-secondary-container decoration-2" : "text-on-surface-variant hover:text-primary")}
              onClick={() => i18n.changeLanguage("am")}
            >
              አማ
            </span>
          </div>
          
          <Link to="/register" className="hidden md:inline-flex bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">
            {t("nav.join")}
          </Link>
          
          <button 
            className="md:hidden text-primary"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{isOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-outline-variant bg-surface shadow-sm">
          <div className="mx-auto flex w-full flex-col gap-4 px-margin-mobile py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                label={item.label}
                onClick={() => setIsOpen(false)}
              />
            ))}
            <Link 
              to="/register" 
              className="mt-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-center hover:shadow-lg transition-all"
              onClick={() => setIsOpen(false)}
            >
              {t("nav.join")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
