import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { mediaApi } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GalleryGrid = ({ type }: { type: "all" | "photo" | "video" }) => {
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["media", type],
    queryFn: () => (type === "all" ? mediaApi.getAll() : mediaApi.getByType(type))
  });

  if (isError) {
    return (
      <div className="rounded-2xl border border-border bg-card/60 p-10 text-center shadow-soft">
        <p className="text-base font-semibold">{t("common.error")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card/60 p-10 text-center shadow-soft">
        <p className="text-base font-semibold">{t("common.loading")}</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-border bg-card/60 p-10 text-center shadow-soft">
        <p className="text-base font-semibold">{t("gallery.emptyTitle")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("gallery.emptyText")}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/contact">{t("gallery.emptyCta")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden card-elevated">
          <div className="h-48 w-full bg-muted">
            {item.type === "video" ? (
              <video
                src={item.url}
                poster={item.thumbnail || "/placeholder.svg"}
                className="h-full w-full object-cover"
                controls
                muted
                preload="metadata"
              />
            ) : (
              <img
                src={item.url}
                alt={item.title}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  event.currentTarget.src = "/placeholder.svg";
                  event.currentTarget.onerror = null;
                }}
              />
            )}
          </div>
          <div className="p-4">
            <p className="text-sm font-semibold">
              {isAm ? item.titleAm : item.title}
            </p>
            <p className="text-xs text-muted-foreground">{item.type.toUpperCase()}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

const GalleryPage = () => {
  const { t } = useTranslation();

  return (
    <section className="container section-compact">
      <div className="space-y-4">
        <div>
          <h1 className="section-title text-2xl md:text-3xl">{t("gallery.title")}</h1>
          <p className="text-muted-foreground">{t("gallery.subtitle")}</p>
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">{t("common.all")}</TabsTrigger>
            <TabsTrigger value="photo">{t("gallery.photos")}</TabsTrigger>
            <TabsTrigger value="video">{t("gallery.videos")}</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <GalleryGrid type="all" />
          </TabsContent>
          <TabsContent value="photo">
            <GalleryGrid type="photo" />
          </TabsContent>
          <TabsContent value="video">
            <GalleryGrid type="video" />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default GalleryPage;
