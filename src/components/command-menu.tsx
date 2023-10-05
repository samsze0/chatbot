"use client";

import { generateNextCommandMenuComp } from "@artizon/ui/next-client-components";
import { useSettings } from "./settings";
import { navConfig } from "@/config/nav-config";

const Comp = generateNextCommandMenuComp(useSettings);

export function CommandMenu() {
  return <Comp navConfig={navConfig} commandMenuConfig={[]} />;
}
