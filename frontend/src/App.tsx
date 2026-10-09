import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { AlertCircle, Phone, Navigation } from 'lucide-react';

// Custom icons
const createIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.8);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

const userIcon = createIcon('#3b82f6'); // Blue
const hospitalIcon = createIcon('#10b981'); // Green
const availableAmbulanceIcon = createIcon('#ef4444'); // Red (Emergency Available)
const occupiedAmbulanceIcon = createIcon('#f59e0b'); // Orange (Occupied/En Route)

// Tamil Nadu (Chennai) Data
const USER_LOCATION: [number, number] = [13.0827, 80.2707]; // Chennai Central Area

const HOSPITALS = [
  { id: 1, name: 'Rajiv Gandhi General Hospital', lat: 13.0815, lng: 80.2775, phone: '+91 44 2530 5000', beds: 45 },
  { id: 2, name: 'Apollo Hospital, Greams Road', lat: 13.0622, lng: 80.2520, phone: '+91 44 2829 0200', beds: 12 },
  { id: 3, name: 'SIMS Hospital, Vadapalani', lat: 13.0538, lng: 80.2114, phone: '+91 44 2000 2001', beds: 8 },
];

const INITIAL_AMBULANCES = [
  { id: 1, lat: 13.0900, lng: 80.2600, status: 'AVAILABLE', eta: '5 mins' },
  { id: 2, lat: 13.0700, lng: 80.2500, status: 'OCCUPIED', eta: 'N/A' },
  { id: 3, lat: 13.0950, lng: 80.2800, status: 'AVAILABLE', eta: '8 mins' },
];

function App() {
  const [sosSent, setSosSent] = useState(false);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);

  // Demo movement logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Start moving Ambulance #1 after 10 seconds
    const timer = setTimeout(() => {
      console.log("Starting ambulance demo movement...");
      interval = setInterval(() => {
        setAmbulances(prev => prev.map(amb => {
          if (amb.id === 1) {
            // Move slowly towards user (13.0827, 80.2707)
            const targetLat = USER_LOCATION[0];
            const targetLng = USER_LOCATION[1];
            
            // Simple linear interpolation
            const latDiff = targetLat - amb.lat;
            const lngDiff = targetLng - amb.lng;
            
            // Stop moving if very close
            if (Math.abs(latDiff) < 0.0005 && Math.abs(lngDiff) < 0.0005) {
              return { ...amb, status: 'ARRIVED', eta: '0 mins' };
            }

            return {
              ...amb,
              lat: amb.lat + (latDiff * 0.05), // Move 5% of remaining distance each tick
              lng: amb.lng + (lngDiff * 0.05),
              status: 'DISPATCHED',
              eta: 'Arriving soon...'
            };
          }
          return amb;
        }));
      }, 1000); // Update every second
    }, 10000); // 10 second delay

    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleSOS = () => {
    setSosSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-800 p-4 shadow-lg border-b border-slate-700 flex justify-between items-center z-10 relative">
        <div>
          <h1 className="text-2xl font-bold text-teal-400 tracking-wide">Golden Hour</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Tamil Nadu Emergency Portal</p>
        </div>
        <a href="tel:108" className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full font-bold transition-colors">
          <Phone size={18} /> Call 108
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-96 bg-slate-800 p-6 flex flex-col gap-6 z-10 relative shadow-xl overflow-y-auto">
          
          <div className="bg-slate-700 rounded-xl p-6 text-center shadow-inner">
            <h2 className="text-lg font-semibold mb-4">Need Immediate Help?</h2>
            <button 
              onClick={handleSOS}
              disabled={sosSent}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl text-xl font-bold transition-all shadow-lg
                ${sosSent 
                  ? 'bg-orange-500 hover:bg-orange-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-500 hover:scale-105 hover:shadow-red-500/50'}`}
            >
              <AlertCircle size={28} />
              {sosSent ? 'SOS BROADCASTED' : 'SOS ALERT'}
            </button>
            <p className="text-sm text-slate-400 mt-4">
              Your exact coordinates in Chennai will be shared with 108 Dispatch and nearby hospitals.
            </p>
          </div>

          <div>
            <h3 className="text-teal-400 font-bold mb-3 flex justify-between items-end">
              <span>Nearby Units</span>
              <span className="text-xs text-slate-400 font-normal">Live Map Feed</span>
            </h3>
            <div className="flex flex-col gap-3">
              {ambulances.map(amb => (
                <div key={amb.id} className="bg-slate-700 p-3 rounded-lg flex justify-between items-center border border-slate-600">
                  <div>
                    <p className="font-semibold text-sm">Ambulance #TN-{1000 + amb.id}</p>
                    <p className={`text-xs font-bold 
                      ${amb.status === 'AVAILABLE' ? 'text-green-400' 
                        : amb.status === 'DISPATCHED' ? 'text-blue-400' 
                        : 'text-orange-400'}`}>
                      {amb.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{amb.eta}</p>
                    <p className="text-xs text-slate-400">ETA</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Map Area */}
        <div className="flex-1 relative z-0 min-h-[500px]">
          <MapContainer 
            center={USER_LOCATION} 
            zoom={14} 
            className="w-full h-full absolute inset-0"
            zoomControl={false}
          >
            {/* Realistic Esri World Imagery (Satellite Map) */}
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            {/* Labels overlay on top of satellite map for readability */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
            />
            
            {/* User Location */}
            <Marker position={USER_LOCATION} icon={userIcon}>
              <Popup className="custom-popup">
                <strong>Your Location (Chennai)</strong><br/>Accuracy: ±5m
              </Popup>
            </Marker>
            <Circle center={USER_LOCATION} radius={800} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }} />

            {/* Hospitals */}
            {HOSPITALS.map(h => (
              <Marker key={`h-${h.id}`} position={[h.lat, h.lng]} icon={hospitalIcon}>
                <Popup>
                  <strong className="text-sm">{h.name}</strong><br/>
                  <div className="mt-1 text-xs">
                    <span className="font-semibold">Contact:</span> {h.phone}<br/>
                    <span className="font-semibold">Emergency Beds:</span> {h.beds}
                  </div>
                  <a href={`tel:${h.phone.replace(/[^0-9]/g, '')}`} className="text-teal-600 mt-2 inline-flex items-center text-xs font-bold">
                    <Phone size={12} className="mr-1"/> Call Hospital
                  </a>
                </Popup>
              </Marker>
            ))}

            {/* Ambulances */}
            {ambulances.map(a => (
              <Marker key={`a-${a.id}`} position={[a.lat, a.lng]} icon={a.status === 'OCCUPIED' ? occupiedAmbulanceIcon : availableAmbulanceIcon}>
                <Popup>
                  <strong>Ambulance #TN-{1000 + a.id}</strong><br/>
                  Status: {a.status}<br/>
                  ETA: {a.eta}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Map Legend Overlay */}
          <div className="absolute bottom-6 right-6 bg-slate-800/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-700 text-sm z-[400]">
            <h4 className="font-bold mb-2 text-slate-300">Map Legend</h4>
            <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div> You</div>
            <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div> Available Ambulance</div>
            <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-orange-500 border border-white"></div> Occupied Ambulance</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div> Hospital</div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
