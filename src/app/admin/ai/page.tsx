"use client";

import { useState, useMemo } from "react";
import { SafeImage } from "@/components/shared/safe-image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, TrendingUp, Package, Users, MessageSquare, Send, Brain,
  BarChart3, Lightbulb, Target,
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/shared/page-transition";
import { PRODUCTS, CUSTOMERS, DASHBOARD_STATS, ORDERS } from "@/data";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";

const FORECAST_MONTHS = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"].map((month, i) => ({
  month,
  actual: i < 2 ? Math.round(DASHBOARD_STATS.revenue / 12 * (0.9 + i * 0.1)) : null,
  forecast: Math.round(DASHBOARD_STATS.revenue / 12 * (1 + i * 0.08)),
  lower: Math.round(DASHBOARD_STATS.revenue / 12 * (0.85 + i * 0.06)),
  upper: Math.round(DASHBOARD_STATS.revenue / 12 * (1.15 + i * 0.1)),
}));

const CHAT_RESPONSES: Record<string, string> = {
  default: "I can help with sales forecasts, inventory predictions, and customer insights. Try asking about top products or demand trends!",
  sales: "Based on current trends, sales are projected to grow 12.4% next quarter. ACs and refrigerators show strongest demand during summer months in Idukki.",
  inventory: "23 products are below reorder threshold. I recommend restocking Samsung 55\" TVs and Voltas 1.5T ACs at Kattappana and Thodupuzha branches.",
  customers: "Your Gold & Platinum tier customers contribute 68% of revenue. 142 customers haven't purchased in 90+ days — a win-back campaign could recover ₹12L.",
  forecast: "Demand forecast shows peak appliance sales in Oct-Nov (festival season). Stock up on washing machines and kitchen appliances by September.",
};

const BOT_SUGGESTIONS = [
  "What's the sales forecast for next quarter?",
  "Which products need restocking?",
  "Show customer retention insights",
  "Predict demand for festival season",
];

export default function AIPage() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hello! I'm Highrange AI Assistant. I analyze your store data to provide actionable insights. How can I help?" },
  ]);

  const recommendations = useMemo(() =>
    PRODUCTS.filter((p) => p.isBestSeller || p.isTrending).slice(0, 6).map((p, i) => ({
      ...p,
      confidence: 78 + ((i * 7 + p.id.charCodeAt(p.id.length - 1)) % 18),
      reason: p.isBestSeller ? "High conversion rate" : "Trending in Idukki region",
    })),
  []);

  const inventoryPredictions = useMemo(() =>
    PRODUCTS.filter((p) => p.stock < 20).slice(0, 5).map((p) => ({
      name: p.name,
      current: p.stock,
      predicted: Math.max(0, p.stock - Math.round(p.stock * 0.4)),
      daysLeft: Math.round(p.stock / 2.5),
      action: p.stock < 10 ? "Reorder Now" : "Monitor",
    })),
  []);

  const customerInsights = useMemo(() => {
    const tiers = { Gold: 0, Platinum: 0, Silver: 0, Bronze: 0 };
    CUSTOMERS.forEach((c) => { tiers[c.tier]++; });
    const atRisk = CUSTOMERS.filter((c) => c.segment === "Inactive").length;
    const highValue = CUSTOMERS.filter((c) => c.tier === "Gold" || c.tier === "Platinum").length;
    return { tiers, atRisk, highValue, avgPoints: Math.round(CUSTOMERS.reduce((s, c) => s + c.loyaltyPoints, 0) / CUSTOMERS.length) };
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const lower = text.toLowerCase();
    let response = CHAT_RESPONSES.default;
    if (lower.includes("sales") || lower.includes("forecast")) response = CHAT_RESPONSES.sales;
    else if (lower.includes("inventory") || lower.includes("stock") || lower.includes("restock")) response = CHAT_RESPONSES.inventory;
    else if (lower.includes("customer") || lower.includes("retention")) response = CHAT_RESPONSES.customers;
    else if (lower.includes("demand") || lower.includes("predict")) response = CHAT_RESPONSES.forecast;

    setMessages((prev) => [...prev, { role: "user", text }, { role: "bot", text: response }]);
    setChatInput("");
  };

  return (
    <PageTransition className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold">AI Insights</h2>
          <p className="text-muted-foreground text-sm">Powered by machine learning on your store data</p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-red-500/20 to-red-500/20 text-red-300 border-red-500/30">Beta</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "AI Confidence", value: "94.2%", icon: Brain, color: "text-red-400" },
          { label: "Predicted Growth", value: "+12.4%", icon: TrendingUp, color: "text-emerald-400" },
          { label: "Products Analyzed", value: formatNumber(PRODUCTS.length), icon: Package, color: "text-red-400" },
          { label: "Customer Segments", value: "6", icon: Users, color: "text-blue-400" },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={cn("h-8 w-8", s.color)} />
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
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-red-500" />Sales Forecasting</CardTitle>
            <CardDescription>6-month revenue projection with confidence bands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={FORECAST_MONTHS}>
                  <defs>
                    <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v) => formatCurrency(Number(v))} />
                  <Area type="monotone" dataKey="upper" stroke="none" fill="url(#forecastGrad)" name="Upper Bound" />
                  <Area type="monotone" dataKey="lower" stroke="none" fill="var(--background)" name="Lower Bound" />
                  <Area type="monotone" dataKey="forecast" stroke="#8b5cf6" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
                  <Area type="monotone" dataKey="actual" stroke="var(--chart-1)" fill="none" strokeWidth={2} name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-red-500" />AI Chatbot</CardTitle>
            <CardDescription>Ask questions about your business</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 space-y-3 max-h-64 overflow-y-auto mb-3">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm",
                      msg.role === "user" ? "bg-red-500 text-white rounded-br-md" : "bg-muted/50 rounded-bl-md"
                    )}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {BOT_SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => sendMessage(s)} className="text-[10px] px-2 py-1 rounded-full bg-muted/50 hover:bg-red-500/20 transition-colors text-muted-foreground hover:text-red-400">
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Ask AI anything..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage(chatInput)} />
              <Button size="icon" onClick={() => sendMessage(chatInput)}><Send className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-amber-400" />Product Recommendations</CardTitle>
            <CardDescription>AI-curated products to promote</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-border/50 hover:border-red-500/30 transition-colors">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  <SafeImage src={p.images[0]} alt={p.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.reason}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-red-500/20 text-red-300 border-0">{p.confidence}%</Badge>
                  <p className="text-xs font-medium mt-0.5">{formatCurrency(p.price)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-red-400" />Inventory Predictions</CardTitle>
            <CardDescription>Stock depletion forecasts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {inventoryPredictions.map((item) => (
              <div key={item.name} className="p-3 rounded-xl border border-border/50">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium truncate flex-1">{item.name}</p>
                  <Badge variant={item.action === "Reorder Now" ? "destructive" : "warning"} className="text-[10px] ml-2">{item.action}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Current: {item.current}</span>
                  <span>Predicted: {item.predicted}</span>
                  <span>~{item.daysLeft} days left</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-red-500 rounded-full" style={{ width: `${(item.predicted / item.current) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Customer Insights</CardTitle>
          <CardDescription>AI-driven customer analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-muted/30 text-center">
              <p className="text-2xl font-bold text-red-500">{customerInsights.highValue}</p>
              <p className="text-xs text-muted-foreground mt-1">High-Value Customers</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 text-center">
              <p className="text-2xl font-bold text-amber-500">{customerInsights.atRisk}</p>
              <p className="text-xs text-muted-foreground mt-1">At-Risk (Inactive)</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 text-center">
              <p className="text-2xl font-bold">{formatNumber(customerInsights.avgPoints)}</p>
              <p className="text-xs text-muted-foreground mt-1">Avg Loyalty Points</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 text-center">
              <p className="text-2xl font-bold">{ORDERS.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Orders Analyzed</p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(customerInsights.tiers).map(([tier, count]) => ({ tier, count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="tier" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Customers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-red-500/20 bg-gradient-to-br from-red-500/5 to-red-500/5">
        <CardContent className="p-6 flex items-center gap-4">
          <BarChart3 className="h-10 w-10 text-red-400 shrink-0" />
          <div>
            <p className="font-medium">Demand Forecasting Summary</p>
            <p className="text-sm text-muted-foreground mt-1">
              Festival season (Sep–Nov) expected to drive 35% higher demand for large appliances. 
              Recommend increasing AC inventory by 20% at Munnar and Kumily branches. 
              Mobile phone sales projected to peak during Onam offers.
            </p>
          </div>
          <Button variant="outline" className="shrink-0 ml-auto">View Full Report</Button>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
