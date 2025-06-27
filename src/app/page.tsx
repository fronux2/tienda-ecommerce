// page.tsx
import About from '@/components/About';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Invitation from '@/components/Invitation';
import Popular from '@/components/Popular';
import SectionMap from '@/components/SectionMap';
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return (
    <main>
      <Hero />
      <Popular id={user?.id} />
      <About />
      <SectionMap />
      <Invitation />
      <Footer />
    </main>
  );
}