"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Barcode, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTransition } from "@/components/shared/page-transition";
import { PRODUCTS, CATEGORIES_WITH_COUNTS } from "@/data";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
      const matchCat = category === "all" || p.categorySlug === category;
      const matchStock = stockFilter === "all" || (stockFilter === "low" && p.stock < 15) || (stockFilter === "out" && p.stock === 0) || (stockFilter === "in" && p.stock >= 15);
      return matchSearch && matchCat && matchStock;
    });
  }, [search, category, stockFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => ({
    total: PRODUCTS.length,
    lowStock: PRODUCTS.filter((p) => p.stock < 15).length,
    outOfStock: PRODUCTS.filter((p) => p.stock === 0).length,
    avgPrice: Math.round(PRODUCTS.reduce((s, p) => s + p.price, 0) / PRODUCTS.length),
  }), []);

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Product Management</h2>
          <p className="text-muted-foreground text-sm">{formatNumber(PRODUCTS.length)} products across {CATEGORIES_WITH_COUNTS.length} categories</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Simulated product creation — data won&apos;t persist</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic" className="mt-2">
              <TabsList className="w-full">
                <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing" className="flex-1">Pricing</TabsTrigger>
                <TabsTrigger value="stock" className="flex-1">Stock</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-3">
                <Input placeholder="Product Name" />
                <Select><SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>{CATEGORIES_WITH_COUNTS.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Brand" />
                <Input placeholder="SKU (auto-generated if empty)" />
              </TabsContent>
              <TabsContent value="pricing" className="space-y-3">
                <Input type="number" placeholder="MRP (₹)" />
                <Input type="number" placeholder="Selling Price (₹)" />
                <Input placeholder="Barcode (EAN-13)" />
              </TabsContent>
              <TabsContent value="stock" className="space-y-3">
                <Input type="number" placeholder="Initial Stock" />
                <Select><SelectTrigger><SelectValue placeholder="Primary Branch" /></SelectTrigger>
                  <SelectContent>
                    {["Kattappana", "Thodupuzha", "Munnar", "Kumily", "Adimali", "Nedumkandam"].map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TabsContent>
            </Tabs>
            <Button className="w-full mt-4" onClick={() => setAddOpen(false)}>Create Product (Demo)</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: formatNumber(stats.total), icon: Package },
          { label: "Low Stock", value: stats.lowStock, icon: Package, warn: true },
          { label: "Out of Stock", value: stats.outOfStock, icon: Package, warn: true },
          { label: "Avg. Price", value: formatCurrency(stats.avgPrice), icon: Package },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-teal-500/15 flex items-center justify-center">
                <s.icon className="h-5 w-5 text-teal-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={cn("text-xl font-bold", s.warn && Number(s.value) > 0 && "text-amber-500")}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, SKU, or barcode..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
                <SelectTrigger className="w-40"><Filter className="h-3.5 w-3.5 mr-1" /><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES_WITH_COUNTS.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={(v) => { setStockFilter(v); setPage(1); }}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription className="mt-2">{formatNumber(filtered.length)} products found · Page {page} of {totalPages || 1}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-left">
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">SKU</th>
                <th className="pb-3 font-medium">Barcode</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">MRP</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((product) => (
                <motion.tr key={product.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors" whileHover={{ backgroundColor: "var(--muted)" }}>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-xs">{product.sku}</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                      <Barcode className="h-3 w-3" />{product.barcode.slice(0, 8)}…
                    </span>
                  </td>
                  <td className="py-3"><Badge variant="outline" className="text-[10px]">{product.category}</Badge></td>
                  <td className="py-3 text-muted-foreground line-through text-xs">{formatCurrency(product.mrp)}</td>
                  <td className="py-3 font-medium">{formatCurrency(product.price)}</td>
                  <td className="py-3">{formatNumber(product.stock)}</td>
                  <td className="py-3">
                    <Badge variant={product.stock === 0 ? "destructive" : product.stock < 15 ? "warning" : "success"} className="text-[10px]">
                      {product.stock === 0 ? "Out" : product.stock < 15 ? "Low" : "In Stock"}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
