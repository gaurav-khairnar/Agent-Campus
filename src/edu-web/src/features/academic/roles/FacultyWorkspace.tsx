import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  UserCheck,
  CheckSquare,
  BookOpen,
  Check,
  X,
  Search,
  ShieldCheck,
  Award
} from "lucide-react";
import AIApprovalQueue from "../AIApprovalQueue";

export const FacultyWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"courses" | "attendance" | "ai_queue">("ai_queue");

  const [myCourses] = useState([
    { id: "c1", code: "CS101", name: "Distributed AI Systems", students: 120, schedule: "Mon/Wed 10:00 AM", room: "Hall A-101" },
    { id: "c2", code: "AI201", name: "Neural RAG & Vector Databases", students: 85, schedule: "Tue/Thu 02:00 PM", room: "Lab B-204" }
  ]);

  const [studentRoster, setStudentRoster] = useState([
    { id: "s1", name: "Alex Johnson", roll: "CS2026-001", attendance: "Present", grade: "A-", recGrade: "A-" },
    { id: "s2", name: "Sarah Miller", roll: "AI2026-042", attendance: "Absent", grade: "B+", recGrade: "B" },
    { id: "s3", name: "David Chen", roll: "SE2026-015", attendance: "Present", grade: "A", recGrade: "A" }
  ]);

  const handleToggleAttendance = (id: string) => {
    setStudentRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, attendance: s.attendance === "Present" ? "Absent" : "Present" } : s))
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" /> Faculty Instructor Authority
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mt-2">Faculty Teaching & AI Verification Hub</h2>
          <p className="text-xs text-slate-300 mt-1">
            Course instruction, daily student attendance logging, assignment grading & human AI approval queue.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b text-sm font-semibold">
        <button
          onClick={() => setActiveTab("ai_queue")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "ai_queue" ? "border-amber-500 text-amber-600 font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-500" /> AI Approval Queue (3 Pending)
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "attendance" ? "border-emerald-600 text-emerald-600" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCheck className="h-4 w-4" /> Attendance & Grading
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "courses" ? "border-emerald-600 text-emerald-600" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" /> My Assigned Courses ({myCourses.length})
        </button>
      </div>

      {/* TAB 1: AI APPROVAL QUEUE */}
      {activeTab === "ai_queue" && <AIApprovalQueue />}

      {/* TAB 2: ATTENDANCE & GRADING */}
      {activeTab === "attendance" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">Interactive Class Roster & Attendance</h3>
            <span className="text-xs text-muted-foreground font-semibold">Course: CS101 Distributed AI Systems</span>
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-xs font-bold uppercase text-muted-foreground">
                  <th className="p-4">Student</th>
                  <th className="p-4">Roll Number</th>
                  <th className="p-4">Today's Attendance</th>
                  <th className="p-4">Current Grade</th>
                  <th className="p-4">AI Rec. Grade</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {studentRoster.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-bold text-foreground">{s.name}</td>
                    <td className="p-4 text-xs font-mono text-muted-foreground">{s.roll}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleAttendance(s.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          s.attendance === "Present"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-600 border border-red-500/20"
                        }`}
                      >
                        {s.attendance} (Click to toggle)
                      </button>
                    </td>
                    <td className="p-4 font-bold text-foreground">{s.grade}</td>
                    <td className="p-4 font-bold text-emerald-600">{s.recGrade}</td>
                    <td className="p-4">
                      <button className="px-3 py-1 rounded-lg border bg-background text-xs font-semibold hover:bg-muted">
                        Edit Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MY COURSES */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myCourses.map((c) => (
            <div key={c.id} className="p-5 rounded-2xl border bg-card shadow-sm space-y-3 hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {c.code}
                </span>
                <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {c.students} Students
                </span>
              </div>
              <h4 className="font-bold text-base text-foreground">{c.name}</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><span className="font-semibold text-foreground">Schedule:</span> {c.schedule}</p>
                <p><span className="font-semibold text-foreground">Room Allocation:</span> {c.room}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyWorkspace;
