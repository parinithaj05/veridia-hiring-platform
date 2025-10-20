"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useAuthStore } from "../store/auth";
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";

const NavLink = ({ href, label }: { href: string; label: string }) => {
const pathname = usePathname();
return (
<Link
href={href}
className={cn(
"px-3 py-2 rounded-md text-sm font-medium",
pathname === href
? "bg-accent text-accent-foreground"
: "text-muted-foreground hover:text-foreground"
)}
>
{label}
</Link>
);
};

export default function Navbar() {
const user = useAuthStore((s) => s.user);
const logout = useAuthStore((s) => s.logout);
const router = useRouter();
const { theme, setTheme } = useTheme();

const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) {
return (
<header className="border-b bg-background/60 backdrop-blur">
<div className="container mx-auto flex items-center justify-between h-14 px-4">
<Link href="/" className="flex items-center gap-2 font-semibold">
<Image src="/veridia-logo.png" alt="Veridia logo" width={28} height={28} className="rounded" />
<span className="hidden sm:inline">Veridia</span>
</Link>
</div>
</header>
);
}

return (
<header className="border-b bg-background/60 backdrop-blur">
<div className="container mx-auto flex items-center justify-between h-14 px-4">
<Link href="/" className="flex items-center gap-2 font-semibold">
<Image src="/veridia-logo.png" alt="Veridia logo" width={28} height={28} className="rounded" priority />
<span className="hidden sm:inline">Veridia</span>
</Link>


    <nav className="flex items-center gap-2">
      <NavLink href="/" label="Home" />
      {user?.role === "applicant" && (
        <>
          <NavLink href="/apply" label="Apply" />
          <NavLink href="/dashboard" label="Dashboard" />
        </>
      )}
      {user?.role === "admin" && (
        <>
          <NavLink href="/admin/applications" label="Applications" />
          <NavLink href="/admin" label="Admin Dashboard" />
        </>
      )}
    </nav>

    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </Button>

      {user ? (
        <>
          <span className="text-sm text-muted-foreground hidden sm:inline">{user.name}</span>
          <Button
            variant="outline"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" onClick={() => router.push("/login")}>Login</Button>
          <Button onClick={() => router.push("/register")}>Register</Button>
        </>
      )}
    </div>
  </div>
</header>
);
}