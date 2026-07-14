"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3, FileText, Download, Printer, TrendingUp, Package, Users,
  Truck, IndianRupee, Building2, Wrench, ClipboardList, Sparkles, Calendar,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageTransition, StaggerChildren, StaggerItem } from "@/components/shared/page-transition";
import {
  DASHBOARD_STATS, ORDERS, PRODUCTS, CUSTOMERS, DELIVERIES,
  EMPLOYEES, SERVICE_REQUESTS, BRANCH_PERFORMANCE,
} from "@/data";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";

const REPORT_CATEGORIES = [
  {
    title: "Sales Reports",
    icon: TrendingUp,
    color: "from-teal-500/20 to-teal-600/10",
    iconColor: "text-teal-500",
    reports: [
      { name: "Daily Sales Summary", desc: "Today's transactions & revenue", metric: formatCurrency(DASHBOARD_STATS.revenue / 30), href: "/admin/sales" },
      { name: "Monthly Revenue Report", desc: "MTD sales across branches", metric: formatCurrency(DASHBOARD_STATS.revenue), href: "/admin/finance" },
      { name: "Product-wise Sales", desc: "Top performing SKUs", metric: `${PRODUCTS.filter((p) => p.isBestSeller).length} best sellers`, href: "/admin/products" },
      { name: "GST Sales Register", desc: "Taxable sales with GST breakup", metric: formatCurrency(ORDERS.reduce((s, o) => s + o.tax, 0)), href: "/admin/finance" },
    ],
  },
  {
    title: "Inventory Reports",
    icon: Package,
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-500",
    reports: [
      { name: "Stock Summary", desc: "Current inventory across branches", metric: formatNumber(PRODUCTS.reduce((s, p) => s + p.stock, 0)) + " units", href: "/admin/inventory" },
      { name: "Low Stock Alert Report", desc: "Items below reorder level", metric: `${PRODUCTS.filter((p) => p.stock < 15).length} items`, href: "/admin/inventory" },
      { name: "Inventory Valuation", desc: "Total stock value at selling price", metric: formatCurrency(DASHBOARD_STATS.inventoryValue), href: "/admin/inventory" },
      { name: "Branch Stock Distribution", desc: "Stock levels per location", metric: "6 branches", href: "/admin/branches" },
    ],
  },
  {
    title: "Customer Reports",
    icon: Users,
    color: "from-violet-500/20 to-violet-600/10",
    iconColor: "text-violet-500",
    reports: [
      { name: "Customer Directory", desc: "Full CRM export", metric: formatNumber(CUSTOMERS.length) + " customers", href: "/admin/customers" },
      { name: "Loyalty Points Report", desc: "Points issued & redeemed", metric: formatNumber(CUSTOMERS.reduce((s, c) => s + c.loyaltyPoints, 0)), href: "/admin/customers" },
      { name: "Tier-wise Analysis", desc: "Revenue by membership tier", metric: "4 tiers", href: "/admin/customers" },
      { name: "Customer Acquisition", desc: "New signups this month", metric: "48 new", href: "/admin/customers" },
    ],
  },
  {
    title: "Operations Reports",
    icon: Truck,
    color: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-500",
    reports: [
      { name: "Delivery Performance", desc: "On-time delivery metrics", metric: `${DELIVERIES.filter((d) => d.status === "delivered").length} delivered`, href: "/admin/deliveries" },
      { name: "Service Ticket Report", desc: "Open & resolved tickets", metric: `${SERVICE_REQUESTS.filter((sr) => sr.status !== "completed").length} open`, href: "/admin/service" },
      { name: "Employee Attendance", desc: "Daily attendance log", metric: `${DASHBOARD_STATS.attendanceRate}% present`, href: "/admin/employees" },
      { name: "Branch Operations", desc: "Per-branch KPI summary", metric: "6 locations", href: "/admin/branches" },
    ],
  },
  {
    title: "Financial Reports",
    icon: IndianRupee,
    color: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-500",
    reports: [
      { name: "Profit & Loss Statement", desc: "Revenue, expenses & net profit", metric: formatCurrency(DASHBOARD_STATS.revenue * 0.28), href: "/admin/finance" },
      { name: "Cash Flow Statement", desc: "Inflows & outflows", metric: "H1 2026", href: "/admin/finance" },
      { name: "Expense Breakdown", desc: "Operating costs by category", metric: "6 categories", href: "/admin/finance" },
      { name: "Vendor Payment Report", desc: "Outstanding payables", metric: "14 vendors", href: "/admin/procurement" },
    ],
  },
  {
    title: "AI & Analytics",
    icon: Sparkles,
    color: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-400",
    reports: [
      { name: "Sales Forecast", desc: "6-month ML projection", metric: "+12.4% growth", href: "/admin/ai" },
      { name: "Demand Prediction", desc: "Category-wise demand forecast", metric: "11 categories", href: "/admin/ai" },
      { name: "Customer Insights", desc: "Segmentation & churn analysis", metric: "6 segments", href: "/admin/ai" },
      { name: "Inventory Optimization", desc: "AI reorder recommendations", metric: `${PRODUCTS.filter((p) => p.stock < 15).length} alerts`, href: "/admin/ai" },
    ],
  },
];

export default function ReportsPage() {
  const today = formatDate(new Date());

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Reports Hub</h2>
          <p className="text-muted-foreground text-sm">Printable summaries & exportable business reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Calendar className="h-4 w-4" />{today}</Button>
          <Button className="gap-2"><Download className="h-4 w-4" />Export All (Demo)</Button>
        </div>
      </div>

      <Card className="glass-card border-teal-500/20 bg-gradient-to-r from-teal-500/5 via-transparent to-violet-500/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-teal-500" />
                <h3 className="font-display font-bold text-lg">Executive Summary — July 2026</h3>
                <Badge variant="success" className="text-[10px]">Ready</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Comprehensive monthly report covering sales, inventory, finance, and operations across all 6 Idukki branches.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Revenue", value: formatCurrency(DASHBOARD_STATS.revenue) },
                { label: "Orders", value: formatNumber(DASHBOARD_STATS.orders) },
                { label: "Customers", value: formatNumber(CUSTOMERS.length) },
                { label: "Staff", value: EMPLOYEES.length },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 rounded-xl bg-muted/30">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-bold text-sm mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
            <Button className="gap-2 shrink-0"><Printer className="h-4 w-4" />Print Summary</Button>
          </div>
        </CardContent>
      </Card>

      <StaggerChildren className="space-y-8">
        {REPORT_CATEGORIES.map((category) => (
          <StaggerItem key={category.title}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <category.icon className={`h-5 w-5 ${category.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-display font-bold">{category.title}</h3>
                  <p className="text-xs text-muted-foreground">{category.reports.length} reports available</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.reports.map((report) => (
                  <motion.div key={report.name} whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Link href={report.href}>
                      <Card className="glass-card h-full hover:shadow-lg hover:border-teal-500/30 transition-all cursor-pointer group">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-medium leading-snug group-hover:text-teal-400 transition-colors">{report.name}</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground group-hover:text-teal-500 transition-colors shrink-0" />
                          </div>
                          <CardDescription className="text-xs">{report.desc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-bold text-teal-500">{report.metric}</p>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={(e) => e.preventDefault()}>
                              <Download className="h-3 w-3 mr-1" />PDF
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs flex-1" onClick={(e) => e.preventDefault()}>
                              <Printer className="h-3 w-3 mr-1" />Print
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Branch Performance Snapshot</CardTitle>
          <CardDescription>Quick reference for all locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="pb-3 font-medium">Branch</th>
                  <th className="pb-3 font-medium">Sales</th>
                  <th className="pb-3 font-medium">Orders</th>
                  <th className="pb-3 font-medium">Inventory</th>
                  <th className="pb-3 font-medium">Staff</th>
                  <th className="pb-3 font-medium">Rating</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {BRANCH_PERFORMANCE.map((bp) => (
                  <tr key={bp.branch} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 font-medium">{bp.branch}</td>
                    <td className="py-3">{formatCurrency(bp.sales)}</td>
                    <td className="py-3">{bp.orders}</td>
                    <td className="py-3">{formatNumber(bp.inventory)}</td>
                    <td className="py-3">{bp.employees}</td>
                    <td className="py-3">{bp.satisfaction}/5</td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                        <Download className="h-3 w-3" />Report
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: ClipboardList, label: "Procurement Report", desc: "PO & vendor summary", href: "/admin/procurement" },
          { icon: Wrench, label: "Service Report", desc: "Ticket resolution metrics", href: "/admin/service" },
          { icon: Sparkles, label: "AI Analytics Report", desc: "ML insights & forecasts", href: "/admin/ai" },
        ].map((item) => (
          <Link key={item.label} href={item.href}>
            <Card className="glass-card hover:shadow-md hover:border-teal-500/30 transition-all cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <item.icon className="h-8 w-8 text-teal-500 shrink-0" />
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageTransition>
  );
}
