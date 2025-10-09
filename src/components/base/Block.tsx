import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Block({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={cn("bg-muted/100 aspect-video rounded-xl py-4 px-8 text-sm", className)}>{children}</div>;
}
