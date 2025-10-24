import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { LucidePlay } from "lucide-react";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { Block } from "@/components/base/Block";
import { Page } from "@/components/base/Page";
import { Tabs } from "@/components/base/Tabs";
import { VideoPlayer } from "@/components/base/VideoPlayer";
import { editorsAtom } from "@/components/tabs/atoms";
import { EditorPanel } from "@/components/tabs/EditorPanel";
import { UploadTab } from "@/components/tabs/UploadTab";
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
              <Block className="w-[360px] min-h-[200px] self-center flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={() => setShowVideo(true)}
                  className="self-stretch grow flex justify-center items-center"
                >
                  <LucidePlay className="mt-4 h-16 w-16 text-muted-foreground" />
                </button>
              </Block>

              {showVideo && (
                <Dialog
                  open={showVideo}
                  onOpenChange={() => setShowVideo(false)}
                >
                  <DialogContent className="min-w-[95%] h-[95%] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>{t("settings.title")}</DialogTitle>
                      <DialogDescription>
                        {t("settings.description")}
                      </DialogDescription>
                    </DialogHeader>
                    <VideoPlayer
                      src="/videos/camt-converter.mp4"
                      autoPlay
                      loop
                      controls
                      containerClasses="min-h-[400px]"
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
