import React, { useState } from "react";
import { Sparkles, Check, X, ShieldAlert, FileText, UserCheck } from "lucide-react";

export interface ApprovalTask {
  id: string;
  workflow_type: string;
  payload: {
    student_name?: string;
    course_name?: string;
    recommended_grade?: string;
    recommended_feedback?: string;
    reason?: string;
  };
  created_at: string;
}

export const AIApprovalQueue: React.FC = () => {
  const [tasks, setTasks] = useState<ApprovalTask[]>([
    {
      id: "task-1",
      workflow_type: "grade_recommendation",
      payload: {
        student_name: "Alex Johnson",
        course_name: "CS101: Introduction to Computer Science",
        recommended_grade: "A- (92%)",
        recommended_feedback: "Excellent analysis of spatial complexity. minor omission in recursive base case.",
      },
      created_at: "10 mins ago",
    },
    {
      id: "task-2",
      workflow_type: "attendance_flag",
      payload: {
        student_name: "Sarah Miller",
        course_name: "AI201: Neural Networks",
        reason: "Student missed 3 consecutive lectures. Recommended warning notification to advisor.",
      },
      created_at: "1 hour ago",
    },
  ]);

  const handleAction = (taskId: string, action: "approve" | "reject") => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-500" />
          AI Workflow Approval Queue
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and approve autonomous AI recommendations before they are committed to institutional records.
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="p-12 text-center border rounded-xl bg-card space-y-3">
          <UserCheck className="h-12 w-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-semibold">Queue Cleared!</h3>
          <p className="text-sm text-muted-foreground">All pending AI recommendations have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-5 rounded-xl border bg-card shadow-sm hover:border-primary/50 transition-colors space-y-3">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 uppercase border border-amber-500/20">
                    {task.workflow_type.replace("_", " ")}
                  </span>
                  <span className="text-xs text-muted-foreground">{task.created_at}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(task.id, "reject")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button
                    onClick={() => handleAction(task.id, "approve")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve & Execute
                  </button>
                </div>
              </div>

              <div className="text-sm space-y-2">
                <p>
                  <span className="font-semibold text-foreground">Course:</span> {task.payload.course_name}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Student:</span> {task.payload.student_name}
                </p>
                {task.payload.recommended_grade && (
                  <p>
                    <span className="font-semibold text-foreground">Recommended Grade:</span>{" "}
                    <span className="font-bold text-emerald-600">{task.payload.recommended_grade}</span>
                  </p>
                )}
                {task.payload.recommended_feedback && (
                  <p className="text-muted-foreground bg-muted/40 p-3 rounded-md text-xs italic">
                    "{task.payload.recommended_feedback}"
                  </p>
                )}
                {task.payload.reason && <p className="text-amber-700 text-xs bg-amber-50 p-2.5 rounded-md">{task.payload.reason}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIApprovalQueue;
