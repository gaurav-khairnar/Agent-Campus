import { Result, useAtomValue } from '@effect-atom/atom-react'
import { Link } from '@tanstack/react-router'
import { FolderIcon, PlusIcon, GraduationCap, Sparkles, Building2, ShieldCheck, ArrowRight, Upload } from 'lucide-react'
import { projectsAtom } from '@/data-acess/project'
import { useCreateProjectDialog } from '@/features/project/components/upsert-project-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const DashboardPage = () => {
  const projectsResult = useAtomValue(projectsAtom)
  const openCreateProjectDialog = useCreateProjectDialog((state) => state.open)

  const hasProjects =
    Result.isSuccess(projectsResult) && projectsResult.value.length > 0

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* AgentCampus Header & Multi-Tenant Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 p-6 md:p-8 text-white shadow-xl">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> Institution: MIT CS Dept
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Human Approval Engine Active
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                AgentCampus Workspace
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Autonomous academic operations powered by workflow AI with human approval queues, course timetabling, and multi-tenant student management.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/dashboard/academic">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Academic Console
                </Button>
              </Link>
              <Link to="/dashboard/ai-approval">
                <Button variant="outline" className="bg-slate-800/80 hover:bg-slate-800 text-slate-100 border-slate-700 font-semibold">
                  <Sparkles className="h-4 w-4 mr-2 text-amber-400" />
                  AI Queue (3)
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Action Hub Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-primary/50 transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Multi-Tenant
                </span>
              </div>
              <CardTitle className="mt-3 text-lg font-bold">Academic Operations</CardTitle>
              <CardDescription>
                Courses, department rosters, student enrollment, and class timetables.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard/academic">
                <Button variant="ghost" className="w-full justify-between text-primary font-medium hover:bg-primary/5">
                  Manage Academic Roster <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Pending Tasks
                </span>
              </div>
              <CardTitle className="mt-3 text-lg font-bold">AI Workflow Approvals</CardTitle>
              <CardDescription>
                Human-in-the-loop validation for AI recommended grades and attendance warnings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard/ai-approval">
                <Button variant="ghost" className="w-full justify-between text-primary font-medium hover:bg-primary/5">
                  Open Review Queue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  JSON / CSV
                </span>
              </div>
              <CardTitle className="mt-3 text-lg font-bold">Bulk Data Importer</CardTitle>
              <CardDescription>
                Import institutional structures, student records, and schedules in batch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard/academic">
                <Button variant="ghost" className="w-full justify-between text-primary font-medium hover:bg-primary/5">
                  Launch Importer <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Existing Projects Section Header */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Personal Learning Projects</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Course study notes, AI chat sessions, flashcard decks, and mind maps
            </p>
          </div>
          {hasProjects && (
            <Button onClick={() => openCreateProjectDialog()}>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Project
            </Button>
          )}
        </div>

        {Result.builder(projectsResult)
          .onInitialOrWaiting(() => (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ))
          .onFailure(() => (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load projects</p>
            </div>
          ))
          .onSuccess((projects) => {
            if (projects.length === 0) {
              return (
                <Card>
                  <CardHeader>
                    <CardTitle>No projects yet</CardTitle>
                    <CardDescription>
                      Get started by creating your first project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => openCreateProjectDialog()}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  </CardContent>
                </Card>
              )
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FolderIcon className="h-5 w-5" />
                        <Link
                          to="/dashboard/p/$projectId"
                          params={{ projectId: project.id }}
                          className="hover:underline"
                        >
                          {project.name}
                        </Link>
                      </CardTitle>
                      {project.description && (
                        <CardDescription>{project.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Link
                        to="/dashboard/p/$projectId"
                        params={{ projectId: project.id }}
                      >
                        <Button variant="outline" className="w-full">
                          Open Project
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          })
          .render()}
      </div>
    </div>
  )
}
