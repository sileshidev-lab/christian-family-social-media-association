import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const IntroSection = () => {
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";

  return (
    <section className="container section-padding">
      <div className="max-w-4xl">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="section-title text-2xl">{t("intro.title")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("intro.subtitle")}</p>
          </CardHeader>
          <CardContent>
            <p
              className="text-sm leading-7 text-foreground/90 whitespace-pre-line"
              lang={isAm ? "am" : "en"}
            >
              {t("intro.body")}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default IntroSection;
