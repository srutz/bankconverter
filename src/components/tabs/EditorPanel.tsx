import { useSetAtom } from "jotai";
import { Camt053Document, Camt053ParseResult } from "@/converter/Camt";
import { Camt053Parser } from "@/converter/CamtParser";
import { Mt940File } from "@/converter/Mt940";
import { CamtToMt940Converter } from "@/converter/Mt940Converter";
import { H3 } from "../base/H3";
import { Tabs } from "../base/Tabs";
import { Editor, editorsAtom } from "./atoms";

function XmlViewer({ xml }: { xml: string }) {
  return (
    <pre className="h-1 grow self-stretch overflow-auto text-xs p-4 rounded-md border border-gray-200 dark:border-gray-700">
      {xml}
    </pre>
  );
}

function CamtViewer({ camt }: { camt: Camt053Document }) {
  return (
    <pre className="h-1 grow self-stretch overflow-auto text-xs p-4 rounded-md border border-gray-300">
      {JSON.stringify(camt, null, 4)}
    </pre>
  );
}
function Mt940Viewer({ mt940 }: { mt940: Mt940File }) {
  return (
    <pre className="h-1 grow self-stretch overflow-auto text-xs p-4 rounded-md border border-gray-300">
      {JSON.stringify(mt940, null, 4)}
    </pre>
  );
}

export function EditorPanel({ editor }: { editor: Editor }) {
  const { name, content } = editor;
  const parser = new Camt053Parser({
    parseNestedTransactions: true,
    strictMode: false,
    validateBalances: false,
  });
  let parseResult: Camt053ParseResult | null = null;
  try {
    parseResult = parser.parse(content);
  } catch (error) {
    console.error("Error parsing CAMT.053 file:", error);
  }
  const converter = new CamtToMt940Converter({
    defaultCurrency: "EUR",
    includeEntryDetails: true,
  });
  let mt940Result: Mt940File | null = null;
  if (parseResult?.success && parseResult.data) {
    try {
      mt940Result = converter.convert(parseResult.data);
    } catch (error) {
      console.error("Error parsing CAMT.053 file:", error);
    }
  }
  return (
    <div className="grow h-1 flex flex-col items-center">
      <div className="self-stretch grow flex flex-col items-center gap-1 px-2 py-2 relative">
        <Tabs
          tabs={[
            {
              visible: true,
              name: "CAMT.053",
              content: <XmlViewer xml={content} />,
            },
            {
              visible: true,
              name: "CAMT.053 (Parsed)",
              content:
                parseResult?.success && parseResult.data ? (
                  <CamtViewer camt={parseResult.data} />
                ) : (
                  <div className="p-4 text-red-500">
                    Error parsing CAMT.053 file.
                  </div>
                ),
            },
            {
              visible: true,
              name: "MT940 (Parsed)",
              content: mt940Result ? (
                <Mt940Viewer mt940={mt940Result} />
              ) : (
                <div className="p-4 text-red-500">
                  Error converting to MT940.
                </div>
              ),
            },
          ]}
          className="self-stretch"
        />
      </div>
    </div>
  );
}
