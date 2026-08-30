'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getDirecciones, addDireccion, updateDireccion, deleteDireccion } from '@/lib/supabase/services/direcciones.client'
import type { Direccion } from '@/types/supabase'
import { direccionSchema } from '@/schemas/direccionesSchema'
import { REGIONES_CHILE } from '@/lib/regionesChile'
import LoadingButton from '@/components/LoadingButton'

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
    calle: '',
    numero: '',
    departamento: '',
    comuna: '',
    ciudad: '',
    region: '',
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
    setForm({ nombre_direccion: '', calle: '', numero: '', departamento: '', comuna: '', ciudad: '', region: '', codigo_postal: '' })
    setShowForm(false)
    setEditandoId(null)
  }

  const handleSubmit = async () => {
    if (saving || !userId) return
    const parsed = direccionSchema.safeParse(form)
    if (!parsed.success) {
      alert(parsed.error.errors[0].message)
      return
    }
    setSaving(true)
    try {
      if (editandoId) {
        await updateDireccion(editandoId, form)
      } else {
        await addDireccion({ ...form, usuario_id: userId, pais: 'Chile' })
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
      calle: d.calle,
      numero: d.numero,
      departamento: d.departamento ?? '',
      comuna: d.comuna,
      ciudad: d.ciudad,
      region: d.region ?? '',
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
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Direcciones</h1>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm) }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
        >
          {showForm ? 'Cancelar' : 'Agregar dirección'}
        </button>
      </div>

      {showForm && (
        <div className="border border-border rounded-lg p-4 mb-6 bg-surface-alt">
          <h2 className="font-semibold mb-4">
            {editandoId ? 'Editar dirección' : 'Nueva dirección'}
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre (ej: Casa, Trabajo)"
              value={form.nombre_direccion}
              onChange={(e) => setForm({ ...form, nombre_direccion: e.target.value })}
              className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <input
              type="text"
              placeholder="Calle / Pasaje / Av."
              value={form.calle}
              onChange={(e) => setForm({ ...form, calle: e.target.value })}
              className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <input
              type="text"
              placeholder="N° (ej: 1234)"
              value={form.numero}
              onChange={(e) => setForm({ ...form, numero: e.target.value })}
              className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <input
              type="text"
              placeholder="Depto / Oficina (opcional)"
              value={form.departamento}
              onChange={(e) => setForm({ ...form, departamento: e.target.value })}
              className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <input
              type="text"
              placeholder="Comuna"
              value={form.comuna}
              onChange={(e) => setForm({ ...form, comuna: e.target.value })}
              className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <input
              type="text"
              placeholder="Ciudad"
              value={form.ciudad}
              onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
              className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <select
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Selecciona una región</option>
              {REGIONES_CHILE.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Código postal (opcional)"
              value={form.codigo_postal}
              onChange={(e) => setForm({ ...form, codigo_postal: e.target.value })}
              className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <LoadingButton
              onClick={handleSubmit}
              loading={saving}
              disabled={!form.nombre_direccion || !form.calle || !form.numero || !form.comuna || !form.ciudad}
              className="bg-success text-white px-4 py-2 rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2"
            >
              {editandoId ? 'Actualizar' : 'Guardar'}
            </LoadingButton>
          </div>
        </div>
      )}

      {direcciones.length === 0 ? (
        <div className="text-center py-16 bg-surface-alt rounded-lg">
          <p className="text-text-muted">No tienes direcciones guardadas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {direcciones.map((d) => (
            <div key={d.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{d.nombre_direccion}</p>
                  <p className="text-sm text-text-secondary">
                    {d.calle} #{d.numero}
                    {d.departamento && `, ${d.departamento}`}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {d.comuna}, {d.ciudad}
                    {d.region && `, ${d.region}`}
                  </p>
                  {d.codigo_postal && (
                    <p className="text-sm text-text-muted">CP: {d.codigo_postal}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="text-info hover:opacity-80 text-sm active:scale-95 transition-all rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-info"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="text-primary hover:text-primary-hover text-sm active:scale-95 transition-all rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
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
