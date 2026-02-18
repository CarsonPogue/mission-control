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
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from "@/lib/constants";
import { formatDate, formatTime } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  upcoming: "#007AFF",
  running: "#FF9500",
  completed: "#34C759",
  failed: "#FF3B30",
};

export default function EventDetail({
  open,
  onClose,
  event,
}: {
  open: boolean;
  onClose: () => void;
  event: Doc<"calendarEvents"> | null;
}) {
  const updateEvent = useMutation(api.calendar.update);
  const deleteEvent = useMutation(api.calendar.remove);

  if (!event) return null;

  const typeColor = EVENT_TYPE_COLORS[event.type];
  const statusColor = STATUS_COLORS[event.status];

  const handleStatusChange = async (status: Doc<"calendarEvents">["status"]) => {
    await updateEvent({ id: event._id, status });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge label={EVENT_TYPE_LABELS[event.type]} color={typeColor} />
            <Badge label={event.status} color={statusColor} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date</Label>
              <div
                className="mt-1 text-sm px-3 py-2 rounded-[var(--radius-sm)]"
                style={{
                  fontFamily: "var(--font-code)",
                  color: "var(--text-secondary)",
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                {formatDate(event.startTime)}
              </div>
            </div>
            <div>
              <Label>Time</Label>
              <div
                className="mt-1 text-sm px-3 py-2 rounded-[var(--radius-sm)]"
                style={{
                  fontFamily: "var(--font-code)",
                  color: "var(--text-secondary)",
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                {formatTime(event.startTime)}
              </div>
            </div>
          </div>

          {event.description && (
            <div>
              <Label>Description</Label>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                {event.description}
              </p>
            </div>
          )}

          {event.agentId && (
            <div>
              <Label>Owner Agent</Label>
              <div className="mt-1">
                <Badge label={event.agentId} color="#34C759" />
              </div>
            </div>
          )}

          {event.recurrence && (
            <div>
              <Label>Recurrence</Label>
              <div
                className="mt-1 text-sm px-3 py-2 rounded-[var(--radius-sm)]"
                style={{
                  fontFamily: "var(--font-code)",
                  color: "var(--accent-purple)",
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                {event.recurrence}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center gap-2 flex-wrap">
            {event.status !== "completed" && (
              <Button variant="outline" onClick={() => handleStatusChange("completed")}>
                Mark Complete
              </Button>
            )}
            {event.status !== "failed" && (
              <Button variant="destructive" onClick={() => handleStatusChange("failed")}>
                Mark Failed
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Event</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete &quot;{event.title}&quot;. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      await deleteEvent({ id: event._id });
                      onClose();
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
