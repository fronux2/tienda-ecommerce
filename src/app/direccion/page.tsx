'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false })

type Resultado = {
  display_name: string
  lat: string
  lon: string
}

export default function BusquedaDireccionPage() {
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [seleccionado, setSeleccionado] = useState<Resultado | null>(null)

  useEffect(() => {
    const delay = setTimeout(() => {
      if (busqueda.length >= 3) {
        fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            busqueda
          )}&format=json&addressdetails=1&limit=5`
        )
          .then((res) => res.json())
          .then((data) => setResultados(data))
      } else {
        setResultados([])
      }
    }, 400)

    return () => clearTimeout(delay)
  }, [busqueda])

  return (
    <div className="w-full max-w-xl mx-auto">
      <label className="block font-medium mb-1">Buscar dirección</label>
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        type="text"
        placeholder="Ej: Av. Providencia 1234"
        className="w-full border p-2 rounded"
      />
      {resultados.length > 0 && (
        <ul className="bg-white border rounded shadow mt-2 max-h-60 overflow-y-auto">
          {resultados.map((r, i) => (
            <li
              key={i}
              onClick={() => {
                setBusqueda(r.display_name)
                setSeleccionado(r)
                setResultados([])
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}

      {seleccionado && (
        <div className="mt-6">
          <h2 className="font-bold mb-2">Dirección seleccionada:</h2>
          <p className="mb-4">{seleccionado.display_name}</p>

          <MapComponent seleccionado={seleccionado} />
        </div>
      )}
    </div>
  )
}
