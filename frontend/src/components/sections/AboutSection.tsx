import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-surface-bright dark:bg-surface-dim">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-primary mb-4">{t("about.valuesTitle")}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{t("about.valuesSubtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Value 1 */}
          <div className="bg-surface-container-low rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-md border border-outline-variant/30">
            <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">public</span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-primary mb-3">{t("about.globalReach")}</h3>
            <p className="font-body-md text-on-surface-variant">{t("about.globalReachText")}</p>
          </div>
          {/* Value 2 */}
          <div className="bg-surface-container-low rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-md border border-outline-variant/30">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">favorite</span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-primary mb-3">{t("about.faithFirst")}</h3>
            <p className="font-body-md text-on-surface-variant">{t("about.faithFirstText")}</p>
          </div>
          {/* Value 3 */}
          <div className="bg-surface-container-low rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-md border border-outline-variant/30 lg:col-span-2 lg:row-span-2 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">diversity_3</span>
              </div>
              <h3 className="font-headline-md text-2xl font-bold text-primary mb-4">{t("about.community")}</h3>
              <p className="font-body-lg text-on-surface-variant mb-6">{t("about.communityText")}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary">check_circle</span> {t("about.mentorship")}
                </li>
                <li className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary">check_circle</span> {t("about.workshops")}
                </li>
                <li className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary">check_circle</span> {t("about.collaborative")}
                </li>
              </ul>
            </div>
            <Link to="/register" className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors group">
              {t("about.joinCommunity")}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          {/* Value 4 */}
          <div className="bg-primary text-on-primary rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-md lg:col-span-2">
            <div className="w-14 h-14 rounded-full bg-on-primary/20 text-on-primary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
            </div>
            <h3 className="font-headline-md text-xl font-bold mb-3">{t("about.stewardship")}</h3>
            <p className="font-body-md text-on-primary/80">{t("about.stewardshipText")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
