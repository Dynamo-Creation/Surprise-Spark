"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Shield,
  Filter,
  Sparkles,
  Calendar,
  Lock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminStore, AdminUserAccount } from "@/lib/admin/adminStore";

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [users, setUsers] = useState<AdminUserAccount[]>(adminStore.listUsers());
  const [statusToast, setStatusToast] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "suspended" ? "active" : "suspended";
    const updated = adminStore.updateUserStatus(userId, nextStatus as "active" | "suspended");
    if (updated) {
      setUsers([...adminStore.listUsers()]);
      setStatusToast(`User ${updated.displayName} status changed to ${nextStatus.toUpperCase()}`);
      setTimeout(() => setStatusToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Account Directory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Users & Creator Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage operational creator profiles, monitor surprise velocity, and review account standing.
          </p>
        </div>

        {/* Privacy Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero-Credential Safe: Passwords & secrets strictly hidden</span>
        </div>
      </div>

      {statusToast && (
        <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-800/80 text-purple-200 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <span>{statusToast}</span>
          <Button variant="ghost" size="sm" onClick={() => setStatusToast(null)} className="h-5 px-2 text-xs">
            Dismiss
          </Button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-slate-900/70 border-slate-800">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              id="input-user-search"
              placeholder="Search by User ID, Name, or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-950 border-slate-800 text-xs text-white placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {["all", "active", "verified", "suspended"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                  statusFilter === s
                    ? "bg-purple-600 text-white"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-900/70 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400">
              <tr>
                <th className="p-4 pl-6">User Account</th>
                <th className="p-4">Role</th>
                <th className="p-4">Surprises Built</th>
                <th className="p-4">Template Usage</th>
                <th className="p-4">Registered</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div>
                        <p className="font-bold text-white text-xs">{u.displayName}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                        <span className="text-[10px] text-slate-500 font-mono">{u.id}</span>
                      </div>
                    </td>
                    <td className="p-4 capitalize">
                      <Badge
                        variant="secondary"
                        size="sm"
                        className={
                          u.role === "superadmin"
                            ? "bg-rose-950/40 text-rose-300 border-rose-800/40"
                            : "bg-slate-800 text-slate-300"
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-xs">
                        <span className="font-bold text-white">{u.surprisesCount}</span> total
                        <span className="text-purple-400 ml-1">({u.publishedCount} live)</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {u.templateUsage.map((slug) => (
                          <span
                            key={slug}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 font-mono"
                          >
                            {slug}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(u.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(u.lastActivityAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {u.status === "active" && (
                        <Badge variant="success" size="sm">Active</Badge>
                      )}
                      {u.status === "verified" && (
                        <Badge variant="secondary" size="sm" className="bg-blue-950/40 text-blue-300 border-blue-800/40">
                          Verified
                        </Badge>
                      )}
                      {u.status === "suspended" && (
                        <Badge variant="outline" size="sm" className="text-rose-400 border-rose-800">Suspended</Badge>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {u.role !== "superadmin" && (
                        <Button
                          id={`btn-toggle-status-${u.id}`}
                          variant={u.status === "suspended" ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className="h-7 text-xs border-slate-700"
                        >
                          {u.status === "suspended" ? "Reactivate" : "Suspend"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
