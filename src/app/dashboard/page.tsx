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
import Link from "next/link";
import { Button } from "../../components/ui/button";

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

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const apps = useApplicationsStore((s) =>
    user ? s.forUser(user.id) : []
  );
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/login");
    else if (user.role !== "applicant") router.replace("/admin");
  }, [user, router]);

  if (!user || user.role !== "applicant") return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
        <Button asChild>
          <Link href="/apply">New Application</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {apps.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No applications yet.{" "}
              <Link className="underline" href="/apply">
                Apply now
              </Link>
              .
            </p>
          ) : (
            apps.map((a) => (
              <div key={a.id} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.position}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.submittedAt
                        ? new Date(a.submittedAt).toLocaleString()
                        : "Draft (not submitted)"}
                    </div>
                  </div>
                  <span className={statusBadgeClass(a.status)}>
                    {a.status === "Hired" ? "Accepted" : a.status}
                  </span>
                </div>
                {a.notes && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Note from HR: {a.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}