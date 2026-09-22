import React from "react";
import { Shield, Building2, GraduationCap, BookOpen, Lock, UserCheck, Key } from "lucide-react";
import { useAuth, DEMO_ACCOUNTS } from "@/hooks/use-auth";
import AdminWorkspace from "./roles/AdminWorkspace";
import CoordinatorWorkspace from "./roles/CoordinatorWorkspace";
import FacultyWorkspace from "./roles/FacultyWorkspace";
import StudentWorkspace from "./roles/StudentWorkspace";

export const AcademicDashboard: React.FC = () => {
  const { user, switchDemoUser, isLoading } = useAuth();

  // Active Session Role & Tenant Scoping
  const userRole = (user?.role || "coordinator").toLowerCase();
  const institutionId = user?.institution_id || "11111111-1111-1111-1111-111111111111";

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-sm font-semibold text-muted-foreground">
        Authenticating session security credentials...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen bg-background">
      {/* Server-Authenticated Security Banner with Dev Identity Selector */}
      <div className="p-4 rounded-2xl border bg-card shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* User Identity & Authority Context */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              AgentCampus Academic Portal
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Authenticated Session: <strong className="text-foreground">{user?.name}</strong> (<span className="font-mono">{user?.email}</span>)
            </p>
          </div>
        </div>

        {/* Security & Dev Demo Identity Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dev Test Identity Switcher */}
          <div className="flex items-center gap-1.5 bg-muted/70 p-1.5 rounded-xl border">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 px-1">
              <Key className="h-3.5 w-3.5 text-amber-500" /> Test Identity:
            </span>
            <select
              value={user?.email || DEMO_ACCOUNTS[1].email}
              onChange={(e) => {
                const acc = DEMO_ACCOUNTS.find((a) => a.email === e.target.value);
                if (acc) switchDemoUser(acc);
              }}
              className="bg-background text-foreground text-xs font-bold px-2.5 py-1 rounded-lg border shadow-sm cursor-pointer"
            >
              {DEMO_ACCOUNTS.map((acc) => (
                <option key={acc.id} value={acc.email}>
                  {acc.role === "admin" && "🛡️ Admin — Elena Rostova"}
                  {acc.role === "coordinator" && "📋 Coordinator — Dr. Sarah Connor"}
                  {acc.role === "faculty" && "🎓 Faculty — Prof. Alan Turing"}
                  {acc.role === "student" && "🎒 Student — Alex Johnson"}
                </option>
              ))}
            </select>
          </div>

          {/* Active Role Security Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase flex items-center gap-1.5 border shadow-sm ${
              userRole === "admin"
                ? "bg-slate-900 text-white border-slate-800"
                : userRole === "coordinator"
                ? "bg-blue-600 text-white border-blue-500"
                : userRole === "faculty"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-purple-600 text-white border-purple-500"
            }`}
          >
            {userRole === "admin" && <Shield className="h-3.5 w-3.5" />}
            {userRole === "coordinator" && <Building2 className="h-3.5 w-3.5" />}
            {userRole === "faculty" && <GraduationCap className="h-3.5 w-3.5" />}
            {userRole === "student" && <BookOpen className="h-3.5 w-3.5" />}
            Role: {userRole}
          </div>
        </div>
      </div>

      {/* Production Strict Role-Scoped Workspace View Execution */}
      {userRole === "admin" && <AdminWorkspace />}
      {userRole === "coordinator" && <CoordinatorWorkspace />}
      {userRole === "faculty" && <FacultyWorkspace />}
      {userRole === "student" && <StudentWorkspace />}
    </div>
  );
};

export default AcademicDashboard;
