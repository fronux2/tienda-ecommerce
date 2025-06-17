'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Importar los estilos de Leaflet
import 'leaflet/dist/leaflet.css'

// Fix para los íconos que no cargan bien en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

type Resultado = {
  display_name: string
  lat: string
  lon: string
}

export default function BusquedaDireccion() {
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [seleccionado, setSeleccionado] = useState<Resultado | null>(null)

  useEffect(() => {
    const delay = setTimeout(() => {
      if (busqueda.length >= 3) {
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(busqueda)}&format=json&addressdetails=1&limit=5`)
          .then(res => res.json())
          .then(data => setResultados(data))
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

          <MapContainer
            center={[parseFloat(seleccionado.lat), parseFloat(seleccionado.lon)]}
            zoom={17}
            scrollWheelZoom={false}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[parseFloat(seleccionado.lat), parseFloat(seleccionado.lon)]}>
              <Popup>{seleccionado.display_name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  )
}

