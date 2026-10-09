import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Navigation, Phone, UserCircle2 } from 'lucide-react';

const createIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.8);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

const ambulanceIcon = createIcon('#3b82f6'); // Blue
const accidentIcon = createIcon('#ef4444'); // Red
const hospitalIcon = createIcon('#10b981'); // Green

const START_LOCATION: [number, number] = [13.05156, 80.20790]; // Ambulance start (Arcot Rd)
const ACCIDENT_LOCATION: [number, number] = [13.05060, 80.21140]; // Vadapalani Signal (Accident)
const HOSPITAL_LOCATION: [number, number] = [13.05380, 80.21140]; // SIMS Hospital (100ft Rd)

// Exact road polyline (Arcot Road)
const FAST_ROUTE: [number, number][] = [
  START_LOCATION,
  [13.05130, 80.20910], 
  [13.05100, 80.21030], 
  ACCIDENT_LOCATION,        
];

// Exact road polyline (Hospital route on 100ft road)
const HOSPITAL_ROUTE: [number, number][] = [
  ACCIDENT_LOCATION,
  [13.05150, 80.21140],
  [13.05250, 80.21140],
  HOSPITAL_LOCATION,
];

// Mock Alternative Routes
const TRAFFIC_ROUTE: [number, number][] = [
  START_LOCATION,
  [13.05250, 80.20850],
  [13.05200, 80.21000],
  ACCIDENT_LOCATION
];

const EASY_ROUTE: [number, number][] = [
  START_LOCATION,
  [13.05000, 80.20800],
  [13.04950, 80.21050],
  ACCIDENT_LOCATION
];

export default function DriverPortal() {
  const [missionStatus, setMissionStatus] = useState<'IDLE' | 'EN_ROUTE_SCENE' | 'AT_SCENE' | 'EN_ROUTE_HOSPITAL' | 'COMPLETED'>('IDLE');
  
  // State for live moving ambulance
  const [driverPos, setDriverPos] = useState<[number, number]>(START_LOCATION);

  // Demo Movement Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (missionStatus === 'EN_ROUTE_SCENE') {
      let stepIndex = 0;
      interval = setInterval(() => {
        if (stepIndex < FAST_ROUTE.length) {
          setDriverPos(FAST_ROUTE[stepIndex]);
          stepIndex++;
        } else {
          setMissionStatus('AT_SCENE'); // Auto-arrive when it reaches the end
        }
      }, 1500); // Move every 1.5s
    } else if (missionStatus === 'EN_ROUTE_HOSPITAL') {
      let stepIndex = 0;
      interval = setInterval(() => {
        if (stepIndex < HOSPITAL_ROUTE.length) {
          setDriverPos(HOSPITAL_ROUTE[stepIndex]);
          stepIndex++;
        } else {
          setMissionStatus('COMPLETED');
        }
      }, 1500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [missionStatus]);

  const advanceMission = () => {
    if (missionStatus === 'IDLE') setMissionStatus('EN_ROUTE_SCENE');
    else if (missionStatus === 'EN_ROUTE_SCENE') setMissionStatus('AT_SCENE');
    else if (missionStatus === 'AT_SCENE') setMissionStatus('EN_ROUTE_HOSPITAL');
    else if (missionStatus === 'EN_ROUTE_HOSPITAL') setMissionStatus('COMPLETED');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans">
      <header className="bg-slate-800 p-4 shadow-lg border-b border-slate-700">
        <h1 className="text-2xl font-bold text-blue-400 tracking-wide">Ambulance Dispatch Portal</h1>
        <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Driver ID: TN-1001 (Ramesh K.)</p>
      </header>

      <main className="flex-1 flex flex-col md:flex-row relative">
        {/* Sidebar */}
        <div className="w-full md:w-96 bg-slate-800 p-6 flex flex-col gap-6 z-10 relative shadow-xl overflow-y-auto">
          
          <div className="bg-slate-700 rounded-xl p-6 shadow-inner border border-slate-600">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <AlertTriangle className="text-red-500"/> Current Mission
            </h2>
            <button 
              onClick={advanceMission}
              disabled={missionStatus === 'COMPLETED' || missionStatus === 'EN_ROUTE_SCENE' || missionStatus === 'EN_ROUTE_HOSPITAL'}
              className="mt-2 w-full py-3 rounded-lg font-bold text-lg bg-blue-600 hover:bg-blue-500 transition-colors disabled:bg-slate-600"
            >
              {missionStatus === 'IDLE' && 'ACCEPT & START ROUTE'}
              {missionStatus === 'EN_ROUTE_SCENE' && 'DRIVING TO SCENE...'}
              {missionStatus === 'AT_SCENE' && 'START TRANSPORT'}
              {missionStatus === 'EN_ROUTE_HOSPITAL' && 'DRIVING TO HOSPITAL...'}
              {missionStatus === 'COMPLETED' && 'MISSION COMPLETED'}
            </button>
          </div>
          
          <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
            <h3 className="font-bold text-teal-400 mb-3">Your Details</h3>
            <div className="text-sm space-y-2 border-l-2 border-slate-500 pl-3">
              <p className="flex items-center gap-2"><UserCircle2 size={16}/> <strong>Ramesh K.</strong> (TN-1001)</p>
              <p className="flex items-center gap-2 text-slate-300"><Phone size={14}/> +91 9876543210</p>
            </div>
            
            <h3 className="font-bold text-teal-400 mt-4 mb-3">Target Hospital</h3>
            <div className="text-sm space-y-2 border-l-2 border-slate-500 pl-3">
              <p><strong>SIMS Hospital, Vadapalani</strong></p>
              <p className="text-xs text-slate-300">Type: Private Facility</p>
              <p className="text-xs text-slate-300">Emergency Beds: <strong className="text-green-400">45 Beds</strong></p>
              <p className="flex items-center gap-2 text-slate-300"><Phone size={14}/> +91 44 2000 2001</p>
            </div>
          </div>

          <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
            <h3 className="font-bold text-teal-400 mb-3 flex items-center gap-2">
              <Navigation size={18}/> Routing Details
            </h3>
            <div className="space-y-2 mb-4 text-sm font-semibold">
              <div className="flex items-center gap-2 text-blue-400"><div className="w-4 h-1 bg-blue-500 rounded"></div> Fast Route (ETA: 4 mins)</div>
              <div className="flex items-center gap-2 text-green-400"><div className="w-4 h-1 bg-green-500 rounded border border-dashed border-white"></div> Easy Way (ETA: 6 mins)</div>
              <div className="flex items-center gap-2 text-red-400"><div className="w-4 h-1 bg-red-500 rounded"></div> Heavy Traffic (ETA: 12 mins)</div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative z-0 min-h-[500px]">
          <MapContainer center={[13.0515, 80.2100]} zoom={17} className="w-full h-full absolute inset-0" zoomControl={false}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <Marker position={driverPos} icon={ambulanceIcon}>
              <Popup>
                <strong>You (TN-1001)</strong><br/>
                Driver: Ramesh K.<br/>
                <a href="tel:09876543210" className="text-blue-500 flex items-center gap-1 mt-1"><Phone size={12}/> +91 9876543210</a>
              </Popup>
            </Marker>
            
            <Marker position={ACCIDENT_LOCATION} icon={accidentIcon}>
              <Popup><strong>Accident Scene</strong></Popup>
            </Marker>
            
            <Marker position={HOSPITAL_LOCATION} icon={hospitalIcon}>
              <Popup>
                <strong>SIMS Hospital, Vadapalani</strong><br/>
                Beds Available: 45<br/>
                <a href="tel:04420002001" className="text-blue-500 flex items-center gap-1 mt-1"><Phone size={12}/> +91 44 2000 2001</a>
              </Popup>
            </Marker>

            {/* Multiple Route Overlays */}
            {['IDLE', 'EN_ROUTE_SCENE'].includes(missionStatus) && (
              <>
                <Polyline positions={TRAFFIC_ROUTE} color="#ef4444" weight={4} dashArray="5, 10" />
                <Polyline positions={EASY_ROUTE} color="#10b981" weight={4} dashArray="10, 10" />
                <Polyline positions={FAST_ROUTE} color="#3b82f6" weight={6} />
              </>
            )}

            {/* Hospital Exact Road Overlay */}
            {['AT_SCENE', 'EN_ROUTE_HOSPITAL'].includes(missionStatus) && (
              <Polyline positions={HOSPITAL_ROUTE} color="#3b82f6" weight={6} dashArray="10, 10" />
            )}

          </MapContainer>
        </div>
      </main>
    </div>
  );
}
