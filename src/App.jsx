import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Control_Compu from "./Views/Visitor/Control_Compu/Control_Compu";
import Login from "./Views/Login/Login";
import Home from "./Views/Home/Home";
import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
import Ingreso_Usuario from "./Views/Admin/Ingreso_Usuario/Ingreso_Usuario";
import Ingreso_Maestro from "./Views/Admin/Ingreso_Maestro/Ingreso_Maestro";
import Ingreso_Planta from "./Views/Admin/Ingreso_Maestro/Ingreso_Planta/Ingreso_Planta";
import Ingreso_Gerencia from "./Views/Admin/Ingreso_Maestro/Ingreso_Gerencia/Ingreso_Gerencia";
import Ingreso_PlantaGerencia from "./Views/Admin/Ingreso_Maestro/Ingreso_PlantaGerencia/Ingreso_PlantaGerencia";
import Ingreso_Dependencia from "./Views/Admin/Ingreso_Maestro/Ingreso_Dependencia/Ingreso_Dependencia";
import Ingreso_TipoMarcas from "./Views/Admin/Ingreso_Maestro/Ingreso_TipoMarcas/Ingreso_TiposMarcas";
import Ingreso_Estado from "./Views/Admin/Ingreso_Maestro/Ingreso_Estado/Ingreso_Estado";
import Ingreso_TipoCargo from "./Views/Admin/Ingreso_Maestro/Ingreso_TipoCargo/Ingreso_TipoCargo";
import Ingreso_TipoEquipos from "./Views/Admin/Ingreso_Maestro/Ingreso_TipoEquipos/Ingreso_TipoEquipos";
import Ingreso_Trabajador from "./Views/Admin/Ingreso_Maestro/Ingreso_Trabajador/Ingreso_Trabajador";
import Ingreso_Compu from "./Views/Admin/Ingreso_Compu/Ingreso_Compu";
import Ingreso_Impresoras from "./Views/Admin/Ingreso_Impresoras/Ingreso_Impresoras";
import ControlImpresoras from "./Views/Visitor/Control_Impresoras/Control_Impresoras";
import Ingreso_Tabletas from "./Views/Admin/Ingreso_Tabletas/Ingreso_tabletas";
import ControlTabletas from "./Views/Visitor/Control_Tabletas/Control_Tabletas";
import Control_UPS from "./Views/Visitor/Control_UPS/Control_UPS";
import Ingreso_UPS from "./Views/Admin/Ingreso_UPS/Ingreso_UPS";
import Control_Servidores from "./Views/Visitor/Control_Servidores/Control_Servidores";
import Ingreso_Switch from "./Views/Admin/Ingreso_Switches/Ingreso_Switch";
import Control_Redes from "./Views/Visitor/Control_Redes/Control_Redes";

import "./App.css";

export default function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <Routes>
      {/* 1. Ruta pública de login */}
      <Route path="/login" element={<Login onLogin={(u) => setUsuario(u)} />} />

      {/* 2. Rutas protegidas */}
      <Route
        path="/Home/*"
        element={
          usuario ? (
            <Home usuario={usuario} onLogout={() => setUsuario(null)} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/Home/Control-Redes/*"
        element={
          usuario ? (
            <Control_Redes
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home" replace />
          )
        }
      />

      <Route
        path="/Home/Control-Computadoras/*"
        element={
          usuario ? (
            <Control_Compu
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home" replace />
          )
        }
      />

      <Route
        path="/Home/Control-Impresoras/*"
        element={
          usuario ? (
            <ControlImpresoras
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home" replace />
          )
        }
      />

      <Route
        path="/Home/Control-Tabletas/*"
        element={
          usuario ? (
            <ControlTabletas
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home" replace />
          )
        }
      />

      <Route
        path="/Home/Control-UPS/*"
        element={
          usuario ? (
            <Control_UPS usuario={usuario} onLogout={() => setUsuario(null)} />
          ) : (
            <Navigate to="/Home" replace />
          )
        }
      />

      <Route
        path="/Home/Control-Servidores/*"
        element={
          usuario ? (
            <Control_Servidores
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Usuarios/*"
        element={
          usuario && usuario.rol === "admin" ? (
            <Ingreso_Usuario
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Maestro/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_Maestro
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Redes/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_Switch
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Maestro/Planta/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_Planta
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home/Ingreso-Maestro" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Maestro/Gerencia/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_Gerencia
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home/Ingreso-Maestro" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Maestro/Planta-Gerencia/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_PlantaGerencia
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home/Ingreso-Maestro" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Maestro/Dependencia/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_Dependencia
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home/Ingreso-Maestro" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Maestro/Tipo-Marcas/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_TipoMarcas
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home/Ingreso-Maestro" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Maestro/Estado-Equipo/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_Estado
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home/Ingreso-Maestro" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Maestro/Tipo-Cargo/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_TipoCargo
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home/Ingreso-Maestro" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Maestro/Tipo-Equipos/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_TipoEquipos
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home/Ingreso-Maestro" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Maestro/Trabajador/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_Trabajador
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home/Ingreso-Maestro" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Computadoras/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_Compu
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Impresoras/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_Impresoras
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-Tabletas/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_Tabletas
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          ) : (
            <Navigate to="/Home" replace />
          )
        }
      />

      <Route
        path="/Home/Ingreso-UPS/*"
        element={
          usuario?.rol === "admin" ? (
            <Ingreso_UPS usuario={usuario} onLogout={() => setUsuario(null)} />
          ) : (
            <Navigate to="/Home" replace />
          )
        }
      />

      <Route
        path="*"
        element={
          usuario ? (
            <Navigate to="/Home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
