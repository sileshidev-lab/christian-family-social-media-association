import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle } from "lucide-react";

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";
  const intro = t("intro.body");
  const [videoError, setVideoError] = useState(false);
  const verse = 'Mark 16:15: "Go into all the world and preach the gospel to all creation."';

  const renderIntro = () => {
    if (isAm || !intro.includes(verse)) {
      return intro;
    }
    const parts = intro.split(verse);
    return (
      <>
        {parts[0]}
        <span className="inline-block rounded bg-secondary/20 px-1 text-foreground">
          {verse}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div>
      {/* Intro + Video */}
      <section className="container section-padding">
        <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_1fr]">
          {/* Text Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="section-title text-3xl md:text-4xl">
                {isAm ? t("hero.titleAm") : t("hero.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isAm ? t("hero.title") : t("hero.titleAm")}
              </p>
            </div>
            <p
              className="text-sm md:text-base leading-7 text-foreground/90 whitespace-pre-line"
              lang={isAm ? "am" : "en"}
            >
              {renderIntro()}
            </p>
          </div>

          {/* Video Card */}
          <div className="w-full lg:max-w-[520px] lg:ml-auto">
            {videoError ? (
              <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground bg-muted/20">
                Video will appear here once uploaded.
              </div>
            ) : (
              <div className="aspect-video overflow-hidden rounded-2xl bg-muted/40 shadow-soft">
                <video
                  src="/videos/IMG_0953.mp4"
                  controls
                  className="h-full w-full object-cover"
                  onError={() => setVideoError(true)}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container section-compact">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-8">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-2xl">flag</span>
            </div>
            <h2 className="font-headline-md text-xl font-bold text-primary mb-3">{t("about.mission")}</h2>
            <p className="text-on-surface-variant leading-relaxed">{t("about.missionText")}</p>
          </div>
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-8">
            <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-2xl">visibility</span>
            </div>
            <h2 className="font-headline-md text-xl font-bold text-primary mb-3">{t("about.vision")}</h2>
            <p className="text-on-surface-variant leading-relaxed">{t("about.visionText")}</p>
          </div>
        </div>

        {/* Founded badge */}
        <div className="mt-6 flex items-center gap-3 rounded-xl bg-accent/10 border border-accent/20 px-6 py-4">
          <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
          <div>
            <span className="font-semibold text-foreground">{t("about.founded")}: </span>
            <span className="text-muted-foreground">{t("about.foundedText")}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
