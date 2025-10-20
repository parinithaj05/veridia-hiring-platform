"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { useAuthStore } from "../store/auth";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  return (
    <main className="relative min-h-[calc(100vh-56px)] grid place-items-center overflow-hidden">
      {/* Soft gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <Card className="w-full max-w-3xl shadow-lg border">
        <CardHeader className="flex items-center gap-3">
          <Image
            src="/veridia-logo.png"
            alt="Veridia logo"
            width={56}
            height={56}
            className="rounded"
            priority
          />
          <div>
            <CardTitle className="text-2xl">Veridia Hiring Platform</CardTitle>
            <p className="text-sm text-muted-foreground">
              Streamlined applications for candidates and HR
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="applicant" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="applicant">Applicant</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="applicant" className="mt-6">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">Apply to Veridia</h2>
                <p className="text-sm text-muted-foreground">
                  Create an account or log in to submit your application and track status.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button onClick={() => router.push("/login")} size="lg" variant="secondary">
                    Login
                  </Button>
                  <Button onClick={() => router.push("/register")} size="lg">
                    Register
                  </Button>
                </div>
                {user?.role === "applicant" && (
                  <div className="pt-3">
                    <Button variant="outline" onClick={() => router.push("/dashboard")}>
                      Go to your Dashboard
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="admin" className="mt-6">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">HR / Admin Portal</h2>
                <p className="text-sm text-muted-foreground">
                  Log in as admin to view, filter, and manage job applications.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button onClick={() => router.push("/login")} size="lg">
                    Admin Login
                  </Button>
                  <Button
                    onClick={() => router.push("/admin/applications")}
                    size="lg"
                    variant="secondary"
                  >
                    View Applications
                  </Button>
                </div>
                {user?.role === "admin" && (
                  <div className="pt-3 flex items-center justify-center gap-3">
                    <Button variant="outline" onClick={() => router.push("/admin/applications")}>
                      Applications
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/admin")}>
                      Admin Dashboard
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground pt-2">
                  Test admin: admin@veridia.com / Admin123
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}