"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/auth";
import { useApplicationsStore } from "../../../store/applications";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import ConfirmStatus from "../../../components/admin/confirm-status";
import { toast } from "sonner";

const STATUSES = [
  "All",
  "Draft",
  "Submitted",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Hired",
  "Waitlisted",
] as const;
type StatusFilter = (typeof STATUSES)[number];

function statusBadgeClass(s: string) {
  const map: Record<string, string> = {
    Draft: "bg-gray-500/15 text-gray-600",
    Submitted: "bg-blue-500/15 text-blue-600",
    "Under Review": "bg-amber-500/15 text-amber-600",
    Shortlisted: "bg-emerald-500/15 text-emerald-600",
    Rejected: "bg-rose-500/15 text-rose-600",
    Hired: "bg-purple-500/15 text-purple-600",
    Waitlisted: "bg-cyan-500/15 text-cyan-600",
  };
  return `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[s] ?? "bg-muted text-foreground"}`;
}

export default function AdminApplicationsPage() {
  const user = useAuthStore((s) => s.user);
  const { applications: allApps, changeStatus } = useApplicationsStore();
  const router = useRouter();

  // Hooks must be before any return
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");

  // Guard
  useEffect(() => {
    if (!user) router.replace("/login");
    else if (user.role !== "admin") router.replace("/");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  // Simple search + filter (no hooks below)
  const q = query.trim().toLowerCase();
  let filtered = allApps.filter((a) => {
    if (!q) return true;
    return (
      a.firstName.toLowerCase().includes(q) ||
      a.lastName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.position.toLowerCase().includes(q)
    );
  });
  if (status !== "All") filtered = filtered.filter((a) => a.status === status);

  const adminName = user.name ?? "Admin";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search by name, email, position..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded">
          <div className="grid grid-cols-6 gap-2 p-2 text-sm bg-muted font-medium">
            <div>Candidate</div>
            <div>Position</div>
            <div>Submitted</div>
            <div>Status</div>
            <div>Action</div>
            <div>View</div>
          </div>

          {filtered.map((a) => (
            <div key={a.id} className="grid grid-cols-6 gap-2 p-2 border-t">
              <div>
                {a.firstName} {a.lastName}
                <div className="text-xs text-muted-foreground">{a.email}</div>
              </div>
              <div>{a.position}</div>
              <div className="text-sm">
                {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : "-"}
              </div>
              <div>
                <span className={statusBadgeClass(a.status)}>
                  {a.status === "Hired" ? "Accepted" : a.status}
                </span>
              </div>

              <div className="flex gap-1 flex-wrap">
                <ConfirmStatus
                  trigger={<Button size="sm">Accept</Button>}
                  target="Hired"
                  title="Accept applicant"
                  onConfirm={(note) => {
                    changeStatus(a.id, "Hired", note || "Accepted", adminName);
                    toast.success("Marked as Accepted");
                  }}
                />
                <ConfirmStatus
                  trigger={<Button size="sm" variant="secondary">Waitlist</Button>}
                  target="Waitlisted"
                  title="Waitlist applicant"
                  onConfirm={(note) => {
                    changeStatus(a.id, "Waitlisted", note || "Waitlisted", adminName);
                    toast.success("Marked as Waitlisted");
                  }}
                />
                <ConfirmStatus
                  trigger={<Button size="sm" variant="destructive">Reject</Button>}
                  target="Rejected"
                  title="Reject applicant"
                  requireNote
                  description="Please provide a brief reason (visible to the applicant)."
                  onConfirm={(note) => {
                    changeStatus(a.id, "Rejected", note, adminName);
                    toast.success("Marked as Rejected");
                  }}
                />
              </div>

              <div>
                <Link href={`/admin/applications/${a.id}`} className="underline text-sm">
                  View
                </Link>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">
              No applications found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}