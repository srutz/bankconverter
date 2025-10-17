import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { AppSidebar } from "@/components/base/AppSidebar";
import { LanguageToggle } from "@/components/base/LanguageToggle";
import { ModeToggle } from "@/components/base/ModeToggle";
import { ThemeProvider } from "@/components/base/ThemeProvider";
import { editorsAtom, settingsAtom } from "@/components/tabs/atoms";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import i18n from "@/i18n/config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_main")({
  component: App,
});

function App() {
  const [editors, setEditors] = useAtom(editorsAtom);
  const [initialized, setInitialized] = useState(false);
  const settings = useAtomValue(settingsAtom);

  // Initialize language from localStorage on client side
  useEffect(() => {
    const language = settings.language || "en";
    i18n.changeLanguage(language);
    setInitialized(true);
  }, [settings.language]);

  const handleClose = () => {
    setEditors([]);
  };
  return (
    <ThemeProvider defaultTheme="system">
      <SidebarProvider>
        <AppSidebar
          className={cn(
            initialized ? "animate-in fade-in slide-left" : "opacity-0",
          )}
        />
        <main
          className={cn(
            "flex w-full flex-1 flex-col overflow-hidden",
            initialized ? "animate-in fade-in zoom-in" : "opacity-0",
          )}
        >
          <div className="flex flex-row gap-1 mr-2">
            <SidebarTrigger />
            <div className="grow" />

            <div className="flex flex-row items-center justify-center">
              {/*
              <span className="text-sm text-muted-foreground">
                {editors.length > 0 ? `${editors[0].name}` : ""}
              </span>
                */}
            </div>
            <div className="grow" />
            <LanguageToggle />
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
