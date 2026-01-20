import type { LucideIcon } from "lucide-react";
export * from "./models";
export * from "./auth";

// res
export interface ApiResponse<T> {
  status: string;
  message: string | null;
  data: T;
}

// UI
export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}
