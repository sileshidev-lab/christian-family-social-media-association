import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { newsService } from "@/services/dataService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const NewsPage = () => {
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";
  const items = newsService.getPublished();

  return (
    <section className="container section-compact">
      <div className="space-y-4">
        <div>
          <h1 className="section-title text-2xl md:text-3xl">{t("news.title")}</h1>
          <p className="text-muted-foreground">{t("news.subtitle")}</p>
        </div>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card/60 p-10 text-center shadow-soft">
            <p className="text-base font-semibold">{t("news.emptyTitle")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("news.emptyText")}</p>
            <Link to="/contact" className="mt-4 inline-flex text-sm font-medium text-primary">
              {t("news.emptyCta")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {items.map((item) => (
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
                  <h2 className="text-lg font-semibold">
                    {isAm ? item.titleAm : item.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isAm ? item.excerptAm : item.excerpt}
                  </p>
                  <Link
                    to={`/news/${item.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t("news.readMore")}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsPage;
