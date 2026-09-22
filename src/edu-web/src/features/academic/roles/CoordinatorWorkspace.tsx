import React, { useState } from "react";
import {
  Building2,
  Calendar,
  BookOpen,
  Clock,
  Bell,
  UserCheck,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Megaphone
} from "lucide-react";

export const CoordinatorWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"courses" | "timetable" | "notices" | "risk">("courses");
  const [searchQuery, setSearchQuery] = useState("");

  // Courses
  const [courses, setCourses] = useState([
    { id: "c1", code: "CS101", name: "Distributed AI Systems", dept: "Computer Science", instructor: "Dr. Sarah Connor", students: 120, schedule: "Mon/Wed 10:00 AM - 11:30 AM", room: "Hall A-101" },
    { id: "c2", code: "AI201", name: "Neural RAG & Vector Databases", dept: "Artificial Intelligence", instructor: "Prof. Alan Turing", students: 85, schedule: "Tue/Thu 02:00 PM - 03:30 PM", room: "Lab B-204" },
    { id: "c3", code: "SE305", name: "Multi-Tenant Cloud Architectures", dept: "Software Engineering", instructor: "Dr. Grace Hopper", students: 95, schedule: "Fri 09:00 AM - 12:00 PM", room: "Auditorium C" }
  ]);

  // Department Notices
  const [notices, setNotices] = useState([
    { id: "n1", title: "Mid-Semester Examination Schedule", target: "All Students", date: "Today", status: "Published" },
    { id: "n2", title: "AI Tutor Vector RAG Access Enabled", target: "CS & AI Faculty", date: "Yesterday", status: "Published" }
  ]);

  const [newNoticeTitle, setNewNoticeTitle] = useState("");
  const [newNoticeTarget, setNewNoticeTarget] = useState("All Students");

  const handleAddNotice = () => {
    if (!newNoticeTitle) return;
    setNotices([
      { id: `n-${Date.now()}`, title: newNoticeTitle, target: newNoticeTarget, date: "Just now", status: "Published" },
      ...notices
    ]);
    setNewNoticeTitle("");
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" /> Department Coordinator Authority
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mt-2">Academic Operations & Timetable Console</h2>
          <p className="text-xs text-slate-300 mt-1">
            Department course catalog management, class schedules, room allocations & official notice broadcasts.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b text-sm font-semibold">
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "courses" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" /> Course Catalog ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab("timetable")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "timetable" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="h-4 w-4" /> Timetables & Rooms
        </button>
        <button
          onClick={() => setActiveTab("notices")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "notices" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bell className="h-4 w-4" /> Campus Notices ({notices.length})
        </button>
        <button
          onClick={() => setActiveTab("risk")}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "risk" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <AlertTriangle className="h-4 w-4 text-amber-500" /> Attendance Risk Overview
        </button>
      </div>

      {/* TAB 1: COURSES */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">Department Course Offerings</h3>
            <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" /> Create Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl border bg-card shadow-sm space-y-3 hover:border-primary/50 transition-all">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary border border-primary/20">
                    {c.code}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {c.students} Students
                  </span>
                </div>
                <h4 className="font-bold text-base text-foreground">{c.name}</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><span className="font-semibold text-foreground">Instructor:</span> {c.instructor}</p>
                  <p><span className="font-semibold text-foreground">Schedule:</span> {c.schedule}</p>
                  <p><span className="font-semibold text-foreground">Room:</span> {c.room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TIMETABLES */}
      {activeTab === "timetable" && (
        <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Weekly Class Schedule Matrix
          </h3>
          <div className="rounded-xl border overflow-hidden text-xs">
            <div className="grid grid-cols-6 border-b bg-muted/60 p-3 font-bold uppercase text-muted-foreground text-center">
              <div>Time</div>
              <div>Monday</div>
              <div>Tuesday</div>
              <div>Wednesday</div>
              <div>Thursday</div>
              <div>Friday</div>
            </div>
            <div className="grid grid-cols-6 border-b p-3 items-center text-center">
              <div className="font-bold text-muted-foreground">10:00 - 11:30 AM</div>
              <div className="p-2 rounded-lg bg-primary/10 text-primary font-bold">CS101 (Hall A)</div>
              <div className="text-muted-foreground">-</div>
              <div className="p-2 rounded-lg bg-primary/10 text-primary font-bold">CS101 (Hall A)</div>
              <div className="text-muted-foreground">-</div>
              <div className="text-muted-foreground">-</div>
            </div>
            <div className="grid grid-cols-6 p-3 items-center text-center">
              <div className="font-bold text-muted-foreground">02:00 - 03:30 PM</div>
              <div className="text-muted-foreground">-</div>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 font-bold">AI201 (Lab B)</div>
              <div className="text-muted-foreground">-</div>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 font-bold">AI201 (Lab B)</div>
              <div className="text-muted-foreground">-</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTICES */}
      {activeTab === "notices" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-foreground">Published Campus Notices</h3>
            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-4 rounded-xl border bg-card shadow-sm space-y-2">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span className="text-foreground">{n.title}</span>
                    <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full">{n.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Target: {n.target}</span>
                    <span>{n.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border bg-card shadow-sm space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-indigo-600" /> Broadcast New Notice
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-muted-foreground">Notice Title</label>
                <input
                  type="text"
                  placeholder="e.g., Mid-Term Assessment Schedule"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border bg-background"
                />
              </div>
              <div>
                <label className="font-semibold text-muted-foreground">Target Audience</label>
                <select
                  value={newNoticeTarget}
                  onChange={(e) => setNewNoticeTarget(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border bg-background font-semibold"
                >
                  <option value="All Students">All Students</option>
                  <option value="CS & AI Faculty">CS & AI Faculty</option>
                  <option value="Department Coordinators">Department Coordinators</option>
                </select>
              </div>
              <button
                onClick={handleAddNotice}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
              >
                Publish Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RISK */}
      {activeTab === "risk" && (
        <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" /> Attendance Risk & Warning Monitor
          </h3>
          <p className="text-xs text-muted-foreground">
            Students whose attendance falls below the mandatory 80% institutional threshold.
          </p>

          <div className="rounded-xl border overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-muted/50 border-b font-bold uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Student</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Attendance</th>
                  <th className="p-3">AI Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3 font-bold text-foreground">Sarah Miller</td>
                  <td className="p-3 font-medium">AI201: Neural RAG</td>
                  <td className="p-3 font-bold text-red-600">78%</td>
                  <td className="p-3 text-amber-700 font-semibold">Warning Notice Sent to Faculty</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">Emily Watson</td>
                  <td className="p-3 font-medium">DS402: Autonomous Agents</td>
                  <td className="p-3 font-bold text-amber-600">84%</td>
                  <td className="p-3 text-muted-foreground">Review Recommended</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorWorkspace;
