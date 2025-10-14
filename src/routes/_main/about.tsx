import { createFileRoute } from "@tanstack/react-router";
import { H2 } from "@/components/base/H2";
import { H3 } from "@/components/base/H3";
import { Page } from "@/components/base/Page";

export const Route = createFileRoute("/_main/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
      <Page className="flex flex-col gap-1">
        <H2>About CAMT Converter</H2>
        <div className="text-sm">Written by stepan.rutz AT stepanrutz.com</div>
        <H3 className="mt-4">License</H3>
        <div className="text-sm">
        This software is free to use in all commercial and non-commercial applications.</div>
        <H3 className="mt-4">Cookies</H3>
        <div className="text-sm">
          This software does not set Cookies. Cookies may be set by third-party services.</div>
        <H3 className="mt-4">Disclaimer</H3>
        <div className="text-sm">
          This software comes without any warranty whatsoever. 
          All results need to be verified by the user and are 
          potentially wrong. The author is not liable for any damages.
          By using This software you agree to these terms and confirm that 
          you have read the privacy policy and that you will validate all results
          manually.
        </div>
        <H3 className="mt-4">Haftungsausschluss</H3>
        <div className="text-sm">Diese Software wird ohne jegliche Gewährleistung bereitgestellt. 
          Alle Ergebnisse müssen vom Benutzer überprüft werden und sind 
          potenziell falsch. Der Autor haftet nicht für Schäden jeglicher Art.
          Durch die Nutzung dieser Software stimmen Sie diesen Bedingungen zu und bestätigen,
          dass Sie die Datenschutzbestimmungen gelesen haben und alle Ergebnisse manuell überprüfen werden.
        </div>
      </Page>
  );
  
}
