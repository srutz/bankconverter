import { createFileRoute } from "@tanstack/react-router";
import { H2 } from "@/components/base/H2";
import { Page } from "@/components/base/Page";
import { PrivacyPanel } from "@/converter/PrivacyPanel";

export const Route = createFileRoute("/_main/privacy")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
      <Page>
        <H2>About CAMT Converter</H2>
        <PrivacyPanel></PrivacyPanel>
      </Page>
  );
  
}
