"use client";

import { useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "../../store/auth";
import { useAccountsStore } from "../../store/accounts";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Using selectors or full store both work. This avoids any typing issues.
  const login = useAuthStore((state) => state.login);
  const { verify, ensureAdmin } = useAccountsStore();
  const router = useRouter();

  useEffect(() => {
    // Seed admin account: admin@veridia.com / Admin123
    ensureAdmin();
  }, [ensureAdmin]);

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    const acc = verify(values.email, values.password);
    if (!acc) {
      toast.error("Invalid email or password");
      return;
    }
    login({ id: acc.id, name: acc.name, email: acc.email, role: acc.role });
    toast.success("Welcome back!");
    router.push(acc.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
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
            Login
          </Button>
        </form>
      </Form>
      <p className="text-xs text-muted-foreground mt-3">
        Admin test: admin@veridia.com / Admin123
      </p>
    </div>
  );
}