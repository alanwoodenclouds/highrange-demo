"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search, Users, Crown, Gift, Mail, ChevronLeft, ChevronRight, ShoppingBag, MapPin,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTransition } from "@/components/shared/page-transition";
import { CUSTOMERS, ORDERS } from "@/data";
import { formatCurrency, formatDate, formatNumber, cn } from "@/lib/utils";
import type { Customer, MembershipTier } from "@/types";

const PAGE_SIZE = 12;
const TIER_COLORS: Record<MembershipTier, string> = {
  Bronze: "#cd7f32", Silver: "#94a3b8", Gold: "#f59e0b", Platinum: "#8b5cf6",
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [promoOpen, setPromoOpen] = useState(false);

  const segments = useMemo(() => [...new Set(CUSTOMERS.map((c) => c.segment))], []);

  const filtered = useMemo(() => CUSTOMERS.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search.toLowerCase()) || c.phone.includes(search);
    const matchTier = tierFilter === "all" || c.tier === tierFilter;
    const matchSegment = segmentFilter === "all" || c.segment === segmentFilter;
    return matchSearch && matchTier && matchSegment;
  }), [search, tierFilter, segmentFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tierData = useMemo(() => {
    const counts: Record<string, number> = {};
    CUSTOMERS.forEach((c) => { counts[c.tier] = (counts[c.tier] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, fill: TIER_COLORS[name as MembershipTier] }));
  }, []);

  const customerOrders = useMemo(() =>
    selected ? ORDERS.filter((o) => o.customerId === selected.id).slice(0, 8) : [],
  [selected]);

  const stats = {
    total: CUSTOMERS.length,
    vip: CUSTOMERS.filter((c) => c.segment === "VIP").length,
    avgSpent: Math.round(CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0) / CUSTOMERS.length),
    totalPoints: CUSTOMERS.reduce((s, c) => s + c.loyaltyPoints, 0),
  };

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Customer CRM</h2>
          <p className="text-muted-foreground text-sm">{formatNumber(CUSTOMERS.length)} registered customers</p>
        </div>
        <Button className="gap-2" onClick={() => setPromoOpen(true)}><Mail className="h-4 w-4" />Send Campaign</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: formatNumber(stats.total), icon: Users },
          { label: "VIP Members", value: stats.vip, icon: Crown },
          { label: "Avg. Lifetime Value", value: formatCurrency(stats.avgSpent), icon: ShoppingBag },
          { label: "Loyalty Points Issued", value: formatNumber(stats.totalPoints), icon: Gift },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-teal-500/15 flex items-center justify-center">
                <s.icon className="h-5 w-5 text-teal-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="glass-card lg:col-span-3">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search customers..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
              </div>
              <Select value={tierFilter} onValueChange={(v) => { setTierFilter(v); setPage(1); }}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Tier" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  {(["Bronze", "Silver", "Gold", "Platinum"] as MembershipTier[]).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={segmentFilter} onValueChange={(v) => { setSegmentFilter(v); setPage(1); }}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Segment" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Segments</SelectItem>
                  {segments.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Tier</th>
                  <th className="pb-3 font-medium">Segment</th>
                  <th className="pb-3 font-medium">Points</th>
                  <th className="pb-3 font-medium">Total Spent</th>
                  <th className="pb-3 font-medium">Orders</th>
                  <th className="pb-3 font-medium">Branch</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((customer) => (
                  <motion.tr
                    key={customer.id}
                    className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                    whileHover={{ x: 2 }}
                    onClick={() => setSelected(customer)}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 rounded-full overflow-hidden bg-muted shrink-0">
                          {customer.avatar && <Image src={customer.avatar} alt={customer.name} fill className="object-cover" sizes="36px" />}
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge style={{ backgroundColor: `${TIER_COLORS[customer.tier]}20`, color: TIER_COLORS[customer.tier] }} className="border-0">{customer.tier}</Badge>
                    </td>
                    <td className="py-3"><Badge variant="outline" className="text-[10px]">{customer.segment}</Badge></td>
                    <td className="py-3 font-medium">{formatNumber(customer.loyaltyPoints)}</td>
                    <td className="py-3">{formatCurrency(customer.totalSpent)}</td>
                    <td className="py-3">{customer.orderCount}</td>
                    <td className="py-3 text-muted-foreground text-xs">{customer.preferredBranch}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Tier Segmentation</CardTitle>
            <CardDescription>Membership distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={tierData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {tierData.map((d) => <Cell key={d.name} fill={d.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {tierData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span>{d.name}</span>
                  <span className="ml-auto font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted">
                    {selected.avatar && <Image src={selected.avatar} alt={selected.name} fill className="object-cover" sizes="56px" />}
                  </div>
                  <div>
                    <DialogTitle>{selected.name}</DialogTitle>
                    <DialogDescription>{selected.email} · {selected.phone}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <Tabs defaultValue="overview">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/30"><p className="text-xs text-muted-foreground">Tier</p><p className="font-bold" style={{ color: TIER_COLORS[selected.tier] }}>{selected.tier}</p></div>
                    <div className="p-3 rounded-lg bg-muted/30"><p className="text-xs text-muted-foreground">Loyalty Points</p><p className="font-bold">{formatNumber(selected.loyaltyPoints)}</p></div>
                    <div className="p-3 rounded-lg bg-muted/30"><p className="text-xs text-muted-foreground">Total Spent</p><p className="font-bold">{formatCurrency(selected.totalSpent)}</p></div>
                    <div className="p-3 rounded-lg bg-muted/30"><p className="text-xs text-muted-foreground">Orders</p><p className="font-bold">{selected.orderCount}</p></div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />Preferred: {selected.preferredBranch} · Joined {formatDate(selected.joinedAt)}
                  </div>
                </TabsContent>
                <TabsContent value="orders" className="space-y-2 max-h-60 overflow-y-auto">
                  {customerOrders.length ? customerOrders.map((o) => (
                    <div key={o.id} className="flex justify-between p-2.5 rounded-lg border border-border/50 text-sm">
                      <div>
                        <p className="font-mono text-xs">{o.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(o.total)}</p>
                        <Badge variant="outline" className="text-[10px] capitalize">{o.status.replace(/_/g, " ")}</Badge>
                      </div>
                    </div>
                  )) : <p className="text-center text-muted-foreground py-4 text-sm">No orders yet</p>}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={promoOpen} onOpenChange={setPromoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promotional Campaign</DialogTitle>
            <DialogDescription>Send targeted offers to customer segments</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Campaign name" defaultValue="Summer Cool Sale 2026" />
            <Select defaultValue="Gold">
              <SelectTrigger><SelectValue placeholder="Target Tier" /></SelectTrigger>
              <SelectContent>
                {(["Bronze", "Silver", "Gold", "Platinum"] as MembershipTier[]).map((t) => <SelectItem key={t} value={t}>{t} Members</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Discount code" defaultValue="HIGHRANGE10" />
            <textarea className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px]" placeholder="Message body..." defaultValue="Dear valued customer, enjoy 10% off on all ACs and refrigerators this summer!" />
            <Button className="w-full" onClick={() => setPromoOpen(false)}>Send Campaign (Demo)</Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
