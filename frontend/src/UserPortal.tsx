import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { AlertCircle, Phone, UserCircle2 } from 'lucide-react';

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
const availableAmbulanceIcon = createIcon('#ef4444'); // Red 
const occupiedAmbulanceIcon = createIcon('#f59e0b'); // Orange

// Vadapalani Precise Road Intersections
const USER_LOCATION: [number, number] = [13.05060, 80.21140]; // Vadapalani Signal (Accident Scene)
const START_LOCATION: [number, number] = [13.05156, 80.20790]; // Ambulance start (Arcot Rd)
const SIMS_LOCATION: [number, number] = [13.05380, 80.21140]; // SIMS Hospital (100ft Rd)

// Exact road polyline (Arcot Road -> 100ft Road)
const EXACT_ROAD_ROUTE: [number, number][] = [
  START_LOCATION,
  [13.05130, 80.20910], // Arcot Rd bend
  [13.05100, 80.21030], // Arcot Rd approach
  USER_LOCATION,        // Vadapalani Signal Intersection
];

const HOSPITALS = [
  { id: 1, name: 'SIMS Hospital, Vadapalani', lat: SIMS_LOCATION[0], lng: SIMS_LOCATION[1], phone: '+91 44 2000 2001', beds: 45, type: 'Private' },
  { id: 2, name: 'Vijaya Hospital', lat: 13.0488, lng: 80.2104, phone: '+91 44 2365 1234', beds: 12, type: 'Private' },
  { id: 3, name: 'Sooriya Hospital', lat: 13.0415, lng: 80.2038, phone: '+91 44 2376 1750', beds: 8, type: 'Private' },
];

const INITIAL_AMBULANCES = [
  { id: 1, lat: START_LOCATION[0], lng: START_LOCATION[1], status: 'AVAILABLE', eta: '3 mins', driverName: 'Ramesh K.', driverPhone: '+91 9876543210' },
  { id: 2, lat: 13.0400, lng: 80.2150, status: 'OCCUPIED', eta: 'N/A', driverName: 'Suresh V.', driverPhone: '+91 9876543211' },
  { id: 3, lat: 13.0600, lng: 80.2200, status: 'AVAILABLE', eta: '6 mins', driverName: 'Karthik M.', driverPhone: '+91 9876543212' },
];

function UserPortal() {
  const [sosSent, setSosSent] = useState(false);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);

  // Demo movement logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (sosSent) {
      let stepIndex = 0;
      
      interval = setInterval(() => {
        setAmbulances(prev => prev.map(amb => {
          if (amb.id === 1) {
            if (stepIndex < EXACT_ROAD_ROUTE.length) {
              const newPos = EXACT_ROAD_ROUTE[stepIndex];
              return { ...amb, lat: newPos[0], lng: newPos[1], status: 'DISPATCHED', eta: 'Arriving soon...' };
            } else {
              return { ...amb, status: 'ARRIVED', eta: '0 mins' };
            }
          }
          return amb;
        }));

        if (stepIndex < EXACT_ROAD_ROUTE.length) {
          stepIndex++;
        } else {
          clearInterval(interval);
        }
      }, 2000); // Move every 2 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sosSent]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans">
      <header className="bg-slate-800 p-4 shadow-lg border-b border-slate-700 flex justify-between items-center z-10 relative">
        <div>
          <h1 className="text-2xl font-bold text-teal-400 tracking-wide">Thefirstresponse360</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Tamil Nadu Emergency Portal</p>
        </div>
        <a href="tel:108" className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full font-bold transition-colors">
          <Phone size={18} /> Call 108
        </a>
      </header>

      <main className="flex-1 flex flex-col md:flex-row relative">
        <div className="w-full md:w-96 bg-slate-800 p-6 flex flex-col gap-6 z-10 relative shadow-xl overflow-y-auto">
          <div className="bg-slate-700 rounded-xl p-6 text-center shadow-inner border border-slate-600">
            <h2 className="text-lg font-semibold mb-4">Need Immediate Help?</h2>
            <button 
              onClick={() => setSosSent(true)}
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
              Your exact coordinates will be shared with 108 Dispatch.
            </p>
          </div>

          <div>
            <h3 className="text-teal-400 font-bold mb-3 flex justify-between items-end">
              <span>Nearby Units</span>
              <span className="text-xs text-slate-400 font-normal">Live Map Feed</span>
            </h3>
            <div className="flex flex-col gap-3">
              {ambulances.map(amb => (
                <div key={amb.id} className="bg-slate-700 p-3 rounded-lg flex flex-col border border-slate-600 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold text-sm text-teal-300">Ambulance #TN-{1000 + amb.id}</p>
                      <p className={`text-xs font-bold 
                        ${amb.status === 'AVAILABLE' ? 'text-red-400' 
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
                  <div className="border-t border-slate-600 pt-2 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1"><UserCircle2 size={14}/> Driver: {amb.driverName}</span>
                    <a href={`tel:${amb.driverPhone.replace(/[^0-9]/g, '')}`} className="flex items-center gap-1 hover:text-white"><Phone size={12}/> {amb.driverPhone}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-teal-400 font-bold mb-3 mt-2">Target Hospitals</h3>
            <div className="flex flex-col gap-3">
              {HOSPITALS.map((h, i) => (
                <div key={h.id} className="bg-slate-700 p-3 rounded-lg flex flex-col border border-slate-600 shadow-sm text-sm space-y-2">
                  <p><strong className="text-teal-300">{h.name}</strong></p>
                  <div className="flex justify-between items-center">
                    <p className="text-slate-300 text-xs">Type: {h.type}</p>
                    {i === 0 && <span className="text-[10px] bg-blue-900 text-blue-300 px-2 py-0.5 rounded uppercase font-bold">Nearest</span>}
                  </div>
                  <p className="text-slate-300 text-xs">Emergency Beds Available: <strong className="text-green-400">{h.beds} Beds</strong></p>
                  <a href={`tel:${h.phone.replace(/[^0-9]/g, '')}`} className="text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300 mt-2"><Phone size={12}/> {h.phone}</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 relative z-0 min-h-[500px]">
          <MapContainer center={[13.0515, 80.2100]} zoom={15} className="w-full h-full absolute inset-0" zoomControl={false}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <Marker position={USER_LOCATION} icon={userIcon}>
              <Popup><strong>You (Vadapalani Signal)</strong></Popup>
            </Marker>

            {/* Render exact road polyline if dispatched */}
            {sosSent && (
              <Polyline positions={EXACT_ROAD_ROUTE} color="#3b82f6" weight={6} opacity={0.8} />
            )}

            {/* Ambulances */}
            {ambulances.map(a => (
              <Marker key={`a-${a.id}`} position={[a.lat, a.lng]} icon={a.status === 'OCCUPIED' ? occupiedAmbulanceIcon : availableAmbulanceIcon}>
                <Popup>
                  <strong className="block mb-1">Ambulance #TN-{1000 + a.id}</strong>
                  <div className="text-xs space-y-1">
                    <p><span className="font-semibold text-slate-600">Status:</span> {a.status}</p>
                    <p><span className="font-semibold text-slate-600">ETA:</span> {a.eta}</p>
                    <p className="pt-1 mt-1 border-t border-slate-200"><span className="font-semibold text-slate-600">Driver:</span> {a.driverName}</p>
                    <p><span className="font-semibold text-slate-600">Contact:</span> {a.driverPhone}</p>
                  </div>
                  <a href={`tel:${a.driverPhone.replace(/[^0-9]/g, '')}`} className="text-blue-600 mt-2 inline-flex items-center text-xs font-bold bg-blue-50 px-2 py-1 rounded">
                    <Phone size={12} className="mr-1"/> Contact Driver
                  </a>
                </Popup>
              </Marker>
            ))}

            {/* Hospitals */}
            {HOSPITALS.map(h => (
              <Marker key={`h-${h.id}`} position={[h.lat, h.lng]} icon={hospitalIcon}>
                <Popup>
                  <strong className="text-sm block mb-1">{h.name}</strong>
                  <div className="text-xs space-y-1">
                    <p><span className="font-semibold text-slate-600">Type:</span> {h.type}</p>
                    <p><span className="font-semibold text-slate-600">Emergency Beds:</span> {h.beds}</p>
                    <p><span className="font-semibold text-slate-600">Direct Line:</span> {h.phone}</p>
                  </div>
                  <a href={`tel:${h.phone.replace(/[^0-9]/g, '')}`} className="text-teal-600 mt-2 inline-flex items-center text-xs font-bold bg-teal-50 px-2 py-1 rounded">
                    <Phone size={12} className="mr-1"/> Call Hospital
                  </a>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}

export default UserPortal;
