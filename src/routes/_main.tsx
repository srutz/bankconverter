import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/base/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_main")({
  component: App,
});

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
