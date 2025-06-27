// SectionMap.tsx
import Link from "next/link";

const contactInfo = [
    { 
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: "Dirección",
        content: "Av. Japón 123, Ciudad Manga"
    },
    { 
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        ),
        title: "Teléfono",
        content: "+54 11 1234-5678"
    },
    { 
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        title: "Email",
        content: "contacto@manganiho.com"
    }
];

const schedule = [
    { days: "Lunes - Viernes", hours: "9:00 - 18:00" },
    { days: "Sábados", hours: "10:00 - 14:00" }
];

export default function SectionMap() {
  return (
    <section id="location" className="w-full bg-[#FFF8F0] py-16 border-t-2 border-red-600">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
          ¿Dónde <span className="text-red-600">encontrarnos</span>?
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 flex flex-col gap-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-5">
                    <div className="bg-red-600 p-3 rounded-full flex-shrink-0">
                        {item.icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-black mb-1">{item.title}</h3>
                        <p className="text-lg text-gray-800">{item.content}</p>
                    </div>
                </div>
            ))}
            
            <div className="mt-4 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-black mb-4">Horarios de atención</h3>
                <div className="grid grid-cols-2 gap-4">
                    {schedule.map((item, index) => (
                        <div key={index}>
                            <p className="text-gray-700 font-medium">{item.days}</p>
                            <p className="text-black">{item.hours}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
          
          <div className="flex-1 w-full h-96 rounded-xl overflow-hidden shadow-2xl border-4 border-red-600">
            <iframe
                title="Ubicación MangaNihon"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-58.3816%2C-34.6037%2C-58.3816%2C-34.6037&amp;layer=mapnik"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/contacto" 
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition-colors duration-300"
          >
            Envíanos un mensaje
          </Link>
        </div>
      </div>
    </section>
  );
}