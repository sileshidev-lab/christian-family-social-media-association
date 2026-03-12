import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import NavLink from "./NavLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language === "am" ? "am" : "en";
    document.body.classList.toggle("amharic", i18n.language === "am");
  }, [i18n.language]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "am" ? "en" : "am");
  };

  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/news", label: t("nav.news") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/register", label: t("nav.register") },
    { to: "/contact", label: t("nav.contact") }
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-soft" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="leading-tight">
            <p className="text-sm font-semibold">Christian Family Social Media Association</p>
            <p className="text-sm font-semibold text-foreground/80">
              የክርስቲያን ቤተሰብ ማህበራዊ ሚዲያ ማህበር
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} label={item.label} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            variant="ghost"
            size="sm"
            className="lang-switch"
            onClick={toggleLanguage}
            aria-label="Toggle language"
            aria-pressed={i18n.language === "am"}
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-semibold">EN</span>
            <span className="text-xs text-foreground/60">/</span>
            <span className="text-xs font-semibold">አማ</span>
          </Button>
          <Button asChild size="sm" className="btn-primary-warm">
            <Link to="/register">{t("nav.register")}</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-border bg-background shadow-soft"
        >
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-6 py-4 lg:px-10">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                label={item.label}
                onClick={() => setIsOpen(false)}
              />
            ))}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="lang-switch"
                onClick={toggleLanguage}
                aria-label="Toggle language"
                aria-pressed={i18n.language === "am"}
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs font-semibold">EN</span>
                <span className="text-xs text-foreground/60">/</span>
                <span className="text-xs font-semibold">አማ</span>
              </Button>
              <Button asChild size="sm" className="btn-primary-warm">
                <Link to="/register">{t("nav.register")}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
