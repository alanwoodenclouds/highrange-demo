"use client";

import { useState, useMemo } from "react";
import { SafeImage } from "@/components/shared/safe-image";
import { motion } from "framer-motion";
import {
  Truck, MapPin, Clock, Navigation, CheckCircle2, Package, Route,
  Phone, Star, Shield,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PageTransition } from "@/components/shared/page-transition";
import { DELIVERIES, DELIVERY_AGENTS, ORDERS } from "@/data";
import { BRANCH_COORDS } from "@/data/constants";
import { formatDate, cn } from "@/lib/utils";
import type { Branch, Delivery, DeliveryStatus } from "@/types";

const STATUS_VARIANT: Record<DeliveryStatus, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  assigned: "secondary",
  picked_up: "default",
  in_transit: "default",
  out_for_delivery: "warning",
  delivered: "success",
  failed: "destructive",
  returned: "destructive",
};

function KeralaMap({ agents, selectedBranch }: { agents: typeof DELIVERY_AGENTS; selectedBranch: Branch | "all" }) {
  const branches = Object.entries(BRANCH_COORDS);
  const minLat = 9.5, maxLat = 10.15, minLng = 76.65, maxLng = 77.2;

  const toXY = (lat: number, lng: number) => ({
    x: ((lng - minLng) / (maxLng - minLng)) * 100,
    y: ((maxLat - lat) / (maxLat - minLat)) * 100,
  });

  const filteredAgents = selectedBranch === "all" ? agents : agents.filter((a) => a.branch === selectedBranch);

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-950/80 via-slate-900 to-slate-950 border border-red-500/20">
      <svg viewBox="0 0 100 75" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="100" height="75" fill="url(#mapGlow)" />
        <path d="M15,20 Q30,10 45,15 T70,12 Q85,18 90,30 T85,50 Q75,65 55,68 T25,62 Q10,50 12,35 Z" fill="none" stroke="#14b8a6" strokeWidth="0.3" strokeOpacity="0.4" strokeDasharray="2,1" />
        <path d="M20,25 Q35,22 50,28 T75,25" fill="none" stroke="#2dd4bf" strokeWidth="0.15" strokeOpacity="0.3" />
        <path d="M18,45 Q40,42 60,48 T82,44" fill="none" stroke="#2dd4bf" strokeWidth="0.15" strokeOpacity="0.3" />
        <text x="50" y="6" textAnchor="middle" fill="#f87171" fontSize="3" opacity="0.6">IDUKKI DISTRICT · KERALA</text>
        {branches.map(([name, coords]) => {
          const { x, y } = toXY(coords.lat, coords.lng);
          return (
            <g key={name}>
              <circle cx={x} cy={y} r="3" fill="#14b8a6" opacity="0.2" />
              <circle cx={x} cy={y} r="1.2" fill="#2dd4bf" filter="url(#glow)" />
              <text x={x} y={y + 4} textAnchor="middle" fill="#94a3b8" fontSize="2.2">{name}</text>
            </g>
          );
        })}
        {filteredAgents.filter((a) => a.currentLocation && a.status === "on_delivery").map((agent) => {
          const { x, y } = toXY(agent.currentLocation!.lat, agent.currentLocation!.lng);
          return (
            <motion.g key={agent.id} initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <circle cx={x} cy={y} r="1.8" fill="#f59e0b" opacity="0.6">
                <animate attributeName="r" values="1.8;2.5;1.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y} r="0.8" fill="#fbbf24" />
            </motion.g>
          );
        })}
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-3 text-[10px] text-neutral-400">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400" />Branch</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />Agent en route</span>
      </div>
    </div>
  );
}

export default function DeliveriesPage() {
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | "all">("all");
  const [selected, setSelected] = useState<Delivery | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [branchFilter, setBranchFilter] = useState<Branch | "all">("all");

  const filtered = useMemo(() =>
    DELIVERIES.filter((d) => {
      const matchStatus = statusFilter === "all" || d.status === statusFilter;
      const matchBranch = branchFilter === "all" || d.branch === branchFilter;
      return matchStatus && matchBranch;
    }),
  [statusFilter, branchFilter]);

  const stats = useMemo(() => ({
    total: DELIVERIES.length,
    active: DELIVERIES.filter((d) => !["delivered", "failed"].includes(d.status)).length,
    delivered: DELIVERIES.filter((d) => d.status === "delivered").length,
    avgDistance: (DELIVERIES.reduce((s, d) => s + d.distance, 0) / DELIVERIES.length).toFixed(1),
  }), []);

  const agentPerformance = useMemo(() =>
    DELIVERY_AGENTS.slice(0, 8).map((a) => ({
      name: a.name.split(" ")[0],
      deliveries: a.deliveriesToday,
      rating: a.rating,
    })),
  []);

  const verifyOtp = () => {
    if (selected && otpInput === selected.otp) setOtpVerified(true);
  };

  return (
    <PageTransition className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Delivery Logistics</h2>
        <p className="text-muted-foreground text-sm">Real-time tracking across Idukki district</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Deliveries", value: stats.total, icon: Package },
          { label: "Active Now", value: stats.active, icon: Truck, accent: true },
          { label: "Delivered Today", value: stats.delivered, icon: CheckCircle2 },
          { label: "Avg. Distance", value: `${stats.avgDistance} km`, icon: Route },
        ].map((s) => (
          <Card key={s.label} className="glass-card hover:shadow-md transition-all">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", s.accent ? "bg-amber-500/15" : "bg-red-500/15")}>
                <s.icon className={cn("h-5 w-5", s.accent ? "text-amber-500" : "text-red-500")} />
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
            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-red-500" />Live Delivery Map</CardTitle>
            <CardDescription>Branch locations & active delivery agents in Idukki</CardDescription>
          </CardHeader>
          <CardContent>
            <KeralaMap agents={DELIVERY_AGENTS} selectedBranch={branchFilter} />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Agent Tracking</CardTitle>
            <CardDescription>{DELIVERY_AGENTS.filter((a) => a.status === "on_delivery").length} agents on delivery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {DELIVERY_AGENTS.filter((a) => a.status !== "off_duty").slice(0, 6).map((agent) => (
              <motion.div key={agent.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-border/50 hover:border-red-500/30 transition-colors" whileHover={{ x: 2 }}>
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted shrink-0">
                  {agent.avatar && <SafeImage src={agent.avatar} alt={agent.name} fill className="object-cover" sizes="40px" />}
                  <span className={cn("absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card", agent.status === "on_delivery" ? "bg-amber-500" : agent.status === "available" ? "bg-emerald-500" : "bg-slate-500")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{agent.name}</p>
                  <p className="text-[10px] text-muted-foreground">{agent.vehicleType} · {agent.branch}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-0.5 text-xs"><Star className="h-3 w-3 text-amber-400 fill-amber-400" />{agent.rating}</div>
                  <p className="text-[10px] text-muted-foreground">{agent.deliveriesToday} today</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Delivery List</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="routes">Route Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                {(["all", "assigned", "in_transit", "out_for_delivery", "delivered", "failed"] as const).map((s) => (
                  <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" className="text-xs capitalize" onClick={() => setStatusFilter(s)}>
                    {s === "all" ? "All" : s.replace(/_/g, " ")}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="pb-3 font-medium">Order</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Agent</th>
                    <th className="pb-3 font-medium">Branch</th>
                    <th className="pb-3 font-medium">Distance</th>
                    <th className="pb-3 font-medium">ETA</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 15).map((delivery) => (
                    <motion.tr key={delivery.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" whileHover={{ x: 2 }} onClick={() => { setSelected(delivery); setOtpInput(""); setOtpVerified(false); }}>
                      <td className="py-3 font-mono text-xs">{delivery.orderNumber}</td>
                      <td className="py-3">
                        <p>{delivery.customerName}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{delivery.address}</p>
                      </td>
                      <td className="py-3">{delivery.agentName}</td>
                      <td className="py-3 text-muted-foreground">{delivery.branch}</td>
                      <td className="py-3">{delivery.distance} km</td>
                      <td className="py-3"><span className="flex items-center gap-1 text-xs"><Clock className="h-3 w-3" />{delivery.estimatedTime}</span></td>
                      <td className="py-3"><Badge variant={STATUS_VARIANT[delivery.status]} className="capitalize text-[10px]">{delivery.status.replace(/_/g, " ")}</Badge></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="glass-card">
            <CardHeader><CardTitle>Agent Performance</CardTitle><CardDescription>Deliveries completed today by agent</CardDescription></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    <Bar dataKey="deliveries" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Deliveries" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { route: "Kattappana → Nedumkandam", distance: "18 km", time: "35 mins", deliveries: 4 },
              { route: "Thodupuzha → Adimali", distance: "42 km", time: "1.2 hrs", deliveries: 3 },
              { route: "Munnar → Kumily", distance: "65 km", time: "1.8 hrs", deliveries: 2 },
            ].map((r) => (
              <Card key={r.route} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2"><Navigation className="h-4 w-4 text-red-500" /><p className="font-medium text-sm">{r.route}</p></div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-muted/30"><p className="text-muted-foreground">Distance</p><p className="font-bold">{r.distance}</p></div>
                    <div className="p-2 rounded-lg bg-muted/30"><p className="text-muted-foreground">Time</p><p className="font-bold">{r.time}</p></div>
                    <div className="p-2 rounded-lg bg-muted/30"><p className="text-muted-foreground">Stops</p><p className="font-bold">{r.deliveries}</p></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Delivery #{selected.orderNumber}</DialogTitle>
                <DialogDescription>{selected.customerName} · {selected.branch}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <Phone className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">{selected.customerPhone}</p>
                    <p className="text-xs text-muted-foreground">{selected.address}, {selected.pincode}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Delivery Timeline</p>
                  <div className="space-y-3 pl-3 border-l-2 border-red-500/30">
                    {selected.timeline.map((step, i) => (
                      <div key={i} className="relative pl-4">
                        <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-red-500" />
                        <p className="text-sm font-medium">{step.status}</p>
                        <p className="text-xs text-muted-foreground">{step.note} · {formatDate(step.time)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selected.status === "out_for_delivery" && (
                  <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                    <div className="flex items-center gap-2 mb-3"><Shield className="h-4 w-4 text-red-500" /><p className="text-sm font-medium">OTP Confirmation</p></div>
                    {otpVerified ? (
                      <div className="flex items-center gap-2 text-emerald-500 text-sm"><CheckCircle2 className="h-4 w-4" />OTP Verified — Delivery confirmed</div>
                    ) : (
                      <div className="flex gap-2">
                        <Input placeholder="Enter 4-digit OTP" maxLength={4} value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="font-mono tracking-widest" />
                        <Button onClick={verifyOtp}>Verify</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
