import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { newsApi } from "@/services/api";
import { fallbackNews } from "@/services/dataService";
import { format } from "date-fns";
import { Newspaper } from "lucide-react";

const NewsSection = () => {
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["news", "published"],
    queryFn: newsApi.getPublished,
    retry: false
  });
  const visibleItems = (items.length ? items : fallbackNews).slice(0, 3);

  return (
    <section className="py-24 bg-surface-bright dark:bg-surface-dim">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-primary mb-4">{t("news.title")}</h2>
            <p className="font-body-md text-on-surface-variant max-w-2xl">{t("news.subtitle")}</p>
          </div>
          <Link to="/news" className="hidden md:inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors group whitespace-nowrap">
            {t("news.viewAll")} <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        {isLoading && items.length === 0 && !isError ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col opacity-60">
                <div className="h-56 bg-surface-container-highest animate-pulse" />
                <div className="p-6 flex flex-col flex-grow gap-4">
                  <div className="h-4 w-24 bg-surface-container-high rounded animate-pulse" />
                  <div className="h-6 w-full bg-surface-container-high rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-surface-container-high rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-outline-variant bg-surface-container-lowest p-10 flex flex-col items-center justify-center text-center shadow-sm min-h-[30vh]">
            <Newspaper className="h-12 w-12 text-on-surface-variant/30 mb-4" />
            <p className="font-headline-md text-lg font-bold text-primary mb-2">{t("news.emptyTitle")}</p>
            <p className="font-body-md text-on-surface-variant max-w-sm mb-6">{t("news.emptyText")}</p>
            <Link to="/contact" className="bg-surface-container-high text-primary px-6 py-2 rounded-lg font-bold hover:bg-surface-container-highest transition-colors">
              {t("news.emptyCta")}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {visibleItems.map((item) => (
                <article key={item.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-outline-variant/30 flex flex-col group">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        event.currentTarget.src = "/placeholder.svg";
                        event.currentTarget.onerror = null;
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-3">
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      <span>{format(new Date(item.date), "MMM d, yyyy")}</span>
                    </div>
                    <h3 className="font-headline-md text-xl font-bold text-primary mb-3 line-clamp-2">
                      {isAm ? item.titleAm : item.title}
                    </h3>
                    <p className="font-body-md text-on-surface-variant mb-6 flex-grow line-clamp-3">
                      {isAm ? item.excerptAm : item.excerpt}
                    </p>
                    <Link to={`/news/${item.id}`} className="inline-flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors mt-auto">
                      {t("news.readMore")} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10 text-center md:hidden">
              <Link to="/news" className="inline-flex items-center justify-center gap-2 text-primary border border-outline-variant px-6 py-3 rounded-lg font-bold w-full">
                {t("news.viewAll")}
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
