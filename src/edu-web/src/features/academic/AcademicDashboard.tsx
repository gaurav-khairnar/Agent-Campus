import React, { useState } from "react";
import { Building2, GraduationCap, Users, Calendar, CheckSquare, Bell, Sparkles, ShieldCheck } from "lucide-react";

export interface AcademicDashboardProps {
  userRole?: "admin" | "coordinator" | "faculty" | "student";
}

export const AcademicDashboard: React.FC<AcademicDashboardProps> = ({ userRole = "student" }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            AgentCampus Workspace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Multi-Tenant Academic Operations & AI Approval Engine • Role:{" "}
            <span className="font-semibold uppercase text-primary">{userRole}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" /> Human-in-the-Loop Active
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Active Courses</span>
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-extrabold mt-2">12</div>
          <p className="text-xs text-muted-foreground mt-1">Across 3 Departments</p>
        </div>

        <div className="p-5 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Enrolled Students</span>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold mt-2">485</div>
          <p className="text-xs text-muted-foreground mt-1">94% Average Attendance</p>
        </div>

        <div className="p-5 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">AI Approval Queue</span>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold mt-2 text-amber-600">3 Pending</div>
          <p className="text-xs text-muted-foreground mt-1">Requires Faculty Review</p>
        </div>

        <div className="p-5 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Campus Notices</span>
            <Bell className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold mt-2">5</div>
          <p className="text-xs text-muted-foreground mt-1">Published this week</p>
        </div>
      </div>

      {/* Role-Specific Actions & Workflow Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Academic Actions */}
        <div className="lg:col-span-2 p-5 rounded-xl border bg-card shadow-sm space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            Academic Management Console
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-lg border bg-accent/40 hover:bg-accent/70 cursor-pointer transition-colors space-y-1">
              <h3 className="font-semibold text-sm">📚 Course Catalog & Timetables</h3>
              <p className="text-xs text-muted-foreground">View course schedules, assigned faculty, and room allocations.</p>
            </div>

            <div className="p-4 rounded-lg border bg-accent/40 hover:bg-accent/70 cursor-pointer transition-colors space-y-1">
              <h3 className="font-semibold text-sm">📝 Attendance & Assessment Tracker</h3>
              <p className="text-xs text-muted-foreground">Record daily student attendance and grade submissions.</p>
            </div>

            <div className="p-4 rounded-lg border bg-accent/40 hover:bg-accent/70 cursor-pointer transition-colors space-y-1">
              <h3 className="font-semibold text-sm">🤖 AI Approval Queue</h3>
              <p className="text-xs text-muted-foreground">Review and approve AI recommended grades and attendance flags.</p>
            </div>

            <div className="p-4 rounded-lg border bg-accent/40 hover:bg-accent/70 cursor-pointer transition-colors space-y-1">
              <h3 className="font-semibold text-sm">📤 Bulk Academic Importer</h3>
              <p className="text-xs text-muted-foreground">Import departments, student rosters, and schedules from JSON/CSV.</p>
            </div>
          </div>
        </div>

        {/* Notices / Announcements */}
        <div className="p-5 rounded-xl border bg-card shadow-sm space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Official Announcements
          </h2>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border bg-background text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span>Mid-Semester Exam Schedule</span>
                <span className="text-[10px] text-muted-foreground">Today</span>
              </div>
              <p className="text-muted-foreground">The timetable for mid-term assessments has been published.</p>
            </div>

            <div className="p-3 rounded-lg border bg-background text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span>AI Tutor Integration Active</span>
                <span className="text-[10px] text-muted-foreground">Yesterday</span>
              </div>
              <p className="text-muted-foreground">All students can now access vector RAG search for course PDFs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicDashboard;
