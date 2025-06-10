"use client"

import Image from "next/image";
export default function About() {
    

    return (
        <section id="about" className="min-h-screen flex items-center justify-center bg-pink-100">
            <div className="flex flex-col md:flex-row items-center bg-white/80 rounded-xl shadow-lg p-8 md:p-16 max-w-4xl w-full">
                {/* Imagen a la izquierda */}
                <div className="flex-1 flex justify-center mb-8 md:mb-0 md:mr-8">
                    <Image
                        src="/manga-hero.png"
                        alt="Manga tienda"
                        width={200}
                        height={260}
                        className="rounded-lg shadow-lg object-cover"
                    />
                </div>
                {/* Contenido a la derecha */}
                <div className="flex-1 flex flex-col items-center md:items-start">
                    <h1 className="text-3xl md:text-4xl font-bold text-pink-700 mb-4">Sobre Nosotros</h1>
                    <p className="text-lg text-gray-700 mb-8 text-center md:text-left">
                        Somos una tienda apasionada por la cultura japonesa y el manga. Desde 2010, seleccionamos cuidadosamente los títulos más populares y exclusivos para que vivas la experiencia nipona en cada página. Nuestro equipo está formado por verdaderos fans del manga, listos para asesorarte y recomendarte tus próximas aventuras.
                    </p>
                    <div className="flex flex-col items-center mt-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-300 mb-2">
                            <Image
                                src="/perfil-marcos.png"
                                alt="Marcos Muñoz"
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <span className="font-semibold text-gray-800">Marcos Muñoz</span>
                        <span className="text-sm text-gray-500">Fundador</span>
                    </div>
                </div>
            </div>
        </section>
    )
}