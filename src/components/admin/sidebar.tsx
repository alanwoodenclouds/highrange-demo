"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, Warehouse, ShoppingCart, Users, Truck,
  UserCog, Wrench, Building2, IndianRupee, Store, Sparkles,
  ChevronLeft, Menu, X, Home, ClipboardList, BarChart3,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/ai", label: "AI Insights", icon: Sparkles },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
    ],
  },
  {
    title: "Sales",
    items: [
      { href: "/admin/sales", label: "Sales & POS", icon: ShoppingCart },
      { href: "/admin/customers", label: "Customers CRM", icon: Users },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/admin/deliveries", label: "Deliveries", icon: Truck },
      { href: "/admin/service", label: "Service Center", icon: Wrench },
      { href: "/admin/employees", label: "Employees", icon: UserCog },
    ],
  },
  {
    title: "Business",
    items: [
      { href: "/admin/procurement", label: "Procurement", icon: ClipboardList },
      { href: "/admin/finance", label: "Finance", icon: IndianRupee },
      { href: "/admin/branches", label: "Branches", icon: Building2 },
      { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
        <div className="h-9 w-9 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold shrink-0">
          H
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <div className="font-display font-bold text-white text-sm truncate">Highrange</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Store Manager</div>
          </div>
        )}
        {mobile && (
          <Button variant="ghost" size="icon" className="ml-auto text-white" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-hide">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            {(!collapsed || mobile) && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => mobile && setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all relative",
                      active
                        ? "bg-teal-500/20 text-teal-300"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="admin-nav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-400 rounded-r"
                      />
                    )}
                    <item.icon className="h-4 w-4 shrink-0" />
                    {(!collapsed || mobile) && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5"
        >
          <Store className="h-4 w-4" />
          {(!collapsed || mobile) && <span>View Storefront</span>}
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5"
        >
          <Home className="h-4 w-4" />
          {(!collapsed || mobile) && <span>Back to Home</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-sidebar border-b border-white/10 flex items-center px-4 gap-3">
        <Button variant="ghost" size="icon" className="text-white" onClick={() => setMobileOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-display font-bold text-white text-sm">Highrange Admin</span>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/60"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-sidebar"
            >
              <NavContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30 bg-sidebar transition-all duration-300",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        <NavContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-card border border-border shadow flex items-center justify-center hover:bg-muted"
        >
          <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform", collapsed && "rotate-180")} />
        </button>
      </aside>
    </>
  );
}
