import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../../../Components/Header";
import Navbar from "../../../../Components/Navbar";
import {
  getDependencias,
  createDependencia,
  updateDependencia,
  deleteDependencia,
  getPlantaGerencias,
} from "../../../../api/api";
import "./Ingreso_Dependencia.css";

export default function Ingreso_Dependencia({ usuario }) {
  const [navbarVisible, setNavbarVisible] = useState(true);

  const DependenciaSections = [
    {
      title: "Dependencias",
      mainHref: "/Home/Ingreso-Maestro/Dependencia",
      links: [
        {
          text: "Ingresar Dependencia",
          href: "/Home/Ingreso-Maestro/Dependencia/Crear-Dependencia",
        },
        {
          text: "Actualizar Dependencia",
          href: "/Home/Ingreso-Maestro/Dependencia/Actualizar-Dependencia",
        },
        {
          text: "Eliminar Dependencia",
          href: "/Home/Ingreso-Maestro/Dependencia/Eliminar-Dependencia",
        },
      ],
    },
  ];

  return (
    <div className="app-layout">
      <Header titulo="Gestión de Dependencias" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home/Ingreso-Maestro"
          sections={DependenciaSections}
          onToggle={setNavbarVisible}
        />

        <main
          className={`layout-content ingreso-dependencia-main ${
            !navbarVisible ? "navbar-hidden" : ""
          }`}
        >
          <Routes>
            <Route path="Crear-Dependencia" element={<CrearDependencia />} />
            <Route
              path="Actualizar-Dependencia"
              element={<ActualizarDependencia />}
            />
            <Route
              path="Eliminar-Dependencia"
              element={<EliminarDependencia />}
            />
            <Route
              index
              element={
                <p className="placeholder">
                  Selecciona una acción sobre Dependencias
                </p>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// — CrearDependencia —
function CrearDependencia() {
  const [nombre, setNombre] = useState("");
  const [ccosto, setCcosto] = useState("");
  const [pgs, setPgs] = useState([]);
  const [pgSeleccion, setPgSeleccion] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    getPlantaGerencias()
      .then((res) => setPgs(res.data))
      .catch((err) => {
        console.error(err);
        setError("Error al cargar Planta-Gerencias");
      });
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createDependencia({
        NombreDependencia: nombre,
        Ccosto: parseFloat(ccosto),
        PlantaGerenciaID: parseInt(pgSeleccion, 10),
      });
      setNombre("");
      setCcosto("");
      setPgSeleccion("");
      alert("Dependencia creada");
    } catch (err) {
      setError(err.message || "Error al crear dependencia");
    }
  };

  return (
    <section className="form-section">
      <h2>Ingresar Dependencia</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleCrear} className="form-grid">
        <label>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Costo (ccosto)</label>
        <input
          type="number"
          step="0.01"
          value={ccosto}
          onChange={(e) => setCcosto(e.target.value)}
          required
        />

        <label>Planta–Gerencia</label>
        <select
          value={pgSeleccion}
          onChange={(e) => setPgSeleccion(e.target.value)}
          required
        >
          <option value="">Seleccione relación</option>
          {pgs.map((pg) => (
            <option key={pg.PlantaGerenciaID} value={pg.PlantaGerenciaID}>
              {pg.TipoPlanta} – {pg.NombreGerencia}
            </option>
          ))}
        </select>

        <button type="submit">Crear Dependencia</button>
      </form>
    </section>
  );
}

// — ActualizarDependencia —
function ActualizarDependencia() {
  const [dependencias, setDependencias] = useState([]);
  const [filteredDependencias, setFilteredDependencias] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pgs, setPgs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [nombre, setNombre] = useState("");
  const [ccosto, setCcosto] = useState("");
  const [pgSeleccion, setPgSeleccion] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    getPlantaGerencias()
      .then((res) => setPgs(res.data))
      .catch((err) => {
        console.error(err);
        setError("Error al cargar Planta-Gerencias");
      });
  }, []);

  const fetchData = () => {
    getDependencias()
      .then((res) => {
        setDependencias(res.data);
        setFilteredDependencias(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar dependencias");
      });
  };

  // Filtrar dependencias por nombre o costo
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredDependencias(dependencias);
    } else {
      setFilteredDependencias(
        dependencias.filter(
          (d) =>
            d.NombreDependencia.toLowerCase().includes(q) ||
            String(d.Ccosto).toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, dependencias]);

  const startEdit = (d) => {
    setSelected(d.DependenciaID);
    setNombre(d.NombreDependencia);
    setCcosto(d.Ccosto);
    setPgSeleccion(d.PlantaGerenciaID);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await updateDependencia(selected, {
        NombreDependencia: nombre,
        Ccosto: parseFloat(ccosto),
        PlantaGerenciaID: parseInt(pgSeleccion, 10),
      });
      setSelected(null);
      setNombre("");
      setCcosto("");
      setPgSeleccion("");
      fetchData();
      alert("Dependencia actualizada");
    } catch (err) {
      setError(err.message || "Error al actualizar dependencia");
    }
  };

  return (
    <section className="form-section">
      <h2>Actualizar Dependencia</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre o costo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla */}
      <div className="table-section">
        {filteredDependencias.length === 0 ? (
          <p className="no-results">No se encontraron dependencias.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Ccosto</th>
                  <th>Relación</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredDependencias.map((d) => (
                  <tr key={d.DependenciaID}>
                    <td data-label="Nombre">{d.NombreDependencia}</td>
                    <td data-label="Ccosto">{d.Ccosto}</td>
                    <td data-label="Relación">
                      {d.TipoPlanta} – {d.NombreGerencia}
                    </td>
                    <td data-label="Acción">
                      <button onClick={() => startEdit(d)} className="btn-edit">
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
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label>Costo (ccosto)</label>
          <input
            type="number"
            step="0.01"
            value={ccosto}
            onChange={(e) => setCcosto(e.target.value)}
            required
          />

          <label>Planta–Gerencia</label>
          <select
            value={pgSeleccion}
            onChange={(e) => setPgSeleccion(e.target.value)}
            required
          >
            <option value="">Seleccione relación</option>
            {pgs.map((pg) => (
              <option key={pg.PlantaGerenciaID} value={pg.PlantaGerenciaID}>
                {pg.TipoPlanta} – {pg.NombreGerencia}
              </option>
            ))}
          </select>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              Guardar Cambios
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setSelected(null)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function EliminarDependencia() {
  const [dependencias, setDependencias] = useState([]);
  const [filteredDependencias, setFilteredDependencias] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    getDependencias()
      .then((res) => {
        setDependencias(res.data);
        setFilteredDependencias(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar dependencias");
      });
  }, []);

  // Filtrar por nombre o costo
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredDependencias(dependencias);
    } else {
      setFilteredDependencias(
        dependencias.filter(
          (d) =>
            d.NombreDependencia.toLowerCase().includes(q) ||
            String(d.Ccosto).toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, dependencias]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta dependencia?")) return;
    setError(null);
    try {
      await deleteDependencia(id);
      const updated = dependencias.filter((d) => d.DependenciaID !== id);
      setDependencias(updated);
      setFilteredDependencias(updated);
      alert("Dependencia eliminada");
    } catch (err) {
      setError(err.message || "Error al eliminar dependencia");
    }
  };

  return (
    <section className="table-section">
      <h2>Eliminar Dependencia</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre o costo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla */}
      <div className="table-container">
        {filteredDependencias.length === 0 ? (
          <p className="no-results">No se encontraron dependencias.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Ccosto</th>
                  <th>Relación</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredDependencias.map((d) => (
                  <tr key={d.DependenciaID}>
                    <td data-label="Nombre">{d.NombreDependencia}</td>
                    <td data-label="Ccosto">{d.Ccosto}</td>
                    <td data-label="Relación">
                      {d.TipoPlanta} – {d.NombreGerencia}
                    </td>
                    <td data-label="Acción">
                      <button
                        onClick={() => handleDelete(d.DependenciaID)}
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
