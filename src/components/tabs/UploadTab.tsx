import { useAtom } from "jotai";
import { LucideUpload } from "lucide-react";
import { readFileAsText } from "@/lib/fileutil";
import { cn } from "@/lib/utils";
import { Block } from "../base/Block";
import { Dropzone } from "../base/Dropzone";
import { H2 } from "../base/H2";
import { editorsAtom } from "./atoms";

export function UploadTab() {
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
      <Block className={cn(
          "mt-8 self-center flex flex-col items-center p-0",
          "relative"
          )}>        
        <Dropzone
          onDrop={handleDrop}
          className="self-stretch grow flex flex-col items-center px-8 py-8"
        >
          <H2>CAMT CONVERTER</H2>
          <div className="flex flex-col items-center">
            <div className="grow flex flow-col items-center justify-center">
              <LucideUpload className="mt-4 h-16 w-16 text-muted-foreground" />
            </div>
            <p className="mt-4 text-muted-foreground">Upload your CAMT file</p>
          </div>
        </Dropzone>
      </Block>
    </div>
  );
}
