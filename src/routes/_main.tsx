import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { MdClose } from "react-icons/md";
import { AppSidebar } from "@/components/base/AppSidebar";
import { ModeToggle } from "@/components/base/ModeToggle";
import { ThemeProvider } from "@/components/base/ThemeProvider";
import { editorsAtom } from "@/components/tabs/atoms";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/i18n/config";

export const Route = createFileRoute("/_main")({
  component: App,
});

function App() {
  const [editors, setEditors] = useAtom(editorsAtom);
  const handleClose = () => {
    setEditors([]);
  };
  return (
    <ThemeProvider defaultTheme="system">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className="flex flex-row gap-1 mr-2">
            <SidebarTrigger />
            <div className="grow" />
            <div className="flex flex-row items-center justify-center">
              <span className="text-sm text-muted-foreground">
                {editors.length > 0 ? `${editors[0].name}` : ""}
              </span>
            </div>
            <div className="grow" />
            <ModeToggle />
            {editors.length > 0 && (
              <Button
                variant="ghost"
                onClick={handleClose}
                title="Close Editor"
                className="h-7 w-7 p-0"
              >
                <MdClose />
              </Button>
            )}
          </div>
          <Outlet />
        </main>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
}
