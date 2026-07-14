"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { getInitials } from "@/lib/utils";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Executive Dashboard",
  "/admin/ai": "AI Insights",
  "/admin/products": "Product Management",
  "/admin/inventory": "Inventory Control",
  "/admin/sales": "Sales & POS",
  "/admin/customers": "Customer CRM",
  "/admin/deliveries": "Delivery Logistics",
  "/admin/service": "Service Center",
  "/admin/employees": "Employee Management",
  "/admin/procurement": "Procurement",
  "/admin/finance": "Finance & Accounts",
  "/admin/branches": "Branch Network",
  "/admin/reports": "Reports Hub",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.entries(PAGE_TITLES)
    .filter(([path]) => path !== "/admin")
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => pathname.startsWith(path));
  return match?.[1] ?? "Admin Panel";
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="lg:ml-64 pt-14 lg:pt-0 min-h-screen flex flex-col transition-[margin] duration-300">
        <header className="sticky top-0 z-20 hidden lg:flex h-16 items-center gap-4 border-b border-border/60 bg-background/80 backdrop-blur-xl px-6">
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-lg font-bold truncate">{title}</h1>
            <p className="text-xs text-muted-foreground">Highrange Home Appliances · Idukki, Kerala</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search admin..." className="pl-9 h-9 bg-muted/50 border-0" />
          </div>
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Button>
          <ThemeToggle />
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right hidden xl:block">
              <p className="text-sm font-medium">Rajesh Kumar</p>
              <p className="text-xs text-muted-foreground">Store Manager</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold ring-2 ring-red-500/30">
              {getInitials("Rajesh Kumar")}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <AdminShell>{children}</AdminShell>
    </ThemeProvider>
  );
}
