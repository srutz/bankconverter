import { createFileRoute } from "@tanstack/react-router";
import { LucideUpload } from "lucide-react";
import { Block } from "@/components/base/Block";
import { Page } from "@/components/base/Page";

export const Route = createFileRoute("/_main/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page>
      <Block className="min-h-[200px] self-center flex flex-col items-center">
        <h2 className="text-primary leading-tighter max-w-2xl text-2xl font-semibold text-balance ">
          CAMT CONVERTER
        </h2>
        <div className="grow flex flow-col items-center justify-center">
        <LucideUpload className="mt-4 h-16 w-16 text-muted-foreground" />
        </div>
        <p className="mt-4 text-muted-foreground">Upload your CAMT file</p>
      </Block>
    </Page>
  );
}
