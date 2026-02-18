"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTENT_STAGES, CONTENT_STAGE_LABELS } from "@/lib/constants";

export default function ScriptEditor({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item?: Doc<"contentItems"> | null;
}) {
  const createContent = useMutation(api.content.create);
  const updateContent = useMutation(api.content.update);
  const deleteContent = useMutation(api.content.remove);
  const agents = useQuery(api.agents.list);

  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");
  const [notes, setNotes] = useState("");
  const [stage, setStage] = useState<Doc<"contentItems">["stage"]>("idea");
  const [assignedAgentId, setAssignedAgentId] = useState("");

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setScript(item.script ?? "");
      setNotes(item.notes ?? "");
      setStage(item.stage);
      setAssignedAgentId(item.assignedAgentId ?? "");
    } else {
      setTitle("");
      setScript("");
      setNotes("");
      setStage("idea");
      setAssignedAgentId("");
    }
  }, [item, open]);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    if (item) {
      await updateContent({
        id: item._id,
        title,
        script: script || undefined,
        notes: notes || undefined,
        stage,
        assignedAgentId: assignedAgentId || undefined,
      });
    } else {
      await createContent({
        title,
        script: script || undefined,
        notes: notes || undefined,
        stage,
        assignedAgentId: assignedAgentId || undefined,
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>
            {item ? "Edit Content" : "Add Idea"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Content title..."
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Stage</Label>
              <Select value={stage} onValueChange={(val) => setStage(val as Doc<"contentItems">["stage"])}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {CONTENT_STAGE_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assigned Agent</Label>
              <Select value={assignedAgentId || "none"} onValueChange={(val) => setAssignedAgentId(val === "none" ? "" : val)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {agents?.map((a) => (
                    <SelectItem key={a._id} value={a.name}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="script">Script</Label>
            <Textarea
              id="script"
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Write your script here..."
              rows={10}
              className="mt-1"
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "12px",
                lineHeight: "1.6",
              }}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Production notes, comments..."
              rows={3}
              className="mt-1"
            />
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            <Button onClick={handleSubmit}>
              {item ? "Save Changes" : "Add Idea"}
            </Button>
            {item && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Content</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete &quot;{item.title}&quot;. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        await deleteContent({ id: item._id });
                        onClose();
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
