"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, IndianRupee, Receipt, PieChart as PieIcon, BarChart3, Wallet,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTransition } from "@/components/shared/page-transition";
import { DASHBOARD_STATS, BRANCH_PERFORMANCE, ORDERS } from "@/data";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const EXPENSE_CATEGORIES = [
  { name: "Inventory Purchase", value: 42, fill: "var(--chart-1)" },
  { name: "Salaries", value: 28, fill: "var(--chart-2)" },
  { name: "Rent & Utilities", value: 12, fill: "var(--chart-3)" },
  { name: "Marketing", value: 8, fill: "var(--chart-4)" },
  { name: "Logistics", value: 6, fill: "var(--chart-5)" },
  { name: "Other", value: 4, fill: "#94a3b8" },
];

export default function FinancePage() {
  const stats = DASHBOARD_STATS;
  const revenue = stats.revenue;
  const expenses = Math.round(revenue * 0.72);
  const profit = revenue - expenses;
  const gstCollected = ORDERS.reduce((s, o) => s + o.tax, 0);

  const monthlyData = useMemo(() => {
    const baseRev = revenue / 12;
    const baseExp = expenses / 12;
    return MONTHS.map((month, i) => ({
      month,
      revenue: Math.round(baseRev * (0.75 + (i / 12) * 0.5)),
      expenses: Math.round(baseExp * (0.8 + Math.sin(i) * 0.15)),
      profit: 0,
    })).map((d) => ({ ...d, profit: d.revenue - d.expenses }));
  }, [revenue, expenses]);

  const cashFlow = useMemo(() =>
    MONTHS.slice(0, 6).map((month, i) => ({
      month,
      inflow: Math.round(revenue / 6 * (0.8 + i * 0.05)),
      outflow: Math.round(expenses / 6 * (0.85 + i * 0.03)),
    })),
  []);

  return (
    <PageTransition className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Finance & Accounts</h2>
        <p className="text-muted-foreground text-sm">Revenue analytics, GST, P&L & cash flow</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(revenue), change: stats.revenueChange, icon: TrendingUp, up: true },
          { label: "Total Expenses", value: formatCurrency(expenses), change: 5.2, icon: TrendingDown, up: false },
          { label: "Net Profit", value: formatCurrency(profit), change: 22.8, icon: IndianRupee, up: true },
          { label: "GST Collected", value: formatCurrency(gstCollected), icon: Receipt },
        ].map((s) => (
          <Card key={s.label} className="glass-card hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <s.icon className="h-4 w-4 text-teal-500 mb-2" />
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold mt-0.5">{s.value}</p>
              {s.change !== undefined && (
                <p className={`text-xs mt-1 font-medium ${s.up ? "text-emerald-500" : "text-red-500"}`}>{formatPercent(s.change)} vs last month</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue" className="gap-1"><BarChart3 className="h-3.5 w-3.5" />Revenue</TabsTrigger>
          <TabsTrigger value="expenses" className="gap-1"><PieIcon className="h-3.5 w-3.5" />Expenses</TabsTrigger>
          <TabsTrigger value="pnl" className="gap-1"><TrendingUp className="h-3.5 w-3.5" />P&L</TabsTrigger>
          <TabsTrigger value="gst" className="gap-1"><Receipt className="h-3.5 w-3.5" />GST</TabsTrigger>
          <TabsTrigger value="cashflow" className="gap-1"><Wallet className="h-3.5 w-3.5" />Cash Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader><CardTitle>Revenue Trend</CardTitle><CardDescription>Monthly revenue — FY 2025-26</CardDescription></CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="finRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
                      <YAxis stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                      <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v) => formatCurrency(Number(v))} />
                      <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" fill="url(#finRev)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader><CardTitle>Branch Profitability</CardTitle><CardDescription>Sales by branch</CardDescription></CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={BRANCH_PERFORMANCE}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="branch" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                      <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v) => formatCurrency(Number(v))} />
                      <Bar dataKey="sales" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader><CardTitle>Expense Breakdown</CardTitle><CardDescription>Operating cost distribution</CardDescription></CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={EXPENSE_CATEGORIES} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" paddingAngle={3} label={({ name, value }) => `${name} ${value}%`}>
                        {EXPENSE_CATEGORIES.map((d) => <Cell key={d.name} fill={d.fill} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader><CardTitle>Expense Details</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.fill }} />
                      <span className="text-sm">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatCurrency(Math.round(expenses * cat.value / 100))}</p>
                      <p className="text-xs text-muted-foreground">{cat.value}%</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pnl">
          <Card className="glass-card">
            <CardHeader><CardTitle>Profit & Loss Statement</CardTitle><CardDescription>Monthly P&L — FY 2025-26</CardDescription></CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v) => formatCurrency(Number(v))} />
                    <Legend />
                    <Bar dataKey="revenue" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Revenue" />
                    <Bar dataKey="expenses" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Expenses" />
                    <Bar dataKey="profit" fill="var(--chart-5)" radius={[4, 4, 0, 0]} name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 p-4 rounded-xl bg-muted/30">
                <div className="text-center"><p className="text-xs text-muted-foreground">YTD Revenue</p><p className="text-lg font-bold text-teal-500">{formatCurrency(revenue)}</p></div>
                <div className="text-center"><p className="text-xs text-muted-foreground">YTD Expenses</p><p className="text-lg font-bold text-orange-500">{formatCurrency(expenses)}</p></div>
                <div className="text-center"><p className="text-xs text-muted-foreground">YTD Profit</p><p className="text-lg font-bold text-emerald-500">{formatCurrency(profit)}</p></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gst">
          <Card className="glass-card">
            <CardHeader><CardTitle>GST Reports</CardTitle><CardDescription>Tax collection summary — GSTIN: 32AABCH1234F1Z5</CardDescription></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "CGST (9%)", value: formatCurrency(gstCollected / 2) },
                  { label: "SGST (9%)", value: formatCurrency(gstCollected / 2) },
                  { label: "Total GST", value: formatCurrency(gstCollected) },
                ].map((g) => (
                  <div key={g.label} className="p-4 rounded-xl border border-border/50 text-center">
                    <p className="text-xs text-muted-foreground">{g.label}</p>
                    <p className="text-xl font-bold mt-1">{g.value}</p>
                  </div>
                ))}
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="pb-3 font-medium">Month</th>
                    <th className="pb-3 font-medium">Taxable Value</th>
                    <th className="pb-3 font-medium">CGST</th>
                    <th className="pb-3 font-medium">SGST</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHS.slice(0, 6).map((month, i) => {
                    const taxable = Math.round(revenue / 12 * (0.8 + i * 0.04));
                    const tax = Math.round(taxable * 0.18);
                    return (
                      <tr key={month} className="border-b border-border/50">
                        <td className="py-3">{month} 2026</td>
                        <td className="py-3">{formatCurrency(taxable)}</td>
                        <td className="py-3">{formatCurrency(tax / 2)}</td>
                        <td className="py-3">{formatCurrency(tax / 2)}</td>
                        <td className="py-3 font-medium">{formatCurrency(tax)}</td>
                        <td className="py-3"><Badge variant="success" className="text-[10px]">Filed</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow">
          <Card className="glass-card">
            <CardHeader><CardTitle>Cash Flow Analysis</CardTitle><CardDescription>Inflows vs outflows — H1 2026</CardDescription></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashFlow}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v) => formatCurrency(Number(v))} />
                    <Legend />
                    <Line type="monotone" dataKey="inflow" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 4 }} name="Inflow" />
                    <Line type="monotone" dataKey="outflow" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 4 }} name="Outflow" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 flex justify-between">
                <span className="font-medium">Net Cash Position</span>
                <span className="font-bold text-teal-500">{formatCurrency(cashFlow.reduce((s, c) => s + c.inflow - c.outflow, 0))}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}
