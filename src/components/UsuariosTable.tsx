"use client";
import { useUsuarioStore } from "@/store/usuarioStore";
import { useEffect, useState } from "react";
import { updateUsuario } from "@/lib/supabase/services/usuarios.client";
import { getRoles } from "@/lib/supabase/services/roles.client";
import {type Roles} from "@/types/supabase";

export default function UsuariosTable() {
  const { usuarios, getUsuarios, updateUsuarioEnStore } = useUsuarioStore();
  const [editando, setEditando] = useState<{ id: string; campo: string } | null>(null);
  const [valorEditado, setValorEditado] = useState<string>("");
  const [roles, setRoles] = useState<Roles[]>([]);

  console.log(JSON.stringify(usuarios));

  const manejarDobleClick = (id: string | undefined, campo: string, valor: string | undefined) => {
    if (!id || valor === undefined) return;
    setEditando({ id, campo });
    setValorEditado(valor);
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValorEditado(e.target.value);
  };

  const manejarGuardar = async () => {
    if (!editando) return;
    try {
      await updateUsuario(editando.id, { [editando.campo]: valorEditado });
      updateUsuarioEnStore(
        editando.id,
        editando.campo,
        valorEditado,
        Object.fromEntries(roles.map((r) => [r.id, r.nombre])) // pasamos el map id -> nombre
      );
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      setEditando(null);
    }
  };

  const manejarEnter = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === "Enter") {
      manejarGuardar();
    }
  };

  useEffect(() => {
    getUsuarios();
    getRoles().then(setRoles);
  }, []);

  return (
    <main className="flex flex-col items-center justify-start min-w-screen md:min-w-auto min-h-screen py-8 px-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Panel de Usuarios</h1>
        <p className="text-gray-600 mt-2">Administra y actualiza a los usuarios</p>
      </div>

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
            {usuarios?.map((usuario) => (
              <tr key={usuario.id}>
                <td className="px-4 py-2 border">{usuario.id}</td>
                <td
                  className="px-4 py-2 border cursor-pointer"
                  onDoubleClick={() =>
                    manejarDobleClick(usuario.id, "email", usuario.email)
                  }
                >
                  {editando?.id === usuario.id && editando.campo === "email" ? (
                    <input
                      type="text"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      className="w-full px-2 py-1 border rounded"
                      autoFocus
                    />
                  ) : (
                    usuario.email
                  )}
                </td>
                <td 
                  className="px-4 py-2 border"
                  onDoubleClick={() => manejarDobleClick(usuario.id, "rol_id", usuario.rol_id)}>
                    {
                      editando?.id === usuario.id && editando.campo === "rol_id" ? (
                        <select
                          className="w-full px-2 py-1 border rounded"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        >
                          {roles.map((rol) => (
                            <option key={rol.id} value={rol.id}>
                              {rol.nombre}
                            </option>
                          ))}
                        </select>
                      ) : (<p>{usuario.roles.nombre}</p>)
                    }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
