import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Search, Check, X } from 'lucide-react';

// Custom MapPin icon
const pinIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LocationPickerProps {
  initialLat: number;
  initialLon: number;
  onSelect: (lat: number, lon: number, address?: string) => void;
  onClose: () => void;
}

function MapClickHandler({ onPositionChange }: { onPositionChange: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center]);
  return null;
}

export const LocationPickerModal: React.FC<LocationPickerProps> = ({
  initialLat,
  initialLon,
  onSelect,
  onClose,
}) => {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLon]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Quick preset Indian flood-prone hubs for easy testing
  const presets = [
    { name: 'Begumpet, Hyderabad', lat: 17.4448, lon: 78.4682 },
    { name: 'Tolichowki, Hyderabad', lat: 17.4011, lon: 78.4116 },
    { name: 'Hitec City, Hyderabad', lat: 17.4504, lon: 78.3808 },
    { name: 'Dadar, Mumbai', lat: 19.0178, lon: 72.8478 },
    { name: 'Silk Board, Bengaluru', lat: 12.9172, lon: 77.6228 },
  ];

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setPosition([lat, lon]);
      },
      (err) => {
        setIsLocating(false);
        setGeoError('Location permission denied or unavailable. You can click on the map to set the pin.');
      },
      { timeout: 8000 }
    );
  };

  const handleConfirm = () => {
    const addressGuess = `Near ${position[0].toFixed(4)}, ${position[1].toFixed(4)}`;
    onSelect(position[0], position[1], searchQuery.trim() || addressGuess);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E3EBE5] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-[#E3EBE5] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-base text-[#25332F] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8FAF9A]" />
              Select Incident Location
            </h3>
            <p className="text-xs text-[#718078]">Click anywhere on the map or search to place the hazard pin.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#718078] hover:bg-[#F8FAF8] hover:text-[#25332F]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls & Search */}
        <div className="p-3 bg-[#F8FAF8] border-b border-[#E3EBE5] flex flex-col sm:flex-row gap-2 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#718078] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Enter landmark or street name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E3EBE5] rounded-xl text-xs text-[#25332F] focus:outline-none focus:border-[#8FAF9A]"
            />
          </div>

          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#A8D5CE] bg-white text-xs font-medium text-[#25332F] hover:bg-[#DCECF5] transition-colors"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Use My GPS'}</span>
          </button>
        </div>

        {/* Presets */}
        <div className="px-3 py-1.5 bg-white border-b border-[#E3EBE5] flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-[#718078] shrink-0 font-medium">Quick Hubs:</span>
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setPosition([p.lat, p.lon]);
                setSearchQuery(p.name);
              }}
              className="px-2 py-0.5 rounded-md bg-[#F8FAF8] border border-[#E3EBE5] hover:border-[#8FAF9A] shrink-0 text-[#25332F]"
            >
              {p.name}
            </button>
          ))}
        </div>

        {geoError && (
          <div className="px-4 py-2 bg-[#FEF6E4] text-[#8F6616] text-xs border-b border-[#F5D99A]">
            {geoError}
          </div>
        )}

        {/* Map View */}
        <div className="relative h-80 w-full bg-[#E3EBE5]">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeView center={position} />
            <MapClickHandler
              onPositionChange={(lat, lon) => {
                setPosition([lat, lon]);
              }}
            />
            <Marker
              position={position}
              icon={pinIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const newPos = marker.getLatLng();
                  setPosition([newPos.lat, newPos.lng]);
                },
              }}
            />
          </MapContainer>
        </div>

        {/* Footer Selected info */}
        <div className="p-4 bg-white border-t border-[#E3EBE5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#718078]">
            Selected Pin: <span className="font-mono text-[#25332F]">{position[0].toFixed(5)}, {position[1].toFixed(5)}</span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-[#E3EBE5] text-xs text-[#718078] hover:bg-[#F8FAF8]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#8FAF9A] hover:bg-[#7E9E89] text-[#25332F] text-xs font-semibold shadow-xs"
            >
              <Check className="w-4 h-4" />
              Confirm Location
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
