import React, { useState } from "react";
import { Shield, Building2, GraduationCap, BookOpen, Users, Sparkles, ChevronDown, Globe } from "lucide-react";
import AdminWorkspace from "./roles/AdminWorkspace";
import CoordinatorWorkspace from "./roles/CoordinatorWorkspace";
import FacultyWorkspace from "./roles/FacultyWorkspace";
import StudentWorkspace from "./roles/StudentWorkspace";

export interface AcademicDashboardProps {
  userRole?: "admin" | "coordinator" | "faculty" | "student";
}

export interface InstitutionTenant {
  id: string;
  name: string;
  code: string;
  domain: string;
}

export const AcademicDashboard: React.FC<AcademicDashboardProps> = ({ userRole: initialRole = "coordinator" }) => {
  const [activeRole, setActiveRole] = useState<"admin" | "coordinator" | "faculty" | "student">(initialRole);

  // Available Multi-Tenant Institutions
  const institutions: InstitutionTenant[] = [
    { id: "11111111-1111-1111-1111-111111111111", name: "AgentCampus MIT", code: "MIT-CS", domain: "mit.agentcampus.edu" },
    { id: "22222222-2222-2222-2222-222222222222", name: "Stanford AI Institute", code: "STAN-AI", domain: "stanford.agentcampus.edu" },
    { id: "33333333-3333-3333-3333-333333333333", name: "Oxford Cybernetics", code: "OX-CYB", domain: "oxford.agentcampus.edu" }
  ];

  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionTenant>(institutions[0]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen bg-background">
      {/* Role & Multi-Tenant Institution Selector Header Control Bar */}
      <div className="p-4 rounded-2xl border bg-card shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Title & Active Scopes */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              AgentCampus Academic Portal
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-muted-foreground">
              <span>Active Authority: <strong className="uppercase text-primary">{activeRole}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-indigo-500" /> Tenant Domain: <strong className="text-foreground">{selectedInstitution.domain}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Controls: Institution Switcher + Role Switcher */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Institution Tenant Selector */}
          <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-xl border">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 px-1">
              <Building2 className="h-3.5 w-3.5 text-indigo-500" /> Institution:
            </span>
            <select
              value={selectedInstitution.id}
              onChange={(e) => {
                const inst = institutions.find((i) => i.id === e.target.value);
                if (inst) setSelectedInstitution(inst);
              }}
              className="bg-background text-foreground text-xs font-extrabold px-3 py-1.5 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  🏛️ {inst.name} ({inst.code})
                </option>
              ))}
            </select>
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
