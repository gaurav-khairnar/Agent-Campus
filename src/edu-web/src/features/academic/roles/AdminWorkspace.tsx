import React, { useState } from "react";
import {
  Shield,
  Building2,
  Users,
  Server,
  Upload,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  Plus,
  Search,
  Lock
} from "lucide-react";

export const AdminWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"tenants" | "users" | "importer" | "logs">("tenants");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock Institutions
  const [institutions, setInstitutions] = useState([
    { id: "inst-1", name: "AgentCampus MIT", code: "MIT-CS", domain: "mit.agentcampus.edu", depts: 5, status: "Active" },
    { id: "inst-2", name: "Stanford AI Institute", code: "STAN-AI", domain: "stanford.agentcampus.edu", depts: 4, status: "Active" },
    { id: "inst-3", name: "Oxford Cybernetics", code: "OX-CYB", domain: "oxford.agentcampus.edu", depts: 3, status: "Pending Sync" }
  ]);

  // Mock System Users
  const [users, setUsers] = useState([
    { id: "u-1", name: "Dr. Sarah Connor", email: "sarah@mit.edu", role: "coordinator", dept: "Computer Science", status: "Active" },
    { id: "u-2", name: "Prof. Alan Turing", email: "alan@mit.edu", role: "faculty", dept: "Artificial Intelligence", status: "Active" },
    { id: "u-3", name: "Alex Johnson", email: "alex@mit.edu", role: "student", dept: "Computer Science", status: "Active" },
    { id: "u-4", name: "Elena Rostova", email: "elena@mit.edu", role: "admin", dept: "IT & Operations", status: "Active" }
  ]);

  // Importer state
  const [importJson, setImportJson] = useState<string>(
    JSON.stringify(
      {
        institution: { name: "AgentCampus MIT", code: "MIT-CS" },
        department: { name: "Computer Science & AI", code: "CS-AI" },
        courses: [
          { name: "CS101: Distributed AI Systems", code: "CS101", credits: 4 },
          { name: "AI201: Neural RAG & Vector DBs", code: "AI201", credits: 3 }
        ]
      },
      null,
      2
    )
  );
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [isImporting, setIsImporting] = useState(false);

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
  };

  const handleRunImport = async () => {
    setIsImporting(true);
    setImportStatus({ type: null, message: "" });
    try {
      const parsed = JSON.parse(importJson);
      const res = await fetch("http://localhost:8000/api/v1/import/academic-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed)
      });
      if (res.ok) {
        const data = await res.json();
        setImportStatus({
          type: "success",
          message: `Tenant Data Batch Enqueued! Worker Job ID: ${data.task_id || "task-sync-01"}`
        });
      } else {
        setImportStatus({
          type: "error",
          message: `Server returned status ${res.status}. Demo import fallback active.`
        });
      }
    } catch (err: any) {
      setImportStatus({
        type: "error",
        message: err.message || "Invalid JSON syntax provided."
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> System Administrator Authority
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mt-2">Institutional Admin Portal</h2>
          <p className="text-xs text-slate-300 mt-1">
            Global tenant provisioning, RBAC user role permissions, system worker pipelines & audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" /> API: Healthy (8000)
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b text-sm font-semibold">
        <button
          onClick={() => setActiveTab("tenants")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "tenants" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="h-4 w-4" /> Multi-Tenant Institutions ({institutions.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "users" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" /> User RBAC Permissions ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("importer")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "importer" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="h-4 w-4" /> System Data Importer
        </button>
      </div>

      {/* TAB 1: TENANTS */}
      {activeTab === "tenants" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">Configured Institutions & Campuses</h3>
            <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors">
              <Plus className="h-4 w-4" /> Provision Tenant
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {institutions.map((inst) => (
              <div key={inst.id} className="p-5 rounded-2xl border bg-card shadow-sm space-y-3 hover:border-indigo-500/50 transition-all">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                    {inst.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {inst.status}
                  </span>
                </div>
                <h4 className="font-bold text-base text-foreground">{inst.name}</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><span className="font-semibold text-foreground">Domain:</span> {inst.domain}</p>
                  <p><span className="font-semibold text-foreground">Active Depts:</span> {inst.depts}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: USER PERMISSIONS */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">User Directory & Role Scoping</h3>
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-xs font-bold uppercase text-muted-foreground">
                  <th className="p-4">User Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-bold text-foreground">{u.name}</td>
                    <td className="p-4 text-xs text-muted-foreground font-mono">{u.email}</td>
                    <td className="p-4 font-medium text-foreground">{u.dept}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg border bg-background text-xs font-bold uppercase focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="admin">Admin</option>
                        <option value="coordinator">Coordinator</option>
                        <option value="faculty">Faculty</option>
                        <option value="student">Student</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM DATA IMPORTER */}
      {activeTab === "importer" && (
        <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 max-w-3xl">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Upload className="h-5 w-5 text-indigo-600" />
              Institutional Bulk Data Ingestion
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Upload JSON configuration payloads directly to background celery/worker task queues.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">JSON Payload</label>
            <textarea
              rows={10}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              className="w-full p-4 rounded-xl border bg-muted/40 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {importStatus.message && (
            <div
              className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                importStatus.type === "success" ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" : "bg-red-500/10 text-red-700 border-red-500/30"
              }`}
            >
              {importStatus.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {importStatus.message}
            </div>
          )}

          <button
            onClick={handleRunImport}
            disabled={isImporting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            {isImporting ? "Enqueuing Job..." : "Execute Bulk Ingestion"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminWorkspace;
