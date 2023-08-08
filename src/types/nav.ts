import { Icons } from "@/components/icons";

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
}

export interface ParentNavItem
  extends Omit<NavItem, "href" | "disabled" | "external"> {
  items: NavItem[];
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends ParentNavItem {}

export interface FooterNavItem extends ParentNavItem {}
