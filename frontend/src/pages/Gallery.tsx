import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { mediaApi } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, ImageOff } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";

const GalleryGrid = ({ type }: { type: "all" | "photo" | "video" }) => {
  const { t, i18n } = useTranslation();
  const isAm = i18n.language === "am";
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden card-elevated border-none">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-border bg-card/60 p-10 flex flex-col items-center justify-center text-center shadow-soft min-h-[30vh]">
        <ImageOff className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-lg font-semibold">{t("gallery.emptyTitle")}</p>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">{t("gallery.emptyText")}</p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/contact">{t("gallery.emptyCta")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card 
            key={item.id} 
            className="group overflow-hidden card-elevated cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-primary/50"
            onClick={() => setSelectedMedia(item)}
          >
            <div className="aspect-video w-full bg-muted relative overflow-hidden">
              {item.type === "video" ? (
                <>
                  <video
                    src={item.url}
                    poster={item.thumbnail || "/placeholder.svg"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 group-hover:bg-black/40">
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                      <Play className="h-5 w-5 text-white ml-1" />
                    </div>
                  </div>
                </>
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.src = "/placeholder.svg";
                    event.currentTarget.onerror = null;
                  }}
                />
              )}
            </div>
            <div className="p-4 bg-card">
              <p className="text-sm font-semibold truncate transition-colors duration-300 group-hover:text-primary">
                {isAm ? item.titleAm : item.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{item.type.toUpperCase()}</p>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl w-[90vw] p-0 overflow-hidden bg-black/95 border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Media Viewer</DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="relative w-full aspect-video flex items-center justify-center">
              {selectedMedia.type === "video" ? (
                <video
                  src={selectedMedia.url}
                  className="max-h-[85vh] w-full object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="max-h-[85vh] w-full object-contain"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
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
