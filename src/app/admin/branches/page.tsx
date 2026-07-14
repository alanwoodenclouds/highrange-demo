"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Building2, MapPin, Users, Package, Star, TrendingUp, IndianRupee,
} from "lucide-react";
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTransition, StaggerChildren, StaggerItem } from "@/components/shared/page-transition";
import { BRANCH_PERFORMANCE } from "@/data";
import { BRANCH_COORDS } from "@/data/constants";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function BranchesPage() {
  const radarData = useMemo(() =>
    BRANCH_PERFORMANCE.map((bp) => ({
      branch: bp.branch.slice(0, 6),
      sales: Math.round(bp.sales / 100000),
      orders: bp.orders,
      inventory: Math.round(bp.inventory / 10),
      employees: bp.employees * 10,
      satisfaction: bp.satisfaction * 20,
    })),
  []);

  const topBranch = useMemo(() =>
    [...BRANCH_PERFORMANCE].sort((a, b) => b.sales - a.sales)[0],
  []);

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Branch Network</h2>
          <p className="text-muted-foreground text-sm">6 locations across Idukki district, Kerala</p>
        </div>
        <Badge variant="success" className="w-fit gap-1"><TrendingUp className="h-3 w-3" />Top: {topBranch.branch} — {formatCurrency(topBranch.sales)}</Badge>
      </div>

      <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {BRANCH_PERFORMANCE.map((bp, i) => {
          const coords = BRANCH_COORDS[bp.branch];
          return (
            <StaggerItem key={bp.branch}>
              <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="glass-card overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-2 bg-gradient-to-r from-teal-500 to-teal-700" style={{ opacity: 0.4 + (i * 0.1) }} />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-teal-500/15 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-teal-500" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{bp.branch}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs"><MapPin className="h-3 w-3" />{coords.address}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-sm">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        {bp.satisfaction}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><IndianRupee className="h-3 w-3" />Sales</div>
                        <p className="text-lg font-bold text-teal-500">{formatCurrency(bp.sales)}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Package className="h-3 w-3" />Orders</div>
                        <p className="text-lg font-bold">{formatNumber(bp.orders)}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Package className="h-3 w-3" />Inventory</div>
                        <p className="text-lg font-bold">{formatNumber(bp.inventory)}</p>
                        <p className="text-[10px] text-muted-foreground">units</p>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Users className="h-3 w-3" />Staff</div>
                        <p className="text-lg font-bold">{bp.employees}</p>
                        <p className="text-[10px] text-muted-foreground">employees</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          );
        })}
      </StaggerChildren>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Sales Comparison</CardTitle>
            <CardDescription>Revenue across all branches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BRANCH_PERFORMANCE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="branch" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v) => formatCurrency(Number(v))} />
                  <Bar dataKey="sales" fill="var(--chart-1)" radius={[6, 6, 0, 0]} name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Multi-Metric Comparison</CardTitle>
            <CardDescription>Radar view of branch performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="branch" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <Radar name="Kattappana" dataKey="sales" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.2} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle>Inventory Distribution</CardTitle><CardDescription>Stock levels by branch</CardDescription></CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BRANCH_PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="branch" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="inventory" fill="var(--chart-3)" radius={[4, 4, 0, 0]} name="Units" />
                <Bar dataKey="employees" fill="var(--chart-4)" radius={[4, 4, 0, 0]} name="Staff" />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
