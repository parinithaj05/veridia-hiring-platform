"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth";
import { useApplicationsStore } from "../../store/applications";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import type { Application, ApplicationStatus } from "../../types/application";

// Show "Accepted" for internal "Hired"
function statusLabel(s: ApplicationStatus) {
  return s === "Hired" ? "Accepted" : s;
}

// Color badge classes
function statusBadgeClass(s: ApplicationStatus) {
  const map: Record<ApplicationStatus, string> = {
    Draft: "bg-gray-500/15 text-gray-600",
    Submitted: "bg-blue-500/15 text-blue-600",
    "Under Review": "bg-amber-500/15 text-amber-600",
    Shortlisted: "bg-emerald-500/15 text-emerald-600",
    Rejected: "bg-rose-500/15 text-rose-600",
    Hired: "bg-purple-500/15 text-purple-600", // displayed as "Accepted"
    Waitlisted: "bg-cyan-500/15 text-cyan-600",
  };
  return `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[s]}`;
}

// Small metric card
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

// Column (read-only, no action buttons)
function Column({
  title,
  items,
}: {
  title: string;
  items: Application[];
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm text-muted-foreground">{items.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground">No applications here</div>
        )}
        {items.map((a) => (
          <div key={a.id} className="border rounded p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {a.firstName} {a.lastName}
                </div>
                <div className="text-xs text-muted-foreground">{a.email}</div>
              </div>
              <span className={statusBadgeClass(a.status)}>{statusLabel(a.status)}</span>
            </div>
            <div className="text-sm">Position: {a.position}</div>
            <div className="text-xs text-muted-foreground">
              {a.submittedAt ? new Date(a.submittedAt).toLocaleString() : "-"}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/admin/applications/${a.id}`} className="underline text-xs">
                View
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function AdminHome() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { applications } = useApplicationsStore();

  // Guard
  useEffect(() => {
    if (!user) router.replace("/login");
    else if (user.role !== "admin") router.replace("/");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  // Derived lists (read-only)
  const accepted = applications.filter((a) => a.status === "Hired");
  const waitlisted = applications.filter((a) => a.status === "Waitlisted");
  const rejected = applications.filter((a) => a.status === "Rejected");

  // Other counts
  const total = applications.length;
  const submitted = applications.filter((a) => a.status === "Submitted").length;
  const underReview = applications.filter((a) => a.status === "Under Review").length;
  const shortlisted = applications.filter((a) => a.status === "Shortlisted").length;

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid md:grid-cols-7 gap-4">
        <Stat label="Total" value={total} />
        <Stat label="Submitted" value={submitted} />
        <Stat label="Under Review" value={underReview} />
        <Stat label="Shortlisted" value={shortlisted} />
        <Stat label="Accepted" value={accepted.length} />
        <Stat label="Waitlisted" value={waitlisted.length} />
        <Stat label="Rejected" value={rejected.length} />
      </div>

      {/* Board (read-only) */}
      <div className="grid md:grid-cols-3 gap-4">
        <Column title="Accepted" items={accepted} />
        <Column title="Waitlisted" items={waitlisted} />
        <Column title="Rejected" items={rejected} />
      </div>

      {/* Link to full list (where actions exist) */}
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href="/admin/applications">Open Applications List</Link>
        </Button>
      </div>
    </div>
  );
}