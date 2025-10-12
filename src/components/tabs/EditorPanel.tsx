import { useSetAtom } from "jotai";
import { LucideCircleX } from "lucide-react";
import { Camt053ParseResult } from "@/converter/Camt";
import { Camt053Parser } from "@/converter/CamtParser";
import { Mt940File } from "@/converter/Mt940";
import { CamtToMt940Converter } from "@/converter/Mt940Converter";
import { H3 } from "../base/H3";
import { Editor, editorsAtom } from "./atoms";

export function EditorPanel({ editor } : { editor: Editor }) {
  const { name, content } = editor;
  const setEditors = useSetAtom(editorsAtom);
  const handleClose = () => {
    setEditors([])
  }
  const parser = new Camt053Parser({
    parseNestedTransactions: true,
    strictMode: false,
    validateBalances: false
  });
  let parseResult: Camt053ParseResult | null = null;
  try {
    parseResult = parser.parse(content);
  } catch (error) {
    console.error("Error parsing CAMT.053 file:", error);
  }
  const converter = new CamtToMt940Converter({
    defaultCurrency: 'EUR',
    includeEntryDetails: true,
  });
  let mt940Result : Mt940File | null = null;
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
        <H3>{name}</H3>
        <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={handleClose} title="Close Editor">
          <LucideCircleX />
        </button>
        <pre className="h-1 grow self-stretch overflow-auto text-xs bg-white p-4 rounded-md border border-gray-300">
          {mt940Result && parseResult?.success 
            ? mt940Result.toString() : (
              parseResult?.success
              ? 'No data to convert' 
              : `Error parsing CAMT.053 file: ${parseResult?.errors?.join(', ') || 'Unknown error'}`
              )}
        </pre>
      </div>
    </div>
  );
}