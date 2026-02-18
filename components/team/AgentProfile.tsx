"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/Badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AGENT_STATUS_COLORS, AGENT_ROLE_COLORS } from "@/lib/constants";
import { useState } from "react";

export default function AgentProfile({
  open,
  onClose,
  agent,
}: {
  open: boolean;
  onClose: () => void;
  agent: Doc<"agents"> | null;
}) {
  const updateStatus = useMutation(api.agents.updateStatus);
  const [newStatus, setNewStatus] = useState<Doc<"agents">["status"]>("idle");

  if (!agent) return null;

  const roleColor = AGENT_ROLE_COLORS[agent.role] ?? "#007AFF";
  const statusColor = AGENT_STATUS_COLORS[agent.status];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>
            Agent: {agent.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{
                background: `${roleColor}12`,
                color: roleColor,
                fontFamily: "var(--font-display)",
                border: `1px solid ${roleColor}25`,
                boxShadow: `0 0 20px ${roleColor}15`,
              }}
            >
              {agent.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {agent.name}
              </h2>
              <div className="text-xs" style={{ color: roleColor, fontFamily: "var(--font-code)" }}>
                {agent.role}
              </div>
              <div className="mt-1">
                <Badge label={agent.status} color={statusColor} pulse={agent.status === "active"} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Responsibilities */}
          <div>
            <Label>Responsibilities</Label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {agent.responsibilities.map((r) => (
                <span
                  key={r}
                  className="text-[11px] px-2.5 py-1 rounded-[var(--radius-sm)]"
                  style={{
                    background: "var(--glass-bg-hover)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--glass-border)",
                    fontFamily: "var(--font-code)",
                  }}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* Current task */}
          {agent.currentTask && (
            <div>
              <Label>Current Task</Label>
              <div
                className="mt-1 text-sm px-3 py-2 rounded-[var(--radius-sm)]"
                style={{
                  background: "var(--glass-bg-hover)",
                  border: "1px solid var(--glass-border)",
                  fontFamily: "var(--font-code)",
                  color: "var(--text-secondary)",
                }}
              >
                {agent.currentTask}
              </div>
            </div>
          )}

          <Separator />

          {/* Status control */}
          <div className="flex items-center gap-2">
            <Select value={newStatus} onValueChange={(val) => setNewStatus(val as Doc<"agents">["status"])}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={async () => {
                await updateStatus({ id: agent._id, status: newStatus });
                onClose();
              }}
            >
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
