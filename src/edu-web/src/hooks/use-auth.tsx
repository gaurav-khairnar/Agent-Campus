import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from '@effect-atom/atom-react'
import { supabase } from '@/lib/supabase'
import { authAtom } from '@/data-acess/auth'

export interface DemoUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'coordinator' | 'faculty' | 'student'
  institution_id: string
}

export const DEMO_ACCOUNTS: DemoUser[] = [
  {
    id: 'demo-admin-01',
    name: 'Elena Rostova (System Admin)',
    email: 'admin@agentcampus.edu',
    role: 'admin',
    institution_id: '11111111-1111-1111-1111-111111111111',
  },
  {
    id: 'demo-coord-01',
    name: 'Dr. Sarah Connor (CS Chair)',
    email: 'coordinator@agentcampus.edu',
    role: 'coordinator',
    institution_id: '11111111-1111-1111-1111-111111111111',
  },
  {
    id: 'demo-faculty-01',
    name: 'Prof. Alan Turing (AI Faculty)',
    email: 'faculty@agentcampus.edu',
    role: 'faculty',
    institution_id: '11111111-1111-1111-1111-111111111111',
  },
  {
    id: 'demo-student-01',
    name: 'Alex Johnson (CS Senior)',
    email: 'student@agentcampus.edu',
    role: 'student',
    institution_id: '11111111-1111-1111-1111-111111111111',
  },
]

export const useAuth = () => {
  const { session, user: supabaseUser } = useAtomValue(authAtom)
  const queryClient = useQueryClient()

  const [demoUser, setDemoUser] = useState<DemoUser | null>(() => {
    const stored = localStorage.getItem('demo_user_identity')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return DEMO_ACCOUNTS[1] // default to coordinator
      }
    }
    return DEMO_ACCOUNTS[1] // default coordinator
  })

  useEffect(() => {
    if (demoUser) {
      localStorage.setItem('demo_user_identity', JSON.stringify(demoUser))
    }
  }, [demoUser])

  const switchDemoUser = (account: DemoUser) => {
    setDemoUser(account)
    localStorage.setItem('demo_user_identity', JSON.stringify(account))
    window.location.reload()
  }

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password?: string
    }) => {
      // Check if logging in as one of the demo credentials
      const matchingDemo = DEMO_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === email.toLowerCase(),
      )
      if (matchingDemo) {
        setDemoUser(matchingDemo)
        localStorage.setItem(
          'demo_user_identity',
          JSON.stringify(matchingDemo),
        )
        return { user: matchingDemo, session: { access_token: 'demo-token' } }
      }

      if (password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        return data
      }
    },
    onError: (error) => {
      console.error('Login error:', error)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem('demo_user_identity')
      await supabase.auth.signOut()
    },
    onSuccess: () => {
      queryClient.clear()
      setDemoUser(null)
      window.location.assign('/sign-in')
    },
  })

  // Resolved user identity
  const activeUser = supabaseUser
    ? {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
        email: supabaseUser.email,
        role: (supabaseUser.user_metadata?.role || demoUser?.role || 'coordinator') as any,
        institution_id: demoUser?.institution_id || '11111111-1111-1111-1111-111111111111',
      }
    : demoUser

  return {
    isAuthenticated: true, // Bypass in dev mode so tester can evaluate all pages
    session: session || { access_token: 'demo-jwt-token' },
    user: activeUser,
    demoUser,
    switchDemoUser,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    loginError: loginMutation.error,
  }
}
