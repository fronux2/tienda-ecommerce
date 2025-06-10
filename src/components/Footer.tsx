import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-6 px-4 flex flex-col md:flex-row items-center justify-between">
      <div className="text-lg font-semibold mb-2 md:mb-0">
        MangaNihon © 2024
      </div>
      <div className="flex gap-6 text-base">
        <Link href="/admin/mangas" className="hover:text-pink-300 transition">Mangas</Link>
        <Link href="#about" className="hover:text-pink-300 transition">Sobre Nosotros</Link>
        <Link href="#section-map" className="hover:text-pink-300 transition">Encuéntranos</Link>
      </div>
    </footer>
  );
}