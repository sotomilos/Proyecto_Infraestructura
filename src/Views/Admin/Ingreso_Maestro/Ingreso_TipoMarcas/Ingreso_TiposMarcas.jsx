import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "../../../../Components/Header";
import Navbar from "../../../../Components/Navbar";
import "./Ingreso_TipoMarcas.css";

import {
  getTipoMarcas,
  createTipoMarca,
  updateTipoMarca,
  deleteTipoMarca,
} from "../../../../api/api";

export default function Ingreso_TipoMarcas({ usuario }) {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const navigate = useNavigate();

  const TipoMarcasSections = [
    {
      title: "Tipo de Marcas",
      mainHref: "/Home/Ingreso-Maestro/Tipo-Marcas",
      links: [
        {
          text: "Ingresar Marca",
          href: "/Home/Ingreso-Maestro/Tipo-Marcas/Crear-Marca",
        },
        {
          text: "Actualizar Marca",
          href: "/Home/Ingreso-Maestro/Tipo-Marcas/Actualizar-Marca",
        },
        {
          text: "Eliminar Marca",
          href: "/Home/Ingreso-Maestro/Tipo-Marcas/Eliminar-Marca",
        },
      ],
    },
  ];

  return (
    <div className="app-layout">
      <Header titulo="Gestión de Marcas" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home/Ingreso-Maestro"
          sections={TipoMarcasSections}
          onToggle={setNavbarVisible}
        />

        <main
          className={`layout-content ingreso-marcas-main ${
            !navbarVisible ? "navbar-hidden" : ""
          }`}
        >
          <Routes>
            <Route path="Crear-Marca" element={<CrearMarca />} />
            <Route path="Actualizar-Marca" element={<ActualizarMarca />} />
            <Route path="Eliminar-Marca" element={<EliminarMarca />} />
            <Route
              index
              element={
                <p className="placeholder">
                  Selecciona una acción sobre Tipo de Marcas
                </p>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// — CrearMarca —
function CrearMarca() {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(null);

  const handleCrear = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createTipoMarca({ NombreMarca: nombre });
      setNombre("");
      alert("Marca creada");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="form-section">
      <h2>Ingresar Marca</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleCrear} className="form-grid">
        <label>Nombre de la Marca</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <button type="submit">Crear Marca</button>
      </form>
    </section>
  );
}

// — ActualizarMarca —
function ActualizarMarca() {
  const [marcas, setMarcas] = useState([]);
  const [filteredMarcas, setFilteredMarcas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarcas();
  }, []);

  const fetchMarcas = async () => {
    try {
      const res = await getTipoMarcas();
      setMarcas(res.data);
      setFilteredMarcas(res.data);
    } catch (err) {
      setError("Error al cargar marcas: " + err.message);
    }
  };

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredMarcas(marcas);
    } else {
      setFilteredMarcas(
        marcas.filter(
          (m) =>
            m.MarcaID.toString().includes(q) ||
            m.NombreMarca.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, marcas]);

  const startEdit = (m) => {
    setSelected(m.MarcaID);
    setNombre(m.NombreMarca);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await updateTipoMarca(selected, { NombreMarca: nombre.trim() });
      alert("Marca actualizada");
      setSelected(null);
      setNombre("");
      fetchMarcas();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setSelected(null);
    setNombre("");
    setError(null);
  };

  return (
    <section className="form-section">
      <h2>Actualizar Marca</h2>
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
        {filteredMarcas.length === 0 ? (
          <p className="no-results">No se encontraron marcas.</p>
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
                {filteredMarcas.map((m) => (
                  <tr key={m.MarcaID}>
                    <td data-label="ID">{m.MarcaID}</td>
                    <td data-label="Nombre">{m.NombreMarca}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => startEdit(m)}
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

function EliminarMarca() {
  const [marcas, setMarcas] = useState([]);
  const [filteredMarcas, setFilteredMarcas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMarcas() {
      try {
        const res = await getTipoMarcas();
        setMarcas(res.data);
        setFilteredMarcas(res.data);
      } catch (err) {
        setError("Error al cargar marcas: " + err.message);
      }
    }
    loadMarcas();
  }, []);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredMarcas(marcas);
    } else {
      setFilteredMarcas(
        marcas.filter(
          (m) =>
            m.MarcaID.toString().includes(q) ||
            m.NombreMarca.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, marcas]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta marca?")) return;
    setError(null);
    try {
      await deleteTipoMarca(id);
      const updated = marcas.filter((m) => m.MarcaID !== id);
      setMarcas(updated);
      setFilteredMarcas(updated);
      alert("Marca eliminada");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="table-section">
      <h2>Eliminar Marca</h2>
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
        {filteredMarcas.length === 0 ? (
          <p className="no-results">No se encontraron marcas.</p>
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
                {filteredMarcas.map((m) => (
                  <tr key={m.MarcaID}>
                    <td data-label="ID">{m.MarcaID}</td>
                    <td data-label="Nombre">{m.NombreMarca}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => handleDelete(m.MarcaID)}
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
