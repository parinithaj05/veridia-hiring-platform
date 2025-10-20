"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth";
import ApplyForm from "../../components/forms/apply-form";

export default function ApplyPage() {
const user = useAuthStore((s) => s.user);
const router = useRouter();

useEffect(() => {
if (!user) router.replace("/login");
else if (user.role !== "applicant") router.replace("/admin/applications");
}, [user, router]);

if (!user || user.role !== "applicant") return null;
return <ApplyForm />;
}