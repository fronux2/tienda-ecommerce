import Image from "next/image";

export default function Card1({ imagen, titulo, autor, editorial, precio }: {
  imagen: string;
  titulo: string;
  autor: string;
  editorial: string;
  precio: number;
}) {
  return (
    <main className="">
        <section className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center w-64">
        <Image
            src={imagen}
            alt={titulo}
            width={400}
            height={560}
            className="w-40 h-56 object-cover rounded mb-4 shadow"
        />
        <h3 className="text-lg font-bold text-center mb-1">{titulo}</h3>
        <p className="text-sm text-gray-700 mb-1">Autor: <span className="font-semibold">{autor}</span></p>
        <p className="text-sm text-gray-700 mb-2">Editorial: <span className="font-semibold">{editorial}</span></p>
        <p className="text-xl font-bold text-red-500">${precio}</p>
        </section>
        
    </main>
  );
}