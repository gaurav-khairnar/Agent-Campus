import React, { useState } from "react";
import {
  BookOpen,
  UserCheck,
  Calendar,
  Bell,
  Sparkles,
  Award,
  Clock,
  ArrowRight,
  Brain,
  FileText,
  Layers,
  MapPin
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export const StudentWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"courses" | "schedule" | "notices" | "ai_tutor">("courses");

  const enrolledCourses = [
    { id: "c1", code: "CS101", name: "Distributed AI Systems", instructor: "Dr. Sarah Connor", attendance: "96%", grade: "A-", room: "Hall A-101", schedule: "Mon/Wed 10:00 AM" },
    { id: "c2", code: "AI201", name: "Neural RAG & Vector Databases", instructor: "Prof. Alan Turing", attendance: "88%", grade: "B+", room: "Lab B-204", schedule: "Tue/Thu 02:00 PM" },
    { id: "c3", code: "SE305", name: "Multi-Tenant Cloud Architectures", instructor: "Dr. Grace Hopper", attendance: "94%", grade: "A", room: "Auditorium C", schedule: "Fri 09:00 AM" }
  ];

  const notices = [
    { id: "n1", title: "Mid-Semester Examination Schedule", text: "The timetable for mid-term assessments has been officially published.", date: "Today" },
    { id: "n2", title: "AI Assistant Vector Search Active", text: "You can now query all syllabus PDFs using pgvector RAG search.", date: "Yesterday" }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" /> Student Learner Hub
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mt-2">Welcome Back, Alex! 👋</h2>
          <p className="text-xs text-purple-200 mt-1">
            Enrolled in 3 courses • Average Attendance: <span className="font-bold text-emerald-400">93%</span> • GPA: <span className="font-bold text-amber-300">3.82</span>
          </p>
        </div>

        <Link to="/dashboard">
          <button className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-300" /> Open AI Tutor Projects <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b text-sm font-semibold">
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "courses" ? "border-purple-600 text-purple-600 font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" /> My Enrolled Courses ({enrolledCourses.length})
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "schedule" ? "border-purple-600 text-purple-600 font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="h-4 w-4" /> Class Schedule & Rooms
        </button>
        <button
          onClick={() => setActiveTab("ai_tutor")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "ai_tutor" ? "border-purple-600 text-purple-600 font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Brain className="h-4 w-4 text-amber-500" /> AI Study Tools
        </button>
        <button
          onClick={() => setActiveTab("notices")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "notices" ? "border-purple-600 text-purple-600 font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bell className="h-4 w-4" /> Campus Notices ({notices.length})
        </button>
      </div>

      {/* TAB 1: ENROLLED COURSES */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {enrolledCourses.map((c) => (
            <div key={c.id} className="p-5 rounded-2xl border bg-card shadow-sm space-y-3 hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-500/10 text-purple-600 border border-purple-500/20">
                  {c.code}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Attendance: {c.attendance}
                </span>
              </div>
              <h4 className="font-bold text-base text-foreground">{c.name}</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><span className="font-semibold text-foreground">Instructor:</span> {c.instructor}</p>
                <p><span className="font-semibold text-foreground">Schedule:</span> {c.schedule}</p>
                <p><span className="font-semibold text-foreground">Room:</span> {c.room}</p>
                <p><span className="font-semibold text-foreground">Current Grade:</span> <span className="font-bold text-primary">{c.grade}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: SCHEDULE */}
      {activeTab === "schedule" && (
        <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" /> Daily Class Schedule
          </h3>
          <div className="space-y-3">
            {enrolledCourses.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border bg-muted/30 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-foreground text-sm">{c.name} ({c.code})</span>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> {c.room} • Instructor: {c.instructor}
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 font-bold border border-purple-500/20">
                  {c.schedule}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AI STUDY TOOLS */}
      {activeTab === "ai_tutor" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border bg-card shadow-sm space-y-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 w-fit">
              <Brain className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-base">RAG Course Document Chat</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ask questions grounded directly in your uploaded syllabus PDFs and course slide decks.
            </p>
            <Link to="/dashboard">
              <button className="w-full mt-2 py-2 rounded-xl border bg-background text-xs font-bold hover:bg-muted">
                Open Course AI Chat
              </button>
            </Link>
          </div>

          <div className="p-5 rounded-2xl border bg-card shadow-sm space-y-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 w-fit">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-base">Adaptive AI Quizzes & Flashcards</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Automatically generate active recall flashcard decks and practice quizzes for upcoming mid-terms.
            </p>
            <Link to="/dashboard">
              <button className="w-full mt-2 py-2 rounded-xl border bg-background text-xs font-bold hover:bg-muted">
                Generate Study Aids
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* TAB 4: NOTICES */}
      {activeTab === "notices" && (
        <div className="space-y-3">
          {notices.map((n) => (
            <div key={n.id} className="p-4 rounded-xl border bg-card shadow-sm space-y-1 text-xs">
              <div className="flex items-center justify-between font-bold text-sm">
                <span className="text-foreground">{n.title}</span>
                <span className="text-muted-foreground font-normal">{n.date}</span>
              </div>
              <p className="text-muted-foreground">{n.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentWorkspace;
