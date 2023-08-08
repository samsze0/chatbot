import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { useTranslation } from "react-i18next";
import { buttonVariants } from "@/components/ui/button";
import { RxLinkedinLogo } from "react-icons/rx";
import { ImTwitter } from "react-icons/im";

export const SocialLink: React.FC<
  LinkProps & {
    className?: string;
    href: string;
    type: "artizon" | "linkedin" | "twitter";
  }
> = ({ href, type, className, ...props }) => {
  const { t } = useTranslation();

  return (
    <Link href={href} target="_blank" rel="noreferrer" {...props}>
      <div
        className={cn(
          buttonVariants({
            variant: "ghost",
          }),
          className,
          "w-9 px-0"
        )}
      >
        {type === "twitter" ? (
          <ImTwitter className="h-[1.2rem] w-[1.2rem] fill-current" />
        ) : type === "linkedin" ? (
          <RxLinkedinLogo className="h-[1.2rem] w-[1.2rem] fill-current" />
        ) : null}
        <span className="sr-only">{t("Twitter")}</span>
      </div>
    </Link>
  );
};
