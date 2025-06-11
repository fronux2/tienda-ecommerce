import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export type User = {
  id: string
  email: string
  created_at: string
  updated_at: string
}

const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email) {
        setUser({
          id: user.id,
          email: user.email,
          created_at: user.created_at ?? '',
          updated_at: user.updated_at ?? ''
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  return { user, loading }
}

export default useUser