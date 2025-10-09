import { ReactNode } from "react";

export function Page({ children }: { children: ReactNode }) {
  return <div className="h-1 grow flex flex-col p-4">{children}</div>;
}
