"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList, Truck, Star, IndianRupee, Clock, CheckCircle2, AlertCircle,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTransition } from "@/components/shared/page-transition";
import { SUPPLIERS, PURCHASE_ORDERS } from "@/data";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";

export default function ProcurementPage() {
  const stats = useMemo(() => ({
    vendors: SUPPLIERS.filter((s) => s.status === "active").length,
    totalPOs: PURCHASE_ORDERS.length,
    pendingPOs: PURCHASE_ORDERS.filter((po) => ["draft", "sent", "confirmed"].includes(po.status)).length,
    totalSpend: PURCHASE_ORDERS.filter((po) => po.status !== "cancelled").reduce((s, po) => s + po.total, 0),
    outstanding: SUPPLIERS.reduce((s, sup) => s + sup.outstanding, 0),
  }), []);

  const vendorPerformance = useMemo(() =>
    SUPPLIERS.slice(0, 8).map((s) => ({
      name: s.name.split(" ")[0],
      orders: s.totalOrders,
      rating: s.rating,
      outstanding: s.outstanding,
    })),
  []);

  return (
    <PageTransition className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Procurement</h2>
        <p className="text-muted-foreground text-sm">Vendor management, purchase orders & payments</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Active Vendors", value: stats.vendors, icon: Truck },
          { label: "Total POs", value: stats.totalPOs, icon: ClipboardList },
          { label: "Pending POs", value: stats.pendingPOs, icon: Clock },
          { label: "Total Spend", value: formatCurrency(stats.totalSpend), icon: IndianRupee },
          { label: "Outstanding", value: formatCurrency(stats.outstanding), icon: AlertCircle },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4">
              <s.icon className="h-4 w-4 text-teal-500 mb-2" />
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold mt-0.5">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="vendors">
        <TabsList>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors">
          <div className="grid md:grid-cols-2 gap-4">
            {SUPPLIERS.map((supplier) => (
              <motion.div key={supplier.id} whileHover={{ y: -2 }}>
                <Card className="glass-card hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-xs text-muted-foreground">{supplier.contactPerson}</p>
                      </div>
                      <Badge variant={supplier.status === "active" ? "success" : "secondary"}>{supplier.status}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {supplier.categories.slice(0, 3).map((c) => <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>)}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-center gap-0.5"><Star className="h-3 w-3 text-amber-400 fill-amber-400" />{supplier.rating}</div>
                        <p className="text-muted-foreground mt-0.5">Rating</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/30">
                        <p className="font-bold">{supplier.totalOrders}</p>
                        <p className="text-muted-foreground">Orders</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/30">
                        <p className="font-bold">{formatCurrency(supplier.outstanding)}</p>
                        <p className="text-muted-foreground">Due</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Terms: {supplier.paymentTerms}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="glass-card">
            <CardHeader><CardTitle>Purchase Orders</CardTitle><CardDescription>All procurement orders</CardDescription></CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="pb-3 font-medium">PO Number</th>
                    <th className="pb-3 font-medium">Supplier</th>
                    <th className="pb-3 font-medium">Branch</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Expected</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PURCHASE_ORDERS.map((po) => (
                    <tr key={po.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 font-mono text-xs">{po.poNumber}</td>
                      <td className="py-3">{po.supplierName}</td>
                      <td className="py-3 text-muted-foreground">{po.branch}</td>
                      <td className="py-3">{po.items.length} items</td>
                      <td className="py-3 font-medium">{formatCurrency(po.total)}</td>
                      <td className="py-3 text-xs text-muted-foreground">{formatDate(po.expectedDate)}</td>
                      <td className="py-3">
                        <Badge variant={po.status === "received" ? "success" : po.status === "cancelled" ? "destructive" : "secondary"} className="capitalize">{po.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="glass-card">
            <CardHeader><CardTitle>Vendor Performance</CardTitle><CardDescription>Order volume by supplier</CardDescription></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vendorPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    <Bar dataKey="orders" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="glass-card">
            <CardHeader><CardTitle>Payment Schedule</CardTitle><CardDescription>Outstanding vendor payments</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {SUPPLIERS.filter((s) => s.outstanding > 0).map((supplier) => (
                <div key={supplier.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                  <div>
                    <p className="font-medium text-sm">{supplier.name}</p>
                    <p className="text-xs text-muted-foreground">{supplier.paymentTerms} · {supplier.totalOrders} orders fulfilled</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <p className="font-bold text-amber-500">{formatCurrency(supplier.outstanding)}</p>
                    <Button size="sm" variant="outline" className="h-7 text-xs">Pay (Demo)</Button>
                  </div>
                </div>
              ))}
              <div className="p-4 rounded-xl bg-muted/30 flex justify-between items-center mt-4">
                <span className="font-medium flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Total Outstanding</span>
                <span className="text-xl font-bold">{formatCurrency(stats.outstanding)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}
