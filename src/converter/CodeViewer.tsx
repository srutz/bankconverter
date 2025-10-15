import { MdCopyAll } from "react-icons/md";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import oneLight from "react-syntax-highlighter/dist/esm/styles/prism/one-light";
import { toast } from "sonner";
import { useTheme } from "@/components/base/ThemeProvider";
import { Button } from "@/components/ui/button";

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

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast("Content has been copied to clipboard", {
      dismissible: true,
      duration: 3_500,
    });
  };
  const handleDownload = () => {
    if (!filename) {
      console.error("Filename is not provided");
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="h-1 grow flex flex-col gap-2 items-stretch overflow-hidden">
      <SyntaxHighlighter language="javascript" style={customStyle}>
        {code}
      </SyntaxHighlighter>
      <div className="flex-grow"></div>
      <div className="flex flex-row gap-2">
        <Button variant="secondary" size="sm" onClick={handleCopyToClipboard}>
          <MdCopyAll></MdCopyAll>
          Copy to Clipboard
        </Button>
        {filename && (
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            <MdCopyAll></MdCopyAll>
            Download Mt940
          </Button>
        )}
      </div>
    </div>
  );
}
