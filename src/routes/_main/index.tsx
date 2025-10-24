import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { LucidePlay } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Block } from "@/components/base/Block";
import { Page } from "@/components/base/Page";
import { Tabs } from "@/components/base/Tabs";
import { VideoPlayer } from "@/components/base/VideoPlayer";
import { editorsAtom } from "@/components/tabs/atoms";
import { EditorPanel } from "@/components/tabs/EditorPanel";
import { UploadTab } from "@/components/tabs/UploadTab";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_main/")({
  component: RouteComponent,
});

export type InterfaceStyle = "tabs" | "stack";
const style: InterfaceStyle = "stack"; // This could be made dynamic based on user preference

function RouteComponent() {
  const { t } = useTranslation();
  const editors = useAtomValue(editorsAtom);
  const [showVideo, setShowVideo] = useState(false);
  return (
    <Page className="pt-0 px-1">
      {style === "tabs" ? (
        <Tabs
          tabs={[
            { name: "Upload", content: <UploadTab />, visible: true },
            ...editors.map((editor) => ({
              name: editor.name,
              content: <div>{editor.content}</div>,
              visible: true,
            })),
          ]}
        ></Tabs>
      ) : (
        <div className="h-1 grow flex flex-col gap-4">
          {editors.length === 0 ? (
            <>
              <UploadTab />
              <Block className="relative w-[480px] min-h-[200px] self-center flex flex-col items-center justify-center">
                <div className="absolute inset-6 bg-black rounded-lg opacity-40">
                  <img
                    alt="Video thumbnail"
                    className="absolute inset-0 object-cover w-full h-full rounded-lg p-4"
                    src="/images/shot.png"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowVideo(true)}
                  className="relative p-4 flex justify-center items-center bg-black rounded-lg"
                >
                  <LucidePlay className="h-16 w-16 text-muted-foreground" />
                </button>
              </Block>
              <div className="flex flex-col items-center">
                <Button
                  variant="link"
                  onClick={() =>
                    window!.open(
                      "https://www.sepa-tools.de/camt-testdateien.html",
                      "_blank",
                    )
                  }
                >
                  {t("upload.openExample")}
                </Button>
              </div>

              {showVideo && (
                <Dialog
                  open={showVideo}
                  onOpenChange={() => setShowVideo(false)}
                >
                  <DialogContent className="min-w-[95%] h-[95%] flex flex-col items-center">
                    <DialogHeader>
                      <DialogTitle>{t("description")}</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <VideoPlayer
                      src="/videos/camt-converter.mp4"
                      autoPlay
                      loop
                      controls
                      containerClasses="max-w-[1126px]"
                    ></VideoPlayer>
                  </DialogContent>
                </Dialog>
              )}
            </>
          ) : (
            <EditorPanel editor={editors[0]} />
          )}
        </div>
      )}
    </Page>
  );
}
