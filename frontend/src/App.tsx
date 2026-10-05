import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import IndexPage from "@/pages/Index";
import AboutPage from "@/pages/About";
import NewsPage from "@/pages/News";
import NewsDetailPage from "@/pages/NewsDetail";
import GalleryPage from "@/pages/Gallery";
import RegisterPage from "@/pages/Register";
import ContactPage from "@/pages/Contact";
import NotFoundPage from "@/pages/NotFound";

const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminMessagesPage = lazy(() => import("@/pages/admin/AdminMessages"));
const AdminRegistrationsPage = lazy(() => import("@/pages/admin/AdminRegistrations"));
const AdminNewsPage = lazy(() => import("@/pages/admin/AdminNews"));
const AdminTeamPage = lazy(() => import("@/pages/admin/AdminTeam"));
const AdminMediaPage = lazy(() => import("@/pages/admin/AdminMedia"));

const AdminFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <p className="text-sm text-muted-foreground">Loading admin…</p>
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/admin" element={<Suspense fallback={<AdminFallback />}><AdminLayout /></Suspense>}>
        <Route index element={<Navigate to="messages" replace />} />
        <Route path="login" element={<AdminLoginPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="registrations" element={<AdminRegistrationsPage />} />
        <Route path="news" element={<AdminNewsPage />} />
        <Route path="team" element={<AdminTeamPage />} />
        <Route path="media" element={<AdminMediaPage />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="/" element={<IndexPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
