"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Users, UserCheck, Clock, Calendar, IndianRupee, Briefcase, Search,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageTransition } from "@/components/shared/page-transition";
import { EMPLOYEES } from "@/data";
import { BRANCHES } from "@/data/constants";
import { formatCurrency, formatDate, formatNumber, cn } from "@/lib/utils";
import type { EmployeeRole } from "@/types";

const ROLE_COLORS: Record<EmployeeRole, string> = {
  admin: "#8b5cf6", manager: "#3b82f6", sales: "#14b8a6", inventory: "#f59e0b",
  delivery: "#06b6d4", technician: "#10b981", accountant: "#6366f1", cashier: "#ec4899",
};

const LEAVE_REQUESTS = [
  { id: 1, name: "Ananya Menon", type: "Casual Leave", from: "2026-07-18", to: "2026-07-19", status: "pending" },
  { id: 2, name: "Rahul Joseph", type: "Sick Leave", from: "2026-07-15", to: "2026-07-15", status: "approved" },
  { id: 3, name: "Priya Thomas", type: "Earned Leave", from: "2026-07-22", to: "2026-07-26", status: "pending" },
  { id: 4, name: "Vikram Nair", type: "Casual Leave", from: "2026-07-20", to: "2026-07-20", status: "rejected" },
];

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");

  const filtered = useMemo(() => EMPLOYEES.filter((e) => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || e.role === roleFilter;
    const matchBranch = branchFilter === "all" || e.branch === branchFilter;
    return matchSearch && matchRole && matchBranch;
  }), [search, roleFilter, branchFilter]);

  const roleData = useMemo(() => {
    const counts: Record<string, number> = {};
    EMPLOYEES.forEach((e) => { counts[e.role] = (counts[e.role] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value, fill: ROLE_COLORS[name as EmployeeRole] }));
  }, []);

  const attendance = useMemo(() => {
    const counts = { present: 0, late: 0, absent: 0, half_day: 0 };
    EMPLOYEES.forEach((e) => { counts[e.attendanceToday]++; });
    return counts;
  }, []);

  const payrollTotal = EMPLOYEES.filter((e) => e.status === "active").reduce((s, e) => s + e.salary, 0);

  return (
    <PageTransition className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Employee Management</h2>
        <p className="text-muted-foreground text-sm">{EMPLOYEES.length} team members across 6 branches</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Employees", value: EMPLOYEES.length, icon: Users },
          { label: "Present Today", value: attendance.present + attendance.late, icon: UserCheck },
          { label: "On Leave", value: EMPLOYEES.filter((e) => e.status === "on_leave").length, icon: Calendar },
          { label: "Monthly Payroll", value: formatCurrency(payrollTotal), icon: IndianRupee },
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

      <Tabs defaultValue="directory">
        <TabsList>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search employees..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-36"><SelectValue placeholder="Role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {Object.keys(ROLE_COLORS).map((r) => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Branch" /></SelectTrigger>
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
                    <th className="pb-3 font-medium">Employee</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Department</th>
                    <th className="pb-3 font-medium">Branch</th>
                    <th className="pb-3 font-medium">Shift</th>
                    <th className="pb-3 font-medium">Performance</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp) => (
                    <motion.tr key={emp.id} className="border-b border-border/50 hover:bg-muted/30" whileHover={{ x: 2 }}>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 rounded-full overflow-hidden bg-muted">
                            {emp.avatar && <Image src={emp.avatar} alt={emp.name} fill className="object-cover" sizes="36px" />}
                          </div>
                          <div>
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-xs text-muted-foreground">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3"><Badge style={{ backgroundColor: `${ROLE_COLORS[emp.role]}20`, color: ROLE_COLORS[emp.role] }} className="border-0 capitalize">{emp.role}</Badge></td>
                      <td className="py-3 text-muted-foreground">{emp.department}</td>
                      <td className="py-3">{emp.branch}</td>
                      <td className="py-3 text-xs text-muted-foreground">{emp.shift}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(emp.performanceScore / 5) * 100}%` }} />
                          </div>
                          <span className="text-xs">{emp.performanceScore}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant={emp.status === "active" ? "success" : emp.status === "on_leave" ? "warning" : "secondary"} className="capitalize text-[10px]">
                          {emp.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader><CardTitle>Today&apos;s Attendance</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Present", count: attendance.present, color: "bg-emerald-500" },
                  { label: "Late", count: attendance.late, color: "bg-amber-500" },
                  { label: "Half Day", count: attendance.half_day, color: "bg-blue-500" },
                  { label: "Absent", count: attendance.absent, color: "bg-red-500" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-sm"><span>{item.label}</span><span className="font-medium">{item.count}</span></div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <motion.div className={cn("h-full rounded-full", item.color)} initial={{ width: 0 }} animate={{ width: `${(item.count / EMPLOYEES.length) * 100}%` }} transition={{ duration: 0.8 }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader><CardTitle>Role Distribution</CardTitle></CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={roleData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={2}>
                        {roleData.map((d) => <Cell key={d.name} fill={d.fill} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shifts">
          <div className="grid md:grid-cols-3 gap-4">
            {["Morning (9AM-5PM)", "Evening (1PM-9PM)", "Full Day (10AM-7PM)"].map((shift) => {
              const count = EMPLOYEES.filter((e) => e.shift === shift).length;
              return (
                <Card key={shift} className="glass-card">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3"><Clock className="h-5 w-5 text-teal-500" /><p className="font-medium">{shift}</p></div>
                    <p className="text-3xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground mt-1">employees assigned</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="payroll">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" />Payroll Overview</CardTitle>
              <CardDescription>Monthly salary breakdown — July 2026</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="pb-3 font-medium">Employee</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Branch</th>
                    <th className="pb-3 font-medium">Base Salary</th>
                    <th className="pb-3 font-medium">Attendance</th>
                    <th className="pb-3 font-medium">Net Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {EMPLOYEES.filter((e) => e.status === "active").slice(0, 15).map((emp) => {
                    const deduction = emp.attendanceToday === "absent" ? emp.salary * 0.05 : emp.attendanceToday === "half_day" ? emp.salary * 0.025 : 0;
                    return (
                      <tr key={emp.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 font-medium">{emp.name}</td>
                        <td className="py-3 capitalize text-muted-foreground">{emp.role}</td>
                        <td className="py-3">{emp.branch}</td>
                        <td className="py-3">{formatCurrency(emp.salary)}</td>
                        <td className="py-3"><Badge variant={emp.attendanceToday === "present" ? "success" : emp.attendanceToday === "absent" ? "destructive" : "warning"} className="capitalize text-[10px]">{emp.attendanceToday.replace(/_/g, " ")}</Badge></td>
                        <td className="py-3 font-medium">{formatCurrency(emp.salary - deduction)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-4 p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 flex justify-between items-center">
                <span className="font-medium">Total Monthly Payroll</span>
                <span className="text-xl font-bold text-teal-500">{formatCurrency(payrollTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card className="glass-card">
            <CardHeader><CardTitle>Leave Requests</CardTitle><CardDescription>Pending approvals & recent decisions</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {LEAVE_REQUESTS.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-teal-500/20 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{req.name}</p>
                    <p className="text-xs text-muted-foreground">{req.type} · {req.from} to {req.to}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={req.status === "approved" ? "success" : req.status === "rejected" ? "destructive" : "warning"} className="capitalize">{req.status}</Badge>
                    {req.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" className="h-7 text-xs">Reject</Button>
                        <Button size="sm" className="h-7 text-xs">Approve</Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}
