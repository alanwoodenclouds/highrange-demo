"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Warehouse, AlertTriangle, ArrowRightLeft, Package, Trash2, RotateCcw, ClipboardList,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { PageTransition } from "@/components/shared/page-transition";
import { PRODUCTS, PURCHASE_ORDERS, BRANCH_PERFORMANCE } from "@/data";
import { BRANCHES } from "@/data/constants";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";
import type { Branch } from "@/types";

export default function InventoryPage() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | "all">("all");
  const [transferOpen, setTransferOpen] = useState(false);

  const lowStock = useMemo(() => PRODUCTS.filter((p) => p.stock < 15).sort((a, b) => a.stock - b.stock), []);
  const branchStock = useMemo(() =>
    BRANCHES.map((branch) => ({
      branch,
      stock: PRODUCTS.reduce((s, p) => s + (p.branchStock[branch] || 0), 0),
      value: PRODUCTS.reduce((s, p) => s + (p.branchStock[branch] || 0) * p.price, 0),
    })),
  []);

  const warehouseProducts = useMemo(() => {
    const items = PRODUCTS.filter((p) => selectedBranch === "all" || (p.branchStock[selectedBranch] || 0) > 0);
    return items.slice(0, 20);
  }, [selectedBranch]);

  const damagedItems = useMemo(() =>
    PRODUCTS.filter((_, i) => i % 17 === 0).slice(0, 8).map((p) => ({
      ...p,
      damagedQty: Math.max(1, Math.floor(p.stock * 0.02)),
      reason: ["Transit damage", "Display unit", "Customer return", "Manufacturing defect"][p.id.charCodeAt(5) % 4],
    })),
  []);

  const returnItems = useMemo(
    () =>
      PRODUCTS.filter((_, i) => i % 23 === 0).slice(0, 6).map((p) => ({
        ...p,
        returnQty: 1,
        condition: ["Resellable", "Refurbish", "Scrap"][p.id.charCodeAt(7) % 3],
      })),
    []
  );

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Inventory Control</h2>
          <p className="text-muted-foreground text-sm">Multi-branch stock management across Idukki</p>
        </div>
        <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><ArrowRightLeft className="h-4 w-4" />Stock Transfer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inter-Branch Stock Transfer</DialogTitle>
              <DialogDescription>Simulated transfer between warehouses</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <Select><SelectTrigger><SelectValue placeholder="Product" /></SelectTrigger>
                <SelectContent>{lowStock.slice(0, 10).map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Select><SelectTrigger><SelectValue placeholder="From Branch" /></SelectTrigger>
                  <SelectContent>{BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
                <Select><SelectTrigger><SelectValue placeholder="To Branch" /></SelectTrigger>
                  <SelectContent>{BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Input type="number" placeholder="Quantity" min={1} />
              <Button className="w-full" onClick={() => setTransferOpen(false)}>Initiate Transfer (Demo)</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total SKUs", value: formatNumber(PRODUCTS.length), icon: Package },
          { label: "Low Stock Items", value: lowStock.length, icon: AlertTriangle, warn: true },
          { label: "Total Units", value: formatNumber(PRODUCTS.reduce((s, p) => s + p.stock, 0)), icon: Warehouse },
          { label: "Inventory Value", value: formatCurrency(PRODUCTS.reduce((s, p) => s + p.price * p.stock, 0)), icon: Warehouse },
        ].map((s) => (
          <Card key={s.label} className="glass-card hover:shadow-md transition-shadow">
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

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Stock by Branch</CardTitle>
            <CardDescription>Unit distribution across 6 locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchStock}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="branch" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
                    formatter={(v, name) => [name === "value" ? formatCurrency(Number(v)) : v, name === "value" ? "Value" : "Units"]} />
                  <Bar dataKey="stock" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Units" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" />Low Stock Alerts</CardTitle>
            <CardDescription>{lowStock.length} items need replenishment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-64 overflow-y-auto">
            {lowStock.slice(0, 10).map((p) => (
              <motion.div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 hover:border-amber-500/30 transition-colors" whileHover={{ x: 2 }}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.sku}</p>
                </div>
                <div className="text-right">
                  <Badge variant="warning">{p.stock} units</Badge>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{formatCurrency(p.price)}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="warehouse">
        <TabsList>
          <TabsTrigger value="warehouse" className="gap-1.5"><Warehouse className="h-3.5 w-3.5" />Warehouse</TabsTrigger>
          <TabsTrigger value="damaged" className="gap-1.5"><Trash2 className="h-3.5 w-3.5" />Damaged</TabsTrigger>
          <TabsTrigger value="returns" className="gap-1.5"><RotateCcw className="h-3.5 w-3.5" />Returns</TabsTrigger>
          <TabsTrigger value="purchase" className="gap-1.5"><ClipboardList className="h-3.5 w-3.5" />Purchase Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="warehouse">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Warehouse View</CardTitle>
                <Select value={selectedBranch} onValueChange={(v) => setSelectedBranch(v as Branch | "all")}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="pb-3 font-medium">Product</th>
                    {BRANCHES.map((b) => <th key={b} className="pb-3 font-medium text-center text-xs">{b.slice(0, 4)}</th>)}
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouseProducts.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2.5 font-medium truncate max-w-[200px]">{p.name}</td>
                      {BRANCHES.map((b) => (
                        <td key={b} className="py-2.5 text-center">
                          <span className={cn("text-xs", (p.branchStock[b] || 0) < 3 && "text-amber-500 font-bold")}>{p.branchStock[b] || 0}</span>
                        </td>
                      ))}
                      <td className="py-2.5 text-right font-medium">{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="damaged">
          <Card className="glass-card">
            <CardHeader><CardTitle>Damaged Inventory</CardTitle><CardDescription>Items flagged for write-off or repair</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {damagedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">{item.damagedQty} damaged</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{formatCurrency(item.price * item.damagedQty)} loss</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns">
          <Card className="glass-card">
            <CardHeader><CardTitle>Return Inventory</CardTitle><CardDescription>Customer returns pending inspection</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {returnItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Condition: {item.condition}</p>
                  </div>
                  <Badge variant="outline">{item.returnQty} unit</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase">
          <Card className="glass-card">
            <CardHeader><CardTitle>Linked Purchase Orders</CardTitle><CardDescription>Pending & confirmed POs for restocking</CardDescription></CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="pb-3 font-medium">PO Number</th>
                    <th className="pb-3 font-medium">Supplier</th>
                    <th className="pb-3 font-medium">Branch</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PURCHASE_ORDERS.filter((po) => po.status !== "cancelled").slice(0, 10).map((po) => (
                    <tr key={po.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 font-mono text-xs">{po.poNumber}</td>
                      <td className="py-3">{po.supplierName}</td>
                      <td className="py-3 text-muted-foreground">{po.branch}</td>
                      <td className="py-3 font-medium">{formatCurrency(po.total)}</td>
                      <td className="py-3"><Badge variant={po.status === "received" ? "success" : "secondary"} className="capitalize">{po.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {BRANCH_PERFORMANCE.map((bp) => (
          <Card key={bp.branch} className="glass-card text-center hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{bp.branch}</p>
              <p className="text-lg font-bold mt-1">{formatNumber(bp.inventory)}</p>
              <p className="text-[10px] text-muted-foreground">units in stock</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageTransition>
  );
}
