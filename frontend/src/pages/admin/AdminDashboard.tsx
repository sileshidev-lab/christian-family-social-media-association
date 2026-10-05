import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Mail,
  Newspaper,
  FileCheck
} from "lucide-react";
import { registrationApi, messageApi, newsApi } from "@/services/api";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingRegistrations: 0,
    newsArticles: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [registrations, messages, news] = await Promise.all([
          registrationApi.getAdminAll(),
          messageApi.getAdminAll(),
          newsApi.getAdminAll()
        ]);
        
        setStats({
          totalMembers: registrations.filter(r => r.status === "approved").length,
          pendingRegistrations: registrations.filter(r => r.status === "pending").length,
          newsArticles: news.length,
          unreadMessages: messages.filter(m => !m.isRead).length
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Approved Members",
      value: stats.totalMembers,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      link: "/admin/registrations"
    },
    {
      title: "Pending Registrations",
      value: stats.pendingRegistrations,
      icon: FileCheck,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      link: "/admin/registrations"
    },
    {
      title: "News Articles",
      value: stats.newsArticles,
      icon: Newspaper,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      link: "/admin/news"
    },
    {
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: Mail,
      color: "text-green-500",
      bg: "bg-green-500/10",
      link: "/admin/messages"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your platform's statistics.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} to={card.link} className="block group">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${card.bg}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-bold">
                    {loading ? "..." : card.value}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mt-1 group-hover:text-foreground transition-colors">
                    {card.title}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
