import { createFileRoute } from "@tanstack/react-router";
import { H2 } from "@/components/base/H2";
import { Page } from "@/components/base/Page";

export const Route = createFileRoute("/_main/imprint")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page>
      <div className="h-1 grow flex flex-col gap-4">
        <H2>Impressum und V.I.S.D.P. / Imprint</H2>
        <div className="text-sm">
          Stepan Rutz
          <br />
          Brunnenallee 25a
          <br />
          D-50226 Frechen
          <br />
          Deutschland
          <br />
          <br />
          Telephone: +49 157 804 33 749
          <br />
          E-Mail: stepan.rutz AT stepanrutz.com
          <br />
        </div>
      </div>
    </Page>
  );
}
