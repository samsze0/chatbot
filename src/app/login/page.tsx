import { siteConfig } from "@/config/site-config";
import { LoginPage } from "@artizon/ui/next";

export default function Page() {
  return <LoginPage siteConfig={siteConfig} />;
}
