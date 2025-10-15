import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import { ComboBox } from "@/components/base/ComboBox";
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
  const languages = [
    { label: "English", value: "en" },
    { label: "German", value: "de" },
  ];
  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        navigate({ to: "/" });
      }}
    >
      <DialogContent className="min-w-[80%] h-[80%] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bankconverter Settings</DialogTitle>
          <DialogDescription>
            Configure your preferences and application settings
          </DialogDescription>
        </DialogHeader>
        <div className="h-1 grow flex flex-col gap-4 pt-4">
          <div className="flex gap-2 items-center">
            <Checkbox name="details"></Checkbox>
            <Label htmlFor="details">Enable additional info-tabs</Label>
          </div>
          <div className="flex gap-2 items-center">
            <Label>User-Interface language</Label>
            <ComboBox options={languages} placeholder="Language" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
