'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Resultado = {
  display_name: string
  lat: string
  lon: string
}

// Fix íconos Leaflet
type IconDefaultPrototype = { _getIconUrl?: () => string | undefined }
delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

export default function MapComponent({ seleccionado }: { seleccionado: Resultado }) {
  return (
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
  )
}
