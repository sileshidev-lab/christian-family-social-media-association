import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  return (
    <section className="hero-pattern relative overflow-hidden py-24 md:py-32 flex items-center justify-center min-h-[80vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-low opacity-80" />
      
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter relative z-10 text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high border border-outline-variant mb-8 shadow-sm"
        >
          <span className="material-symbols-outlined text-secondary text-sm">campaign</span>
          <span className="font-label-sm text-label-sm text-primary">
            {t("hero.badge")}
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-6 max-w-4xl tracking-tight leading-tight"
        >
          {t("hero.title")}
          <br />
          <span className="text-secondary mt-2 block">{t("hero.titleAm")}</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
        >
          <Link 
            to="/register"
            className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-lg font-bold text-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
          >
            {t("hero.cta")}
          </Link>
          <Link 
            to="/about"
            className="bg-surface text-primary border border-outline-variant px-8 py-4 rounded-lg font-bold text-lg hover:bg-surface-container-highest transition-colors duration-300 flex items-center justify-center gap-2"
          >
            {t("hero.learnMore")} <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
