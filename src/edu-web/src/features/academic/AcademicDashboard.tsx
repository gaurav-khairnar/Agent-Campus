import React, { useState, useEffect } from "react";
import {
  Building2,
  GraduationCap,
  Users,
  Calendar,
  CheckSquare,
  Bell,
  Sparkles,
  ShieldCheck,
  Search,
  Upload,
  BookOpen,
  UserCheck,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export interface AcademicDashboardProps {
  userRole?: "admin" | "coordinator" | "faculty" | "student";
}

export const AcademicDashboard: React.FC<AcademicDashboardProps> = ({ userRole: initialRole = "coordinator" }) => {
  const [activeRole, setActiveRole] = useState<"admin" | "coordinator" | "faculty" | "student">(initialRole);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "students" | "importer">("overview");

  // Filter / Search states
  const [searchQuery, setSearchQuery] = useState("");
  
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
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: ""
  });
  const [isImporting, setIsImporting] = useState(false);

  // Mock data for Courses
  const courses = [
    { id: "c1", code: "CS101", name: "Distributed AI Systems", dept: "Computer Science", instructor: "Dr. Sarah Connor", students: 120, schedule: "Mon/Wed 10:00 AM - 11:30 AM", room: "Hall A-101" },
    { id: "c2", code: "AI201", name: "Neural RAG & Vector Databases", dept: "Artificial Intelligence", instructor: "Prof. Alan Turing", students: 85, schedule: "Tue/Thu 02:00 PM - 03:30 PM", room: "Lab B-204" },
    { id: "c3", code: "SE305", name: "Multi-Tenant Cloud Architectures", dept: "Software Engineering", instructor: "Dr. Grace Hopper", students: 95, schedule: "Fri 09:00 AM - 12:00 PM", room: "Auditorium C" },
    { id: "c4", code: "DS402", name: "Autonomous Agent Orchestration", dept: "Data Science", instructor: "Prof. Marvin Minsky", students: 60, schedule: "Mon/Wed 03:00 PM - 04:30 PM", room: "Lab A-302" }
  ];

  // Mock data for Students & Attendance
  const students = [
    { id: "s1", name: "Alex Johnson", roll: "CS2026-001", course: "CS101", attendance: "96%", status: "Good Standing", grade: "A-" },
    { id: "s2", name: "Sarah Miller", roll: "AI2026-042", course: "AI201", attendance: "78%", status: "Attendance Flagged", grade: "B+" },
    { id: "s3", name: "David Chen", roll: "SE2026-015", course: "SE305", attendance: "92%", status: "Good Standing", grade: "A" },
    { id: "s4", name: "Emily Watson", roll: "DS2026-088", course: "DS402", attendance: "84%", status: "Review Recommended", grade: "B" }
  ];

  const filteredCourses = courses.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase()) || c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = students.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll.toLowerCase().includes(searchQuery.toLowerCase()) || s.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          message: `Import Task Queued Successfully! Worker Task ID: ${data.task_id || "task-sync"}`
        });
      } else {
        setImportStatus({
          type: "error",
          message: `Server returned error status ${res.status}. Demo fallback active.`
        });
      }
    } catch (err: any) {
      setImportStatus({
        type: "error",
        message: err.message || "Failed to submit JSON payload. Please ensure valid JSON."
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              Multi-Tenant Architecture
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Human Approval Engine
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-2 flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            AgentCampus Workspace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Institutional multi-tenant operations, automated AI grading, timetables & approval workflows.
          </p>
        </div>

        {/* Role Switcher Pill */}
        <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-xl border">
          <span className="text-xs font-semibold text-muted-foreground px-2">Role:</span>
          {(["admin", "coordinator", "faculty", "student"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setActiveRole(r)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all uppercase ${
                activeRole === r
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/80"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b text-sm font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="h-4 w-4" /> Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "courses"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" /> Courses & Schedules ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "students"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCheck className="h-4 w-4" /> Roster & Attendance
        </button>
        <button
          onClick={() => setActiveTab("importer")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "importer"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="h-4 w-4" /> Bulk Data Importer
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Courses</span>
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold mt-3">12</div>
              <p className="text-xs text-muted-foreground mt-1">Across 3 Departments</p>
            </div>

            <div className="p-5 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enrolled Students</span>
                <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold mt-3">485</div>
              <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 94% Average Attendance</p>
            </div>

            <div className="p-5 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Approval Queue</span>
                <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold mt-3 text-amber-600">3 Pending</div>
              <p className="text-xs text-muted-foreground mt-1">Human Review Required</p>
            </div>

            <div className="p-5 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Campus Notices</span>
                <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl">
                  <Bell className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold mt-3">5</div>
              <p className="text-xs text-muted-foreground mt-1">Published this week</p>
            </div>
          </div>

          {/* Core Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  Academic Management & Workflow Engine
                </h2>
                <span className="text-xs text-muted-foreground font-medium">Tenant ID: MIT-CS-2026</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setActiveTab("courses")}
                  className="p-4 rounded-xl border bg-muted/30 hover:bg-muted/70 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      📚 Course Catalog & Timetables
                    </h3>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    View active course schedules, assigned faculty, room allocations, and student capacities.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("students")}
                  className="p-4 rounded-xl border bg-muted/30 hover:bg-muted/70 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      📝 Attendance & Grading Tracker
                    </h3>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Record daily student attendance, generate AI grade recommendations, and monitor risk flags.
                  </p>
                </div>

                <div
                  onClick={() => window.location.assign("/dashboard/ai-approval")}
                  className="p-4 rounded-xl border bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-amber-700 dark:text-amber-400 group-hover:underline">
                      ⚡ AI Human Approval Queue
                    </h3>
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Review and approve autonomous AI grade suggestions and student warning notices before commit.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("importer")}
                  className="p-4 rounded-xl border bg-muted/30 hover:bg-muted/70 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      📤 Bulk JSON Data Importer
                    </h3>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Import departments, student rosters, courses, and schedules directly via standard JSON format.
                  </p>
                </div>
              </div>
            </div>

            {/* Official Notices */}
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-500" />
                Official Campus Notices
              </h2>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border bg-muted/40 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-foreground">Mid-Semester Exam Schedule</span>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Today</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    The timetable for mid-term assessments across CS & AI departments has been officially published.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/40 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-foreground">AI Assistant Integration Active</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full">Yesterday</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    All students and faculty can now query course syllabus documents via pgvector RAG search.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COURSES & TIMETABLES */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses, codes, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" /> Add Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl border bg-card shadow-sm hover:border-primary/50 transition-all space-y-3">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary border border-primary/20">
                      {c.code}
                    </span>
                    <h3 className="text-base font-bold mt-1 text-foreground">{c.name}</h3>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    {c.students} Students
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">Department:</span> {c.dept}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Instructor:</span> {c.instructor}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Schedule:</span> {c.schedule}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Room:</span> {c.room}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ROSTER & ATTENDANCE */}
      {activeTab === "students" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter by student name, roll number, or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-xs font-bold uppercase text-muted-foreground">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Roll Number</th>
                  <th className="p-4">Enrolled Course</th>
                  <th className="p-4">Attendance</th>
                  <th className="p-4">Grade Rec.</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-bold text-foreground">{s.name}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{s.roll}</td>
                    <td className="p-4 font-medium text-foreground">{s.course}</td>
                    <td className="p-4 font-bold text-emerald-600">{s.attendance}</td>
                    <td className="p-4 font-bold text-primary">{s.grade}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          s.status.includes("Flagged")
                            ? "bg-red-500/10 text-red-600 border border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BULK DATA IMPORTER */}
      {activeTab === "importer" && (
        <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-5 max-w-3xl">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Institutional JSON Importer
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Submit structured institution, department, course, and student roster payloads directly to the background worker pipeline.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">JSON Payload</label>
            <textarea
              rows={10}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              className="w-full p-4 rounded-xl border bg-muted/40 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {importStatus.message && (
            <div
              className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                importStatus.type === "success"
                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                  : "bg-red-500/10 text-red-700 border-red-500/30"
              }`}
            >
              {importStatus.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {importStatus.message}
            </div>
          )}

          <button
            onClick={handleRunImport}
            disabled={isImporting}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isImporting ? "Submitting Payload..." : "Execute Bulk Import"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AcademicDashboard;
