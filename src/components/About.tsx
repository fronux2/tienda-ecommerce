// About.tsx
import Image from "next/image";

export default function About() {
    return (
        <section id="about" className="min-h-screen flex items-center justify-center bg-[#FFF8F0] py-20 px-4">
            <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-xl border-2 border-black p-6 md:p-12 max-w-6xl w-full">
                <div className="flex-1 flex justify-center mb-10 md:mb-0 md:mr-10">
                    <div className="relative w-full max-w-md overflow-hidden rounded-lg shadow-2xl">
                        <Image
                            src="/imagenes/pasillo.webp"
                            alt="Manga tienda"
                            width={500}
                            height={650}
                            className="object-cover w-full h-auto rounded-lg transform transition-transform duration-500 hover:scale-105"
                            priority
                        />
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col items-center md:items-start">
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                            <span className="text-red-600">Sobre</span> Nosotros
                        </h1>
                        <div className="h-1 w-24 bg-red-600 rounded-full mb-6"></div>
                    </div>
                    
                    <p className="text-lg text-gray-800 mb-8 text-center md:text-left leading-relaxed">
                        Somos una tienda apasionada por la cultura japonesa y el manga. Desde 2010, 
                        seleccionamos cuidadosamente los títulos más populares y exclusivos para que vivas 
                        la experiencia nipona en cada página.
                    </p>
                    
                    <div className="flex flex-col items-center mt-4">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                            <Image
                                src="/imagenes/pasillo.webp"
                                alt="Marcos Muñoz"
                                width={96}
                                height={96}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <span className="font-bold text-black text-lg">Marcos Muñoz</span>
                        <span className="text-red-600 font-medium">Fundador</span>
                    </div>
                    
                    <div className="mt-8 flex space-x-4">
                        {[
                            { value: "13+", label: "Años de experiencia" },
                            { value: "5K+", label: "Clientes satisfechos" },
                            { value: "20K+", label: "Mangas disponibles" }
                        ].map((item, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <span className="text-4xl font-bold text-red-600">{item.value}</span>
                                <span className="text-black">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}