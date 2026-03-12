import { Globe, HeartHandshake, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t } = useTranslation();

  const items = [
    {
      icon: HeartHandshake,
      title: t("about.mission"),
      description: t("about.missionText")
    },
    {
      icon: Globe,
      title: t("about.vision"),
      description: t("about.visionText")
    },
    {
      icon: CalendarDays,
      title: t("about.founded"),
      description: t("about.foundedText")
    }
  ];

  return (
    <section className="container section-padding">
      <div className="space-y-8 text-center">
        <div className="mx-auto max-w-2xl space-y-2">
          <h2 className="section-title text-3xl md:text-4xl">{t("about.title")}</h2>
          <p className="text-muted-foreground">{t("about.subtitle")}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
