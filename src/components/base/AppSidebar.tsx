import { Home, Settings, Sheet } from "lucide-react";
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
    title: "Help",
    url: "/about",
    icon: Settings,
  },
  {
    title: "Imprint / Impressum",
    url: "/imprint",
    icon: Sheet,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>Bankconverter</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menü</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
