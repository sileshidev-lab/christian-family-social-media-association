import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const { t } = useTranslation();

  return (
    <section className="container section-padding pt-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-accent p-8 text-primary-foreground shadow-elevated md:p-12">
        <div className="absolute inset-0 pattern-cross opacity-10" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h3 className="section-title text-3xl">{t("cta.title")}</h3>
            <p className="text-primary-foreground/80">{t("cta.subtitle")}</p>
          </div>
          <Button asChild size="lg" variant="secondary" className="btn-secondary-warm">
            <Link to="/register">{t("cta.button")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
