import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../../../Components/Header";
import Navbar from "../../../../Components/Navbar";
import {
  getPlantaGerencias,
  createPlantaGerencia,
  updatePlantaGerencia,
  deletePlantaGerencia,
  getPlantas,
  getGerencias,
} from "../../../../api/api";
import "./Ingreso_PlantaGerencia.css";

export default function Ingreso_PlantaGerencia({ usuario }) {
  const [navbarVisible, setNavbarVisible] = useState(true);

  const PlantaGerenciaSections = [
    {
      title: "Planta–Gerencia",
      mainHref: "/Home/Ingreso-Maestro/Planta-Gerencia",
      links: [
        {
          text: "Ingresar Relación",
          href: "/Home/Ingreso-Maestro/Planta-Gerencia/Crear-Relación",
        },
        {
          text: "Actualizar Relación",
          href: "/Home/Ingreso-Maestro/Planta-Gerencia/Actualizar-Relación",
        },
        {
          text: "Eliminar Relación",
          href: "/Home/Ingreso-Maestro/Planta-Gerencia/Eliminar-Relación",
        },
      ],
    },
  ];

  return (
    <div className="app-layout">
      <Header titulo="Gestión Planta–Gerencia" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home/Ingreso-Maestro"
          sections={PlantaGerenciaSections}
          onToggle={setNavbarVisible}
        />

        <main
          className={`layout-content ingreso-pg-main ${
            !navbarVisible ? "navbar-hidden" : ""
          }`}
        >
          <Routes>
            <Route path="Crear-Relación" element={<CrearRelacion />} />
            <Route
              path="Actualizar-Relación"
              element={<ActualizarRelacion />}
            />
            <Route path="Eliminar-Relación" element={<EliminarRelacion />} />
            <Route
              index
              element={
                <p className="placeholder">
                  Selecciona una acción sobre Planta–Gerencia
                </p>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// — CrearRelacion —
function CrearRelacion() {
  const [plantas, setPlantas] = useState([]);
  const [gerencias, setGerencias] = useState([]);
  const [plantaId, setPlantaId] = useState("");
  const [gerenciaId, setGerenciaId] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    getPlantas()
      .then((res) => setPlantas(res.data))
      .catch(console.error);
    getGerencias()
      .then((res) => setGerencias(res.data))
      .catch(console.error);
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createPlantaGerencia({
        PlantaID: plantaId,
        GerenciaID: gerenciaId,
      });
      setPlantaId("");
      setGerenciaId("");
      alert("Relación creada");
    } catch (err) {
      setError(err.message || "Error al crear relación");
    }
  };

  return (
    <section className="form-section">
      <h2>Ingresar Relación</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleCrear} className="form-grid">
        <label>Planta</label>
        <select
          value={plantaId}
          onChange={(e) => setPlantaId(e.target.value)}
          required
        >
          <option value="">Seleccione planta</option>
          {plantas.map((p) => (
            <option key={p.PlantaID} value={p.PlantaID}>
              {p.TipoPlanta}
            </option>
          ))}
        </select>

        <label>Gerencia</label>
        <select
          value={gerenciaId}
          onChange={(e) => setGerenciaId(e.target.value)}
          required
        >
          <option value="">Seleccione gerencia</option>
          {gerencias.map((g) => (
            <option key={g.GerenciaID} value={g.GerenciaID}>
              {g.NombreGerencia}
            </option>
          ))}
        </select>

        <button type="submit">Crear Relación</button>
      </form>
    </section>
  );
}

// — ActualizarRelacion —
function ActualizarRelacion() {
  const [relaciones, setRelaciones] = useState([]);
  const [filteredRelaciones, setFilteredRelaciones] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [plantaId, setPlantaId] = useState("");
  const [gerenciaId, setGerenciaId] = useState("");
  const [plantas, setPlantas] = useState([]);
  const [gerencias, setGerencias] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Carga inicial
  useEffect(() => {
    fetchList();
    getPlantas()
      .then((res) => setPlantas(res.data))
      .catch(console.error);
    getGerencias()
      .then((res) => setGerencias(res.data))
      .catch(console.error);
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getPlantaGerencias();
      setRelaciones(res.data);
      setFilteredRelaciones(res.data);
    } catch (err) {
      setError(err.message || "Error al cargar relaciones");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por ID, planta o gerencia
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredRelaciones(relaciones);
    } else {
      setFilteredRelaciones(
        relaciones.filter(
          (r) =>
            r.PlantaGerenciaID.toString().includes(q) ||
            (r.TipoPlanta || "").toLowerCase().includes(q) ||
            (r.NombreGerencia || "").toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, relaciones]);

  const startEdit = (rel) => {
    setSelected(rel.PlantaGerenciaID);
    setPlantaId(rel.PlantaID);
    setGerenciaId(rel.GerenciaID);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    setError(null);
    if (!plantaId || !gerenciaId) {
      setError("Debe seleccionar planta y gerencia");
      return;
    }
    setLoading(true);
    try {
      await updatePlantaGerencia(selected, {
        PlantaID: plantaId,
        GerenciaID: gerenciaId,
      });
      setSelected(null);
      setPlantaId("");
      setGerenciaId("");
      await fetchList();
      alert("Relación actualizada");
    } catch (err) {
      setError(err.message || "Error al actualizar relación");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelected(null);
    setPlantaId("");
    setGerenciaId("");
    setError(null);
  };

  return (
    <section className="form-section">
      <h2>Actualizar Relación Planta–Gerencia</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por ID, planta o gerencia..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla */}
      <div className="table-container">
        {loading && !selected ? (
          <p className="loading-message">Cargando relaciones...</p>
        ) : filteredRelaciones.length === 0 ? (
          <p className="no-results">No se encontraron relaciones.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Planta</th>
                  <th>Gerencia</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredRelaciones.map((r) => (
                  <tr key={r.PlantaGerenciaID}>
                    <td data-label="ID">{r.PlantaGerenciaID}</td>
                    <td data-label="Planta">{r.TipoPlanta}</td>
                    <td data-label="Gerencia">{r.NombreGerencia}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => startEdit(r)}
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
          <label>Planta</label>
          <select
            value={plantaId}
            onChange={(e) => setPlantaId(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Seleccione planta</option>
            {plantas.map((p) => (
              <option key={p.PlantaID} value={p.PlantaID}>
                {p.TipoPlanta}
              </option>
            ))}
          </select>

          <label>Gerencia</label>
          <select
            value={gerenciaId}
            onChange={(e) => setGerenciaId(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Seleccione gerencia</option>
            {gerencias.map((g) => (
              <option key={g.GerenciaID} value={g.GerenciaID}>
                {g.NombreGerencia}
              </option>
            ))}
          </select>

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

function EliminarRelacion() {
  const [relaciones, setRelaciones] = useState([]);
  const [filteredRelaciones, setFilteredRelaciones] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // Carga inicial
  useEffect(() => {
    getPlantaGerencias()
      .then((res) => {
        setRelaciones(res.data);
        setFilteredRelaciones(res.data);
      })
      .catch((err) => {
        setError(err.message || "Error al cargar relaciones");
      });
  }, []);

  // Filtrar
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredRelaciones(relaciones);
    } else {
      setFilteredRelaciones(
        relaciones.filter(
          (r) =>
            r.PlantaGerenciaID.toString().includes(q) ||
            (r.TipoPlanta || "").toLowerCase().includes(q) ||
            (r.NombreGerencia || "").toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, relaciones]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta relación?")) return;
    setError(null);
    try {
      await deletePlantaGerencia(id);
      const updated = relaciones.filter((r) => r.PlantaGerenciaID !== id);
      setRelaciones(updated);
      setFilteredRelaciones(updated);
      alert("Relación eliminada");
    } catch (err) {
      setError(err.message || "Error al eliminar relación");
    }
  };

  return (
    <section className="table-section">
      <h2>Eliminar Relación Planta–Gerencia</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por ID, planta o gerencia..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla */}
      <div className="table-container">
        {filteredRelaciones.length === 0 ? (
          <p className="no-results">No se encontraron relaciones.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Planta</th>
                  <th>Gerencia</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredRelaciones.map((r) => (
                  <tr key={r.PlantaGerenciaID}>
                    <td data-label="ID">{r.PlantaGerenciaID}</td>
                    <td data-label="Planta">{r.TipoPlanta}</td>
                    <td data-label="Gerencia">{r.NombreGerencia}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => handleDelete(r.PlantaGerenciaID)}
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
