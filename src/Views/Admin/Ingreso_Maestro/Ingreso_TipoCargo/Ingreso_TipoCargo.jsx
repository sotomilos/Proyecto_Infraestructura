import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../../../Components/Header";
import Navbar from "../../../../Components/Navbar";
import {
  getTipoCargos,
  createTipoCargo,
  updateTipoCargo,
  deleteTipoCargo,
} from "../../../../api/api";
import "./Ingreso_TipoCargo.css";

export default function Ingreso_TipoCargo({ usuario }) {
  const [navbarVisible, setnavbarVisible] = useState(true);

  const TipoCargoSections = [
    {
      title: "Tipo de Cargo",
      mainHref: "/Home/Ingreso-Maestro/Tipo-Cargo",
      links: [
        {
          text: "Ingresar Cargo",
          href: "/Home/Ingreso-Maestro/Tipo-Cargo/Crear-Cargo",
        },
        {
          text: "Actualizar Cargo",
          href: "/Home/Ingreso-Maestro/Tipo-Cargo/Actualizar-Cargo",
        },
        {
          text: "Eliminar Cargo",
          href: "/Home/Ingreso-Maestro/Tipo-Cargo/Eliminar-Cargo",
        },
      ],
    },
  ];

  return (
    <div className="app-layout">
      <Header titulo="Gestión de Tipo de Cargo" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home/Ingreso-Maestro"
          sections={TipoCargoSections}
          onToggle={setnavbarVisible}
        />
        <main
          className={`layout-content ingreso-tipo-cargo-main ${
            !navbarVisible ? "navbar-hidden" : ""
          }`}
        >
          <Routes>
            <Route path="Crear-Cargo" element={<CrearCargo />} />
            <Route path="Actualizar-Cargo" element={<ActualizarCargo />} />
            <Route path="Eliminar-Cargo" element={<EliminarCargo />} />
            <Route
              index
              element={
                <p className="placeholder">
                  Seleccione acción sobre Tipo de Cargo
                </p>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// --- CrearCargo ---
function CrearCargo() {
  const [nombre, setNombre] = useState("");
  const [err, setErr] = useState(null);

  const handle = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await createTipoCargo({ NombreCargo: nombre });
      setNombre("");
      alert("Cargo creado");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <section className="form-section">
      <h2>Ingresar Cargo</h2>
      {err && <div className="error-message">{err}</div>}
      <form onSubmit={handle} className="form-grid">
        <label>Nombre Cargo</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <button type="submit">Crear Cargo</button>
      </form>
    </section>
  );
}

// --- ActualizarCargo ---
function ActualizarCargo() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sel, setSel] = useState(null);
  const [nombre, setNombre] = useState("");
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchTipoCargo();
  }, []);

  async function fetchTipoCargo() {
    try {
      const res = await getTipoCargos();
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (e) {
      setErr(e.message);
    }
  }

  // Filtrar por ID o nombre
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter(
          (i) =>
            i.TipoCargoID.toString().includes(q) ||
            i.NombreCargo.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, items]);

  const start = (i) => {
    setSel(i.TipoCargoID);
    setNombre(i.NombreCargo);
    setErr(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handle = async (ev) => {
    ev.preventDefault();
    setErr(null);
    try {
      await updateTipoCargo(sel, { NombreCargo: nombre.trim() });
      setSel(null);
      setNombre("");
      fetchTipoCargo();
      alert("Cargo actualizado");
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleCancel = () => {
    setSel(null);
    setNombre("");
    setErr(null);
  };

  return (
    <section className="form-section">
      <h2>Actualizar Cargo</h2>
      {err && <div className="error-message">{err}</div>}

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por ID o nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla */}
      <div className="table-container">
        {filteredItems.length === 0 ? (
          <p className="no-results">No se encontraron cargos.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((i) => (
                  <tr key={i.TipoCargoID}>
                    <td data-label="ID">{i.TipoCargoID}</td>
                    <td data-label="Nombre">{i.NombreCargo}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => start(i)}
                        className="btn-edit"
                        disabled={sel !== null}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulario de edición */}
      {sel && (
        <form onSubmit={handle} className="form-grid">
          <label>Nuevo Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="form-control"
          />

          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              Guardar Cambios
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function EliminarCargo() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchTipoCargos();
  }, []);

  async function fetchTipoCargos() {
    try {
      const res = await getTipoCargos();
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (e) {
      setErr(e.message);
    }
  }

  // Filtrar por ID o nombre
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter(
          (i) =>
            i.TipoCargoID.toString().includes(q) ||
            i.NombreCargo.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, items]);

  const handle = async (id) => {
    if (!window.confirm("¿Eliminar este cargo?")) return;
    setErr(null);
    try {
      await deleteTipoCargo(id);
      const updated = items.filter((i) => i.TipoCargoID !== id);
      setItems(updated);
      setFilteredItems(updated);
      alert("Cargo eliminado");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <section className="table-section">
      <h2>Eliminar Cargo</h2>
      {err && <div className="error-message">{err}</div>}

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por ID o nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla */}
      <div className="table-container">
        {filteredItems.length === 0 ? (
          <p className="no-results">No se encontraron cargos.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((i) => (
                  <tr key={i.TipoCargoID}>
                    <td data-label="ID">{i.TipoCargoID}</td>
                    <td data-label="Nombre">{i.NombreCargo}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => handle(i.TipoCargoID)}
                        className="btn-delete"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
