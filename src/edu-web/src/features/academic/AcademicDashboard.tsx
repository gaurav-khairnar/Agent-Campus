import React, { useState } from "react";
import { Shield, Building2, GraduationCap, BookOpen, Users, Sparkles } from "lucide-react";
import AdminWorkspace from "./roles/AdminWorkspace";
import CoordinatorWorkspace from "./roles/CoordinatorWorkspace";
import FacultyWorkspace from "./roles/FacultyWorkspace";
import StudentWorkspace from "./roles/StudentWorkspace";

export interface AcademicDashboardProps {
  userRole?: "admin" | "coordinator" | "faculty" | "student";
}

export const AcademicDashboard: React.FC<AcademicDashboardProps> = ({ userRole: initialRole = "coordinator" }) => {
  const [activeRole, setActiveRole] = useState<"admin" | "coordinator" | "faculty" | "student">(initialRole);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen bg-background">
      {/* Role Selector Header Control Bar */}
      <div className="p-4 rounded-2xl border bg-card shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              AgentCampus Academic Portal
            </h1>
            <p className="text-xs text-muted-foreground">
              Role-Scoped Multi-Tenant System • Active Role Authority:{" "}
              <span className="font-extrabold uppercase text-primary tracking-wider">{activeRole}</span>
            </p>
          </div>
        </div>

        {/* Role Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-muted/60 p-1.5 rounded-xl border">
          <button
            onClick={() => setActiveRole("admin")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase flex items-center gap-1.5 ${
              activeRole === "admin"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-muted-foreground hover:bg-background/80"
            }`}
          >
            <Shield className="h-3.5 w-3.5" /> Admin
          </button>
          <button
            onClick={() => setActiveRole("coordinator")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase flex items-center gap-1.5 ${
              activeRole === "coordinator"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-muted-foreground hover:bg-background/80"
            }`}
          >
            <Building2 className="h-3.5 w-3.5" /> Coordinator
          </button>
          <button
            onClick={() => setActiveRole("faculty")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase flex items-center gap-1.5 ${
              activeRole === "faculty"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-muted-foreground hover:bg-background/80"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" /> Faculty
          </button>
          <button
            onClick={() => setActiveRole("student")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase flex items-center gap-1.5 ${
              activeRole === "student"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-muted-foreground hover:bg-background/80"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" /> Student
          </button>
        </div>
      </div>

      {/* Role-Scoped Workspace View Routing */}
      {activeRole === "admin" && <AdminWorkspace />}
      {activeRole === "coordinator" && <CoordinatorWorkspace />}
      {activeRole === "faculty" && <FacultyWorkspace />}
      {activeRole === "student" && <StudentWorkspace />}
    </div>
  );
};

export default AcademicDashboard;
