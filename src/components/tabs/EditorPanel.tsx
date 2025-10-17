import { useAtomValue } from "jotai";
import { useEffect, useMemo, useRef } from "react";
import { Camt053Document } from "@/converter/Camt";
import { CodeViewer } from "@/converter/CodeViewer";
import { convertToMt940 } from "@/converter/camtutil";
import { Mt940File } from "@/converter/Mt940";
import { mt940Output } from "@/converter/Mt940Output";
import { Tabs } from "../base/Tabs";
import { Editor, settingsAtom } from "./atoms";

function CamtViewer({ camt }: { camt: Camt053Document }) {
  return <CodeViewer code={JSON.stringify(camt, null, 4)} />;
}
function Mt940JsonViewer({ mt940 }: { mt940: Mt940File }) {
  return <CodeViewer code={JSON.stringify(mt940, null, 4)} />;
}
function Mt940OutputViewer({
  mt940,
  filename,
}: {
  mt940: Mt940File | null;
  filename: string;
}) {
  return (
    <CodeViewer
      code={mt940 ? mt940Output({ mt940 }) : ""}
      filename={filename}
    />
  );
}

export function EditorPanel({ editor }: { editor: Editor }) {
  const settings = useAtomValue(settingsAtom);
  const { content } = editor;
  const mt940filename = editor.filename
    ? editor.filename.replace(/\.camt053\.xml$/i, ".mt940.txt")
    : "output.mt940.txt";

  const conversion = useMemo(() => convertToMt940(content), [content]);
  const { parseResult, mt940Result } = conversion;
  return (
    <div className="grow h-1 flex flex-col items-center">
      <div className="self-stretch grow flex flex-col items-center gap-1 px-2 py-2 relative">
        <Tabs
          initialSelected={1}
          tabs={[
            {
              visible: true,
              name: "CAMT.053",
              content: <CodeViewer code={content} />,
            },
            {
              visible: settings.showAdditionalTabs ?? false,
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
              visible: settings.showAdditionalTabs ?? false,
              name: "MT940 (Parsed)",
              content: mt940Result ? (
                <Mt940JsonViewer mt940={mt940Result} />
              ) : (
                <div className="p-4 text-red-500">
                  Error converting to MT940.
                </div>
              ),
            },
            {
              visible: true,
              name: "MT940",
              content: (
                <Mt940OutputViewer
                  mt940={mt940Result}
                  filename={mt940filename}
                />
              ),
            },
          ]}
          className="self-stretch"
        />
      </div>
    </div>
  );
}
