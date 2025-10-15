import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ComboBox, type ComboBoxOption } from "@/components/base/ComboBox";
import {
  type Language,
  languageAtom,
  settingsAtom,
} from "@/components/tabs/atoms";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
export const Route = createFileRoute("/_main/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [settings, setSettings] = useAtom(settingsAtom);
  const [language, setLanguage] = useAtom(languageAtom);
  const checkboxId = useId();

  // Local state for form
  const [localShowAdditionalTabs, setLocalShowAdditionalTabs] = useState(
    settings.showAdditionalTabs || false,
  );
  const [localLanguage, setLocalLanguage] = useState<Language>(language);

  const languages: ComboBoxOption[] = [
    { label: "English", value: "en" },
    { label: "Deutsch", value: "de" },
  ];

  const handleSave = () => {
    // Update the atoms
    setSettings({
      showAdditionalTabs: localShowAdditionalTabs,
      language: localLanguage,
    });

    // Update language separately to trigger i18n change
    if (localLanguage !== language) {
      setLanguage(localLanguage);
    }

    // Show success message
    toast.success(t("settings.saveSuccess"));

    // Navigate back to home
    navigate({ to: "/" });
  };

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        navigate({ to: "/" });
      }}
    >
      <DialogContent className="min-w-[80%] h-[80%] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("settings.title")}</DialogTitle>
          <DialogDescription>{t("settings.description")}</DialogDescription>
        </DialogHeader>
        <div className="h-1 grow flex flex-col gap-4 pt-4">
          <div className="flex gap-2 items-center">
            <Checkbox
              id={checkboxId}
              checked={localShowAdditionalTabs}
              onCheckedChange={(checked) =>
                setLocalShowAdditionalTabs(!!checked)
              }
            />
            <Label htmlFor={checkboxId}>{t("settings.additionalTabs")}</Label>
          </div>
          <div className="flex gap-2 items-center">
            <Label>{t("settings.language")}</Label>
            <ComboBox
              options={languages}
              hideInput={true}
              placeholder={t("settings.languagePlaceholder")}
              value={localLanguage}
              onChange={(option) => setLocalLanguage(option.value as Language)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            {t("settings.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
