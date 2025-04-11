import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Control_Compu from './Views/Control_Compu/Control_Compu';
import Login from './Views/Login/Login';
import Home from './Views/Home/Home';
import Header from './Components/Header';
import Navbar from './Components/Navbar';
import './App.css';

export default function App() {
  
  const [usuario, setUsuario] = useState(null);


  return (
    <Routes>
      {/* 1. Ruta pública de login */}
      <Route
        path="/login"
        element={<Login onLogin={u => setUsuario(u)} />}
      />

      {/* 2. Rutas protegidas */}
      <Route
        path="/Home"
        element={
          usuario
            ? <Home usuario={usuario} onLogout={() => setUsuario(null)} />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/Control-Computadoras/*"
        element={
          usuario
            ? <Control_Compu usuario={usuario.usuario} onLogout={() => setUsuario(null)} />
            : <Navigate to="/Home" replace />
        }
      />

      {/* 3. Catch-all: si no coincide ninguna ruta */}
      <Route
        path="*"
        element={
          usuario
            ? <Navigate to="/Home" replace />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}
