import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from 'jotai'
import { Page } from "@/components/base/Page";
import { Tabs } from "@/components/base/Tabs";
import { editorsAtom } from "@/components/tabs/atoms";
import { EditorPanel } from "@/components/tabs/EditorPanel";
import { UploadTab } from "@/components/tabs/UploadTab";


export const Route = createFileRoute("/_main/")({
  component: RouteComponent,
});

export type InterfaceStyle = "tabs" | "stack"
  const style: InterfaceStyle = "stack"; // This could be made dynamic based on user preference

function RouteComponent() {
  const editors = useAtomValue(editorsAtom);
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
            <UploadTab />
          ) : (
            <EditorPanel editor={editors[0]} />
          )}
        </div>
      )
    }
    </Page>
  );
}
