"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, Package, Truck, Users, IndianRupee, ShoppingBag,
  AlertTriangle, Star, UserCheck,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTransition, StaggerChildren, StaggerItem } from "@/components/shared/page-transition";
import {
  DASHBOARD_STATS, ORDERS, PRODUCTS, EMPLOYEES, BRANCH_PERFORMANCE,
} from "@/data";
import { formatCurrency, formatNumber, formatDate, formatPercent, cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "#a3a3a3",
  confirmed: "#525252",
  processing: "#737373",
  shipped: "#f07178",
  out_for_delivery: "#e31e24",
  delivered: "#16a34a",
  cancelled: "#b91c1c",
  returned: "#1a1a1a",
};

function StatCard({
  title, value, change, icon: Icon, accent,
}: {
  title: string;
  value: string;
  change?: number;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <Card className="glass-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1 font-display">{value}</p>
            {change !== undefined && (
              <p className={cn("text-xs mt-1 font-medium", change >= 0 ? "text-emerald-500" : "text-red-500")}>
                {formatPercent(change)} vs last month
              </p>
            )}
          </div>
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", accent)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const stats = DASHBOARD_STATS;

  const salesTrend = useMemo(() => {
    const base = stats.revenue / 12;
    return MONTHS.map((month, i) => ({
      month,
      revenue: Math.round(base * (0.7 + (i / 12) * 0.6 + Math.sin(i * 0.8) * 0.15)),
      orders: Math.round(stats.orders / 12 * (0.8 + Math.cos(i * 0.5) * 0.2)),
    }));
  }, [stats]);

  const ordersByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    ORDERS.forEach((o) => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return Object.entries(counts).map(([status, count]) => ({
      name: status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: count,
      fill: STATUS_COLORS[status as OrderStatus] || "#94a3b8",
    }));
  }, []);

  const recentOrders = useMemo(
    () => [...ORDERS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
    []
  );

  const lowStock = useMemo(
    () => PRODUCTS.filter((p) => p.stock < 15).sort((a, b) => a.stock - b.stock).slice(0, 6),
    []
  );

  const attendance = useMemo(() => {
    const counts = { present: 0, late: 0, absent: 0, half_day: 0 };
    EMPLOYEES.forEach((e) => { counts[e.attendanceToday]++; });
    return counts;
  }, []);

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold lg:hidden">Executive Dashboard</h2>
          <p className="text-muted-foreground text-sm">Real-time overview across all 6 Idukki branches</p>
        </div>
        <Badge variant="success" className="w-fit">Live · Updated just now</Badge>
      </div>

      <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StaggerItem><StatCard title="Total Sales" value={formatNumber(stats.totalSales)} change={stats.salesChange} icon={ShoppingBag} accent="bg-red-500/15 text-red-500" /></StaggerItem>
        <StaggerItem><StatCard title="Revenue" value={formatCurrency(stats.revenue)} change={stats.revenueChange} icon={IndianRupee} accent="bg-emerald-500/15 text-emerald-500" /></StaggerItem>
        <StaggerItem><StatCard title="Orders" value={formatNumber(stats.orders)} change={stats.ordersChange} icon={Package} accent="bg-blue-500/15 text-blue-500" /></StaggerItem>
        <StaggerItem><StatCard title="Deliveries" value={formatNumber(stats.deliveries)} icon={Truck} accent="bg-red-500/15 text-red-500" /></StaggerItem>
        <StaggerItem><StatCard title="Inventory Value" value={formatCurrency(stats.inventoryValue)} icon={Package} accent="bg-amber-500/15 text-amber-500" /></StaggerItem>
        <StaggerItem><StatCard title="Pending Deliveries" value={formatNumber(stats.pendingDeliveries)} icon={Truck} accent="bg-orange-500/15 text-orange-500" /></StaggerItem>
        <StaggerItem><StatCard title="Attendance" value={`${stats.attendanceRate}%`} icon={UserCheck} accent="bg-cyan-500/15 text-cyan-500" /></StaggerItem>
        <StaggerItem><StatCard title="Satisfaction" value={`${stats.customerSatisfaction}/5`} icon={Star} accent="bg-yellow-500/15 text-yellow-500" /></StaggerItem>
      </StaggerChildren>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-red-500" />Sales Trend</CardTitle>
            <CardDescription>Monthly revenue & order volume — FY 2025-26</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrend}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
                    formatter={(value, name) => [name === "revenue" ? formatCurrency(Number(value)) : value, name === "revenue" ? "Revenue" : "Orders"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Distribution of {ORDERS.length} orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ordersByStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {ordersByStatus.map((entry, i) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Branch Performance</CardTitle>
          <CardDescription>Sales comparison across Kerala branches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BRANCH_PERFORMANCE} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="branch" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v) => formatCurrency(Number(v))} />
                <Bar dataKey="sales" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Sales" />
                <Bar dataKey="orders" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest transactions across branches</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Branch</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <motion.tr
                    key={order.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    whileHover={{ x: 2 }}
                  >
                    <td className="py-3 font-mono text-xs">{order.orderNumber}</td>
                    <td className="py-3">{order.customerName}</td>
                    <td className="py-3 text-muted-foreground">{order.branch}</td>
                    <td className="py-3 font-medium">{formatCurrency(order.total)}</td>
                    <td className="py-3">
                      <Badge variant={order.status === "delivered" ? "success" : order.status === "cancelled" ? "destructive" : "secondary"} className="capitalize text-[10px]">
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">{formatDate(order.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-amber-500" />Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sku}</p>
                  </div>
                  <Badge variant="warning">{p.stock} left</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-red-500" />Attendance Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Present", count: attendance.present, color: "bg-emerald-500" },
                { label: "Late", count: attendance.late, color: "bg-amber-500" },
                { label: "Half Day", count: attendance.half_day, color: "bg-blue-500" },
                { label: "Absent", count: attendance.absent, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full", item.color)}
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / EMPLOYEES.length) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
