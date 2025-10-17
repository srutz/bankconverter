import { useAtom } from "jotai";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languageAtom } from "../tabs/atoms";

export function LanguageToggle() {
  const [_, setLanguage] = useAtom(languageAtom);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="m-0 py-0 px-0 self-start h-7 w-7">
          <MdLanguage></MdLanguage>
          <span className="sr-only">Sprache umschalten</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("de")}>
          Deutsch
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          Englisch
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
