import { useState } from "react";
import { useTranslation } from "react-i18next";

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
        <span className="inline-block rounded bg-secondary/30 px-1 text-foreground">
          {verse}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div>
      <section className="container section-padding lg:pr-0">
        {/* Changed grid layout to give the video more room on large screens */}
        <div className="grid items-start gap-12 lg:grid-cols-[1.25fr_1fr]">
          
          {/* Text Content */}
          <div className="space-y-4 lg:max-w-[700px]">
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

          {/* Video Card - Pushed to the right corner */}
          <div className="w-full lg:max-w-[560px] lg:ml-auto lg:justify-self-end">
            {videoError ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
                Video will appear here once uploaded.
              </div>
            ) : (
              <div className="aspect-[9/16] max-h-[640px] overflow-hidden rounded-2xl bg-muted/40 shadow-soft">
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
    </div>
  );
};

export default AboutPage;
