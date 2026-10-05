import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newsApi, uploadApi } from "@/services/api";
import type { NewsItem } from "@/services/dataService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const AdminNewsPage = () => {
  const [newsQuery, setNewsQuery] = useState("");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    status: "published" as NewsItem["status"]
  });
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const queryClient = useQueryClient();
  const { data: newsItems = [], isLoading, isError } = useQuery({
    queryKey: ["admin", "news"],
    queryFn: newsApi.getAdminAll
  });

  const filteredNews = useMemo(() => {
    const query = newsQuery.trim().toLowerCase();
    return [...newsItems]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((item) => {
        if (!query) return true;
        const haystack = [item.title, item.titleAm, item.category, item.excerpt]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
  }, [newsItems, newsQuery]);

  const formatDate = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString();
  };

  const createMutation = useMutation({
    mutationFn: (payload: Omit<NewsItem, "id">) => newsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "news"] });
      setFormError(null);
      setNewsForm({
        title: "",
        category: "",
        excerpt: "",
        content: "",
        status: "published"
      });
      setImageUrl("");
      setImageFileUrl(null);
      setNewsDialogOpen(false);
    },
    onError: (err) => {
      setFormError(err instanceof Error ? err.message : "Failed to save article.");
    }
  });
  const isSaving = createMutation.isPending;

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<NewsItem> }) =>
      newsApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "news"] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => newsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "news"] })
  });

  const toggleNewsStatus = (item: NewsItem) => {
    updateMutation.mutate({
      id: item.id,
      payload: { status: item.status === "published" ? "draft" : "published" }
    });
  };

  const deleteNews = (id: string) => {
    if (!window.confirm("Delete this news article?")) return;
    deleteMutation.mutate(id);
  };

  const submitNews = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsForm.title.trim() || !newsForm.category.trim() || !newsForm.content.trim()) {
      window.alert("Please add a title, category, and content.");
      return;
    }

    const imageValue = imageFileUrl?.trim() || imageUrl.trim() || "/placeholder.svg";

    setFormError(null);
    createMutation.mutate({
      title: newsForm.title.trim(),
      titleAm: newsForm.title.trim(),
      excerpt: newsForm.excerpt.trim() || newsForm.content.slice(0, 120) + "...",
      excerptAm: newsForm.excerpt.trim() || newsForm.content.slice(0, 120) + "...",
      content: newsForm.content.trim(),
      contentAm: newsForm.content.trim(),
      date: new Date().toISOString(),
      image: imageValue,
      category: newsForm.category.trim(),
      status: newsForm.status
    });
  };

  const handleImageFile = async (file?: File) => {
    if (!file) return;
    const maxSizeMb = 2;
    if (file.size > maxSizeMb * 1024 * 1024) {
      window.alert(`Please use an image smaller than ${maxSizeMb}MB.`);
      return;
    }
    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadApi.uploadImage(file);
      setImageFileUrl(uploadedUrl);
      setImageUrl("");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6" id="news">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="section-title text-3xl">News Articles</h1>
          <p className="text-sm text-muted-foreground">Manage published updates.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setNewsDialogOpen(true)}>
          Add article
        </Button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Input
          value={newsQuery}
          onChange={(event) => setNewsQuery(event.target.value)}
          placeholder="Search title or category..."
          className="w-full md:max-w-md"
        />
        <p className="text-xs text-muted-foreground">
          Showing {filteredNews.length} of {newsItems.length}
        </p>
      </div>

      {isError ? (
        <div className="w-full rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          Failed to load news.
        </div>
      ) : isLoading ? (
        <div className="w-full rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          Loading news...
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="w-full rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          No news articles yet.
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg border border-border bg-card/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="h-12 w-12 overflow-hidden rounded-md border border-border bg-muted">
                      <img
                        src={item.image || "/placeholder.svg"}
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
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "published" ? "success" : "outline"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedNews(item)}>
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toggleNewsStatus(item)}>
                        {item.status === "published" ? "Unpublish" : "Publish"}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteNews(item.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={Boolean(selectedNews)}
        onOpenChange={(open) => {
          if (!open) setSelectedNews(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedNews?.title}</DialogTitle>
            <DialogDescription>{selectedNews?.category}</DialogDescription>
          </DialogHeader>
          {selectedNews && (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-4 text-xs uppercase text-muted-foreground">
                <span>Status: {selectedNews.status}</span>
                <span>Date: {formatDate(selectedNews.date)}</span>
              </div>
              <div className="h-48 w-full overflow-hidden rounded-lg border border-border bg-muted">
                <img
                  src={selectedNews.image || "/placeholder.svg"}
                  alt={selectedNews.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.src = "/placeholder.svg";
                    event.currentTarget.onerror = null;
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{selectedNews.excerpt}</p>
              <div className="rounded-md border border-border bg-muted/40 p-4 leading-6 text-foreground">
                {selectedNews.content}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={newsDialogOpen} onOpenChange={setNewsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add news article</DialogTitle>
            <DialogDescription>Create a new update for the public news page.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitNews}>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <div className="space-y-2">
              <Label htmlFor="news-title">Title</Label>
              <Input
                id="news-title"
                value={newsForm.title}
                onChange={(event) =>
                  setNewsForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Digital evangelism training launched"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="news-category">Category</Label>
                <Input
                  id="news-category"
                  value={newsForm.category}
                  onChange={(event) =>
                    setNewsForm((prev) => ({ ...prev, category: event.target.value }))
                  }
                  placeholder="Training"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={newsForm.status === "published" ? "default" : "outline"}
                    onClick={() =>
                      setNewsForm((prev) => ({ ...prev, status: "published" }))
                    }
                  >
                    Published
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={newsForm.status === "draft" ? "default" : "outline"}
                    onClick={() => setNewsForm((prev) => ({ ...prev, status: "draft" }))}
                  >
                    Draft
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="news-excerpt">Excerpt</Label>
              <Textarea
                id="news-excerpt"
                value={newsForm.excerpt}
                onChange={(event) =>
                  setNewsForm((prev) => ({ ...prev, excerpt: event.target.value }))
                }
                placeholder="Short summary for the news card..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="news-content">Content</Label>
              <Textarea
                id="news-content"
                value={newsForm.content}
                onChange={(event) =>
                  setNewsForm((prev) => ({ ...prev, content: event.target.value }))
                }
                placeholder="Full article content..."
                className="min-h-[140px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="news-image">Image (URL or upload)</Label>
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  id="news-image"
                  value={imageUrl}
                  onChange={(event) => {
                    setImageUrl(event.target.value);
                    setImageFileUrl(null);
                  }}
                  placeholder="https://example.com/image.jpg"
                />
                <Input
                  id="news-image-file"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImageFile(event.target.files?.[0])}
                  disabled={uploadingImage}
                />
              </div>
              {uploadingImage && (
                <p className="text-xs text-muted-foreground">Uploading image...</p>
              )}
              {(imageFileUrl || imageUrl.trim()) && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={imageFileUrl || imageUrl}
                    alt="Preview"
                    className="h-16 w-16 rounded-lg object-cover"
                    onError={(event) => {
                      event.currentTarget.src = "/placeholder.svg";
                      event.currentTarget.onerror = null;
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImageUrl("");
                      setImageFileUrl(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setNewsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploadingImage || isSaving}>
                {uploadingImage ? "Uploading..." : isSaving ? "Saving..." : "Save article"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNewsPage;
