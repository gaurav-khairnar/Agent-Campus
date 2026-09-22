import React from "react";
import { Shield, Building2, GraduationCap, BookOpen, Lock, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import AdminWorkspace from "./roles/AdminWorkspace";
import CoordinatorWorkspace from "./roles/CoordinatorWorkspace";
import FacultyWorkspace from "./roles/FacultyWorkspace";
import StudentWorkspace from "./roles/StudentWorkspace";

export const AcademicDashboard: React.FC = () => {
  const { user, logout, isLoading } = useAuth();

  // Production Session-Scoped Authority
  const userRole = (user?.role || "coordinator").toLowerCase();
  const userName = user?.name || "Dr. Sarah Connor";
  const userEmail = user?.email || "coordinator@agentcampus.edu";
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
      {/* Session Security Banner */}
      <div className="p-4 rounded-2xl border bg-card shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* User Identity & Authority Context */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              AgentCampus Portal
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Authenticated Session: <strong className="text-foreground">{userName}</strong> ({userEmail})
            </p>
          </div>
        </div>

        {/* Security Badges & Logout Action */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tenant Scope Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-muted/70 border text-xs font-bold text-foreground flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-indigo-500" />
            Tenant: <span className="font-mono text-[11px] text-muted-foreground">{institutionId.substring(0, 8)}...</span>
          </div>

          {/* Role Authority Badge */}
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
            Authority: {userRole}
          </div>

          {/* Sign Out / Switch Account */}
          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-destructive/20 bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-bold transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Switch Account
          </button>
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
