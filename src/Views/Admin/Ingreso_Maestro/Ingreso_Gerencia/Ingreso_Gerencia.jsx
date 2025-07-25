import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "../../../../Components/Header";
import Navbar from "../../../../Components/Navbar";
import {
  getGerencias,
  createGerencia,
  updateGerencia,
  deleteGerencia,
} from "../../../../api/api";
import "./Ingreso_Gerencia.css";

export default function Ingreso_Gerencia({ usuario }) {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const navigate = useNavigate();

  const GerenciaSections = [
    {
      title: "Gerencias",
      mainHref: "/Home/Ingreso-Maestro/Gerencia",
      links: [
        {
          text: "Ingresar Gerencia",
          href: "/Home/Ingreso-Maestro/Gerencia/Crear-Gerencia",
        },
        {
          text: "Actualizar Gerencia",
          href: "/Home/Ingreso-Maestro/Gerencia/Actualizar-Gerencia",
        },
        {
          text: "Eliminar Gerencia",
          href: "/Home/Ingreso-Maestro/Gerencia/Eliminar-Gerencia",
        },
      ],
    },
  ];

  return (
    <div className="app-layout">
      <Header titulo="Gestión de Gerencias" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home/Ingreso-Maestro"
          sections={GerenciaSections}
          onToggle={setNavbarVisible}
        />

        <main
          className={`layout-content ingreso-gerencia-main ${
            !navbarVisible ? "navbar-hidden" : ""
          }`}
        >
          <Routes>
            <Route path="Crear-Gerencia" element={<CrearGerencia />} />
            <Route
              path="Actualizar-Gerencia"
              element={<ActualizarGerencia />}
            />
            <Route path="Eliminar-Gerencia" element={<EliminarGerencia />} />
            <Route
              index
              element={
                <p className="placeholder">
                  Selecciona una acción sobre Gerencias
                </p>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// --- CrearGerencia ---
function CrearGerencia() {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(null);

  const handleCrear = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createGerencia({ NombreGerencia: nombre });
      setNombre("");
      alert("Gerencia creada");
    } catch (err) {
      setError(err.message || "Error al crear gerencia");
    }
  };

  return (
    <section className="form-section">
      <h2>Ingresar Gerencia</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleCrear} className="form-grid">
        <label>Nombre de la Gerencia</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <button type="submit">Crear Gerencia</button>
      </form>
    </section>
  );
}

// --- ActualizarGerencia ---
function ActualizarGerencia() {
  const [gerencias, setGerencias] = useState([]);
  const [filteredGerencias, setFilteredGerencias] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGerencias();
  }, []);

  const fetchGerencias = async () => {
    setLoading(true);
    try {
      const res = await getGerencias();
      setGerencias(res.data);
      setFilteredGerencias(res.data);
    } catch (err) {
      setError("Error al cargar gerencias: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por ID o nombre
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredGerencias(gerencias);
    } else {
      setFilteredGerencias(
        gerencias.filter(
          (g) =>
            g.GerenciaID.toString().includes(q) ||
            g.NombreGerencia.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, gerencias]);

  const startEdit = (g) => {
    setSelected(g.GerenciaID);
    setNombre(g.NombreGerencia);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre no puede estar vacío");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await updateGerencia(selected, { NombreGerencia: nombre.trim() });
      setSelected(null);
      setNombre("");
      await fetchGerencias();
      alert("Gerencia actualizada");
    } catch (err) {
      setError(err.message || "Error al actualizar gerencia");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelected(null);
    setNombre("");
    setError(null);
  };

  return (
    <section className="form-section">
      <h2>Actualizar Gerencia</h2>
      {error && <div className="error-message">{error}</div>}

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
        {loading && !selected ? (
          <p className="loading-message">Cargando gerencias...</p>
        ) : filteredGerencias.length === 0 ? (
          <p className="no-results">No se encontraron gerencias.</p>
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
                {filteredGerencias.map((g) => (
                  <tr key={g.GerenciaID}>
                    <td data-label="ID">{g.GerenciaID}</td>
                    <td data-label="Nombre">{g.NombreGerencia}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => startEdit(g)}
                        className="btn-edit"
                        disabled={selected !== null}
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
      {selected && (
        <form onSubmit={handleActualizar} className="form-grid">
          <label>Nuevo Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={loading}
          />

          <div className="form-buttons">
            <button type="submit" className="btn-primary" disabled={loading}>
              Guardar Cambios
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function EliminarGerencia() {
  const [gerencias, setGerencias] = useState([]);
  const [filteredGerencias, setFilteredGerencias] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGerencias();
  }, []);

  const fetchGerencias = async () => {
    try {
      const res = await getGerencias();
      setGerencias(res.data);
      setFilteredGerencias(res.data);
    } catch (err) {
      setError(err.message || "Error al cargar gerencias");
    }
  };

  // Filtrar por ID o nombre
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredGerencias(gerencias);
    } else {
      setFilteredGerencias(
        gerencias.filter(
          (g) =>
            g.GerenciaID.toString().includes(q) ||
            g.NombreGerencia.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, gerencias]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta gerencia?")) return;
    setError(null);
    try {
      await deleteGerencia(id);
      const updated = gerencias.filter((g) => g.GerenciaID !== id);
      setGerencias(updated);
      setFilteredGerencias(updated);
      alert("Gerencia eliminada");
    } catch (err) {
      setError(err.message || "Error al eliminar gerencia");
    }
  };

  return (
    <section className="table-section">
      <h2>Eliminar Gerencia</h2>
      {error && <div className="error-message">{error}</div>}

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
        {filteredGerencias.length === 0 ? (
          <p className="no-results">No se encontraron gerencias.</p>
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
                {filteredGerencias.map((g) => (
                  <tr key={g.GerenciaID}>
                    <td data-label="ID">{g.GerenciaID}</td>
                    <td data-label="Nombre">{g.NombreGerencia}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => handleDelete(g.GerenciaID)}
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
