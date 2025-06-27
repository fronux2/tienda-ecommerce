import About from '@/components/About';
import { Suspense } from 'react';
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
  return (
    <main>
      {/* Hero con preload */}
      <Hero />
      
      {/* Componente Popular con Suspense para lazy loading */}
      <Suspense fallback={<div>Cargando populares...</div>}>
        <Popular id={user?.id} />
      </Suspense>
      
      <About />
      <SectionMap/>
      <Invitation/>
      <Footer />
    </main>
  );
}
