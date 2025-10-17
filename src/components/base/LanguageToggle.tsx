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
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="m-0 py-0 px-0 self-start h-7 w-7">
          <MdLanguage></MdLanguage>
          <span className="sr-only">{t("languageToggle.toggleLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("de")}>
          {t("languageToggle.german")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          {t("languageToggle.english")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
