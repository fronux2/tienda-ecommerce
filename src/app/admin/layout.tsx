import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <div className="flex gap-x-4">
        <aside className="p-4">
            <nav>
                <ul className="flex flex-col gap-y-2">
                    <li><Link href="/admin/usuarios">Usuarios</Link></li>
                    <li><Link href="/admin/mangas">Mangas</Link></li>
                    <li><Link href="/admin/pedidos">Pedidos</Link></li>
                </ul>
            </nav>
        </aside>
        <div className="flex-1 overflow-x-auto">{children}</div>
      </div>
    </div>
  )
}