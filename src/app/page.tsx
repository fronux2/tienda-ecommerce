import About from '@/components/About';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Invitation from '@/components/Invitation';
import Popular from '@/components/Popular';
import SectionMap from '@/components/SectionMap';
import { createClient } from "@/utils/supabase/server";
export default async function Home() {

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return <div>No tienes usuario</div>
  return (
    <div>
       <Hero />
       <Popular/>
       <About />
       <SectionMap/>
       <Invitation/>
       <Footer />
    </div>
  );
}
