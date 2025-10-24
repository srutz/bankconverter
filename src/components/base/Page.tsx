import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Page({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("h-1 grow flex flex-col p-4", className)}>
      {children}
    </div>
  );
}
