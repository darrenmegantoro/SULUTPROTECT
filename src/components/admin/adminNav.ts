import {
  LayoutDashboard,
  MessagesSquare,
  BookOpen,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

// Sidebar navigation for the Integrated Dashboard.
export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Interaksi Pengaduan", href: "/admin/interactions", icon: MessagesSquare },
  { label: "Kelola FAQ", href: "/admin/faq", icon: BookOpen },
  { label: "Kelola Formulir", href: "/admin/form-questions", icon: ClipboardList },
];
