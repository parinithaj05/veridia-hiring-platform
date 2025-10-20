"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "../../../../store/auth";
import { useApplicationsStore } from "../../../../store/applications";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";
import ConfirmStatus from "../../../../components/admin/confirm-status";
import { toast } from "sonner";
import type { ApplicationStatus, StatusEvent } from "../../../../types/application";

const ALL_STATUSES: readonly ApplicationStatus[] = [
  "Draft",
  "Submitted",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Hired",
  "Waitlisted",
] as const;

function isAppStatus(v: string): v is ApplicationStatus {
  return (ALL_STATUSES as readonly string[]).includes(v);
}

function statusBadgeClass(s: ApplicationStatus) {
  const map: Record<ApplicationStatus, string> = {
    Draft: "bg-gray-500/15 text-gray-600",
    Submitted: "bg-blue-500/15 text-blue-600",
    "Under Review": "bg-amber-500/15 text-amber-600",
    Shortlisted: "bg-emerald-500/15 text-emerald-600",
    Rejected: "bg-rose-500/15 text-rose-600",
    Hired: "bg-purple-500/15 text-purple-600",
    Waitlisted: "bg-cyan-500/15 text-cyan-600",
  };
  return `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[s]}`;
}

export default function AdminApplicationDetail() {
  const { user } = useAuthStore();
  const { applications, changeStatus } = useApplicationsStore();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!user) router.replace("/login");
    else if (user.role !== "admin") router.replace("/");
  }, [user, router]);

  const app = applications.find((a) => a.id === id);

  const [status, setStatus] = useState<ApplicationStatus>(app?.status ?? "Under Review");
  const [note, setNote] = useState<string>(app?.notes ?? "");

  if (!user || user.role !== "admin") return null;
  if (!app) return <div className="text-muted-foreground">Application not found.</div>;

  const handleStatusChange = (value: string) => {
    if (isAppStatus(value)) setStatus(value);
  };

  const save = () => {
    changeStatus(app.id, status, note, user?.name ?? "Admin");
    toast.success("Status updated");
    router.back();
  };

  const adminName = user.name ?? "Admin";

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Candidate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="font-medium">
            {app.firstName} {app.lastName}
          </div>
          <div className="text-sm text-muted-foreground">{app.email}</div>
          <div className="text-sm">{app.phone}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>Position: {app.position}</div>
          <div className="text-sm text-muted-foreground">
            Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleString() : "-"}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Status</span>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className={statusBadgeClass(status)}>{status === "Hired" ? "Accepted" : status}</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes to applicant (optional)</label>
            <Textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., reason for rejection, next steps, etc."
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <ConfirmStatus
              trigger={<Button>Accept</Button>}
              target="Hired"
              title="Accept applicant"
              onConfirm={(n) => {
                changeStatus(app.id, "Hired", n || "Accepted", adminName);
                toast.success("Marked as Accepted");
                router.back();
              }}
            />
            <ConfirmStatus
              trigger={<Button variant="secondary">Waitlist</Button>}
              target="Waitlisted"
              title="Waitlist applicant"
              onConfirm={(n) => {
                changeStatus(app.id, "Waitlisted", n || "Waitlisted", adminName);
                toast.success("Marked as Waitlisted");
                router.back();
              }}
            />
            <ConfirmStatus
              trigger={<Button variant="destructive">Reject</Button>}
              target="Rejected"
              title="Reject applicant"
              requireNote
              description="Please provide a brief reason (visible to the applicant)."
              onConfirm={(n) => {
                changeStatus(app.id, "Rejected", n, adminName);
                toast.success("Marked as Rejected");
                router.back();
              }}
            />
            <Button variant="outline" onClick={save}>
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Motivation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap">{app.motivation}</div>
        </CardContent>
      </Card>

      {app.history && app.history.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Status history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {app.history
              .slice()
              .reverse()
              .map((h: StatusEvent, i: number) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 border-b pb-2 last:border-0"
                >
                  <div>
                    <span className={statusBadgeClass(h.status)}>
                      {h.status === "Hired" ? "Accepted" : h.status}
                    </span>
                    {h.note && (
                      <div className="mt-1 text-muted-foreground">Note: {h.note}</div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(h.at).toLocaleString()}
                    {h.by ? ` • by ${h.by}` : ""}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}