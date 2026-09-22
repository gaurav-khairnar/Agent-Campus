import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from '@effect-atom/atom-react'
import { supabase } from '@/lib/supabase'
import { authAtom } from '@/data-acess/auth'
import { useState, useEffect } from 'react'

export const useAuth = () => {
  const { session, user } = useAtomValue(authAtom)
  const queryClient = useQueryClient()
  const [demoUser, setDemoUser] = useState<any>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('agentcampus_demo_user')
    if (raw) {
      try {
        setDemoUser(JSON.parse(raw))
      } catch (e) {
        setDemoUser(null)
      }
    }
  }, [])

  const activeUser = demoUser || user

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password?: string
    }) => {
      if (password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin,
          },
        })
        if (error) throw error
        return data
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      sessionStorage.removeItem('agentcampus_demo_user')
      setDemoUser(null)
      const { error } = await supabase.auth.signOut()
      if (error) console.log('Signed out demo session')
    },
    onSuccess: () => {
      queryClient.clear()
      window.location.assign('/sign-in')
    },
    onError: (error) => {
      console.error('Logout failed:', error)
    },
  })

  return {
    isAuthenticated: !!session || !!demoUser,
    session,
    user: activeUser,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
  }
}
