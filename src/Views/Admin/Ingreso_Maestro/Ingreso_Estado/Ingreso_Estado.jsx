import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "../../../../Components/Header";
import Navbar from "../../../../Components/Navbar";
import {
  getEstados,
  createEstados,
  updateEstados,
  deleteEstados,
} from "../../../../api/api";
import "./Ingreso_Estado.css";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function Ingreso_Estado({ usuario }) {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const navigate = useNavigate();

  const EstadoSections = [
    {
      title: "Estados de Equipo",
      mainHref: "/Home/Ingreso-Maestro/Estado-Equipo",
      links: [
        {
          text: "Ingresar Estado",
          href: "/Home/Ingreso-Maestro/Estado-Equipo/Crear-Estado",
          icon: <FaPlus />,
        },
        {
          text: "Actualizar Estado",
          href: "/Home/Ingreso-Maestro/Estado-Equipo/Actualizar-Estado",
          icon: <FaEdit />,
        },
        {
          text: "Eliminar Estado",
          href: "/Home/Ingreso-Maestro/Estado-Equipo/Eliminar-Estado",
          icon: <FaTrash />,
        },
      ],
    },
  ];

  return (
    <div className="app-layout">
      <Header titulo="Gestión de Estados" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home/Ingreso-Maestro"
          sections={EstadoSections}
          onToggle={setNavbarVisible}
        />

        <main
          className={`layout-content ingreso-estado-main ${
            !navbarVisible ? "navbar-hidden" : ""
          }`}
        >
          <Routes>
            <Route path="Crear-Estado" element={<CrearEstado />} />
            <Route path="Actualizar-Estado" element={<ActualizarEstado />} />
            <Route path="Eliminar-Estado" element={<EliminarEstado />} />
            <Route
              index
              element={
                <div className="welcome-container">
                  <div className="welcome-card">
                    <h2>Gestión de Estados de Equipo</h2>
                    <p className="placeholder">
                      Selecciona una acción del menú lateral
                    </p>
                    <div className="welcome-options">
                      <div
                        className="option-card"
                        onClick={() => navigate("Crear-Estado")}
                      >
                        <FaPlus className="option-icon" />
                        <span>Crear</span>
                      </div>
                      <div
                        className="option-card"
                        onClick={() => navigate("Actualizar-Estado")}
                      >
                        <FaEdit className="option-icon" />
                        <span>Actualizar</span>
                      </div>
                      <div
                        className="option-card"
                        onClick={() => navigate("Eliminar-Estado")}
                      >
                        <FaTrash className="option-icon" />
                        <span>Eliminar</span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// — CrearEstado —
function CrearEstado() {
  const [estado, setEstado] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingEstados, setExistingEstados] = useState([]);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const res = await getEstados();
        setExistingEstados(res.data);
      } catch (err) {
        console.error("Error al cargar estados para validación:", err);
      }
    };
    fetchEstados();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();

    const estadoNormalizado = estado.trim().toLowerCase();
    const estadoExistente = existingEstados.find(
      (e) => e.EstadoEquipo.toLowerCase() === estadoNormalizado
    );

    if (estadoExistente) {
      setError(`El estado "${estado}" ya existe en el sistema.`);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await createEstados({ EstadoEquipo: estado.trim() });
      setExistingEstados([...existingEstados, res.data]);
      setEstado("");
      showNotification("Estado creado exitosamente");
    } catch (err) {
      setError(err.message || "Error al crear estado");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message) => {
    const notification = document.createElement("div");
    notification.className = "notification success";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);
    }, 100);
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <h2>
          <FaPlus className="section-icon" /> Ingresar Estado
        </h2>
      </div>

      {error && (
        <div className="error-message">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      <form onSubmit={handleCrear} className="form-container">
        <div className="form-group">
          <label htmlFor="estadoNombre">Nombre de Estado:</label>
          <input
            id="estadoNombre"
            type="text"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            placeholder="Ej: Operativo, En reparación, Obsoleto..."
            required
            disabled={loading}
            className="form-control"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creando..." : "Crear Estado"}
          </button>
        </div>
      </form>
    </section>
  );
}

// — ActualizarEstado —
function ActualizarEstado() {
  const [estados, setEstados] = useState([]);
  const [filteredEstados, setFilteredEstados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(null);
  const [estado, setEstado] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEstados();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEstados(estados);
      return;
    }
    const filtered = estados.filter(
      (e) =>
        e.EstadoEquipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.EstadoID.toString().includes(searchTerm)
    );
    setFilteredEstados(filtered);
  }, [searchTerm, estados]);

  const fetchEstados = async () => {
    setLoading(true);
    try {
      const res = await getEstados();
      setEstados(res.data);
      setFilteredEstados(res.data);
    } catch (err) {
      setError("Error al cargar los estados");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (e) => {
    setSelected(e.EstadoID);
    setEstado(e.EstadoEquipo);
    setError(null);
  };

  const handleActualizar = async (ev) => {
    ev.preventDefault();
    setError(null);

    const estadoNormalizado = estado.trim().toLowerCase();
    const estadoExistente = estados.find(
      (e) =>
        e.EstadoEquipo.toLowerCase() === estadoNormalizado &&
        e.EstadoID !== selected
    );

    if (estadoExistente) {
      setError(`El estado "${estado}" ya existe en el sistema.`);
      return;
    }

    setLoading(true);
    try {
      await updateEstados(selected, { EstadoEquipo: estado.trim() });
      setSelected(null);
      setEstado("");
      await fetchEstados();
      showNotification("Estado actualizado exitosamente");
    } catch (err) {
      setError(err.message || "Error al actualizar estado");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setSelected(null);
    setEstado("");
    setError(null);
  };

  const showNotification = (message) => {
    const notification = document.createElement("div");
    notification.className = "notification success";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);
    }, 100);
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <h2>
          <FaEdit className="section-icon" /> Actualizar Estado
        </h2>
      </div>

      {error && (
        <div className="error-message">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      <div className="search-container">
        <div className="search-input-group">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por ID o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm("")}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      <div className="table-section">
        {loading && !selected ? (
          <div className="loading-spinner">Cargando datos...</div>
        ) : filteredEstados.length === 0 ? (
          <div className="no-results">
            No se encontraron estados{searchTerm ? " para la búsqueda" : ""}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Estado de Equipo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredEstados.map((e) => (
                <tr
                  key={e.EstadoID}
                  className={selected === e.EstadoID ? "selected-row" : ""}
                >
                  <td>{e.EstadoID}</td>
                  <td>{e.EstadoEquipo}</td>
                  <td>
                    <button
                      onClick={() => startEdit(e)}
                      className="btn-edit"
                      disabled={selected !== null}
                    >
                      <FaEdit /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="edit-form-container">
          <h3>Editar Estado</h3>
          <form onSubmit={handleActualizar} className="form-container">
            <div className="form-group">
              <label htmlFor="editEstadoNombre">Nuevo Nombre:</label>
              <input
                id="editEstadoNombre"
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
                disabled={loading}
                className="form-control"
                autoFocus
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                <FaSave /> {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="btn-secondary"
                disabled={loading}
              >
                <FaTimes /> Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

// — EliminarEstado —
function EliminarEstado() {
  const [estados, setEstados] = useState([]);
  const [filteredEstados, setFilteredEstados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchEstados();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEstados(estados);
      return;
    }
    const filtered = estados.filter(
      (e) =>
        e.EstadoEquipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.EstadoID.toString().includes(searchTerm)
    );
    setFilteredEstados(filtered);
  }, [searchTerm, estados]);

  const fetchEstados = async () => {
    setLoading(true);
    try {
      const res = await getEstados();
      setEstados(res.data);
      setFilteredEstados(res.data);
    } catch (err) {
      setError("Error al cargar los estados");
    } finally {
      setLoading(false);
    }
  };

  const startDelete = (id, nombre) => {
    setConfirmDelete({ id, nombre });
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    setError(null);
    setLoading(true);

    try {
      await deleteEstados(confirmDelete.id);
      setEstados(estados.filter((e) => e.EstadoID !== confirmDelete.id));
      setFilteredEstados(
        filteredEstados.filter((e) => e.EstadoID !== confirmDelete.id)
      );
      setConfirmDelete(null);
      showNotification("Estado eliminado exitosamente");
    } catch (err) {
      setError(err.message || "Error al eliminar estado");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message) => {
    const notification = document.createElement("div");
    notification.className = "notification success";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);
    }, 100);
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <h2>
          <FaTrash className="section-icon" /> Eliminar Estado
        </h2>
      </div>

      {error && (
        <div className="error-message">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      <div className="search-container">
        <div className="search-input-group">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por ID o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm("")}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      <div className="table-section">
        {loading && !confirmDelete ? (
          <div className="loading-spinner">Cargando datos...</div>
        ) : filteredEstados.length === 0 ? (
          <div className="no-results">
            No se encontraron estados{searchTerm ? " para la búsqueda" : ""}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Estado de Equipo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredEstados.map((e) => (
                <tr key={e.EstadoID}>
                  <td>{e.EstadoID}</td>
                  <td>{e.EstadoEquipo}</td>
                  <td>
                    <button
                      onClick={() => startDelete(e.EstadoID, e.EstadoEquipo)}
                      className="btn-delete"
                      disabled={confirmDelete !== null}
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {confirmDelete && (
        <div className="confirm-dialog">
          <div className="confirm-dialog-content">
            <h3>Confirmar Eliminación</h3>
            <p>
              ¿Estás seguro que deseas eliminar el estado{" "}
              <strong>"{confirmDelete.nombre}"</strong>?
            </p>
            <p className="warning-text">Esta acción no se puede deshacer.</p>

            <div className="confirm-actions">
              <button
                onClick={handleDelete}
                className="btn-danger"
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Sí, Eliminar"}
              </button>
              <button
                onClick={cancelDelete}
                className="btn-secondary"
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
