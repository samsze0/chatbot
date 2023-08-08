"use client";

import { navConfig } from "@/config/nav-config";
import { siteConfig } from "@/config/site-config";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { NavItem, ParentNavItem } from "@/types/nav";
import { cn } from "@/lib/utils";
import { RxArrowTopRight } from "react-icons/rx";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { SocialLink } from "@/components/social-link";

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="pb-6">
      <div className="container flex flex-col items-stretch gap-10">
        <div className={cn("flex flex-col gap-8", "lg:flex-row lg:gap-12")}>
          <Link
            href="/"
            className="mr-6 flex flex-row self-start items-center space-x-2"
          >
            <Icons.logo className="h-5 w-5 text-primary dark:text-foreground" />
            <span className="font-bold">{t(siteConfig.displayName)}</span>
          </Link>
          <nav
            className={cn(
              "grid grid-cols-1 gap-8",
              "md:grid-cols-2",
              "lg:flex lg:flex-row lg:gap-20"
            )}
          >
            {navConfig.footerNav.map((navCategory) => (
              <NavCategory category={navCategory} key={navCategory.title} />
            ))}
          </nav>
        </div>
        <div className="flex flex-row justify-between gap-2 items-center">
          <p className="text-xs text-muted-foreground">
            {t("© 2023 Zhonghui Anda CPA Limited.")}
          </p>
          <nav className="flex flex-row items-center">
            <SocialLink
              href={siteConfig.links.twitter}
              type="twitter"
              className="text-muted-foreground/80 hover:text-muted-foreground"
            />
            <SocialLink
              href={siteConfig.links.linkedIn}
              type="linkedin"
              className="text-muted-foreground/80 hover:text-muted-foreground"
            />
          </nav>
        </div>
      </div>
    </footer>
  );
}

const NavCategory = ({
  category,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  category: ParentNavItem;
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <div className={cn(className, "flex flex-col gap-4")} {...props}>
      <p className="font text-foreground/80 text-sm font-medium">
        {t(category.title)}
      </p>
      <ul className="flex flex-col gap-4">
        {category.items.map((navItem) => (
          <span
            className="flex flex-row gap-1 items-center"
            key={navItem.title}
          >
            <Link
              href={navItem.href}
              className={cn(
                "text-sm transition-colors hover:text-muted-foreground",
                pathname?.startsWith(navItem.href)
                  ? "text-foreground/80"
                  : "text-muted-foreground/80"
              )}
              target={navItem.external ? "_blank" : undefined}
              rel={navItem.external ? "noopener noreferrer" : undefined}
            >
              {t(navItem.title)}
            </Link>
            <RxArrowTopRight
              className={cn(
                "text-muted-foreground/70 w-[13px] h-[13px]",
                navItem.external ? "opacity-100" : "opacity-0"
              )}
            />
          </span>
        ))}
      </ul>
    </div>
  );
};
