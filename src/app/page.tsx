import About from '@/components/About';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Invitation from '@/components/Invitation';
import Popular from '@/components/Popular';
import SectionMap from '@/components/SectionMap';
export default function Home() {
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
