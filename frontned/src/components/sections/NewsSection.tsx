import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { newsApi } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const NewsSection = () => {
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["news", "published"],
    queryFn: newsApi.getPublished
  });
  const visibleItems = items.slice(0, 3);

  return (
    <section className="container section-padding">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title text-3xl md:text-4xl">{t("news.title")}</h2>
          <p className="text-muted-foreground">{t("news.subtitle")}</p>
        </div>
        <Button asChild variant="ghost" className="hidden md:inline-flex">
          <Link to="/news">{t("news.viewAll")}</Link>
        </Button>
      </div>
      {isError ? (
        <div className="mt-8 rounded-2xl border border-border bg-card/60 p-10 text-center shadow-soft">
          <p className="text-base font-semibold">{t("common.error")}</p>
        </div>
      ) : isLoading ? (
        <div className="mt-8 rounded-2xl border border-border bg-card/60 p-10 text-center shadow-soft">
          <p className="text-base font-semibold">{t("common.loading")}</p>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-card/60 p-10 text-center shadow-soft">
          <p className="text-base font-semibold">{t("news.emptyTitle")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("news.emptyText")}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/contact">{t("news.emptyCta")}</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {visibleItems.map((item) => (
              <Card key={item.id} className="card-elevated overflow-hidden">
                <div className="h-44 w-full bg-muted">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.src = "/placeholder.svg";
                      event.currentTarget.onerror = null;
                    }}
                  />
                </div>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{item.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">
                    {isAm ? item.titleAm : item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isAm ? item.excerptAm : item.excerpt}
                  </p>
                  <Button asChild variant="link" className="px-0">
                    <Link to={`/news/${item.id}`}>{t("news.readMore")}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex justify-center md:hidden">
            <Button asChild variant="outline">
              <Link to="/news">{t("news.viewAll")}</Link>
            </Button>
          </div>
        </>
      )}
    </section>
  );
};

export default NewsSection;
