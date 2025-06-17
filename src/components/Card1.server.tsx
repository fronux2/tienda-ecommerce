import Image from "next/image";
import {AddCardButton2 } from "@/components/AddCardButton2";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Card1({ id, imagen, titulo, autor, editorial, precio }: {
  id: string;
  imagen: string;
  titulo: string;
  autor: string;
  editorial: string;
  precio: number;
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !id) return
  return (
    <main className="">
        <section className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center w-64">
          <Link href={`/mangas/${id}`}>
          
            <Image
                src={imagen}
                alt={titulo}
                width={400}
                height={560}
                className="w-40 h-56 object-cover rounded mb-4 shadow"
            />
          </Link>
        <h3 className="text-lg font-bold text-center mb-1">{titulo}</h3>
        <p className="text-sm text-gray-700 mb-1">Autor: <span className="font-semibold">{autor}</span></p>
        <p className="text-sm text-gray-700 mb-2">Editorial: <span className="font-semibold">{editorial}</span></p>
        <p className="text-xl font-bold text-red-500">${precio}</p>
        <AddCardButton2 mangaId={id} userId={user.id}/>
        </section>
        
    </main>
  );
}