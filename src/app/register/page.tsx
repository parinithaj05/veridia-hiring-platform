"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
Form,
FormField,
FormItem,
FormLabel,
FormControl,
FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth";
import { useAccountsStore } from "../../store/accounts";

const RegisterSchema = z.object({
name: z.string().min(2),
email: z.string().email(),
password: z.string().min(6),
});

export default function RegisterPage() {
const form = useForm<z.infer<typeof RegisterSchema>>({
resolver: zodResolver(RegisterSchema),
defaultValues: { name: "", email: "", password: "" },
});

const login = useAuthStore((s) => s.login);
const createAccount = useAccountsStore((s) => s.create);
const router = useRouter();

function onSubmit(values: z.infer<typeof RegisterSchema>) {
const result = createAccount({
name: values.name,
email: values.email,
password: values.password,
role: "applicant",
});

if (result === "exists") {
  toast.error("An account with this email already exists.");
  return;
}

// Auto-login after registration
login({
  id: result.id,
  name: result.name,
  email: result.email,
  role: result.role,
});
toast.success("Account created");
router.push("/dashboard");
}

return (
<div className="max-w-md mx-auto">
<h1 className="text-2xl font-semibold mb-4">Create your account</h1>
<Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
<FormField
control={form.control}
name="name"
render={({ field }) => (
<FormItem>
<FormLabel>Name</FormLabel>
<FormControl>
<Input placeholder="Jane Doe" {...field} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="email"
render={({ field }) => (
<FormItem>
<FormLabel>Email</FormLabel>
<FormControl>
<Input type="email" placeholder="jane@example.com" {...field} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="password"
render={({ field }) => (
<FormItem>
<FormLabel>Password</FormLabel>
<FormControl>
<Input type="password" placeholder="••••••" {...field} />
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<Button type="submit" className="w-full">
Register
</Button>
</form>
</Form>
</div>
);
}