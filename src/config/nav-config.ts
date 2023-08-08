import { FooterNavItem, MainNavItem, SidebarNavItem } from "@/types/nav";
import { siteConfig } from "./site-config";

interface NavConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
  footerNav: FooterNavItem[];
}

export const navConfig: NavConfig = {
  mainNav: [],
  sidebarNav: [],
  footerNav: [],
};
