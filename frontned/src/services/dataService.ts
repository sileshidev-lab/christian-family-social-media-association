import { formatISO } from "date-fns";

export interface NewsItem {
  id: string;
  title: string;
  titleAm: string;
  excerpt: string;
  excerptAm: string;
  content: string;
  contentAm: string;
  date: string;
  image: string;
  category: string;
  status: "published" | "draft";
}

export interface TeamMember {
  id: string;
  name: string;
  nameAm: string;
  role: string;
  roleAm: string;
  image: string;
  order: number;
}

export interface MediaItem {
  id: string;
  type: "photo" | "video";
  title: string;
  titleAm: string;
  url: string;
  thumbnail?: string;
  date: string;
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  church: string;
  country: string;
  tiktokUsername: string;
  contentType: string[];
  otherPlatforms: string[];
  contribution: string;
  availability: "available100" | "dependsCircumstances" | "cannotCommit";
  ethicsStatement?: string;
  agreeToCovenant: boolean;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface SiteStats {
  totalMembers: number;
  pendingRegistrations: number;
  newsArticles: number;
  totalViews: number;
}

const STORAGE_KEYS = {
  news: "cfsmcca_news",
  team: "cfsmcca_team",
  media: "cfsmcca_media",
  registrations: "cfsmcca_registrations",
  messages: "cfsmcca_messages",
  stats: "cfsmcca_stats",
  seeded: "cfsmcca_seeded"
};

const hasStorage = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const getStored = <T>(key: string, fallback: T): T => {
  if (!hasStorage) return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const setStored = <T>(key: string, value: T) => {
  if (!hasStorage) return;
  localStorage.setItem(key, JSON.stringify(value));
};

const imagePath = (filename: string) => encodeURI(`/photos/${filename}`);

const defaultTeam: TeamMember[] = [
  {
    id: "team-ruhama-beruk",
    name: "Ruhama Beruk",
    nameAm: "ሩሀማ ብሩክ",
    role: "Leadership Committee",
    roleAm: "የ ህብረቱ መሪ ኮሚቴ",
    image: imagePath("ሩሀማ ብሩክ የ ህብረቱ መሪ ኮሚቴ.JPG"),
    order: 1
  },
  {
    id: "team-simeon-petros",
    name: "Simeon Petros",
    nameAm: "ስምኦን ዼጥሮስ",
    role: "Vice Chairperson",
    roleAm: "የ ህብረቱ ምክትል ሰብሳቢ",
    image: imagePath("ስምኦን ዼጥሮስ የ ህብረቱ ምክትል ሰብሳቢ.JPG"),
    order: 2
  },
  {
    id: "team-biniyam-lemesa",
    name: "Biniyam Lemesa",
    nameAm: "ቢኒያም ለሜሳ",
    role: "Main Leader",
    roleAm: "የ ህብረቱ ዋና መሪ",
    image: imagePath("ቢኒያም ለሜሳ የ ህብረቱ ዋና መሪ.JPG"),
    order: 3
  },
  {
    id: "team-abel-demelash",
    name: "Abel Demelash",
    nameAm: "አቤል ደመላሽ",
    role: "Leadership Committee",
    roleAm: "የ ህብረቱ መሪ ኮሚቴ",
    image: imagePath("አቤል ደመላሽ የ ህብረቱ መሪ ኮሚቴ.JPG"),
    order: 4
  },
  {
    id: "team-wintana-nuredin",
    name: "Wintana Nuredin",
    nameAm: "ዊንታና ኑረዲን",
    role: "Leadership Committee",
    roleAm: "የ ህብረቱ መሪ ኮሚቴ",
    image: imagePath("ዊንታና ኑረዲን የ ህብረቱ መሪ ኮሚቴ.JPG"),
    order: 5
  },
  {
    id: "team-dawit-birhanu",
    name: "Dawit Birhanu",
    nameAm: "ዳዊት ብርሀኑ",
    role: "Leadership Committee",
    roleAm: "የ ህብረቱ መሪ ኮሚቴ",
    image: imagePath("ዳዊት ብርሀኑ የ ህብረቱ መሪ ኮሚቴ.JPG"),
    order: 6
  },
  {
    id: "team-jara-yerusalem",
    name: "Jara Tesfaye & Yerusalem Workneh",
    nameAm: "ጃራ ተስፋዬ እና እየሩሳሌም ወርቅነህ",
    role: "Leadership Committee",
    roleAm: "የህብረቱ መሪ ኮሚቴ",
    image: imagePath("ጃራ ተስፋዬ እና እየሩሳሌም ወርቅነህ የህብረቱ መሪ ኮሚቴ.JPG"),
    order: 7
  }
];

const clearSeededData = () => {
  if (!hasStorage) return;
  if (!localStorage.getItem(STORAGE_KEYS.seeded)) return;

  const seededNewsTitles = new Set([
    "Digital evangelism training launched",
    "Family prayer campaign",
    "New member covenant orientation"
  ]);
  const seededTeamNames = new Set([
    "Ruhama Beruk",
    "Simon Petros",
    "Biniyam Lemesa",
    "Abel Demelash",
    "Wintana Nuredin",
    "Yonatan Derbe",
    "Dawit Birhanu",
    "Jara Tesfaye & Yerusalem"
  ]);

  const news = getStored<NewsItem[]>(STORAGE_KEYS.news, []);
  const team = getStored<TeamMember[]>(STORAGE_KEYS.team, []);
  const media = getStored<MediaItem[]>(STORAGE_KEYS.media, []);

  const hasSeededNews = news.some((item) => seededNewsTitles.has(item.title));
  const hasSeededTeam = team.some((item) => seededTeamNames.has(item.name));
  const hasSeededMedia = media.some((item) => item.url === "/placeholder.svg");

  if (hasSeededNews || hasSeededTeam || hasSeededMedia) {
    setStored(STORAGE_KEYS.news, [] as NewsItem[]);
    setStored(STORAGE_KEYS.team, [] as TeamMember[]);
    setStored(STORAGE_KEYS.media, [] as MediaItem[]);
    setStored(STORAGE_KEYS.stats, {
      totalMembers: 0,
      pendingRegistrations: 0,
      newsArticles: 0,
      totalViews: 0
    } as SiteStats);
  }

  localStorage.removeItem(STORAGE_KEYS.seeded);
};

clearSeededData();

export const newsService = {
  getAll: () => getStored<NewsItem[]>(STORAGE_KEYS.news, []),
  getPublished: () =>
    getStored<NewsItem[]>(STORAGE_KEYS.news, []).filter((item) => item.status === "published"),
  getById: (id: string) => getStored<NewsItem[]>(STORAGE_KEYS.news, []).find((item) => item.id === id),
  create: (news: NewsItem) => {
    const items = getStored<NewsItem[]>(STORAGE_KEYS.news, []);
    items.unshift(news);
    setStored(STORAGE_KEYS.news, items);
  },
  update: (id: string, updates: Partial<NewsItem>) => {
    const items = getStored<NewsItem[]>(STORAGE_KEYS.news, []).map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setStored(STORAGE_KEYS.news, items);
  },
  delete: (id: string) => {
    const items = getStored<NewsItem[]>(STORAGE_KEYS.news, []).filter((item) => item.id !== id);
    setStored(STORAGE_KEYS.news, items);
  }
};

export const teamService = {
  getAll: () => {
    const stored = getStored<TeamMember[]>(STORAGE_KEYS.team, []);
    const source = stored.length ? stored : defaultTeam;
    return [...source].sort((a, b) => a.order - b.order);
  },
  getById: (id: string) => {
    const stored = getStored<TeamMember[]>(STORAGE_KEYS.team, []);
    const source = stored.length ? stored : defaultTeam;
    return source.find((item) => item.id === id);
  },
  create: (member: TeamMember) => {
    const items = getStored<TeamMember[]>(STORAGE_KEYS.team, []);
    items.push(member);
    setStored(STORAGE_KEYS.team, items);
  },
  update: (id: string, updates: Partial<TeamMember>) => {
    const items = getStored<TeamMember[]>(STORAGE_KEYS.team, []).map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setStored(STORAGE_KEYS.team, items);
  },
  delete: (id: string) => {
    const items = getStored<TeamMember[]>(STORAGE_KEYS.team, []).filter((item) => item.id !== id);
    setStored(STORAGE_KEYS.team, items);
  }
};

export const mediaService = {
  getAll: () =>
    getStored<MediaItem[]>(STORAGE_KEYS.media, []).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
  getByType: (type: MediaItem["type"]) =>
    getStored<MediaItem[]>(STORAGE_KEYS.media, []).filter((item) => item.type === type),
  create: (media: MediaItem) => {
    const items = getStored<MediaItem[]>(STORAGE_KEYS.media, []);
    items.unshift(media);
    setStored(STORAGE_KEYS.media, items);
  },
  update: (id: string, updates: Partial<MediaItem>) => {
    const items = getStored<MediaItem[]>(STORAGE_KEYS.media, []).map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setStored(STORAGE_KEYS.media, items);
  },
  delete: (id: string) => {
    const items = getStored<MediaItem[]>(STORAGE_KEYS.media, []).filter((item) => item.id !== id);
    setStored(STORAGE_KEYS.media, items);
  }
};

export const registrationService = {
  getAll: () => getStored<Registration[]>(STORAGE_KEYS.registrations, []),
  getByStatus: (status: Registration["status"]) =>
    getStored<Registration[]>(STORAGE_KEYS.registrations, []).filter((item) => item.status === status),
  getById: (id: string) =>
    getStored<Registration[]>(STORAGE_KEYS.registrations, []).find((item) => item.id === id),
  create: (registration: Registration) => {
    const items = getStored<Registration[]>(STORAGE_KEYS.registrations, []);
    items.unshift(registration);
    setStored(STORAGE_KEYS.registrations, items);
  },
  updateStatus: (id: string, status: Registration["status"], reviewedBy?: string) => {
    const items = getStored<Registration[]>(STORAGE_KEYS.registrations, []).map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            reviewedAt: formatISO(new Date()),
            reviewedBy
          }
        : item
    );
    setStored(STORAGE_KEYS.registrations, items);
  },
  delete: (id: string) => {
    const items = getStored<Registration[]>(STORAGE_KEYS.registrations, []).filter((item) => item.id !== id);
    setStored(STORAGE_KEYS.registrations, items);
  }
};

export const contactService = {
  getAll: () => getStored<ContactMessage[]>(STORAGE_KEYS.messages, []),
  getUnread: () => getStored<ContactMessage[]>(STORAGE_KEYS.messages, []).filter((item) => !item.isRead),
  create: (message: ContactMessage) => {
    const items = getStored<ContactMessage[]>(STORAGE_KEYS.messages, []);
    items.unshift(message);
    setStored(STORAGE_KEYS.messages, items);
  },
  markAsRead: (id: string) => {
    const items = getStored<ContactMessage[]>(STORAGE_KEYS.messages, []).map((item) =>
      item.id === id ? { ...item, isRead: true } : item
    );
    setStored(STORAGE_KEYS.messages, items);
  },
  markAsUnread: (id: string) => {
    const items = getStored<ContactMessage[]>(STORAGE_KEYS.messages, []).map((item) =>
      item.id === id ? { ...item, isRead: false } : item
    );
    setStored(STORAGE_KEYS.messages, items);
  },
  delete: (id: string) => {
    const items = getStored<ContactMessage[]>(STORAGE_KEYS.messages, []).filter((item) => item.id !== id);
    setStored(STORAGE_KEYS.messages, items);
  },
  getUnreadCount: () => contactService.getUnread().length
};

export const statsService = {
  getStats: (): SiteStats => {
    const registrations = registrationService.getAll();
    const approved = registrations.filter((item) => item.status === "approved").length;
    const pending = registrations.filter((item) => item.status === "pending").length;
    const newsCount = newsService.getAll().length;

    const stats = getStored<SiteStats>(STORAGE_KEYS.stats, {
      totalMembers: approved,
      pendingRegistrations: pending,
      newsArticles: newsCount,
      totalViews: 0
    });

    return {
      ...stats,
      totalMembers: approved,
      pendingRegistrations: pending,
      newsArticles: newsCount
    };
  }
};
