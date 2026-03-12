import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const [videoError, setVideoError] = useState(false);
  const isAm = i18n.language === "am";
  const subtitle = t("hero.subtitle");

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div className="absolute inset-0 pattern-cross opacity-20" />
      <div className="container section-padding relative z-10">
        <div className="hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-primary-foreground"
          >
            <div className="space-y-3">
              <h1 className="section-title text-4xl md:text-5xl lg:text-6xl">
                {isAm ? t("hero.titleAm") : t("hero.title")}
              </h1>
              {subtitle ? (
                <p className="text-lg text-primary-foreground/90 max-w-xl">{subtitle}</p>
              ) : null}
              <p className="text-sm text-primary-foreground/70">
                {isAm ? t("hero.title") : t("hero.titleAm")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="btn-primary-warm">
                <Link to="/register">{t("hero.cta")}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="btn-secondary-warm">
                <Link to="/about">{t("hero.learnMore")}</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-lg lg:max-w-xl justify-self-end flex items-center justify-center"
          >
            <img
              src="/photos/LOGO.jpeg"
              alt="CFSMCCA logo"
              className="h-full w-full object-contain"
              onError={() => setVideoError(true)}
            />
            {videoError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Logo</p>
                  <p className="text-xs text-muted-foreground">Add LOGO.jpeg to /public/photos</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
