'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { getCurrentUser, onAuthStateChange } from '@/lib/supabase/client-auth-helpers'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    getCurrentUser().then((user) => {
      setUser(user)
      setIsLoading(false)
    })

    // Subscribe to auth changes
    const subscription = onAuthStateChange((user) => {
      setUser(user)
      setIsLoading(false)
    })

    return () => {
      subscription.then((sub) => sub.unsubscribe())
    }
  }, [])

  return { user, isLoading }
}