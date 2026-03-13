import { apiFetch } from "@/services/apiClient";
import type {
  NewsItem,
  Registration,
  ContactMessage,
  TeamMember,
  MediaItem
} from "@/services/dataService";

export const authApi = {
  status: () => apiFetch<{ hasAdmin: boolean }>("/api/admin/status"),
  setup: (payload: { email: string; password: string }) =>
    apiFetch<{ id: string; email: string }>("/api/admin/setup", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload: { email: string; password: string }) =>
    apiFetch<{ token: string; admin: { id: string; email: string } }>(
      "/api/admin/login",
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    ),
  me: () => apiFetch<{ id: string; email: string }>("/api/admin/me", { auth: true })
};

type NewsPayload = Omit<NewsItem, "id">;

export const newsApi = {
  getPublished: () => apiFetch<NewsItem[]>("/api/news"),
  getById: (id: string) => apiFetch<NewsItem>(`/api/news/${id}`),
  getAdminAll: () => apiFetch<NewsItem[]>("/api/news/admin/all", { auth: true }),
  create: (payload: NewsPayload) =>
    apiFetch<NewsItem>("/api/news/admin", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true
    }),
  update: (id: string, payload: Partial<NewsItem>) =>
    apiFetch<NewsItem>(`/api/news/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      auth: true
    }),
  remove: (id: string) =>
    apiFetch<void>(`/api/news/admin/${id}`, { method: "DELETE", auth: true })
};

export const registrationApi = {
  create: (payload: Omit<Registration, "id" | "status" | "submittedAt">) =>
    apiFetch<Registration>("/api/registrations", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getAdminAll: () =>
    apiFetch<Registration[]>("/api/registrations/admin", { auth: true }),
  updateStatus: (id: string, status: Registration["status"]) =>
    apiFetch<Registration>(`/api/registrations/admin/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      auth: true
    }),
  remove: (id: string) =>
    apiFetch<void>(`/api/registrations/admin/${id}`, {
      method: "DELETE",
      auth: true
    })
};

export const messageApi = {
  create: (payload: { name: string; email: string; message: string }) =>
    apiFetch<ContactMessage>("/api/messages", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getAdminAll: () => apiFetch<ContactMessage[]>("/api/messages/admin", { auth: true }),
  updateRead: (id: string, isRead: boolean) =>
    apiFetch<ContactMessage>(`/api/messages/admin/${id}/read`, {
      method: "PATCH",
      body: JSON.stringify({ isRead }),
      auth: true
    }),
  remove: (id: string) =>
    apiFetch<void>(`/api/messages/admin/${id}`, { method: "DELETE", auth: true })
};

export const teamApi = {
  getAll: () => apiFetch<TeamMember[]>("/api/team"),
  create: (payload: TeamMember) =>
    apiFetch<TeamMember>("/api/team/admin", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true
    })
};

export const mediaApi = {
  getAll: () => apiFetch<MediaItem[]>("/api/media"),
  getByType: (type: MediaItem["type"]) =>
    apiFetch<MediaItem[]>(`/api/media?type=${type}`)
};

export const uploadApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiFetch<{ url: string }>("/api/uploads", {
      method: "POST",
      body: formData,
      auth: true
    });
    return response.url;
  }
};
