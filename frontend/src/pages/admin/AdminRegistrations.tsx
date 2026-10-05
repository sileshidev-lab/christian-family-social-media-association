import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { registrationApi } from "@/services/api";
import type { Registration } from "@/services/dataService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const AdminRegistrationsPage = () => {
  const [registrationFilter, setRegistrationFilter] = useState<
    "all" | Registration["status"]
  >("all");
  const [registrationQuery, setRegistrationQuery] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  const queryClient = useQueryClient();
  const { data: registrations = [], isLoading, isError } = useQuery({
    queryKey: ["admin", "registrations"],
    queryFn: registrationApi.getAdminAll
  });

  const filteredRegistrations = useMemo(() => {
    const query = registrationQuery.trim().toLowerCase();
    return [...registrations]
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .filter((reg) => (registrationFilter === "all" ? true : reg.status === registrationFilter))
      .filter((reg) => {
        if (!query) return true;
        const haystack = [
          reg.fullName,
          reg.email,
          reg.phone,
          reg.church,
          reg.tiktokUsername
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
  }, [registrations, registrationFilter, registrationQuery]);

  const formatDate = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString();
  };

  const formatAvailability = (value?: Registration["availability"]) => {
    switch (value) {
      case "available100":
        return "100% available";
      case "dependsCircumstances":
        return "Depends on circumstances";
      case "cannotCommit":
        return "Cannot commit fully";
      default:
        return "—";
    }
  };

  const handleRegistrationStatus = (id: string, status: Registration["status"]) => {
    statusMutation.mutate({ id, status });
  };

  const handleDeleteRegistration = (id: string) => {
    if (!window.confirm("Delete this registration?")) return;
    deleteMutation.mutate(id);
  };

  const exportApprovedCsv = () => {
    const approved = registrations.filter((reg) => reg.status === "approved");
    if (!approved.length) {
      window.alert("No approved members to export yet.");
      return;
    }

    const headers = [
      "Full Name",
      "Email",
      "Phone",
      "Church",
      "Country",
      "TikTok Username",
      "Content Type",
      "Submitted At",
      "Reviewed At"
    ];

    const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;

    const rows = approved.map((reg) =>
      [
        reg.fullName,
        reg.email,
        reg.phone,
        reg.church,
        reg.country,
        reg.tiktokUsername,
        reg.contentType.join("; "),
        reg.submittedAt,
        reg.reviewedAt ?? ""
      ]
        .map((value) => escapeCsv(String(value ?? "")))
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cfsmcca-members.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Registration["status"] }) =>
      registrationApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "registrations"] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => registrationApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "registrations"] })
  });

  return (
    <div className="space-y-6" id="registrations">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="section-title text-3xl">Registrations</h1>
          <p className="text-sm text-muted-foreground">Review and approve new members.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "all", label: "All" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" }
            ] as const
          ).map((status) => (
            <Button
              key={status.value}
              size="sm"
              variant={registrationFilter === status.value ? "default" : "outline"}
              onClick={() => setRegistrationFilter(status.value)}
            >
              {status.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Input
          value={registrationQuery}
          onChange={(event) => setRegistrationQuery(event.target.value)}
          placeholder="Search name, email, phone, church..."
          className="w-full md:max-w-md"
        />
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>
            Showing {filteredRegistrations.length} of {registrations.length}
          </span>
          <Button size="sm" variant="outline" onClick={exportApprovedCsv}>
            Export approved CSV
          </Button>
        </div>
      </div>

      {isError ? (
        <div className="w-full rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          Failed to load registrations.
        </div>
      ) : isLoading ? (
        <div className="w-full rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          Loading registrations...
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="w-full rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          No registrations found yet.{" "}
          <Link to="/register" className="text-primary underline-offset-2 hover:underline">
            Open the registration form.
          </Link>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg border border-border bg-card/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell>{reg.fullName}</TableCell>
                  <TableCell>{reg.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        reg.status === "approved"
                          ? "success"
                          : reg.status === "rejected"
                          ? "destructive"
                          : "warning"
                      }
                    >
                      {reg.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(reg.submittedAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRegistration(reg)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={reg.status === "approved"}
                        onClick={() => handleRegistrationStatus(reg.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={reg.status === "rejected"}
                        onClick={() => handleRegistrationStatus(reg.id, "rejected")}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteRegistration(reg.id)}
                      >
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
        open={Boolean(selectedRegistration)}
        onOpenChange={(open) => {
          if (!open) setSelectedRegistration(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>
              Submitted {formatDate(selectedRegistration?.submittedAt)}
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="grid gap-4 text-sm md:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Full name</p>
                <p className="font-medium">{selectedRegistration.fullName}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Email</p>
                <p className="font-medium">{selectedRegistration.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Phone</p>
                <p className="font-medium">{selectedRegistration.phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Church</p>
                <p className="font-medium">{selectedRegistration.church}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Country</p>
                <p className="font-medium">{selectedRegistration.country}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">TikTok username</p>
                <p className="font-medium">{selectedRegistration.tiktokUsername}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs uppercase text-muted-foreground">Content type</p>
                <p className="font-medium">{selectedRegistration.contentType.join(", ")}</p>
              </div>
              {selectedRegistration.otherPlatforms.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-xs uppercase text-muted-foreground">Other platforms</p>
                  <p className="font-medium">
                    {selectedRegistration.otherPlatforms.join(", ")}
                  </p>
                </div>
              )}
              <div className="md:col-span-2">
                <p className="text-xs uppercase text-muted-foreground">Contribution</p>
                <p className="font-medium">{selectedRegistration.contribution}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs uppercase text-muted-foreground">Availability</p>
                <p className="font-medium">{formatAvailability(selectedRegistration.availability)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Status</p>
                <p className="font-medium">{selectedRegistration.status}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Reviewed</p>
                <p className="font-medium">{formatDate(selectedRegistration.reviewedAt)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Covenant</p>
                <p className="font-medium">
                  {selectedRegistration.agreeToCovenant ? "Agreed" : "Not agreed"}
                </p>
              </div>
              {selectedRegistration.ethicsStatement && (
                <div className="md:col-span-2">
                  <p className="text-xs uppercase text-muted-foreground">Ethics statement</p>
                  <p className="font-medium">{selectedRegistration.ethicsStatement}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRegistrationsPage;
