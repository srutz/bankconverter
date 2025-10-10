import { createFileRoute } from "@tanstack/react-router";
import { LucideUpload } from "lucide-react";
import { Block } from "@/components/base/Block";
import { H2 } from "@/components/base/H2";
import { Page } from "@/components/base/Page";

export const Route = createFileRoute("/_main/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page>
      <Block className="min-h-[200px] self-center flex flex-col items-center">
        <H2>CAMT CONVERTER</H2>
        <div className="grow flex flow-col items-center justify-center">
        <LucideUpload className="mt-4 h-16 w-16 text-muted-foreground" />
        </div>
        <p className="mt-4 text-muted-foreground">Upload your CAMT file</p>
      </Block>
    </Page>
  );
}
