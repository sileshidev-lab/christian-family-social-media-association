import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { mediaApi, uploadApi } from "@/services/api";
import { MediaItem } from "@/services/dataService";

const AdminMediaPage = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<MediaItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "photo" | "video">("all");

  const fetchMedia = async () => {
    try {
      const data = await mediaApi.getAll();
      setMedia(data);
    } catch (error) {
      toast.error("Failed to load media items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleOpenDialog = (item?: MediaItem) => {
    if (item) {
      setCurrentItem(item);
    } else {
      setCurrentItem({
        title: "",
        titleAm: "",
        type: "photo",
        url: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentItem(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMedia(true);
      const url = await uploadApi.uploadImage(file);
      setCurrentItem(prev => ({ ...prev, url }));
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSave = async () => {
    if (!currentItem?.title || !currentItem?.url || !currentItem?.type) {
      toast.error("Please fill in all required fields (Title, Type, Media URL)");
      return;
    }

    try {
      setIsSaving(true);
      if (currentItem.id) {
        await mediaApi.update(currentItem.id, currentItem);
        toast.success("Media item updated");
      } else {
        await mediaApi.create(currentItem as Omit<MediaItem, "id" | "date">);
        toast.success("Media item created");
      }
      fetchMedia();
      handleCloseDialog();
    } catch (error) {
      toast.error("Failed to save media item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    try {
      await mediaApi.remove(id);
      toast.success("Media item deleted");
      fetchMedia();
    } catch (error) {
      toast.error("Failed to delete media item");
    }
  };

  const filteredMedia = filterType === "all" ? media : media.filter(m => m.type === filterType);

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery & Media</h1>
          <p className="text-muted-foreground mt-1">Manage photos and videos for the gallery.</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filterType}
            onChange={(e: any) => setFilterType(e.target.value)}
            className="flex h-10 w-[150px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Media</option>
            <option value="photo">Photos</option>
            <option value="video">Videos</option>
          </select>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add Media
          </Button>
        </div>
      </div>

      {filteredMedia.length === 0 ? (
        <div className="rounded-md border border-dashed p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No media found</h3>
          <p className="text-sm text-muted-foreground mb-4">You haven't added any media items yet.</p>
          <Button onClick={() => handleOpenDialog()} variant="outline">
            Upload your first item
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMedia.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md">
              <div className="aspect-video relative bg-muted overflow-hidden">
                {item.type === "photo" ? (
                  <img src={item.url} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted-foreground/10">
                    <Video className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute top-2 left-2 rounded-md bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur">
                  {item.type === "photo" ? "Photo" : "Video"}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                {item.titleAm && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.titleAm}</p>}
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)}>
                    <Pencil className="mr-2 h-3 w-3" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="mr-2 h-3 w-3" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentItem?.id ? "Edit Media" : "Add Media"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Media Type *</Label>
              <select
                value={currentItem?.type}
                onChange={(e: any) => setCurrentItem(prev => ({ ...prev, type: e.target.value }))}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title (English) *</Label>
              <Input
                id="title"
                value={currentItem?.title || ""}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="titleAm">Title (Amharic)</Label>
              <Input
                id="titleAm"
                value={currentItem?.titleAm || ""}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, titleAm: e.target.value }))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Media File / URL *</Label>
              {currentItem?.type === "photo" ? (
                <div className="space-y-3">
                  {currentItem?.url && (
                    <img src={currentItem.url} alt="Preview" className="h-32 rounded-md object-cover border" />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingMedia}
                  />
                  <p className="text-xs text-muted-foreground text-center">OR</p>
                  <Input
                    placeholder="Enter external image URL"
                    value={currentItem?.url || ""}
                    onChange={(e) => setCurrentItem(prev => ({ ...prev, url: e.target.value }))}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    placeholder="Enter YouTube or Vimeo URL"
                    value={currentItem?.url || ""}
                    onChange={(e) => setCurrentItem(prev => ({ ...prev, url: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">For videos, please provide an external embed URL.</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving || uploadingMedia}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMediaPage;
