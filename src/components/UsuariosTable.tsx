import { getUsuarios } from "@/lib/supabase/services/usuarios";

export default async function UsuariosTable() {
  const usuarios = await getUsuarios();
  return (
      <main className="flex flex-col items-center justify-start min-h-screen py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
        <p className="text-xl mb-4">Lista de Usuarios</p>
        
          <div className="overflow-x-auto w-full max-w-4xl rounded-lg border border-gray-300 shadow">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="">
                    <td className="px-4 py-2 border">{usuario.id}</td>
                    <td className="px-4 py-2 border">{usuario.email}</td>
                    <td className="px-4 py-2 border">{usuario.roles.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
      </main>
  );}