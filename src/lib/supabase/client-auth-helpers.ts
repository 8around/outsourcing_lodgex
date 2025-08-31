// Client-side auth helper functions
import { createClient } from './client'
import { AuthError, User } from '@supabase/supabase-js'

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    
    return { success: true, data }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof AuthError ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (error) throw error
    
    return { success: true, data }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof AuthError ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function signOutUser() {
  const supabase = createClient()
  
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof AuthError ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

export async function onAuthStateChange(callback: (user: User | null) => void) {
  const supabase = createClient()
  
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
  
  return subscription
}