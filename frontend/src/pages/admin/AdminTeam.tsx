import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, GripVertical } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { teamApi, uploadApi } from "@/services/api";
import { TeamMember } from "@/services/dataService";

const AdminTeamPage = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<TeamMember> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchMembers = async () => {
    try {
      const data = await teamApi.getAll();
      setMembers(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setCurrentMember(member);
    } else {
      setCurrentMember({
        name: "",
        nameAm: "",
        role: "",
        roleAm: "",
        image: "",
        order: members.length + 1
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentMember(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await uploadApi.uploadImage(file);
      setCurrentMember(prev => ({ ...prev, image: url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!currentMember?.name || !currentMember?.role || !currentMember?.image) {
      toast.error("Please fill in all required fields (Name, Role, Image)");
      return;
    }

    try {
      setIsSaving(true);
      if (currentMember.id) {
        await teamApi.update(currentMember.id, currentMember);
        toast.success("Team member updated");
      } else {
        await teamApi.create(currentMember as Omit<TeamMember, "id">);
        toast.success("Team member created");
      }
      fetchMembers();
      handleCloseDialog();
    } catch (error) {
      toast.error("Failed to save team member");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      await teamApi.remove(id);
      toast.success("Team member deleted");
      fetchMembers();
    } catch (error) {
      toast.error("Failed to delete team member");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-1">Manage leadership and team members.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No team members found.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={member.image} alt={member.name} className="h-10 w-10 rounded-full object-cover bg-muted" />
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.nameAm}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{member.role}</div>
                      <div className="text-xs text-muted-foreground">{member.roleAm}</div>
                    </div>
                  </TableCell>
                  <TableCell>{member.order}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(member)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(member.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentMember?.id ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name (English) *</Label>
                <Input
                  id="name"
                  value={currentMember?.name || ""}
                  onChange={(e) => setCurrentMember(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nameAm">Name (Amharic)</Label>
                <Input
                  id="nameAm"
                  value={currentMember?.nameAm || ""}
                  onChange={(e) => setCurrentMember(prev => ({ ...prev, nameAm: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role (English) *</Label>
                <Input
                  id="role"
                  value={currentMember?.role || ""}
                  onChange={(e) => setCurrentMember(prev => ({ ...prev, role: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="roleAm">Role (Amharic)</Label>
                <Input
                  id="roleAm"
                  value={currentMember?.roleAm || ""}
                  onChange={(e) => setCurrentMember(prev => ({ ...prev, roleAm: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Image *</Label>
              <div className="flex items-center gap-4">
                {currentMember?.image && (
                  <img src={currentMember.image} alt="Preview" className="h-16 w-16 rounded-full object-cover bg-muted" />
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={currentMember?.order || 0}
                onChange={(e) => setCurrentMember(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving || uploadingImage}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTeamPage;
