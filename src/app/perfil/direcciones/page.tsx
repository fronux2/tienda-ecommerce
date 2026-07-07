'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getDirecciones, addDireccion, updateDireccion, deleteDireccion } from '@/lib/supabase/services/direcciones.client'
import type { Direccion } from '@/types/supabase'

export default function MisDirecciones() {
  const supabase = createClient()
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nombre_direccion: '',
    direccion: '',
    ciudad: '',
    codigo_postal: '',
  })

  const cargarDirecciones = useCallback(async (uid: string) => {
    const data = await getDirecciones(uid)
    setDirecciones(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      cargarDirecciones(user.id)
    }
    init()
  }, [supabase, cargarDirecciones])

  const resetForm = () => {
    setForm({ nombre_direccion: '', direccion: '', ciudad: '', codigo_postal: '' })
    setShowForm(false)
    setEditandoId(null)
  }

  const handleSubmit = async () => {
    if (saving || !userId) return
    setSaving(true)
    try {
      if (editandoId) {
        await updateDireccion(editandoId, form)
      } else {
        await addDireccion({ ...form, usuario_id: userId })
      }
      resetForm()
      cargarDirecciones(userId)
    } catch {
      alert('Error al guardar la dirección')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (d: Direccion) => {
    setForm({
      nombre_direccion: d.nombre_direccion,
      direccion: d.direccion,
      ciudad: d.ciudad,
      codigo_postal: d.codigo_postal ?? '',
    })
    setEditandoId(d.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta dirección?')) return
    try {
      await deleteDireccion(id)
      if (userId) cargarDirecciones(userId)
    } catch {
      alert('Error al eliminar la dirección')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Direcciones</h1>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm) }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors active:scale-95"
        >
          {showForm ? 'Cancelar' : 'Agregar dirección'}
        </button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
          <h2 className="font-semibold mb-4">
            {editandoId ? 'Editar dirección' : 'Nueva dirección'}
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre (ej: Casa, Trabajo)"
              value={form.nombre_direccion}
              onChange={(e) => setForm({ ...form, nombre_direccion: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Dirección"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Ciudad"
              value={form.ciudad}
              onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Código postal (opcional)"
              value={form.codigo_postal}
              onChange={(e) => setForm({ ...form, codigo_postal: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleSubmit}
              disabled={saving || !form.nombre_direccion || !form.direccion || !form.ciudad}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {saving ? 'Guardando...' : editandoId ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {direcciones.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No tienes direcciones guardadas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {direcciones.map((d) => (
            <div key={d.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{d.nombre_direccion}</p>
                  <p className="text-sm text-gray-600">{d.direccion}</p>
                  <p className="text-sm text-gray-600">{d.ciudad}</p>
                  {d.codigo_postal && (
                    <p className="text-sm text-gray-500">CP: {d.codigo_postal}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="text-blue-600 hover:text-blue-800 text-sm active:scale-95 transition-all"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="text-red-600 hover:text-red-800 text-sm active:scale-95 transition-all"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
