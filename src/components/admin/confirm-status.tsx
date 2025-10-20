"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import type { ApplicationStatus } from "../../types/application";

type Props = {
  trigger: React.ReactNode;
  target: ApplicationStatus;             // e.g. "Hired" | "Rejected" | "Waitlisted"
  title?: string;
  description?: string;
  requireNote?: boolean;                 // set true for Reject
  onConfirm: (note: string) => void;     // receives note (empty string if none)
};

export default function ConfirmStatus({
  trigger,
  target,
  title = "Confirm status change",
  description = "This will update the applicant's status and they'll see it on their dashboard.",
  requireNote = false,
  onConfirm,
}: Props) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  const confirm = () => {
    if (requireNote && !note.trim()) return; // block if note is required but empty
    onConfirm(note.trim());
    setOpen(false);
    setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Set status to <strong>{target}</strong>. {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {requireNote ? "Reason (required)" : "Note (optional)"}
          </label>
          <Textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              requireNote ? "Provide a brief reason" : "Optional message to the applicant"
            }
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirm} disabled={requireNote && !note.trim()}>
            Confirm {target}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}