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
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function MemoryModal({
  open,
  onClose,
  memory,
}: {
  open: boolean;
  onClose: () => void;
  memory?: Doc<"memories"> | null;
}) {
  const createMemory = useMutation(api.memory.create);
  const agents = useQuery(api.agents.list);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [agentId, setAgentId] = useState("__manual__");

  useEffect(() => {
    if (memory) {
      setTitle(memory.title);
      setContent(memory.content);
      setTagsStr(memory.tags.join(", "));
      setAgentId(memory.agentId ?? "__manual__");
    } else {
      setTitle("");
      setContent("");
      setTagsStr("");
      setAgentId("__manual__");
    }
  }, [memory, open]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    await createMemory({
      title,
      content,
      tags,
      agentId: agentId && agentId !== "__manual__" ? agentId : undefined,
    });
    onClose();
  };

  const isViewing = !!memory;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-2xl bg-[var(--bg-surface)] border-[var(--glass-border)]">
        <DialogHeader>
          <DialogTitle
            className="text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {isViewing ? memory.title : "Add Memory"}
          </DialogTitle>
        </DialogHeader>

        <Separator className="bg-[var(--glass-border)]" />

        <div className="flex flex-col gap-4">
          {isViewing ? (
            <>
              <div
                className="text-sm leading-relaxed whitespace-pre-wrap rounded-[var(--radius-md)] px-4 py-3"
                style={{
                  fontFamily: "var(--font-code)",
                  color: "var(--text-secondary)",
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                {memory.content}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {memory.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded text-[10px] tracking-wider uppercase"
                    style={{
                      fontFamily: "var(--font-code)",
                      background: "var(--glass-bg-hover)",
                      color: "var(--text-muted)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <Label
                  className="text-[10px] tracking-[0.15em] uppercase text-[var(--text-muted)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Title
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Memory title..."
                  className="bg-[var(--bg-elevated)] border-[var(--glass-border)] text-[var(--text-primary)] focus-visible:border-[var(--glass-border-hover)]"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  className="text-[10px] tracking-[0.15em] uppercase text-[var(--text-muted)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Content
                </Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What should be remembered..."
                  rows={6}
                  className="bg-[var(--bg-elevated)] border-[var(--glass-border)] text-[var(--text-primary)] focus-visible:border-[var(--glass-border-hover)] resize-y"
                  style={{ fontFamily: "var(--font-code)" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  className="text-[10px] tracking-[0.15em] uppercase text-[var(--text-muted)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Tags (comma-separated)
                </Label>
                <Input
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="strategy, technical, finance..."
                  className="bg-[var(--bg-elevated)] border-[var(--glass-border)] text-[var(--text-primary)] focus-visible:border-[var(--glass-border-hover)]"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  className="text-[10px] tracking-[0.15em] uppercase text-[var(--text-muted)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Source Agent
                </Label>
                <Select value={agentId} onValueChange={setAgentId}>
                  <SelectTrigger
                    className="w-full bg-[var(--bg-elevated)] border-[var(--glass-border)] text-[var(--text-primary)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <SelectValue placeholder="Manual entry" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--bg-elevated)] border-[var(--glass-border)]">
                    <SelectItem value="__manual__">Manual entry</SelectItem>
                    {agents?.map((a) => (
                      <SelectItem key={a._id} value={a.name}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-[var(--glass-border)]" />

              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="default" onClick={handleSubmit}>
                  Save Memory
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
