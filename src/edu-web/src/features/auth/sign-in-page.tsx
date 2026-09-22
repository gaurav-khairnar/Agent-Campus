import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth, DEMO_ACCOUNTS } from '@/hooks/use-auth'
import { Shield, Building2, GraduationCap, BookOpen, Key, Sparkles } from 'lucide-react'

export const SignInPage = () => {
  const { login, switchDemoUser, isLoading, loginError } = useAuth()
  const navigate = useNavigate()
  const search = useSearch({ from: '/sign-in' })

  const [email, setEmail] = useState('coordinator@agentcampus.edu')
  const [password, setPassword] = useState('CoordPass123!')

  const handleDemoClick = (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email)
    setPassword(account.role === 'admin' ? 'AdminPass123!' : account.role === 'coordinator' ? 'CoordPass123!' : account.role === 'faculty' ? 'FacultyPass123!' : 'StudentPass123!')
    switchDemoUser(account)
    navigate({ to: '/dashboard/academic' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, password })
    navigate({ to: '/dashboard/academic' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Dev & Evaluation Mode Active
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            AgentCampus Sign In
          </h1>
          <p className="text-sm text-muted-foreground">
            Authenticate using production Supabase credentials or 1-click test personas below.
          </p>
        </div>

        {/* 1-Click Demo Persona Credentials Switcher */}
        <div className="p-5 rounded-2xl border bg-card shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Key className="h-4 w-4 text-primary" /> Dev Quick Login Test Accounts
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">1-Click Bypass</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick(DEMO_ACCOUNTS[0])}
              className="p-3 rounded-xl border bg-slate-900 text-white hover:bg-slate-800 text-left transition-all space-y-0.5 group"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Admin</span>
                <span className="text-[10px] text-slate-400">System</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono truncate">admin@agentcampus.edu</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick(DEMO_ACCOUNTS[1])}
              className="p-3 rounded-xl border bg-blue-600 text-white hover:bg-blue-500 text-left transition-all space-y-0.5 group"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> Coordinator</span>
                <span className="text-[10px] text-blue-200">Dept</span>
              </div>
              <p className="text-[11px] text-blue-100 font-mono truncate">coordinator@agentcampus.edu</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick(DEMO_ACCOUNTS[2])}
              className="p-3 rounded-xl border bg-emerald-600 text-white hover:bg-emerald-500 text-left transition-all space-y-0.5 group"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> Faculty</span>
                <span className="text-[10px] text-emerald-200">Teacher</span>
              </div>
              <p className="text-[11px] text-emerald-100 font-mono truncate">faculty@agentcampus.edu</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick(DEMO_ACCOUNTS[3])}
              className="p-3 rounded-xl border bg-purple-600 text-white hover:bg-purple-500 text-left transition-all space-y-0.5 group"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> Student</span>
                <span className="text-[10px] text-purple-200">Learner</span>
              </div>
              <p className="text-[11px] text-purple-100 font-mono truncate">student@agentcampus.edu</p>
            </button>
          </div>
        </div>

        {/* Manual Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@agentcampus.edu"
              autoComplete="email"
              disabled={isLoading}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-bold">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              className="rounded-xl"
            />
          </div>

          {loginError && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3">
              <p className="text-xs text-destructive font-semibold">
                {loginError instanceof Error ? loginError.message : 'Sign in failed'}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full rounded-xl font-bold py-2.5 shadow-md"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Authenticating...' : 'Sign in to AgentCampus'}
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-2">
            By signing in, you agree to our{' '}
            <a
              href="https://github.com/gaurav-khairnar/Agent-Campus/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Privacy Policy & Terms
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
