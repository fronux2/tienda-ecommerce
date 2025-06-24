import { createClient} from "@/utils/supabase/server";

export default async function WithUser({ children }: { children:(user: {id: string}) => React.ReactNode }) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return <div>No tienes usuario</div>

    return <div>{children({ id: user?.id })}</div>
}
 