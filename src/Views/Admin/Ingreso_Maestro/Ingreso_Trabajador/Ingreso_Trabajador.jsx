import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../../../Components/Header";
import Navbar from "../../../../Components/Navbar";
import {
  getTrabajadores,
  createTrabajador,
  updateTrabajador,
  deleteTrabajador,
  getDependencias,
  getTipoCargos,
} from "../../../../api/api";
import "./Ingreso_Trabajador.css";

export default function Ingreso_Trabajador({ usuario }) {
  const [navVisible, setNavVisible] = useState(true);

  const TrabajadorSections = [
    {
      title: "Trabajadores",
      mainHref: "/Home/Ingreso-Maestro/Trabajador",
      links: [
        {
          text: "Ingresar Trabajador",
          href: "/Home/Ingreso-Maestro/Trabajador/Crear-Trabajador",
        },
        {
          text: "Actualizar Trabajador",
          href: "/Home/Ingreso-Maestro/Trabajador/Actualizar-Trabajador",
        },
        {
          text: "Eliminar Trabajador",
          href: "/Home/Ingreso-Maestro/Trabajador/Eliminar-Trabajador",
        },
      ],
    },
  ];

  return (
    <div className="app-layout">
      <Header titulo="Gestión de Trabajadores" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home/Ingreso-Maestro"
          sections={TrabajadorSections}
          onToggle={setNavVisible}
        />

        <main
          className={`layout-content ingreso-trabajador-main ${
            !navVisible ? "navbar-hidden" : ""
          }`}
        >
          <Routes>
            <Route path="Crear-Trabajador" element={<CrearTrabajador />} />
            <Route
              path="Actualizar-Trabajador"
              element={<ActualizarTrabajador />}
            />
            <Route
              path="Eliminar-Trabajador"
              element={<EliminarTrabajador />}
            />
            <Route
              index
              element={
                <p className="placeholder">
                  Selecciona una acción sobre Trabajadores
                </p>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function CrearTrabajador() {
  const [form, setForm] = useState({
    Ficha: "",
    DependenciaID: "",
    NombreCompleto: "",
    UsuarioLogin: "",
    TipoCargoID: "",
    EstadoUsuario: "",
    LicOffice: "",
    PowerBI: "",
    Project: "",
    Visio: "",
    Copilot: "",
    LicSAP: "",
    LicAutodesk: "",
    LicAdobe: "",
    Telefono: "",
    Email: "",
    MFA: "",
    OtraLic: "",
  });

  const [dependencias, setDependencias] = useState([]);
  const [tipocargos, setTipoCargos] = useState([]);

  const [depSearch, setDepSearch] = useState("");
  const [showDepOptions, setShowDepOptions] = useState(false);
  const [tipoSearch, setTipoSearch] = useState("");
  const [showTipoOptions, setShowTipoOptions] = useState(false);

  useEffect(() => {
    // Traer dependencias y cargos desde la API
    const fetchData = async () => {
      try {
        const dependenciasRes = await getDependencias();
        setDependencias(dependenciasRes.data);

        const cargosRes = await getTipoCargos();
        setTipoCargos(cargosRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  const filteredDeps = useMemo(() => {
    const txt = depSearch.toLowerCase();
    return dependencias.filter((d) =>
      d.NombreDependencia.toLowerCase().includes(txt)
    );
  }, [depSearch, dependencias]);

  const filteredTipo = useMemo(() => {
    const txt = tipoSearch.toLowerCase();
    return tipocargos.filter((t) => t.NombreCargo.toLowerCase().includes(txt));
  }, [tipoSearch, tipocargos]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await createTrabajador(form);
      alert("Trabajador creado exitosamente");
      setForm({
        Ficha: "",
        DependenciaID: "",
        NombreCompleto: "",
        UsuarioLogin: "",
        TipoCargoID: "",
        EstadoUsuario: "",
        LicOffice: "",
        PowerBI: "",
        Project: "",
        Visio: "",
        Copilot: "",
        LicSAP: "",
        LicAutodesk: "",
        LicAdobe: "",
        Telefono: "",
        Email: "",
        MFA: "",
        OtraLic: "",
      });
    } catch (error) {
      console.error("Error al crear trabajador:", error);
      alert("Hubo un error al crear el trabajador");
    }
  };

  return (
    <form onSubmit={handleCrear} className="form-grid">
      {/* === Datos Principales === */}
      <h3 className="form-section-title">Datos Principales</h3>

      <label>Ficha</label>
      <input name="Ficha" value={form.Ficha} onChange={handleChange} required />

      <label>Dependencia</label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Buscar dependencia..."
          value={depSearch}
          onChange={(e) => {
            setDepSearch(e.target.value);
            setShowDepOptions(true);
          }}
          onFocus={() => setShowDepOptions(true)}
          onBlur={() => setTimeout(() => setShowDepOptions(false), 100)}
          className="autocomplete-input"
        />
        {showDepOptions && (
          <ul className="autocomplete-list">
            {filteredDeps.map((d) => (
              <li
                key={d.DependenciaID}
                onMouseDown={() => {
                  setForm((f) => ({ ...f, DependenciaID: d.DependenciaID }));
                  setDepSearch(d.NombreDependencia);
                  setShowDepOptions(false);
                }}
              >
                {d.NombreDependencia}
              </li>
            ))}
            {filteredDeps.length === 0 && (
              <li className="no-results">No hay coincidencias</li>
            )}
          </ul>
        )}
      </div>

      <label>Nombre Completo</label>
      <input
        name="NombreCompleto"
        value={form.NombreCompleto}
        onChange={handleChange}
        required
      />

      <label>Usuario Login</label>
      <input
        name="UsuarioLogin"
        value={form.UsuarioLogin}
        onChange={handleChange}
        required
      />

      <label>Tipo Cargo</label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Buscar tipo cargo..."
          value={tipoSearch}
          onChange={(e) => {
            setTipoSearch(e.target.value);
            setShowTipoOptions(true);
          }}
          onFocus={() => setShowTipoOptions(true)}
          onBlur={() => setTimeout(() => setShowTipoOptions(false), 100)}
          className="autocomplete-input"
        />
        {showTipoOptions && (
          <ul className="autocomplete-list">
            {filteredTipo.map((t) => (
              <li
                key={t.TipoCargoID}
                onMouseDown={() => {
                  setForm((f) => ({ ...f, TipoCargoID: t.TipoCargoID }));
                  setTipoSearch(t.NombreCargo);
                  setShowTipoOptions(false);
                }}
              >
                {t.NombreCargo}
              </li>
            ))}
            {filteredTipo.length === 0 && (
              <li className="no-results">No hay coincidencias</li>
            )}
          </ul>
        )}
      </div>

      <label>Estado Usuario</label>
      <input
        name="EstadoUsuario"
        value={form.EstadoUsuario}
        onChange={handleChange}
        required
      />

      {/* === Licencias === */}
      <h3 className="form-section-title">Licencias</h3>

      <label>Licencia Office</label>
      <input name="LicOffice" value={form.LicOffice} onChange={handleChange} />

      <label>Power BI</label>
      <input name="PowerBI" value={form.PowerBI} onChange={handleChange} />

      <label>Project</label>
      <input name="Project" value={form.Project} onChange={handleChange} />

      <label>Visio</label>
      <input name="Visio" value={form.Visio} onChange={handleChange} />

      <label>Copilot</label>
      <input name="Copilot" value={form.Copilot} onChange={handleChange} />

      <label>Licencia SAP</label>
      <input name="LicSAP" value={form.LicSAP} onChange={handleChange} />

      <label>Licencia Autodesk</label>
      <input
        name="LicAutodesk"
        value={form.LicAutodesk}
        onChange={handleChange}
      />

      <label>Licencia Adobe</label>
      <input name="LicAdobe" value={form.LicAdobe} onChange={handleChange} />

      <label>MFA</label>
      <input name="MFA" value={form.MFA} onChange={handleChange} />

      <label>Otra Licencia</label>
      <input name="OtraLic" value={form.OtraLic} onChange={handleChange} />

      {/* === Contacto === */}
      <h3 className="form-section-title">Datos de Contacto</h3>

      <label>Teléfono</label>
      <input name="Telefono" value={form.Telefono} onChange={handleChange} />

      <label>Email</label>
      <input
        type="email"
        name="Email"
        value={form.Email}
        onChange={handleChange}
      />

      <button type="submit" className="submit-button">
        Crear Trabajador
      </button>
    </form>
  );
}

function ActualizarTrabajador() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    Ficha: "",
    DependenciaID: "",
    NombreCompleto: "",
    UsuarioLogin: "",
    TipoCargoID: "",
    EstadoUsuario: "",
    LicOffice: "",
    PowerBI: "",
    Project: "",
    Visio: "",
    Copilot: "",
    LicSAP: "",
    LicAutodesk: "",
    LicAdobe: "",
    Telefono: "",
    Email: "",
    MFA: "",
    OtraLic: "",
  });
  const [dependencias, setDependencias] = useState([]);
  const [tipoCargos, setTipoCargos] = useState([]);
  const [depSearch, setDepSearch] = useState("");
  const [showDepOptions, setShowDepOptions] = useState(false);
  const [tipoSearch, setTipoSearch] = useState("");
  const [showTipoOptions, setShowTipoOptions] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrabajadores();
    fetchListas();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter(
          (u) =>
            u.Ficha.toLowerCase().includes(q) ||
            u.NombreCompleto.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, items]);

  const fetchTrabajadores = async () => {
    setLoading(true);
    try {
      const res = await getTrabajadores();
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      console.error("Error al cargar trabajadores:", err);
      setError("Error al cargar trabajadores: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchListas = async () => {
    try {
      const [depRes, tcRes] = await Promise.all([
        getDependencias(),
        getTipoCargos(),
      ]);
      setDependencias(depRes.data);
      setTipoCargos(tcRes.data);
    } catch (err) {
      console.error("Error al cargar listas:", err);
      setError(
        "Error al cargar datos de dependencias o cargos: " + err.message
      );
    }
  };

  const filteredDeps = useMemo(() => {
    const txt = depSearch.toLowerCase();
    return dependencias.filter((d) =>
      d.NombreDependencia.toLowerCase().includes(txt)
    );
  }, [depSearch, dependencias]);

  const filteredTipo = useMemo(() => {
    const txt = tipoSearch.toLowerCase();
    return tipoCargos.filter((t) => t.NombreCargo.toLowerCase().includes(txt));
  }, [tipoSearch, tipoCargos]);

  const startEdit = (u) => {
    setSelected(u.UsuarioID);
    setForm({
      Ficha: u.Ficha || "",
      DependenciaID: u.DependenciaID || "",
      NombreCompleto: u.NombreCompleto || "",
      UsuarioLogin: u.UsuarioLogin || "",
      TipoCargoID: u.TipoCargoID || "",
      EstadoUsuario: u.EstadoUsuario || "",
      LicOffice: u.LicOffice || "",
      PowerBI: u.PowerBI || "",
      Project: u.Project || "",
      Visio: u.Visio || "",
      Copilot: u.Copilot || "",
      LicSAP: u.LicSAP || "",
      LicAutodesk: u.LicAutodesk || "",
      LicAdobe: u.LicAdobe || "",
      Telefono: u.Telefono || "",
      Email: u.Email || "",
      MFA: u.MFA || "",
      OtraLic: u.OtraLic || "",
    });
    const dep = dependencias.find((d) => d.DependenciaID === u.DependenciaID);
    const tc = tipoCargos.find((t) => t.TipoCargoID === u.TipoCargoID);
    setDepSearch(dep ? dep.NombreDependencia : "");
    setTipoSearch(tc ? tc.NombreCargo : "");
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await updateTrabajador(selected, form);
      alert("Trabajador actualizado correctamente");
      handleCancel();
      fetchTrabajadores();
    } catch (err) {
      console.error("Error al actualizar trabajador:", err);
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setSelected(null);
    setForm({
      Ficha: "",
      DependenciaID: "",
      NombreCompleto: "",
      UsuarioLogin: "",
      TipoCargoID: "",
      EstadoUsuario: "",
      LicOffice: "",
      PowerBI: "",
      Project: "",
      Visio: "",
      Copilot: "",
      LicSAP: "",
      LicAutodesk: "",
      LicAdobe: "",
      Telefono: "",
      Email: "",
      MFA: "",
      OtraLic: "",
    });
    setDepSearch("");
    setTipoSearch("");
    setError(null);
  };

  return (
    <section className="trabajador-section">
      <h2>Actualizar Trabajador</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Formulario de edición */}
      {selected && (
        <div className="edit-form-container">
          <form onSubmit={handleActualizar} className="form-grid">
            <h3 className="form-section-title">
              Editar Trabajador #{selected}
            </h3>

            <label>Ficha</label>
            <input
              name="Ficha"
              value={form.Ficha}
              onChange={handleChange}
              required
            />

            <label>Dependencia</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Buscar dependencia..."
                value={depSearch}
                onChange={(e) => {
                  setDepSearch(e.target.value);
                  setShowDepOptions(true);
                }}
                onFocus={() => setShowDepOptions(true)}
                onBlur={() => setTimeout(() => setShowDepOptions(false), 100)}
                className="autocomplete-input"
              />
              {showDepOptions && (
                <ul className="autocomplete-list">
                  {filteredDeps.map((d) => (
                    <li
                      key={d.DependenciaID}
                      onMouseDown={() => {
                        setForm((f) => ({
                          ...f,
                          DependenciaID: d.DependenciaID,
                        }));
                        setDepSearch(d.NombreDependencia);
                        setShowDepOptions(false);
                      }}
                    >
                      {d.NombreDependencia}
                    </li>
                  ))}
                  {filteredDeps.length === 0 && (
                    <li className="no-results">No hay coincidencias</li>
                  )}
                </ul>
              )}
            </div>

            <label>Nombre Completo</label>
            <input
              name="NombreCompleto"
              value={form.NombreCompleto}
              onChange={handleChange}
              required
            />

            <label>Usuario Login</label>
            <input
              name="UsuarioLogin"
              value={form.UsuarioLogin}
              onChange={handleChange}
              required
            />

            <label>Tipo Cargo</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Buscar tipo cargo..."
                value={tipoSearch}
                onChange={(e) => {
                  setTipoSearch(e.target.value);
                  setShowTipoOptions(true);
                }}
                onFocus={() => setShowTipoOptions(true)}
                onBlur={() => setTimeout(() => setShowTipoOptions(false), 100)}
                className="autocomplete-input"
              />
              {showTipoOptions && (
                <ul className="autocomplete-list">
                  {filteredTipo.map((t) => (
                    <li
                      key={t.TipoCargoID}
                      onMouseDown={() => {
                        setForm((f) => ({ ...f, TipoCargoID: t.TipoCargoID }));
                        setTipoSearch(t.NombreCargo);
                        setShowTipoOptions(false);
                      }}
                    >
                      {t.NombreCargo}
                    </li>
                  ))}
                  {filteredTipo.length === 0 && (
                    <li className="no-results">No hay coincidencias</li>
                  )}
                </ul>
              )}
            </div>

            <label>Estado Usuario</label>
            <input
              name="EstadoUsuario"
              value={form.EstadoUsuario}
              onChange={handleChange}
              required
            />

            {/* Licencias */}
            <h3 className="form-section-title">Licencias</h3>

            <label>Licencia Office</label>
            <input
              name="LicOffice"
              value={form.LicOffice}
              onChange={handleChange}
            />

            <label>Power BI</label>
            <input
              name="PowerBI"
              value={form.PowerBI}
              onChange={handleChange}
            />

            <label>Project</label>
            <input
              name="Project"
              value={form.Project}
              onChange={handleChange}
            />

            <label>Visio</label>
            <input name="Visio" value={form.Visio} onChange={handleChange} />

            <label>Copilot</label>
            <input
              name="Copilot"
              value={form.Copilot}
              onChange={handleChange}
            />

            <label>SAP</label>
            <input name="LicSAP" value={form.LicSAP} onChange={handleChange} />

            <label>Autodesk</label>
            <input
              name="LicAutodesk"
              value={form.LicAutodesk}
              onChange={handleChange}
            />

            <label>Adobe</label>
            <input
              name="LicAdobe"
              value={form.LicAdobe}
              onChange={handleChange}
            />
            <label>MFA</label>
            <input name="MFA" value={form.MFA} onChange={handleChange} />
            <label>Otra Licencia</label>
            <input
              name="OtraLic"
              value={form.OtraLic}
              onChange={handleChange}
            />

            {/* Contacto */}
            <h3 className="form-section-title">Contacto</h3>

            <label>Teléfono</label>
            <input
              type="number"
              name="Telefono"
              value={form.Telefono}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="Email"
              value={form.Email}
              onChange={handleChange}
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
        </div>
      )}

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por ficha o nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla de trabajadores */}
      <div className="table-container">
        {loading ? (
          <p className="loading-message">Cargando trabajadores...</p>
        ) : filteredItems.length === 0 ? (
          <p className="no-results">No se encontraron trabajadores</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ficha</th>
                  <th>Nombre</th>
                  <th>Login</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((u) => (
                  <tr key={u.UsuarioID}>
                    <td data-label="ID">{u.UsuarioID}</td>
                    <td data-label="Ficha">{u.Ficha}</td>
                    <td data-label="Nombre">{u.NombreCompleto}</td>
                    <td data-label="Login">{u.UsuarioLogin}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => startEdit(u)}
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
    </section>
  );
}

function EliminarTrabajador() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // Carga inicial de trabajadores
  useEffect(() => {
    async function fetchTrabajadores() {
      try {
        const res = await getTrabajadores();
        setItems(res.data);
        setFilteredItems(res.data);
      } catch (err) {
        console.error("Error al cargar trabajadores:", err);
        setError("Error al cargar trabajadores: " + err.message);
      }
    }
    fetchTrabajadores();
  }, []);

  // Filtrar según ficha o nombre
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter(
          (u) =>
            u.Ficha.toLowerCase().includes(q) ||
            u.NombreCompleto.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, items]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar este trabajador?")) return;
    setError(null);
    try {
      await deleteTrabajador(id);
      // Remover del estado original y del filtrado
      const updated = items.filter((u) => u.UsuarioID !== id);
      setItems(updated);
      setFilteredItems(updated);
      alert("Trabajador eliminado exitosamente");
    } catch (err) {
      console.error("Error al eliminar trabajador:", err);
      setError("Error al eliminar trabajador: " + err.message);
    }
  };

  return (
    <section className="table-section">
      <h2>Eliminar Trabajador</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por ficha o nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla de trabajadores */}
      <div className="table-container">
        {filteredItems.length === 0 ? (
          <p className="no-results">No se encontraron trabajadores.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ficha</th>
                  <th>Nombre</th>
                  <th>Login</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((u) => (
                  <tr key={u.UsuarioID}>
                    <td data-label="ID">{u.UsuarioID}</td>
                    <td data-label="Ficha">{u.Ficha}</td>
                    <td data-label="Nombre">{u.NombreCompleto}</td>
                    <td data-label="Login">{u.UsuarioLogin}</td>
                    <td data-label="Estado">{u.EstadoUsuario}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => handleDelete(u.UsuarioID)}
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
