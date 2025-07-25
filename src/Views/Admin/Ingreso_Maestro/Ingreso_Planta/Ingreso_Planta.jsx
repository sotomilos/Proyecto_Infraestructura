import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "../../../../Components/Header";
import Navbar from "../../../../Components/Navbar";
import {
  getPlantas,
  createPlanta,
  updatePlanta,
  deletePlanta,
} from "../../../../api/api";
import "./Ingreso_Planta.css";

export default function Ingreso_Planta({ usuario }) {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const navigate = useNavigate();

  const plantaSections = [
    {
      title: "Plantas",
      mainHref: "/Home/Ingreso-Maestro/Planta",
      links: [
        {
          text: "Ingresar Planta",
          href: "/Home/Ingreso-Maestro/Planta/Crear-Planta",
        },
        {
          text: "Actualizar Planta",
          href: "/Home/Ingreso-Maestro/Planta/Actualizar-Planta",
        },
        {
          text: "Eliminar Planta",
          href: "/Home/Ingreso-Maestro/Planta/Eliminar-Planta",
        },
      ],
    },
  ];

  return (
    <div className="app-layout">
      <Header titulo="Gestión de Plantas" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home/Ingreso-Maestro"
          sections={plantaSections}
          onToggle={setNavbarVisible}
        />

        <main
          className={`layout-content ingreso-planta-main ${
            !navbarVisible ? "navbar-hidden" : ""
          }`}
        >
          <Routes>
            <Route path="Crear-Planta" element={<CrearPlanta />} />
            <Route path="Actualizar-Planta" element={<ActualizarPlanta />} />
            <Route path="Eliminar-Planta" element={<EliminarPlanta />} />
            <Route
              index
              element={
                <p className="placeholder">
                  Selecciona una acción sobre Plantas
                </p>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// === Subcomponente: CrearPlanta ===
function CrearPlanta() {
  const [tipoPlanta, setTipoPlanta] = useState("");
  const [error, setError] = useState(null);

  const handleCrear = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createPlanta({ TipoPlanta: tipoPlanta });
      setTipoPlanta("");
      alert("Planta creada");
    } catch (err) {
      setError(err.message || "Error al crear planta");
    }
  };

  return (
    <section className="form-section">
      <h2>Ingresar Planta</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleCrear} className="form-grid">
        <label>Tipo de Planta</label>
        <input
          type="text"
          value={tipoPlanta}
          onChange={(e) => setTipoPlanta(e.target.value)}
          required
        />
        <button type="submit">Crear Planta</button>
      </form>
    </section>
  );
}

// === Subcomponente: ActualizarPlanta ===
function ActualizarPlanta() {
  const [plantas, setPlantas] = useState([]);
  const [filteredPlantas, setFilteredPlantas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [tipoPlanta, setTipoPlanta] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Carga inicial de plantas
  useEffect(() => {
    fetchPlantas();
  }, []);

  const fetchPlantas = async () => {
    setLoading(true);
    try {
      const res = await getPlantas();
      setPlantas(res.data);
      setFilteredPlantas(res.data);
    } catch (err) {
      setError("Error al cargar plantas: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por ID o tipo de planta
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredPlantas(plantas);
    } else {
      setFilteredPlantas(
        plantas.filter(
          (p) =>
            p.PlantaID.toString().includes(q) ||
            p.TipoPlanta.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, plantas]);

  const startEdit = (p) => {
    setSelected(p.PlantaID);
    setTipoPlanta(p.TipoPlanta);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    if (!tipoPlanta.trim()) {
      setError("El tipo de planta no puede estar vacío");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await updatePlanta(selected, { TipoPlanta: tipoPlanta.trim() });
      setSelected(null);
      setTipoPlanta("");
      await fetchPlantas();
      alert("Planta actualizada");
    } catch (err) {
      setError(err.message || "Error al actualizar planta");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelected(null);
    setTipoPlanta("");
    setError(null);
  };

  return (
    <section className="form-section">
      <h2>Actualizar Planta</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por ID o TipoPlanta..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla */}
      <div className="table-container">
        {loading && !selected ? (
          <p className="loading-message">Cargando plantas...</p>
        ) : filteredPlantas.length === 0 ? (
          <p className="no-results">No se encontraron plantas.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>TipoPlanta</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlantas.map((p) => (
                  <tr key={p.PlantaID}>
                    <td data-label="ID">{p.PlantaID}</td>
                    <td data-label="TipoPlanta">{p.TipoPlanta}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => startEdit(p)}
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
          <label>Nuevo Tipo de Planta</label>
          <input
            type="text"
            value={tipoPlanta}
            onChange={(e) => setTipoPlanta(e.target.value)}
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

// === Subcomponente: EliminarPlanta ===
function EliminarPlanta() {
  const [plantas, setPlantas] = useState([]);
  const [filteredPlantas, setFilteredPlantas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlantas();
  }, []);

  const fetchPlantas = async () => {
    try {
      const res = await getPlantas();
      setPlantas(res.data);
      setFilteredPlantas(res.data);
    } catch (err) {
      setError(err.message || "Error al cargar plantas");
    }
  };

  // Filtrar por ID o tipo de planta
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredPlantas(plantas);
    } else {
      setFilteredPlantas(
        plantas.filter(
          (p) =>
            p.PlantaID.toString().includes(q) ||
            p.TipoPlanta.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, plantas]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta planta?")) return;
    setError(null);
    try {
      await deletePlanta(id);
      const updated = plantas.filter((p) => p.PlantaID !== id);
      setPlantas(updated);
      setFilteredPlantas(updated);
      alert("Planta eliminada");
    } catch (err) {
      setError(err.message || "Error al eliminar planta");
    }
  };

  return (
    <section className="table-section">
      <h2>Eliminar Planta</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por ID o TipoPlanta..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla */}
      <div className="table-container">
        {filteredPlantas.length === 0 ? (
          <p className="no-results">No se encontraron plantas.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>TipoPlanta</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlantas.map((p) => (
                  <tr key={p.PlantaID}>
                    <td data-label="ID">{p.PlantaID}</td>
                    <td data-label="TipoPlanta">{p.TipoPlanta}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => handleDelete(p.PlantaID)}
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
