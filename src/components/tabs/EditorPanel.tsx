import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { Camt053Document } from "@/converter/Camt";
import { CodeViewer } from "@/converter/CodeViewer";
import { convertToMt940 } from "@/converter/camtutil";
import { Mt940File } from "@/converter/Mt940";
import { mt940Output } from "@/converter/Mt940Output";
import { Mt940Table } from "@/converter/Mt940Table";
import { makeDtAusFilenameFromCamtFilename } from "@/lib/fileutil";
import { Tab, Tabs } from "../base/Tabs";
import { autoDownloadedFilesAtom, Editor, settingsAtom } from "./atoms";

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

// Utility function to trigger download
const downloadFile = (content: string, filename: string) => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = makeDtAusFilenameFromCamtFilename(filename);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
};

export function EditorPanel({ editor }: { editor: Editor }) {
  const settings = useAtomValue(settingsAtom);
  const [autoDownloadedFiles, setAutoDownloadedFiles] = useAtom(
    autoDownloadedFilesAtom,
  );
  const { content } = editor;
  const mt940filename = editor.filename
    ? editor.filename.replace(/\.camt053\.xml$/i, ".mt940.txt")
    : "output.mt940.txt";

  const conversion = useMemo(() => convertToMt940(content), [content]);
  const { parseResult, mt940Result } = conversion;

  // Auto-download effect
  useEffect(() => {
    // Only proceed if auto-download is enabled and we have a successful conversion
    if (!settings.autoDownload || !mt940Result || !editor.filename) {
      return;
    }

    // Create a unique key for this file content to track if it's been downloaded
    const fileKey = `${editor.filename}-${content.length}-${content.slice(0, 100)}`;

    // Check if this specific file has already been auto-downloaded
    if (autoDownloadedFiles.has(fileKey)) {
      return;
    }

    // Generate MT940 output and download it
    const mt940Content = mt940Output({ mt940: mt940Result });
    if (mt940Content) {
      downloadFile(mt940Content, mt940filename);

      // Mark this file as downloaded
      setAutoDownloadedFiles((prev) => new Set([...prev, fileKey]));
    }
  }, [
    settings.autoDownload,
    mt940Result,
    editor.filename,
    content,
    mt940filename,
    autoDownloadedFiles,
    setAutoDownloadedFiles,
  ]);

  const tabs: Tab[] = [
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
          <div className="p-4 text-red-500">Error parsing CAMT.053 file.</div>
        ),
    },
    {
      visible: settings.showAdditionalTabs ?? false,
      name: "MT940 (Parsed)",
      content: mt940Result ? (
        <Mt940JsonViewer mt940={mt940Result} />
      ) : (
        <div className="p-4 text-red-500">Error converting to MT940.</div>
      ),
    },
    {
      visible: true,
      name: "MT940 Lines",
      content: (
        <Mt940Table
          mt940={mt940Result}
          code={content}
          filename={mt940filename}
        />
      ),
    },
    {
      visible: true,
      name: "MT940",
      content: (
        <Mt940OutputViewer mt940={mt940Result} filename={mt940filename} />
      ),
    },
  ];
  const visibleTabs = tabs.filter((tab) => tab.visible);
  const initialSelected = visibleTabs.length > 0 ? visibleTabs.length - 1 : 0;

  return (
    <div className="grow h-1 flex flex-col items-center">
      <div className="self-stretch grow flex flex-col items-center gap-1 px-2 py-2 relative">
        <Tabs
          initialSelected={initialSelected}
          tabs={tabs}
          className="self-stretch"
        />
      </div>
    </div>
  );
}
