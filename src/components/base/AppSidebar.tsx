import { Link } from "@tanstack/react-router";
import {
  Home,
  LucideBookKey,
  Settings,
  Sheet
} from "lucide-react";
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

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "About",
    url: "/about",
    icon: Settings,
  },
  {
    title: "Imprint / Impressum",
    url: "/imprint",
    icon: Sheet,
  },
  {
    title: "Privacy",
    url: "/privacy",
    icon: MdPrivacyTip,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row gap-1">
        <LucideBookKey />
        Bankconverter
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menü</SidebarGroupLabel>
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
          by stepan.rutz AT stepanrutz.com
          <br />
          Use at your own risk. No warranty.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
