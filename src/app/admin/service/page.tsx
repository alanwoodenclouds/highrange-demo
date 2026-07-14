"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Wrench, Shield, Settings, Hammer, Clock, AlertCircle, User, Search,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PageTransition } from "@/components/shared/page-transition";
import { SERVICE_REQUESTS, EMPLOYEES } from "@/data";
import { formatDate, cn } from "@/lib/utils";
import type { ServiceRequest, ServiceStatus } from "@/types";

const TYPE_ICONS = { repair: Wrench, installation: Settings, warranty: Shield, amc: Hammer, maintenance: Settings };
const STATUS_VARIANT: Record<ServiceStatus, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  open: "secondary", assigned: "default", in_progress: "warning", awaiting_parts: "warning", completed: "success", cancelled: "destructive",
};
const PRIORITY_COLORS = { low: "text-slate-400", medium: "text-blue-400", high: "text-amber-400", urgent: "text-red-400" };

export default function ServicePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState<ServiceRequest | null>(null);

  const technicians = useMemo(() => EMPLOYEES.filter((e) => e.role === "technician"), []);

  const filtered = useMemo(() => SERVICE_REQUESTS.filter((sr) => {
    const matchSearch = !search || sr.customerName.toLowerCase().includes(search.toLowerCase()) || sr.ticketNumber.includes(search) || sr.productName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || sr.status === statusFilter;
    const matchType = typeFilter === "all" || sr.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  }), [search, statusFilter, typeFilter]);

  const typeStats = useMemo(() => {
    const types = ["repair", "installation", "warranty", "amc", "maintenance"] as const;
    return types.map((t) => ({ type: t.charAt(0).toUpperCase() + t.slice(1), count: SERVICE_REQUESTS.filter((sr) => sr.type === t).length }));
  }, []);

  const stats = {
    total: SERVICE_REQUESTS.length,
    open: SERVICE_REQUESTS.filter((sr) => sr.status === "open").length,
    inProgress: SERVICE_REQUESTS.filter((sr) => ["assigned", "in_progress", "awaiting_parts"].includes(sr.status)).length,
    completed: SERVICE_REQUESTS.filter((sr) => sr.status === "completed").length,
  };

  return (
    <PageTransition className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Service Center</h2>
        <p className="text-muted-foreground text-sm">Repairs, installations, warranty & AMC management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tickets", value: stats.total, icon: Wrench },
          { label: "Open", value: stats.open, icon: AlertCircle, warn: true },
          { label: "In Progress", value: stats.inProgress, icon: Clock },
          { label: "Completed", value: stats.completed, icon: Shield },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", s.warn ? "bg-amber-500/15" : "bg-teal-500/15")}>
                <s.icon className={cn("h-5 w-5", s.warn ? "text-amber-500" : "text-teal-500")} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search tickets..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ServiceStatus | "all")}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {(["open", "assigned", "in_progress", "awaiting_parts", "completed", "cancelled"] as ServiceStatus[]).map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {["repair", "installation", "warranty", "amc", "maintenance"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="pb-3 font-medium">Ticket</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Priority</th>
                  <th className="pb-3 font-medium">Technician</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 15).map((sr) => {
                  const Icon = TYPE_ICONS[sr.type];
                  return (
                    <motion.tr key={sr.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" whileHover={{ x: 2 }} onClick={() => setSelected(sr)}>
                      <td className="py-3 font-mono text-xs">{sr.ticketNumber}</td>
                      <td className="py-3">
                        <p>{sr.customerName}</p>
                        <p className="text-xs text-muted-foreground">{sr.customerPhone}</p>
                      </td>
                      <td className="py-3 text-muted-foreground truncate max-w-[150px]">{sr.productName}</td>
                      <td className="py-3"><Badge variant="outline" className="gap-1 text-[10px] capitalize"><Icon className="h-3 w-3" />{sr.type}</Badge></td>
                      <td className="py-3"><span className={cn("text-xs font-semibold capitalize", PRIORITY_COLORS[sr.priority])}>{sr.priority}</span></td>
                      <td className="py-3 text-xs">{sr.technicianName ?? "—"}</td>
                      <td className="py-3"><Badge variant={STATUS_VARIANT[sr.status]} className="capitalize text-[10px]">{sr.status.replace(/_/g, " ")}</Badge></td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Requests by Type</CardTitle></CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" />
                  <YAxis dataKey="type" type="category" width={80} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="count" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle>Available Technicians</CardTitle><CardDescription>{technicians.length} technicians across branches</CardDescription></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {technicians.slice(0, 8).map((tech) => (
              <div key={tech.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-teal-500/30 transition-colors">
                <div className="h-9 w-9 rounded-full bg-teal-500/15 flex items-center justify-center"><User className="h-4 w-4 text-teal-500" /></div>
                <div>
                  <p className="text-sm font-medium">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech.branch} · Score {tech.performanceScore}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.ticketNumber}</DialogTitle>
                <DialogDescription>{selected.type.charAt(0).toUpperCase() + selected.type.slice(1)} request · {selected.branch}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30"><p className="text-xs text-muted-foreground">Customer</p><p className="font-medium">{selected.customerName}</p></div>
                  <div className="p-3 rounded-lg bg-muted/30"><p className="text-xs text-muted-foreground">Product</p><p className="font-medium">{selected.productName}</p></div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30"><p className="text-xs text-muted-foreground">Issue</p><p>{selected.description}</p></div>
                <div className="flex gap-2">
                  <Badge variant={STATUS_VARIANT[selected.status]} className="capitalize">{selected.status.replace(/_/g, " ")}</Badge>
                  <Badge variant="outline" className={cn("capitalize", PRIORITY_COLORS[selected.priority])}>{selected.priority} priority</Badge>
                </div>
                {selected.scheduledDate && <p className="text-xs text-muted-foreground">Scheduled: {formatDate(selected.scheduledDate)}</p>}
                {selected.status === "open" && (
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Assign Technician" /></SelectTrigger>
                    <SelectContent>{technicians.map((t) => <SelectItem key={t.id} value={t.id}>{t.name} — {t.branch}</SelectItem>)}</SelectContent>
                  </Select>
                )}
                <Button className="w-full" onClick={() => setSelected(null)}>Update Ticket (Demo)</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
