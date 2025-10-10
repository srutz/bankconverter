import { createFileRoute } from "@tanstack/react-router";
import { H2 } from "@/components/base/H2";
import { Page } from "@/components/base/Page";

export const Route = createFileRoute("/_main/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
      <Page>
        <H2>About CAMT Converter</H2>
        <div></div>
      </Page>
  );
  
}
