import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { contactService, type ContactMessage } from "@/services/dataService";
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

const AdminMessagesPage = () => {
  const [refresh, setRefresh] = useState(0);
  const [messageQuery, setMessageQuery] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const messages = useMemo(() => contactService.getAll(), [refresh]);

  const filteredMessages = useMemo(() => {
    const query = messageQuery.trim().toLowerCase();
    return [...messages]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .filter((msg) => (showUnreadOnly ? !msg.isRead : true))
      .filter((msg) => {
        if (!query) return true;
        const haystack = [msg.name, msg.email, msg.message]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
  }, [messages, messageQuery, showUnreadOnly]);

  const formatDate = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this message?")) return;
    contactService.delete(id);
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="space-y-6" id="messages">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="section-title text-3xl">Messages</h1>
          <p className="text-sm text-muted-foreground">Respond and track communication.</p>
        </div>
        <Button
          size="sm"
          variant={showUnreadOnly ? "default" : "outline"}
          onClick={() => setShowUnreadOnly((prev) => !prev)}
        >
          {showUnreadOnly ? "Showing unread" : "Show unread only"}
        </Button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Input
          value={messageQuery}
          onChange={(event) => setMessageQuery(event.target.value)}
          placeholder="Search name, email, message..."
          className="w-full md:max-w-md"
        />
        <p className="text-xs text-muted-foreground">
          Showing {filteredMessages.length} of {messages.length}
        </p>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="w-full rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          No messages yet.{" "}
          <Link to="/contact" className="text-primary underline-offset-2 hover:underline">
            Open the contact page.
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
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell>{msg.name}</TableCell>
                  <TableCell>{msg.email}</TableCell>
                  <TableCell>
                    <Badge variant={msg.isRead ? "outline" : "warning"}>
                      {msg.isRead ? "Read" : "Unread"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(msg.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedMessage(msg)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (msg.isRead) {
                            contactService.markAsUnread(msg.id);
                          } else {
                            contactService.markAsRead(msg.id);
                          }
                          setRefresh((prev) => prev + 1);
                        }}
                      >
                        {msg.isRead ? "Mark Unread" : "Mark Read"}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(msg.id)}>
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
        open={Boolean(selectedMessage)}
        onOpenChange={(open) => {
          if (!open) setSelectedMessage(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
            <DialogDescription>{selectedMessage?.email}</DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4 text-sm">
              <p className="text-xs uppercase text-muted-foreground">Received</p>
              <p className="font-medium">{formatDate(selectedMessage.createdAt)}</p>
              <div className="rounded-md border border-border bg-muted/40 p-4 leading-6 text-foreground">
                {selectedMessage.message}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessagesPage;
