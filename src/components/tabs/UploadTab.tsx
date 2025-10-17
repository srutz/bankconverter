import { useAtom } from "jotai";
import { LucideUpload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { readFileAsText } from "@/lib/fileutil";
import { cn } from "@/lib/utils";
import { Block } from "../base/Block";
import { Dropzone } from "../base/Dropzone";
import { H2 } from "../base/H2";
import { editorsAtom } from "./atoms";

export function UploadTab() {
  const { t } = useTranslation();
  const [editors, setEditors] = useAtom(editorsAtom);
  const handleDrop = async (file: File) => {
    const content = await readFileAsText(file, "UTF-8");
    const newEditor = {
      name: file.name,
      filename: file.name,
      content,
    };
    setEditors([...editors, newEditor]);
  };

  return (
    <div className="flex flex-col">
      <Block
        className={cn(
          "mt-8 self-center flex flex-col items-center p-0",
          "relative",
        )}
      >
        <Dropzone
          onDrop={handleDrop}
          className="self-stretch grow flex flex-col items-center px-8 py-8"
        >
          <H2>{t("upload.title")}</H2>
          <div className="h-1 grow flex flex-col items-center">
            <div className="grow flex flow-col items-center justify-center">
              <LucideUpload className="mt-4 h-16 w-16 text-muted-foreground" />
            </div>
            <p className="mt-4 text-center text-muted-foreground min-w-[400px]">
              {t("upload.instructions")}
            </p>
          </div>
        </Dropzone>
      </Block>
    </div>
  );
}
