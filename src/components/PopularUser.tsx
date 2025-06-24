import { createClient } from "@/utils/supabase/server"
import Popular from '@/components/Popular'
export default async function PopularUser() {
    const supabase = await createClient()
    const {
    data: { user },
  } = await supabase.auth.getUser()
    if (!user) return <div>No tienes usuario</div>
    return <Popular id={user?.id} />
}