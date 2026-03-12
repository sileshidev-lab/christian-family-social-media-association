import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { newsService } from "@/services/dataService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const NewsDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";
  const item = id ? newsService.getById(id) : null;

  if (!item) {
    return (
      <section className="container section-padding">
        <p className="text-muted-foreground">{t("common.error")}</p>
        <Button asChild variant="link" className="px-0">
          <Link to="/news">{t("common.back")}</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="container section-padding">
      <div className="max-w-3xl space-y-6">
        <div className="space-y-3">
          <Badge variant="outline">{item.category}</Badge>
          <h1 className="section-title text-3xl md:text-4xl">
            {isAm ? item.titleAm : item.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {format(new Date(item.date), "MMM d, yyyy")}
          </p>
        </div>
        <div className="h-64 w-full overflow-hidden rounded-2xl bg-muted">
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
        <p className="text-base leading-7 text-foreground/90">
          {isAm ? item.contentAm : item.content}
        </p>
        <Button asChild variant="link" className="px-0">
          <Link to="/news">{t("common.back")}</Link>
        </Button>
      </div>
    </section>
  );
};

export default NewsDetailPage;
