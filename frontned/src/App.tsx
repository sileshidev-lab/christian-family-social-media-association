import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import IndexPage from "@/pages/Index";
import AboutPage from "@/pages/About";
import NewsPage from "@/pages/News";
import NewsDetailPage from "@/pages/NewsDetail";
import GalleryPage from "@/pages/Gallery";
import RegisterPage from "@/pages/Register";
import ContactPage from "@/pages/Contact";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminLoginPage from "@/pages/admin/AdminLogin";
import AdminDashboardPage from "@/pages/admin/AdminDashboard";
import AdminMessagesPage from "@/pages/admin/AdminMessages";
import AdminRegistrationsPage from "@/pages/admin/AdminRegistrations";
import AdminNewsPage from "@/pages/admin/AdminNews";
import NotFoundPage from "@/pages/NotFound";

const App = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="messages" replace />} />
        <Route path="login" element={<AdminLoginPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="registrations" element={<AdminRegistrationsPage />} />
        <Route path="news" element={<AdminNewsPage />} />
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
