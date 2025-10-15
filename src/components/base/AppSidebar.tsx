import { Link } from "@tanstack/react-router";
import { Home, Info, LucideBookKey, Settings, Sheet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MdPrivacyTip } from "react-icons/md";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { t } = useTranslation();

  const items = [
    {
      title: t("sidebar.navigation.home"),
      url: "/",
      icon: Home,
    },
    {
      title: t("sidebar.navigation.imprint"),
      url: "/imprint",
      icon: Sheet,
    },
    {
      title: t("sidebar.navigation.privacy"),
      url: "/privacy",
      icon: MdPrivacyTip,
    },
    {
      title: t("sidebar.navigation.about"),
      url: "/about",
      icon: Info,
    },
    {
      title: t("sidebar.navigation.settings"),
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row gap-1">
        <LucideBookKey />
        {t("sidebar.title")}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.menu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="text-xs text-muted-foreground text-center">
          <br />
          {t("sidebar.footer.author")}
          <br />
          {t("sidebar.footer.disclaimer")}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
