import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../../Components/Header";
import Navbar from "../../../Components/Navbar";
import {
  getTipoMarcas,
  getTipoEquipos,
  getEstados,
  getDependencias,
  getTrabajadores,
  getEquiposCM,
  createEquipoCM,
  updateEquipoCM,
  deleteEquipoCM,
} from "../../../api/api";
import Control_UPS from "../../Visitor/Control_UPS/Control_UPS";
import "../Ingreso_Compu/CrearEquipo.css";
import "../Ingreso_Compu/Ingreso_Compu.css";

export default function Ingreso_UPS({ usuario }) {
  const [navVisible, setNavVisible] = useState(true);

  const IngresoUPSSections = [
    {
      title: "UPS",
      mainHref: "/Home/Ingreso-UPS",
      links: [
        { text: "Crear UPS", href: "/Home/Ingreso-UPS/Crear-UPS" },
        { text: "Actualizar UPS", href: "/Home/Ingreso-UPS/Actualizar-UPS" },
        { text: "Eliminar UPS", href: "/Home/Ingreso-UPS/Eliminar-UPS" },
        { text: "Consultar UPS", href: "/Home/Control-UPS/consultar" },
      ],
    },
  ];

  return (
    <div className="app-layout">
      <Header titulo="Gestión de UPS" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home"
          sections={IngresoUPSSections}
          onToggle={setNavVisible}
        />
        <main
          className={`layout-content ingreso-ups-main ${
            !navVisible ? "navbar-hidden" : ""
          }`}
        >
          <Routes>
            <Route path="Crear-UPS" element={<CrearUPS />} />
            <Route path="Actualizar-UPS" element={<ActualizarUPS />} />
            <Route path="Eliminar-UPS" element={<EliminarUPS />} />
            <Route
              path="consultar"
              element={<Control_UPS usuario={usuario} />}
            />
            <Route
              index
              element={
                <p className="placeholder">Selecciona una acción sobre UPS</p>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// === Crear UPS ===
function CrearUPS() {
  const [form, setForm] = useState({
    NombreInventario: "",
    MarcaID: "",
    TipoEquipoID: "",
    Modelo: "",
    Capacidad: "",
    Serie: "",
    FechaLlegada: "",
    FechaInstalacion: "",
    FechaNovedad: "",
    UsuarioID: "",
    DependenciaID: "",
    Ubicacion: "",
    EstadoID: "",
    Contrato: "",
    CostoMes: "",
    Responsable: "",
    Observacion: "",
  });
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [errors, setErrors] = useState({});

  // Autocomplete states
  const [marcaSearch, setMarcaSearch] = useState("");
  const [showMarcaOptions, setShowMarcaOptions] = useState(false);
  const [estadoSearch, setEstadoSearch] = useState("");
  const [showEstadoOptions, setShowEstadoOptions] = useState(false);
  const [depSearch, setDepSearch] = useState("");
  const [showDepOptions, setShowDepOptions] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [showUserOptions, setShowUserOptions] = useState(false);

  const requiredFields = [
    "NombreInventario",
    "MarcaID",
    "TipoEquipoID",
    "Modelo",
    "Serie",
    "EstadoID",
    "Responsable",
    "UsuarioID",
    "DependenciaID",
    "Ubicacion",
    "Contrato",
  ];

  // Helpers de moneda
  const formatPeso = (amt) =>
    amt == null ? "" : "$" + Number(amt).toLocaleString("es-CO");
  const parsePeso = (str) => {
    const digits = str.replace(/[^0-9]/g, "");
    return digits === "" ? null : Number(digits);
  };
  const handleCostoMesChange = (e) =>
    setForm((f) => ({ ...f, CostoMes: parsePeso(e.target.value) }));

  useEffect(() => {
    async function cargarListas() {
      try {
        const [mRes, tRes, eRes, dRes, uRes] = await Promise.all([
          getTipoMarcas(),
          getTipoEquipos(),
          getEstados(),
          getDependencias(),
          getTrabajadores(),
        ]);
        setMarcas(mRes.data);
        setTipos(tRes.data);
        setEstados(eRes.data);
        setDependencias(dRes.data);
        setTrabajadores(uRes.data);
      } catch (err) {
        console.error("Error al cargar listas:", err);
      }
    }
    cargarListas();
  }, []);

  // Solo tipos UPS
  const upsTipos = useMemo(
    () =>
      tipos.filter((t) => (t.NombreTipo || "").toLowerCase().includes("ups")),
    [tipos]
  );

  // Filtrados para autocompletar
  const filteredMarcas = useMemo(() => {
    const txt = marcaSearch.toLowerCase();
    return marcas.filter((m) =>
      (m.NombreMarca || "").toLowerCase().includes(txt)
    );
  }, [marcaSearch, marcas]);
  const filteredEstados = useMemo(() => {
    const txt = estadoSearch.toLowerCase();
    return estados.filter((es) =>
      (es.EstadoEquipo || "").toLowerCase().includes(txt)
    );
  }, [estadoSearch, estados]);
  const filteredDeps = useMemo(() => {
    const txt = depSearch.toLowerCase();
    return dependencias.filter((d) =>
      (d.NombreDependencia || "").toLowerCase().includes(txt)
    );
  }, [depSearch, dependencias]);
  const filteredUsers = useMemo(() => {
    const txt = userSearch.toLowerCase();
    return trabajadores.filter((u) =>
      `${u.NombreCompleto} (${u.Ficha})`.toLowerCase().includes(txt)
    );
  }, [userSearch, trabajadores]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCrear = async (e) => {
    e.preventDefault();
    setErrors({});
    const errorsLocal = {};
    requiredFields.forEach((f) => {
      if (!form[f]) errorsLocal[f] = "Este campo es obligatorio";
    });
    if (Object.keys(errorsLocal).length > 0) {
      setErrors(errorsLocal);
      return;
    }
    const payload = {
      ...form,
      FechaLlegada: form.FechaLlegada || null,
      FechaInstalacion: form.FechaInstalacion || null,
      FechaNovedad: form.FechaNovedad || null,
    };
    try {
      await createEquipoCM(payload);
      alert("UPS creada exitosamente");
      setForm({
        NombreInventario: "",
        MarcaID: "",
        TipoEquipoID: "",
        Modelo: "",
        Capacidad: "",
        Serie: "",
        FechaLlegada: "",
        FechaInstalacion: "",
        FechaNovedad: "",
        UsuarioID: "",
        DependenciaID: "",
        Ubicacion: "",
        EstadoID: "",
        Contrato: "",
        CostoMes: "",
        Responsable: "",
        Observacion: "",
      });
      setMarcaSearch("");
      setEstadoSearch("");
      setDepSearch("");
      setUserSearch("");
    } catch (err) {
      alert(err.message || "Error al crear UPS");
    }
  };

  return (
    <form onSubmit={handleCrear} className="ce-form-grid">
      <h3 className="ce-form-section-title">Datos del Equipo</h3>
      <label>
        Nombre Inventario
        <span style={{ color: "var(--color-primary)" }}> *</span>
      </label>
      <input
        name="NombreInventario"
        value={form.NombreInventario}
        onChange={handleChange}
        required
      />
      {errors.NombreInventario && (
        <small className="ce-error-message">{errors.NombreInventario}</small>
      )}

      {/* Autocomplete Marca */}
      <label>
        Marca <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Buscar marca..."
          value={marcaSearch}
          onChange={(e) => {
            setMarcaSearch(e.target.value);
            setShowMarcaOptions(true);
            // Mientras escribe, llévate a null el form.MarcaID para revalidar
            setForm((f) => ({ ...f, MarcaID: null }));
            setErrors((errs) => {
              const { MarcaID, ...rest } = errs;
              return rest;
            });
          }}
          required
          onFocus={() => setShowMarcaOptions(true)}
          onBlur={() => {
            // Le damos un pequeño delay para que onMouseDown de <li> ocurra antes
            setTimeout(() => {
              setShowMarcaOptions(false);
              // Validación: el texto debe coincidir exactamente con alguna marca
              const match = marcas.find((m) => m.NombreMarca === marcaSearch);
              if (!match) {
                // No hay match: marca inválida
                setForm((f) => ({ ...f, MarcaID: null }));
                setErrors((errs) => ({
                  ...errs,
                  MarcaID: "Selecciona una marca válida",
                }));
              } else {
                // Coincide: limpiamos el posible error
                setForm((f) => ({ ...f, MarcaID: match.MarcaID }));
                setErrors((errs) => {
                  const { MarcaID, ...rest } = errs;
                  return rest;
                });
              }
            }, 150);
          }}
          className="ce-autocomplete-input"
        />

        {showMarcaOptions && (
          <ul className="ce-autocomplete-list">
            {filteredMarcas.map((m) => (
              <li
                key={m.MarcaID}
                onMouseDown={() => {
                  // Al escoger una opción, fijamos el id y texto, y limpiamos error
                  setForm((f) => ({ ...f, MarcaID: m.MarcaID }));
                  setMarcaSearch(m.NombreMarca);
                  setErrors((errs) => {
                    const { MarcaID, ...rest } = errs;
                    return rest;
                  });
                  setShowMarcaOptions(false);
                }}
              >
                {m.NombreMarca}
              </li>
            ))}
            {filteredMarcas.length === 0 && (
              <li className="no-results">No hay coincidencias</li>
            )}
          </ul>
        )}

        {errors.MarcaID && (
          <small className="ce-error-message">{errors.MarcaID}</small>
        )}
      </div>

      {/* Autocomplete TipoEquipo */}
      <label>
        Tipo <span style={{ color: "var(--color-primary)" }}> *</span>
      </label>
      <select
        name="TipoEquipoID"
        value={form.TipoEquipoID}
        onChange={handleChange}
        required
        className="ce-autocomplete-input"
      >
        <option value="">Seleccione tipo</option>
        {upsTipos.map((t) => (
          <option key={t.TipoEquipoID} value={t.TipoEquipoID}>
            {t.NombreTipo}
          </option>
        ))}
      </select>
      {errors.TipoEquipoID && (
        <small className="ce-error-message">{errors.TipoEquipoID}</small>
      )}

      <label>
        Modelo <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <input
        name="Modelo"
        value={form.Modelo}
        onChange={handleChange}
        required
      />
      {errors.Modelo && (
        <small className="ce-error-message">{errors.Modelo}</small>
      )}

      <label>Capacidad</label>
      <input name="Capacidad" value={form.Capacidad} onChange={handleChange} />

      <label>
        Serie <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <input name="Serie" value={form.Serie} onChange={handleChange} required />
      {errors.Serie && (
        <small className="ce-error-message">{errors.Serie}</small>
      )}

      <label>Fecha Llegada</label>
      <input
        type="date"
        name="FechaLlegada"
        value={form.FechaLlegada}
        onChange={handleChange}
      />

      <label>Fecha Instalación</label>
      <input
        type="date"
        name="FechaInstalacion"
        value={form.FechaInstalacion}
        onChange={handleChange}
      />

      <label>Fecha Novedad</label>
      <input
        type="date"
        name="FechaNovedad"
        value={form.FechaNovedad}
        onChange={handleChange}
      />

      {/* Autocomplete Usuario */}
      <label>
        Usuario (Ficha) <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={userSearch}
          required
          onChange={(e) => {
            setUserSearch(e.target.value);
            setShowUserOptions(true);
            setForm((f) => ({ ...f, UsuarioID: null }));
            setErrors((errs) => {
              const { UsuarioID, ...rest } = errs;
              return rest;
            });
          }}
          onFocus={() => setShowUserOptions(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowUserOptions(false);
              const match = trabajadores.find(
                (u) => `${u.NombreCompleto} (${u.Ficha})` === userSearch
              );
              if (!match) {
                setForm((f) => ({ ...f, UsuarioID: null }));
                setErrors((errs) => ({
                  ...errs,
                  UsuarioID: "Selecciona un usuario válido",
                }));
              } else {
                setForm((f) => ({ ...f, UsuarioID: match.UsuarioID }));
                setErrors((errs) => {
                  const { UsuarioID, ...rest } = errs;
                  return rest;
                });
              }
            }, 150);
          }}
          className="ce-autocomplete-input"
        />
        {showUserOptions && (
          <ul className="ce-autocomplete-list">
            {filteredUsers.map((u) => (
              <li
                key={u.UsuarioID}
                onMouseDown={() => {
                  setForm((f) => ({ ...f, UsuarioID: u.UsuarioID }));
                  setUserSearch(`${u.NombreCompleto} (${u.Ficha})`);
                  setErrors((errs) => {
                    const { UsuarioID, ...rest } = errs;
                    return rest;
                  });
                  setShowUserOptions(false);
                }}
              >
                {u.NombreCompleto} ({u.Ficha})
              </li>
            ))}
            {filteredUsers.length === 0 && (
              <li className="no-results">No hay coincidencias</li>
            )}
          </ul>
        )}
        {errors.UsuarioID && (
          <small className="ce-error-message">{errors.UsuarioID}</small>
        )}
      </div>

      {/* Autocomplete Dependencia */}
      <label>
        Dependencia <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Buscar dependencia..."
          value={depSearch}
          required
          onChange={(e) => {
            setDepSearch(e.target.value);
            setShowDepOptions(true);
            setForm((f) => ({ ...f, DependenciaID: null }));
            setErrors((errs) => {
              const { DependenciaID, ...rest } = errs;
              return rest;
            });
          }}
          onFocus={() => setShowDepOptions(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowDepOptions(false);
              const match = dependencias.find(
                (d) => d.NombreDependencia === depSearch
              );
              if (!match) {
                setForm((f) => ({ ...f, DependenciaID: null }));
                setErrors((errs) => ({
                  ...errs,
                  DependenciaID: "Selecciona una dependencia válida",
                }));
              } else {
                setForm((f) => ({ ...f, DependenciaID: match.DependenciaID }));
                setErrors((errs) => {
                  const { DependenciaID, ...rest } = errs;
                  return rest;
                });
              }
            }, 150);
          }}
          className="ce-autocomplete-input"
        />
        {showDepOptions && (
          <ul className="ce-autocomplete-list">
            {filteredDeps.map((d) => (
              <li
                key={d.DependenciaID}
                onMouseDown={() => {
                  setForm((f) => ({ ...f, DependenciaID: d.DependenciaID }));
                  setDepSearch(d.NombreDependencia);
                  setErrors((errs) => {
                    const { DependenciaID, ...rest } = errs;
                    return rest;
                  });
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
        {errors.DependenciaID && (
          <small className="ce-error-message">{errors.DependenciaID}</small>
        )}
      </div>

      <label>
        Ubicación <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <input
        name="Ubicacion"
        value={form.Ubicacion}
        onChange={handleChange}
        required
      />
      {errors.Ubicacion && (
        <small className="ce-error-message">{errors.Ubicacion}</small>
      )}

      {/* Autocomplete Estado */}
      <label>
        Estado <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Buscar estado..."
          value={estadoSearch}
          required
          onChange={(e) => {
            setEstadoSearch(e.target.value);
            setShowEstadoOptions(true);
            // limpiar selección previa y error
            setForm((f) => ({ ...f, EstadoID: null }));
            setErrors((errs) => {
              const { EstadoID, ...rest } = errs;
              return rest;
            });
          }}
          onFocus={() => setShowEstadoOptions(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowEstadoOptions(false);
              const match = estados.find(
                (es) => es.EstadoEquipo === estadoSearch
              );
              if (!match) {
                setForm((f) => ({ ...f, EstadoID: null }));
                setErrors((errs) => ({
                  ...errs,
                  EstadoID: "Selecciona un estado válido",
                }));
              } else {
                setForm((f) => ({ ...f, EstadoID: match.EstadoID }));
                setErrors((errs) => {
                  const { EstadoID, ...rest } = errs;
                  return rest;
                });
              }
            }, 150);
          }}
          className="ce-autocomplete-input"
        />
        {showEstadoOptions && (
          <ul className="ce-autocomplete-list">
            {filteredEstados.map((es) => (
              <li
                key={es.EstadoID}
                onMouseDown={() => {
                  setForm((f) => ({ ...f, EstadoID: es.EstadoID }));
                  setEstadoSearch(es.EstadoEquipo);
                  setErrors((errs) => {
                    const { EstadoID, ...rest } = errs;
                    return rest;
                  });
                  setShowEstadoOptions(false);
                }}
              >
                {es.EstadoEquipo}
              </li>
            ))}
            {filteredEstados.length === 0 && (
              <li className="no-results">No hay coincidencias</li>
            )}
          </ul>
        )}
        {errors.EstadoID && (
          <small className="ce-error-message">{errors.EstadoID}</small>
        )}
      </div>

      <label>
        Contrato <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <input
        name="Contrato"
        value={form.Contrato}
        onChange={handleChange}
        required
      />
      {errors.Contrato && (
        <small className="ce-error-message">{errors.Contrato}</small>
      )}

      <label>Costo Mensual</label>
      <input
        type="text"
        name="CostoMes"
        value={formatPeso(form.CostoMes)}
        onChange={handleCostoMesChange}
      />

      <label>
        Responsable <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <input
        name="Responsable"
        value={form.Responsable}
        onChange={handleChange}
        required
      />
      {errors.Responsable && (
        <small className="ce-error-message">{errors.Responsable}</small>
      )}

      <label>Observación</label>
      <textarea
        name="Observacion"
        value={form.Observacion}
        onChange={handleChange}
      />

      <button type="submit" className="ce-submit-button">
        Crear UPS
      </button>
    </form>
  );
}

// === Actualizar UPS ===
function ActualizarUPS() {
  const [equipos, setEquipos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [estados, setEstados] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const [marcaSearch, setMarcaSearch] = useState("");
  const [showMarcaOptions, setShowMarcaOptions] = useState(false);
  const [estadoSearch, setEstadoSearch] = useState("");
  const [showEstadoOptions, setShowEstadoOptions] = useState(false);
  const [depSearch, setDepSearch] = useState("");
  const [showDepOptions, setShowDepOptions] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [showUserOptions, setShowUserOptions] = useState(false);

  const formatPeso = (amt) =>
    amt == null ? "" : "$" + Number(amt).toLocaleString("es-CO");
  const parsePeso = (str) => {
    const digits = str.replace(/[^0-9]/g, "");
    return digits === "" ? null : Number(digits);
  };
  const handleCostoMesChange = (e) =>
    setForm((f) => ({ ...f, CostoMes: parsePeso(e.target.value) }));

  useEffect(() => {
    async function cargarTodo() {
      try {
        const [tRes, mRes, eRes, dRes, uRes] = await Promise.all([
          getTipoEquipos(),
          getTipoMarcas(),
          getEstados(),
          getDependencias(),
          getTrabajadores(),
        ]);
        setTipos(tRes.data);
        setMarcas(mRes.data);
        setEstados(eRes.data);
        setDependencias(dRes.data);
        setTrabajadores(uRes.data);

        const equiposRes = await getEquiposCM();
        const upsTipoIds = tRes.data
          .filter((t) => (t.NombreTipo || "").toLowerCase().includes("ups"))
          .map((t) => t.TipoEquipoID);
        const upsEquipos = equiposRes.data.filter((eq) =>
          upsTipoIds.includes(eq.TipoEquipoID)
        );
        setEquipos(upsEquipos);
        setFiltered(upsEquipos);
      } catch (err) {
        setError("Error al cargar datos: " + err.message);
      }
    }
    cargarTodo();
  }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) setFiltered(equipos);
    else
      setFiltered(
        equipos.filter(
          (e) =>
            (e.NombreInventario || "").toLowerCase().includes(q) ||
            (e.Serie || "").toLowerCase().includes(q) ||
            (e.Responsable || "").toLowerCase().includes(q)
        )
      );
  }, [search, equipos]);

  // Solo tipos UPS
  const upsTipos = useMemo(
    () =>
      tipos.filter((t) => (t.NombreTipo || "").toLowerCase().includes("ups")),
    [tipos]
  );

  // Filtrados para autocompletar
  const filteredMarcas = useMemo(() => {
    const txt = marcaSearch.toLowerCase();
    return marcas.filter((m) =>
      (m.NombreMarca || "").toLowerCase().includes(txt)
    );
  }, [marcaSearch, marcas]);
  const filteredEstados = useMemo(() => {
    const txt = estadoSearch.toLowerCase();
    return estados.filter((es) =>
      (es.EstadoEquipo || "").toLowerCase().includes(txt)
    );
  }, [estadoSearch, estados]);
  const filteredDeps = useMemo(() => {
    const txt = depSearch.toLowerCase();
    return dependencias.filter((d) =>
      (d.NombreDependencia || "").toLowerCase().includes(txt)
    );
  }, [depSearch, dependencias]);
  const filteredUsers = useMemo(() => {
    const txt = userSearch.toLowerCase();
    return trabajadores.filter((u) =>
      `${u.NombreCompleto} (${u.Ficha})`.toLowerCase().includes(txt)
    );
  }, [userSearch, trabajadores]);

  const startEdit = (e) => {
    setSelected(e.EquipoID);
    setForm({
      NombreInventario: e.NombreInventario || "",
      MarcaID: e.MarcaID || "",
      TipoEquipoID: e.TipoEquipoID || "",
      Modelo: e.Modelo || "",
      Capacidad: e.Capacidad || "",
      Serie: e.Serie || "",
      FechaLlegada: e.FechaLlegada ? e.FechaLlegada.split("T")[0] : "",
      FechaInstalacion: e.FechaInstalacion
        ? e.FechaInstalacion.split("T")[0]
        : "",
      FechaNovedad: e.FechaNovedad ? e.FechaNovedad.split("T")[0] : "",
      UsuarioID: e.UsuarioID || "",
      DependenciaID: e.DependenciaID || "",
      Ubicacion: e.Ubicacion || "",
      EstadoID: e.EstadoID || "",
      Contrato: e.Contrato || "",
      CostoMes: e.CostoMes || "",
      Responsable: e.Responsable || "",
      Observacion: e.Observacion || "",
    });

    // Sincronizar los textos de los autocompletes:
    setMarcaSearch(
      (marcas.find((m) => m.MarcaID === e.MarcaID) || {}).NombreMarca || ""
    );
    setUserSearch(
      (() => {
        const u = trabajadores.find((u) => u.UsuarioID === e.UsuarioID);
        return u ? `${u.NombreCompleto} (${u.Ficha})` : "";
      })()
    );
    setDepSearch(
      (dependencias.find((d) => d.DependenciaID === e.DependenciaID) || {})
        .NombreDependencia || ""
    );
    setEstadoSearch(
      (estados.find((es) => es.EstadoID === e.EstadoID) || {}).EstadoEquipo ||
        ""
    );

    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (ev) =>
    setForm((f) => ({ ...f, [ev.target.name]: ev.target.value }));

  const requiredFields = [
    "NombreInventario",
    "MarcaID",
    "TipoEquipoID",
    "Modelo",
    "Serie",
    "EstadoID",
    "Responsable",
    "UsuarioID",
    "DependenciaID",
    "Ubicacion",
    "Contrato",
  ];

  const handleUpdate = async (ev) => {
    ev.preventDefault();
    setError(null);
    const errorsLocal = {};
    requiredFields.forEach((f) => {
      if (!form[f]) errorsLocal[f] = "Este campo es obligatorio";
    });
    if (Object.keys(errorsLocal).length > 0) {
      setErrors(errorsLocal);
      return;
    }
    try {
      await updateEquipoCM(selected, {
        ...form,
        FechaLlegada: form.FechaLlegada || null,
        FechaInstalacion: form.FechaInstalacion || null,
        FechaNovedad: form.FechaNovedad || null,
      });
      alert("UPS actualizada");
      setSelected(null);
      setForm({});
      const equiposRes = await getEquiposCM();
      const upsTipoIds = tipos
        .filter((t) => (t.NombreTipo || "").toLowerCase().includes("ups"))
        .map((t) => t.TipoEquipoID);
      const upsEquipos = equiposRes.data.filter((eq) =>
        upsTipoIds.includes(eq.TipoEquipoID)
      );
      setEquipos(upsEquipos);
      setFiltered(upsEquipos);
      setErrors({});
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setSelected(null);
    setForm({});
    setError(null);
  };

  return (
    <section className="equipo-section">
      <h2>Actualizar UPS</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por inventario, serie o responsable..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        {filtered.length === 0 ? (
          <p className="no-results">No se encontraron UPS.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Inventario</th>
                  <th>Serie</th>
                  <th>Responsable</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.EquipoID}>
                    <td data-label="ID">{e.EquipoID}</td>
                    <td data-label="Inventario">{e.NombreInventario}</td>
                    <td data-label="Serie">{e.Serie}</td>
                    <td data-label="Responsable">{e.Responsable}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => startEdit(e)}
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

      {selected && (
        <form onSubmit={handleUpdate} className="form-grid">
          <label>
            Nombre Inventario
            <span style={{ color: "var(--color-primary)" }}> *</span>
          </label>
          <input
            name="NombreInventario"
            value={form.NombreInventario}
            onChange={handleChange}
            required
          />
          {errors.NombreInventario && (
            <small className="ce-error-message">
              {errors.NombreInventario}
            </small>
          )}

          {/* Autocomplete Marca */}
          <label>
            Marca <span style={{ color: "var(--color-primary)" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Buscar marca..."
              value={marcaSearch}
              onChange={(e) => {
                setMarcaSearch(e.target.value);
                setShowMarcaOptions(true);
                // Mientras escribe, llévate a null el form.MarcaID para revalidar
                setForm((f) => ({ ...f, MarcaID: null }));
                setErrors((errs) => {
                  const { MarcaID, ...rest } = errs;
                  return rest;
                });
              }}
              required
              onFocus={() => setShowMarcaOptions(true)}
              onBlur={() => {
                // Le damos un pequeño delay para que onMouseDown de <li> ocurra antes
                setTimeout(() => {
                  setShowMarcaOptions(false);
                  // Validación: el texto debe coincidir exactamente con alguna marca
                  const match = marcas.find(
                    (m) => m.NombreMarca === marcaSearch
                  );
                  if (!match) {
                    // No hay match: marca inválida
                    setForm((f) => ({ ...f, MarcaID: null }));
                    setErrors((errs) => ({
                      ...errs,
                      MarcaID: "Selecciona una marca válida",
                    }));
                  } else {
                    // Coincide: limpiamos el posible error
                    setForm((f) => ({ ...f, MarcaID: match.MarcaID }));
                    setErrors((errs) => {
                      const { MarcaID, ...rest } = errs;
                      return rest;
                    });
                  }
                }, 150);
              }}
              className="ce-autocomplete-input"
            />

            {showMarcaOptions && (
              <ul className="ce-autocomplete-list">
                {filteredMarcas.map((m) => (
                  <li
                    key={m.MarcaID}
                    onMouseDown={() => {
                      // Al escoger una opción, fijamos el id y texto, y limpiamos error
                      setForm((f) => ({ ...f, MarcaID: m.MarcaID }));
                      setMarcaSearch(m.NombreMarca);
                      setErrors((errs) => {
                        const { MarcaID, ...rest } = errs;
                        return rest;
                      });
                      setShowMarcaOptions(false);
                    }}
                  >
                    {m.NombreMarca}
                  </li>
                ))}
                {filteredMarcas.length === 0 && (
                  <li className="no-results">No hay coincidencias</li>
                )}
              </ul>
            )}

            {errors.MarcaID && (
              <small className="ce-error-message">{errors.MarcaID}</small>
            )}
          </div>

          {/* Autocomplete TipoEquipo */}
          <label>
            Tipo <span style={{ color: "var(--color-primary)" }}> *</span>
          </label>
          <select
            name="TipoEquipoID"
            value={form.TipoEquipoID}
            onChange={handleChange}
            required
            className="ce-autocomplete-input"
          >
            <option value="">Seleccione tipo</option>
            {upsTipos.map((t) => (
              <option key={t.TipoEquipoID} value={t.TipoEquipoID}>
                {t.NombreTipo}
              </option>
            ))}
          </select>
          {errors.TipoEquipoID && (
            <small className="ce-error-message">{errors.TipoEquipoID}</small>
          )}

          <label>
            Modelo <span style={{ color: "var(--color-primary)" }}>*</span>
          </label>
          <input
            name="Modelo"
            value={form.Modelo}
            onChange={handleChange}
            required
          />
          {errors.Modelo && (
            <small className="ce-error-message">{errors.Modelo}</small>
          )}

          <label>Capacidad</label>
          <input
            name="Capacidad"
            value={form.Capacidad}
            onChange={handleChange}
          />

          <label>
            Serie <span style={{ color: "var(--color-primary)" }}>*</span>
          </label>
          <input
            name="Serie"
            value={form.Serie}
            onChange={handleChange}
            required
          />
          {errors.Serie && (
            <small className="ce-error-message">{errors.Serie}</small>
          )}

          <label>Fecha Llegada</label>
          <input
            type="date"
            name="FechaLlegada"
            value={form.FechaLlegada}
            onChange={handleChange}
          />

          <label>Fecha Instalación</label>
          <input
            type="date"
            name="FechaInstalacion"
            value={form.FechaInstalacion}
            onChange={handleChange}
          />

          <label>Fecha Novedad</label>
          <input
            type="date"
            name="FechaNovedad"
            value={form.FechaNovedad}
            onChange={handleChange}
          />

          {/* Autocomplete Usuario */}
          <label>
            Usuario (Ficha){" "}
            <span style={{ color: "var(--color-primary)" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={userSearch}
              required
              onChange={(e) => {
                setUserSearch(e.target.value);
                setShowUserOptions(true);
                setForm((f) => ({ ...f, UsuarioID: null }));
                setErrors((errs) => {
                  const { UsuarioID, ...rest } = errs;
                  return rest;
                });
              }}
              onFocus={() => setShowUserOptions(true)}
              onBlur={() => {
                setTimeout(() => {
                  setShowUserOptions(false);
                  const match = trabajadores.find(
                    (u) => `${u.NombreCompleto} (${u.Ficha})` === userSearch
                  );
                  if (!match) {
                    setForm((f) => ({ ...f, UsuarioID: null }));
                    setErrors((errs) => ({
                      ...errs,
                      UsuarioID: "Selecciona un usuario válido",
                    }));
                  } else {
                    setForm((f) => ({ ...f, UsuarioID: match.UsuarioID }));
                    setErrors((errs) => {
                      const { UsuarioID, ...rest } = errs;
                      return rest;
                    });
                  }
                }, 150);
              }}
              className="ce-autocomplete-input"
            />
            {showUserOptions && (
              <ul className="ce-autocomplete-list">
                {filteredUsers.map((u) => (
                  <li
                    key={u.UsuarioID}
                    onMouseDown={() => {
                      setForm((f) => ({ ...f, UsuarioID: u.UsuarioID }));
                      setUserSearch(`${u.NombreCompleto} (${u.Ficha})`);
                      setErrors((errs) => {
                        const { UsuarioID, ...rest } = errs;
                        return rest;
                      });
                      setShowUserOptions(false);
                    }}
                  >
                    {u.NombreCompleto} ({u.Ficha})
                  </li>
                ))}
                {filteredUsers.length === 0 && (
                  <li className="no-results">No hay coincidencias</li>
                )}
              </ul>
            )}
            {errors.UsuarioID && (
              <small className="ce-error-message">{errors.UsuarioID}</small>
            )}
          </div>

          {/* Autocomplete Dependencia */}
          <label>
            Dependencia <span style={{ color: "var(--color-primary)" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Buscar dependencia..."
              value={depSearch}
              required
              onChange={(e) => {
                setDepSearch(e.target.value);
                setShowDepOptions(true);
                setForm((f) => ({ ...f, DependenciaID: null }));
                setErrors((errs) => {
                  const { DependenciaID, ...rest } = errs;
                  return rest;
                });
              }}
              onFocus={() => setShowDepOptions(true)}
              onBlur={() => {
                setTimeout(() => {
                  setShowDepOptions(false);
                  const match = dependencias.find(
                    (d) => d.NombreDependencia === depSearch
                  );
                  if (!match) {
                    setForm((f) => ({ ...f, DependenciaID: null }));
                    setErrors((errs) => ({
                      ...errs,
                      DependenciaID: "Selecciona una dependencia válida",
                    }));
                  } else {
                    setForm((f) => ({
                      ...f,
                      DependenciaID: match.DependenciaID,
                    }));
                    setErrors((errs) => {
                      const { DependenciaID, ...rest } = errs;
                      return rest;
                    });
                  }
                }, 150);
              }}
              className="ce-autocomplete-input"
            />
            {showDepOptions && (
              <ul className="ce-autocomplete-list">
                {filteredDeps.map((d) => (
                  <li
                    key={d.DependenciaID}
                    onMouseDown={() => {
                      setForm((f) => ({
                        ...f,
                        DependenciaID: d.DependenciaID,
                      }));
                      setDepSearch(d.NombreDependencia);
                      setErrors((errs) => {
                        const { DependenciaID, ...rest } = errs;
                        return rest;
                      });
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
            {errors.DependenciaID && (
              <small className="ce-error-message">{errors.DependenciaID}</small>
            )}
          </div>

          <label>
            Ubicación <span style={{ color: "var(--color-primary)" }}>*</span>
          </label>
          <input
            name="Ubicacion"
            value={form.Ubicacion}
            onChange={handleChange}
            required
          />
          {errors.Ubicacion && (
            <small className="ce-error-message">{errors.Ubicacion}</small>
          )}

          {/* Autocomplete Estado */}
          <label>
            Estado <span style={{ color: "var(--color-primary)" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Buscar estado..."
              value={estadoSearch}
              required
              onChange={(e) => {
                setEstadoSearch(e.target.value);
                setShowEstadoOptions(true);
                // limpiar selección previa y error
                setForm((f) => ({ ...f, EstadoID: null }));
                setErrors((errs) => {
                  const { EstadoID, ...rest } = errs;
                  return rest;
                });
              }}
              onFocus={() => setShowEstadoOptions(true)}
              onBlur={() => {
                setTimeout(() => {
                  setShowEstadoOptions(false);
                  const match = estados.find(
                    (es) => es.EstadoEquipo === estadoSearch
                  );
                  if (!match) {
                    setForm((f) => ({ ...f, EstadoID: null }));
                    setErrors((errs) => ({
                      ...errs,
                      EstadoID: "Selecciona un estado válido",
                    }));
                  } else {
                    setForm((f) => ({ ...f, EstadoID: match.EstadoID }));
                    setErrors((errs) => {
                      const { EstadoID, ...rest } = errs;
                      return rest;
                    });
                  }
                }, 150);
              }}
              className="ce-autocomplete-input"
            />
            {showEstadoOptions && (
              <ul className="ce-autocomplete-list">
                {filteredEstados.map((es) => (
                  <li
                    key={es.EstadoID}
                    onMouseDown={() => {
                      setForm((f) => ({ ...f, EstadoID: es.EstadoID }));
                      setEstadoSearch(es.EstadoEquipo);
                      setErrors((errs) => {
                        const { EstadoID, ...rest } = errs;
                        return rest;
                      });
                      setShowEstadoOptions(false);
                    }}
                  >
                    {es.EstadoEquipo}
                  </li>
                ))}
                {filteredEstados.length === 0 && (
                  <li className="no-results">No hay coincidencias</li>
                )}
              </ul>
            )}
            {errors.EstadoID && (
              <small className="ce-error-message">{errors.EstadoID}</small>
            )}
          </div>

          <label>
            Contrato <span style={{ color: "var(--color-primary)" }}>*</span>
          </label>
          <input
            name="Contrato"
            value={form.Contrato}
            onChange={handleChange}
            required
          />
          {errors.Contrato && (
            <small className="ce-error-message">{errors.Contrato}</small>
          )}

          <label>Costo Mensual</label>
          <input
            type="text"
            name="CostoMes"
            value={formatPeso(form.CostoMes)}
            onChange={handleCostoMesChange}
          />

          <label>
            Responsable <span style={{ color: "var(--color-primary)" }}>*</span>
          </label>
          <input
            name="Responsable"
            value={form.Responsable}
            onChange={handleChange}
            required
          />
          {errors.Responsable && (
            <small className="ce-error-message">{errors.Responsable}</small>
          )}

          <label>Observación</label>
          <textarea
            name="Observacion"
            value={form.Observacion}
            onChange={handleChange}
          />
          {/* Agrega aquí más campos si lo necesitas */}
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

// === Eliminar UPS ===
function EliminarUPS() {
  const [equipos, setEquipos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarTodo() {
      try {
        const tRes = await getTipoEquipos();
        setTipos(tRes.data);
        const equiposRes = await getEquiposCM();
        const upsTipoIds = tRes.data
          .filter((t) => (t.NombreTipo || "").toLowerCase().includes("ups"))
          .map((t) => t.TipoEquipoID);
        const upsEquipos = equiposRes.data.filter((eq) =>
          upsTipoIds.includes(eq.TipoEquipoID)
        );
        setEquipos(upsEquipos);
        setFiltered(upsEquipos);
      } catch (err) {
        setError("Error al cargar datos: " + err.message);
      }
    }
    cargarTodo();
  }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) setFiltered(equipos);
    else
      setFiltered(
        equipos.filter(
          (e) =>
            (e.NombreInventario || "").toLowerCase().includes(q) ||
            (e.Serie || "").toLowerCase().includes(q) ||
            (e.Responsable || "").toLowerCase().includes(q)
        )
      );
  }, [search, equipos]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta UPS?")) return;
    setError(null);
    try {
      await deleteEquipoCM(id);
      const updated = equipos.filter((e) => e.EquipoID !== id);
      setEquipos(updated);
      setFiltered(updated);
      alert("UPS eliminada");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="equipo-section">
      <h2>Eliminar UPS</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por inventario, serie o responsable..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        {filtered.length === 0 ? (
          <p className="no-results">No se encontraron UPS.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Inventario</th>
                  <th>Serie</th>
                  <th>Responsable</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.EquipoID}>
                    <td data-label="ID">{e.EquipoID}</td>
                    <td data-label="Inventario">{e.NombreInventario}</td>
                    <td data-label="Serie">{e.Serie}</td>
                    <td data-label="Responsable">{e.Responsable}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => handleDelete(e.EquipoID)}
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
