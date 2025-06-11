import { createClient } from '@/utils/supabase/server'



const useRol = async () => {
  const supabase = await createClient()
  
    const {
      data: { user },
    } = await supabase.auth.getUser()

  return { user }
}

export default useRol