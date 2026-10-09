import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import UserPortal from './UserPortal';
import DriverPortal from './DriverPortal';

// A simple navigation component that sits above the portals
function NavBar() {
  const location = useLocation();
  
  return (
    <div className="bg-slate-950 p-2 text-sm flex justify-center gap-4 text-slate-400 font-semibold shadow-inner border-b border-slate-800 z-50 relative">
      <Link 
        to="/" 
        className={`px-4 py-1 rounded-full transition-colors ${location.pathname === '/' ? 'bg-teal-900 text-teal-400' : 'hover:bg-slate-800 hover:text-white'}`}
      >
        User Portal (Demo)
      </Link>
      <Link 
        to="/driver" 
        className={`px-4 py-1 rounded-full transition-colors ${location.pathname === '/driver' ? 'bg-blue-900 text-blue-400' : 'hover:bg-slate-800 hover:text-white'}`}
      >
        Ambulance Driver Portal
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<UserPortal />} />
        <Route path="/driver" element={<DriverPortal />} />
      </Routes>
    </Router>
  );
}

export default App;
