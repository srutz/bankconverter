import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { MdClose, MdCopyAll, MdDownload } from "react-icons/md";
import { toast } from "sonner";
import { editorsAtom } from "@/components/tabs/atoms";
import { Button } from "@/components/ui/button";
import { makeDtAusFilenameFromCamtFilename } from "@/lib/fileutil";

export function ViewerButtonsBar({
  filename,
  code,
}: {
  filename?: string;
  code: string;
}) {
  const { t } = useTranslation();
  const [_, setEditors] = useAtom(editorsAtom);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast(t("codeViewer.copySuccess"), {
      dismissible: true,
      duration: 3_500,
    });
  };
  const handleDownload = () => {
    if (!filename) {
      console.error(t("codeViewer.filenameNotProvided"));
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = makeDtAusFilenameFromCamtFilename(filename);
    document.body.appendChild(element);
    element.click();
  };
  const handleClose = () => {
    setEditors([]);
  };
  return (
    <div className="flex flex-row gap-2">
      <Button variant="secondary" size="sm" onClick={handleCopyToClipboard}>
        <MdCopyAll></MdCopyAll>
        {t("codeViewer.copyToClipboard")}
      </Button>
      {filename && (
        <>
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            <MdDownload></MdDownload>
            {t("codeViewer.downloadFile")}
          </Button>
          <div className="grow"></div>
          <Button variant="outline" size="sm" onClick={handleClose}>
            <MdClose />
            {t("codeViewer.closeViewer")}
          </Button>
        </>
      )}
    </div>
  );
}
