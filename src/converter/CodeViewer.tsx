import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@/components/base/ThemeProvider";

SyntaxHighlighter.registerLanguage("jsx", jsx);

export function CodeViewer({ code }: { code: string }) {
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
      fontSize: "11px",
    },
  };

  return (
    <SyntaxHighlighter language="javascript" style={customStyle}>
      {code}
    </SyntaxHighlighter>
  );
}
