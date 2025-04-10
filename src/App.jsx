import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Views/Login';
import Home from './Views/Home';
import Header from './Components/Header';
import Navbar from './Components/Navbar';
import './App.css';

export default function App() {
  
  const [usuario, setUsuario] = useState(null);

  return (
    <Routes>
      {/* Login separado */}
      <Route 
        path="/login" 
        element={
          <Login 
            onLogin={u => setUsuario(u)} 
          />
        } 
      />

      {/* Rutas protegidas */}
      <Route
        path="/*"
        element={
          usuario
            ? <AuthenticatedApp usuario={usuario} onLogout={() => setUsuario(null)} />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

function AuthenticatedApp({ usuario, onLogout }) {
  return (
    <div className="app-layout">
      <Header usuario={usuario.usuario} />
      <div className="layout-body">
        <Navbar onLogout={onLogout} />
        <main className="layout-content">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* más rutas aquí */}
          </Routes>
        </main>
      </div>
    </div>
  );
}
