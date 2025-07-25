import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../../../Components/Header";
import Navbar from "../../../../Components/Navbar";
import {
  getTipoEquipos,
  createTipoEquipo,
  updateTipoEquipo,
  deleteTipoEquipo,
} from "../../../../api/api";
import "./Ingreso_TipoEquipos.css";

export default function Ingreso_TipoEquipos({ usuario }) {
  const [navVisible, setNavVisible] = useState(true);

  const TipoEquiposSections = [
    {
      title: "Tipo de Equipos",
      mainHref: "/Home/Ingreso-Maestro/Tipo-Equipos",
      links: [
        {
          text: "Ingresar Tipo",
          href: "/Home/Ingreso-Maestro/Tipo-Equipos/Crear-Tipo",
        },
        {
          text: "Actualizar Tipo",
          href: "/Home/Ingreso-Maestro/Tipo-Equipos/Actualizar-Tipo",
        },
        {
          text: "Eliminar Tipo",
          href: "/Home/Ingreso-Maestro/Tipo-Equipos/Eliminar-Tipo",
        },
      ],
    },
  ];

  return (
    <div className="app-layout">
      <Header titulo="Gestión de Tipo de Equipos" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home/Ingreso-Maestro"
          sections={TipoEquiposSections}
          onToggle={setNavVisible}
        />

        <main
          className={`layout-content ingreso-tipo-equipos-main ${
            !navVisible ? "navbar-hidden" : ""
          }`}
        >
          <Routes>
            <Route path="Crear-Tipo" element={<CrearTipo />} />
            <Route path="Actualizar-Tipo" element={<ActualizarTipo />} />
            <Route path="Eliminar-Tipo" element={<EliminarTipo />} />
            <Route
              index
              element={
                <p className="placeholder">
                  Selecciona una acción sobre Tipo de Equipos
                </p>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// --- CrearTipo ---
function CrearTipo() {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(null);

  const handleCrear = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createTipoEquipo({ NombreTipo: nombre });
      setNombre("");
      alert("Tipo creado");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="form-section">
      <h2>Ingresar Tipo de Equipo</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleCrear} className="form-grid">
        <label>Nombre Tipo</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <button type="submit">Crear Tipo</button>
      </form>
    </section>
  );
}

// --- ActualizarTipo ---
function ActualizarTipo() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sel, setSel] = useState(null);
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(null);

  // Carga inicial y filtrar items
  useEffect(() => {
    fetchTipos();
  }, []);

  async function fetchTipos() {
    try {
      const res = await getTipoEquipos();
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      setError("Error al cargar tipos: " + err.message);
    }
  }

  // Filtrado según búsqueda
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter(
          (i) =>
            i.TipoEquipoID.toString().includes(q) ||
            i.NombreTipo.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, items]);

  const startEdit = (i) => {
    setSel(i.TipoEquipoID);
    setNombre(i.NombreTipo);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await updateTipoEquipo(sel, { NombreTipo: nombre.trim() });
      alert("Tipo actualizado");
      setSel(null);
      setNombre("");
      await fetchTipos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setSel(null);
    setNombre("");
    setError(null);
  };

  return (
    <section className="form-section">
      <h2>Actualizar Tipo de Equipo</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por ID o tipo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla */}
      <div className="table-container">
        {filteredItems.length === 0 ? (
          <p className="no-results">No se encontraron tipos.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((i) => (
                  <tr key={i.TipoEquipoID}>
                    <td data-label="ID">{i.TipoEquipoID}</td>
                    <td data-label="Tipo">{i.NombreTipo}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => startEdit(i)}
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
        <form onSubmit={handleActualizar} className="form-grid">
          <label>Nuevo Nombre</label>
          <input
            type="text"
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

// --- EliminarTipo ---
function EliminarTipo() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // Carga inicial
  useEffect(() => {
    fetchTipos();
  }, []);

  async function fetchTipos() {
    try {
      const res = await getTipoEquipos();
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      setError("Error al cargar tipos: " + err.message);
    }
  }

  // Filtrado
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter(
          (i) =>
            i.TipoEquipoID.toString().includes(q) ||
            i.NombreTipo.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, items]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este tipo?")) return;
    setError(null);
    try {
      await deleteTipoEquipo(id);
      const updated = items.filter((i) => i.TipoEquipoID !== id);
      setItems(updated);
      setFilteredItems(updated);
      alert("Tipo eliminado");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="table-section">
      <h2>Eliminar Tipo de Equipo</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por ID o tipo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla */}
      <div className="table-container">
        {filteredItems.length === 0 ? (
          <p className="no-results">No se encontraron tipos.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((i) => (
                  <tr key={i.TipoEquipoID}>
                    <td data-label="ID">{i.TipoEquipoID}</td>
                    <td data-label="Tipo">{i.NombreTipo}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => handleDelete(i.TipoEquipoID)}
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
