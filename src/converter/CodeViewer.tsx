import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { MdClose, MdCopyAll, MdDownload } from "react-icons/md";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import oneLight from "react-syntax-highlighter/dist/esm/styles/prism/one-light";
import { toast } from "sonner";
import { useTheme } from "@/components/base/ThemeProvider";
import { editorsAtom } from "@/components/tabs/atoms";
import { Button } from "@/components/ui/button";
import { makeDtAusFilenameFromCamtFilename } from "@/lib/fileutil";
import { ViewerButtonsBar } from "./ViewerButtonBar";

SyntaxHighlighter.registerLanguage("jsx", jsx);

export function CodeViewer({
  code,
  filename,
}: {
  code: string;
  filename?: string;
}) {
  const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const { theme } = useTheme();
  const baseStyle =
    theme === "system"
      ? darkMode
        ? oneDark
        : oneLight
      : theme === "dark"
        ? oneDark
        : oneLight;

  // Create custom style with 12px font size
  const customStyle = {
    ...baseStyle,
    'pre[class*="language-"]': {
      ...baseStyle['pre[class*="language-"]'],
      fontSize: "12px",
    },
  };

  return (
    <div className="h-1 grow flex flex-col gap-2 items-stretch overflow-hidden">
      <ViewerButtonsBar filename={filename} code={code}></ViewerButtonsBar>
      <SyntaxHighlighter language="javascript" style={customStyle}>
        {code}
      </SyntaxHighlighter>
      <div className="flex-grow"></div>
    </div>
  );
}
