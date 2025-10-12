import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Page({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={cn("h-1 grow flex flex-col p-4", className)}>{children}</div>;
}
