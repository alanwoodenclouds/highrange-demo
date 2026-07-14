"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search, Plus, Minus, Trash2, CreditCard, Receipt, RotateCcw,
  BarChart3, FileText, ShoppingCart,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PageTransition } from "@/components/shared/page-transition";
import { PRODUCTS, ORDERS } from "@/data";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { Product, Order } from "@/types";

interface CartItem { product: Product; quantity: number }

const DAILY_SALES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
  day,
  sales: Math.round(85000 + Math.sin(i) * 25000 + i * 8000),
  transactions: Math.round(12 + i * 3 + Math.cos(i) * 4),
}));

export default function SalesPage() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const searchResults = useMemo(() => {
    if (!search) return PRODUCTS.slice(0, 8);
    return PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 8);
  }, [search]);

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((i) => i.product.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter((i) => i.quantity > 0));
  };

  const recentInvoices = useMemo(() =>
    [...ORDERS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 12),
  []);

  return (
    <PageTransition className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Sales & POS</h2>
        <p className="text-muted-foreground text-sm">Point of sale billing, invoices & sales analytics</p>
      </div>

      <Tabs defaultValue="pos">
        <TabsList>
          <TabsTrigger value="pos" className="gap-1.5"><ShoppingCart className="h-3.5 w-3.5" />POS Billing</TabsTrigger>
          <TabsTrigger value="invoices" className="gap-1.5"><Receipt className="h-3.5 w-3.5" />Invoices</TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="pos">
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Scan barcode or search product..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {searchResults.map((product) => (
                      <motion.button
                        key={product.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-teal-500/50 hover:bg-muted/30 text-left transition-all"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => addToCart(product)}
                      >
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sku}</p>
                          <p className="text-sm font-bold text-teal-500 mt-0.5">{formatCurrency(product.price)}</p>
                        </div>
                        <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="glass-card sticky top-20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" />Current Bill</CardTitle>
                  <CardDescription>{cart.length} items in cart</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8 text-sm">Add products to start billing</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.product.name}</p>
                            <p className="text-xs text-teal-500">{formatCurrency(item.product.price)}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.product.id, -1)}><Minus className="h-3 w-3" /></Button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.product.id, 1)}><Plus className="h-3 w-3" /></Button>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => updateQty(item.product.id, -item.quantity)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2 pt-3 border-t border-border text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>{formatCurrency(gst)}</span></div>
                    <div className="flex justify-between font-bold text-base pt-1"><span>Total</span><span className="text-teal-500">{formatCurrency(total)}</span></div>
                  </div>

                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger><CreditCard className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="emi">EMI</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="w-full" size="lg" disabled={cart.length === 0} onClick={() => { setInvoiceOpen(true); setCart([]); }}>
                    Generate Invoice
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Invoice List</CardTitle>
              <CardDescription>Recent sales invoices with GST details</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="pb-3 font-medium">Invoice</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Branch</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">GST</th>
                    <th className="pb-3 font-medium">Payment</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((order) => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 font-mono text-xs">{order.invoiceNumber}</td>
                      <td className="py-3">{order.customerName}</td>
                      <td className="py-3 text-muted-foreground">{order.branch}</td>
                      <td className="py-3 font-medium">{formatCurrency(order.total)}</td>
                      <td className="py-3 text-muted-foreground">{formatCurrency(order.tax)}</td>
                      <td className="py-3"><Badge variant="outline" className="capitalize text-[10px]">{order.paymentMethod}</Badge></td>
                      <td className="py-3 text-xs text-muted-foreground">{formatDate(order.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setSelectedOrder(order); setInvoiceOpen(true); }}><FileText className="h-3 w-3" /></Button>
                          {order.status === "delivered" && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => { setSelectedOrder(order); setRefundOpen(true); }}><RotateCcw className="h-3 w-3" /></Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Weekly Sales Report</CardTitle>
              <CardDescription>Revenue & transaction trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={DAILY_SALES}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
                      formatter={(v, name) => [name === "sales" ? formatCurrency(Number(v)) : v, name === "sales" ? "Revenue" : "Transactions"]} />
                    <Line type="monotone" dataKey="sales" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="transactions" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>GST Tax Invoice</DialogTitle>
            <DialogDescription>Highrange Home Appliances Pvt Ltd · GSTIN: 32AABCH1234F1Z5</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm border border-border rounded-xl p-4 bg-muted/20">
            <div className="text-center border-b border-border pb-3">
              <p className="font-bold text-base">TAX INVOICE</p>
              <p className="text-xs text-muted-foreground">Invoice: {selectedOrder?.invoiceNumber ?? `INV-HR-${Date.now().toString().slice(-6)}`}</p>
            </div>
            {selectedOrder ? (
              <>
                <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span>{selectedOrder.customerName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Branch</span><span>{selectedOrder.branch}</span></div>
                <div className="border-t border-border pt-2 space-y-1">
                  {selectedOrder.items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-xs">
                      <span className="truncate flex-1">{item.productName} × {item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-2 space-y-1">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(selectedOrder.subtotal)}</span></div>
                  <div className="flex justify-between"><span>CGST (9%)</span><span>{formatCurrency(selectedOrder.tax / 2)}</span></div>
                  <div className="flex justify-between"><span>SGST (9%)</span><span>{formatCurrency(selectedOrder.tax / 2)}</span></div>
                  <div className="flex justify-between font-bold"><span>Total</span><span className="text-teal-500">{formatCurrency(selectedOrder.total)}</span></div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-teal-500 font-bold text-lg">{formatCurrency(total)}</p>
                <p className="text-xs text-muted-foreground mt-1">Payment via {paymentMethod.toUpperCase()} · Invoice generated</p>
              </div>
            )}
          </div>
          <Button className="w-full" onClick={() => setInvoiceOpen(false)}>Print / Download (Demo)</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>Simulated refund for order {selectedOrder?.orderNumber}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/30 text-sm">
                <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                <p><strong>Amount:</strong> {formatCurrency(selectedOrder.total)}</p>
                <p><strong>Payment:</strong> {selectedOrder.paymentMethod.toUpperCase()}</p>
              </div>
              <Select defaultValue="full">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Refund</SelectItem>
                  <SelectItem value="partial">Partial Refund</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Refund reason" />
              <Button variant="destructive" className="w-full" onClick={() => setRefundOpen(false)}>Confirm Refund (Demo)</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
