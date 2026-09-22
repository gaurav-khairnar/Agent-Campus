import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAtom, useAtomValue } from '@effect-atom/atom-react'
import { Cause } from 'effect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isAuthenticatedAtom, signInAtom } from '@/data-acess/auth'
import { Shield, Building2, GraduationCap, BookOpen, KeyRound, Sparkles } from 'lucide-react'

export const SignInPage = () => {
  const [signInResult, signIn] = useAtom(signInAtom)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  const isLoading = signInResult.waiting
  const navigate = useNavigate()
  const search = useSearch({ from: '/sign-in' })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Specific Pre-Configured AgentCampus Demo Accounts
  const demoAccounts = [
    {
      role: 'admin',
      label: 'System Admin',
      email: 'admin@agentcampus.edu',
      password: 'admin123',
      name: 'System Administrator',
      inst: '11111111-1111-1111-1111-111111111111',
      icon: Shield,
      color: 'bg-slate-900 hover:bg-slate-800 text-white',
    },
    {
      role: 'coordinator',
      label: 'Department Coordinator',
      email: 'coordinator@agentcampus.edu',
      password: 'coord123',
      name: 'Dr. Sarah Connor',
      inst: '11111111-1111-1111-1111-111111111111',
      icon: Building2,
      color: 'bg-blue-600 hover:bg-blue-500 text-white',
    },
    {
      role: 'faculty',
      label: 'Faculty Instructor',
      email: 'faculty@agentcampus.edu',
      password: 'faculty123',
      name: 'Prof. Alan Turing',
      inst: '11111111-1111-1111-1111-111111111111',
      icon: GraduationCap,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    },
    {
      role: 'student',
      label: 'Enrolled Student',
      email: 'student@agentcampus.edu',
      password: 'student123',
      name: 'Alex Johnson',
      inst: '11111111-1111-1111-1111-111111111111',
      icon: BookOpen,
      color: 'bg-purple-600 hover:bg-purple-500 text-white',
    },
  ]

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated || sessionStorage.getItem('agentcampus_demo_user')) {
      const redirectUrl =
        search?.redirect || sessionStorage.getItem('auth.redirect')
      if (redirectUrl) {
        sessionStorage.removeItem('auth.redirect')
        const dashboardUrl = redirectUrl.startsWith('/dashboard')
          ? redirectUrl
          : `/dashboard${redirectUrl}`
        navigate({ to: dashboardUrl })
      } else {
        navigate({ to: '/dashboard/academic' })
      }
    }
  }, [isAuthenticated, navigate, search?.redirect])

  const handleDemoLogin = (acc: typeof demoAccounts[0]) => {
    // Store demo session locally for dev testing
    sessionStorage.setItem(
      'agentcampus_demo_user',
      JSON.stringify({
        id: `${acc.role}-user-001`,
        email: acc.email,
        name: acc.name,
        role: acc.role,
        institution_id: acc.inst,
      })
    )
    window.location.assign('/dashboard/academic')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    // Check if entered credentials match a demo account
    const matched = demoAccounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    )
    if (matched) {
      handleDemoLogin(matched)
      return
    }

    if (search?.redirect) {
      sessionStorage.setItem('auth.redirect', search.redirect)
    }

    signIn({ type: 'password', email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg space-y-8 p-8 rounded-3xl border bg-card shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-2">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            AgentCampus Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in with your institutional credentials or choose a pre-configured role test account.
          </p>
        </div>

        {/* Demo Account Quick Selector */}
        <div className="space-y-3 p-4 rounded-2xl bg-muted/40 border">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> One-Click Role Access (Development)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => {
              const IconComp = acc.icon
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleDemoLogin(acc)}
                  className={`p-3 rounded-xl font-bold text-xs flex flex-col items-start gap-1 shadow-sm transition-all ${acc.color}`}
                >
                  <div className="flex items-center gap-1.5">
                    <IconComp className="h-4 w-4" />
                    <span>{acc.label}</span>
                  </div>
                  <span className="text-[10px] opacity-80 font-mono font-normal">
                    {acc.email}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Standard Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative flex items-center justify-center text-xs uppercase text-muted-foreground my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <span className="relative bg-card px-3 font-semibold">Or Enter Credentials</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. coordinator@agentcampus.edu"
              autoComplete="email"
              disabled={isLoading}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              className="rounded-xl"
            />
          </div>

          {signInResult._tag === 'Failure' && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-semibold">
              {Cause.pretty(signInResult.cause)}
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-2.5 rounded-xl font-bold text-sm shadow-md"
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
              className="text-primary hover:underline font-semibold"
            >
              Privacy Policy & Terms
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
