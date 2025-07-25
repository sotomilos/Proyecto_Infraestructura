import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../../Components/Header";
import Navbar from "../../../Components/Navbar";
import "../Ingreso_Compu/CrearEquipo.css";
import "../Ingreso_Compu/Ingreso_Compu.css";
import ConsultarSwitches from "../../Visitor/Control_Redes/Control_Redes";
import {
  getTipoMarcas,
  getTipoEquipos,
  getEstados,
  getPlantas,
  getSwitches,
  createSwitch,
  updateSwitch,
  deleteSwitch,
  getPuertosByEquipoSWID,
  createPuerto,
  updatePuerto,
  deletePuerto,
} from "../../../api/api";
import DataTable from "../../Visitor/DataTable";

export default function Ingreso_Switch({ usuario }) {
  const [navVisible, setNavVisible] = useState(true);
  const IngresoSwitchSections = [
    {
      title: "Switches",
      mainHref: "/Home/Ingreso-Redes",
      links: [
        { text: "Crear Switch", href: "/Home/Ingreso-Redes/Crear-Switch" },
        {
          text: "Actualizar Switch",
          href: "/Home/Ingreso-Redes/Actualizar-Switch",
        },
        {
          text: "Eliminar Switch",
          href: "/Home/Ingreso-Redes/Eliminar-Switch",
        },
        {
          text: "Consultar Switches",
          href: "/Home/Control-Redes/consultar",
        },
        {
          text: "CRUD Puertos",
          href: "/Home/Ingreso-Redes/CRUD-Puertos",
        },
      ],
    },
  ];

  return (
    <div className="app-layout">
      <Header titulo="Gestión de Switches" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home"
          sections={IngresoSwitchSections}
          onToggle={setNavVisible}
        />
        <main
          className={`layout-content ingreso-switch-main ${
            !navVisible ? "navbar-hidden" : ""
          }`}
        >
          <Routes>
            <Route path="Crear-Switch" element={<CrearSwitch />} />
            <Route path="Actualizar-Switch" element={<ActualizarSwitch />} />
            <Route path="Eliminar-Switch" element={<EliminarSwitch />} />
            <Route path="Consultar-Switches" element={<ConsultarSwitches />} />
            <Route path="CRUD-Puertos" element={<CRUDPuerto />} />
            <Route
              index
              element={
                <p className="placeholder">
                  Selecciona una acción sobre Switches
                </p>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// === Crear Switch ===
function CrearSwitch() {
  const [form, setForm] = useState({
    NombreInv: "",
    FechaInstalacion: "",
    Serial: "",
    TipoEquipoID: "",
    MarcaID: "",
    Modelo: "",
    NombreEquipo: "",
    DireccionIP: "",
    Mac: "",
    Ubicacion: "",
    Observaciones: "",
    EstadoID: "",
    Marcacion: "",
    PlantaID: "",
    VersionFirmware: "",
  });
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [plantas, setPlantas] = useState([]);
  const [errors, setErrors] = useState({});

  // Autocomplete states
  const [marcaSearch, setMarcaSearch] = useState("");
  const [showMarcaOptions, setShowMarcaOptions] = useState(false);
  const [estadoSearch, setEstadoSearch] = useState("");
  const [showEstadoOptions, setShowEstadoOptions] = useState(false);
  const [plantaSearch, setPlantaSearch] = useState("");
  const [showPlantaOptions, setShowPlantaOptions] = useState(false);

  const requiredFields = [
    "NombreInv",
    "TipoEquipoID",
    "MarcaID",
    "Modelo",
    "NombreEquipo",
    "EstadoID",
    "PlantaID",
  ];

  useEffect(() => {
    async function cargarListas() {
      try {
        const [mRes, tRes, eRes, pRes] = await Promise.all([
          getTipoMarcas(),
          getTipoEquipos(),
          getEstados(),
          getPlantas(),
        ]);
        setMarcas(mRes.data);
        setTipos(tRes.data);
        setEstados(eRes.data);
        setPlantas(pRes.data);
      } catch (err) {
        console.error("Error al cargar listas:", err);
      }
    }
    cargarListas();
  }, []);

  // Filtrados con useMemo
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

  const filteredPlantas = useMemo(() => {
    const txt = plantaSearch.toLowerCase();
    return plantas.filter((p) =>
      (p.TipoPlanta || "").toLowerCase().includes(txt)
    );
  }, [plantaSearch, plantas]);

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
    try {
      await createSwitch(form);
      alert("Switch creado exitosamente");
      setForm({
        NombreInv: "",
        FechaInstalacion: "",
        Serial: "",
        TipoEquipoID: "",
        MarcaID: "",
        Modelo: "",
        NombreEquipo: "",
        DireccionIP: "",
        Mac: "",
        Ubicacion: "",
        Observaciones: "",
        EstadoID: "",
        Marcacion: "",
        PlantaID: "",
        VersionFirmware: "",
      });
    } catch (err) {
      alert(err.message || "Error al crear switch");
    }
  };

  return (
    <form onSubmit={handleCrear} className="ce-form-grid">
      <h3 className="ce-form-section-title">Datos del Switch</h3>

      <label>
        Nombre Inventario{" "}
        <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <input
        name="NombreInv"
        value={form.NombreInv}
        onChange={handleChange}
        required
      />
      {errors.NombreInv && (
        <small className="ce-error-message">{errors.NombreInv}</small>
      )}

      <label>Fecha Instalación</label>
      <input
        type="date"
        name="FechaInstalacion"
        value={form.FechaInstalacion}
        onChange={handleChange}
      />

      <label>Serial</label>
      <input name="Serial" value={form.Serial} onChange={handleChange} />

      <label>
        Tipo Equipo <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <select
        name="TipoEquipoID"
        value={form.TipoEquipoID}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione tipo</option>
        {tipos
          .filter((t) => t.NombreTipo?.toLowerCase() === "swicth")
          .map((t) => (
            <option key={t.TipoEquipoID} value={t.TipoEquipoID}>
              {t.NombreTipo}
            </option>
          ))}
      </select>
      {errors.TipoEquipoID && (
        <small className="ce-error-message">{errors.TipoEquipoID}</small>
      )}

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
            setForm((f) => ({ ...f, MarcaID: null }));
            setErrors((errs) => {
              const { MarcaID, ...rest } = errs;
              return rest;
            });
          }}
          required
          onFocus={() => setShowMarcaOptions(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowMarcaOptions(false);
              const match = marcas.find((m) => m.NombreMarca === marcaSearch);
              if (!match) {
                setForm((f) => ({ ...f, MarcaID: null }));
                setErrors((errs) => ({
                  ...errs,
                  MarcaID: "Selecciona una marca válida",
                }));
              } else {
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

      <label>
        Nombre Equipo <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <input
        name="NombreEquipo"
        value={form.NombreEquipo}
        onChange={handleChange}
        required
      />
      {errors.NombreEquipo && (
        <small className="ce-error-message">{errors.NombreEquipo}</small>
      )}

      <label>Dirección IP</label>
      <input
        name="DireccionIP"
        value={form.DireccionIP}
        onChange={handleChange}
      />

      <label>MAC</label>
      <input name="Mac" value={form.Mac} onChange={handleChange} />

      <label>Ubicación</label>
      <input name="Ubicacion" value={form.Ubicacion} onChange={handleChange} />

      <label>Observaciones</label>
      <textarea
        name="Observaciones"
        value={form.Observaciones}
        onChange={handleChange}
      />

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

      <label>Marcación</label>
      <input name="Marcacion" value={form.Marcacion} onChange={handleChange} />

      <label>
        Planta <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Buscar planta..."
          value={plantaSearch}
          required
          onChange={(e) => {
            setPlantaSearch(e.target.value);
            setShowPlantaOptions(true);
            setForm((f) => ({ ...f, PlantaID: null }));
            setErrors((errs) => {
              const { PlantaID, ...rest } = errs;
              return rest;
            });
          }}
          onFocus={() => setShowPlantaOptions(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowPlantaOptions(false);
              const match = plantas.find((p) => p.TipoPlanta === plantaSearch);
              if (!match) {
                setForm((f) => ({ ...f, PlantaID: null }));
                setErrors((errs) => ({
                  ...errs,
                  PlantaID: "Selecciona una planta válida",
                }));
              } else {
                setForm((f) => ({ ...f, PlantaID: match.PlantaID }));
                setErrors((errs) => {
                  const { PlantaID, ...rest } = errs;
                  return rest;
                });
              }
            }, 150);
          }}
          className="ce-autocomplete-input"
        />
        {showPlantaOptions && (
          <ul className="ce-autocomplete-list">
            {filteredPlantas.map((p) => (
              <li
                key={p.PlantaID}
                onMouseDown={() => {
                  setForm((f) => ({ ...f, PlantaID: p.PlantaID }));
                  setPlantaSearch(p.TipoPlanta);
                  setErrors((errs) => {
                    const { PlantaID, ...rest } = errs;
                    return rest;
                  });
                  setShowPlantaOptions(false);
                }}
              >
                {p.TipoPlanta}
              </li>
            ))}
            {filteredPlantas.length === 0 && (
              <li className="no-results">No hay coincidencias</li>
            )}
          </ul>
        )}
        {errors.PlantaID && (
          <small className="ce-error-message">{errors.PlantaID}</small>
        )}
      </div>

      <label>Versión Firmware</label>
      <input
        name="VersionFirmware"
        value={form.VersionFirmware}
        onChange={handleChange}
      />

      <button type="submit" className="ce-submit-button">
        Crear Switch
      </button>
    </form>
  );
}

// === Actualizar Switch ===
function ActualizarSwitch() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [plantas, setPlantas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Autocomplete states
  const [marcaSearch, setMarcaSearch] = useState("");
  const [showMarcaOptions, setShowMarcaOptions] = useState(false);
  const [estadoSearch, setEstadoSearch] = useState("");
  const [showEstadoOptions, setShowEstadoOptions] = useState(false);
  const [plantaSearch, setPlantaSearch] = useState("");
  const [showPlantaOptions, setShowPlantaOptions] = useState(false);

  useEffect(() => {
    fetchSwitches();
    fetchListas();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter(
          (sw) =>
            (sw.NombreInv && sw.NombreInv.toLowerCase().includes(q)) ||
            (sw.Serial && sw.Serial.toLowerCase().includes(q)) ||
            (sw.NombreEquipo && sw.NombreEquipo.toLowerCase().includes(q))
        )
      );
    }
  }, [searchQuery, items]);

  async function fetchSwitches() {
    setLoading(true);
    try {
      const res = await getSwitches();
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      setError("Error al cargar switches: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchListas() {
    try {
      const [mRes, tRes, eRes, pRes] = await Promise.all([
        getTipoMarcas(),
        getTipoEquipos(),
        getEstados(),
        getPlantas(),
      ]);
      setMarcas(mRes.data);
      setTipos(tRes.data);
      setEstados(eRes.data);
      setPlantas(pRes.data);
    } catch (err) {
      setError("Error al cargar listas: " + err.message);
    }
  }

  function startEdit(sw) {
    setSelected(sw.EquipoSWID);
    setForm({
      ...sw,
      FechaInstalacion: sw.FechaInstalacion?.split("T")[0] || "",
    });

    // Prefill textos de las búsquedas
    const sm = marcas.find((m) => m.MarcaID === sw.MarcaID);
    const se = estados.find((es) => es.EstadoID === sw.EstadoID);
    const sp = plantas.find((p) => p.PlantaID === sw.PlantaID);
    setMarcaSearch(sm ? sm.NombreMarca : "");
    setEstadoSearch(se ? se.EstadoEquipo : "");
    setPlantaSearch(sp ? sp.TipoPlanta : "");

    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["MarcaID", "TipoEquipoID", "EstadoID", "PlantaID"];
    setForm((f) => ({
      ...f,
      [name]: numericFields.includes(name)
        ? value === ""
          ? null
          : parseInt(value, 10)
        : value,
    }));
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await updateSwitch(selected, form);
      alert("Switch actualizado exitosamente");
      setItems((prev) =>
        prev.map((sw) => (sw.EquipoSWID === selected ? { ...sw, ...form } : sw))
      );
      setFilteredItems((prev) =>
        prev.map((sw) => (sw.EquipoSWID === selected ? { ...sw, ...form } : sw))
      );
      setSelected(null);
      setForm({});
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setSelected(null);
    setForm({});
    setError(null);
  };

  // Autocomplete helpers igual que en crear

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

  const filteredPlantas = useMemo(() => {
    const txt = plantaSearch.toLowerCase();
    return plantas.filter((p) =>
      (p.TipoPlanta || "").toLowerCase().includes(txt)
    );
  }, [plantaSearch, plantas]);

  return (
    <section className="switch-section">
      <h2>Actualizar Switch</h2>
      {error && <div className="ce-error-message">{error}</div>}

      {selected && (
        <div className="edit-form-container">
          <form onSubmit={handleActualizar} className="form-grid">
            <h3 className="form-section-title">
              Editar Switch #{form.EquipoSWID}
            </h3>

            <label>Nombre Inventario</label>
            <input
              name="NombreInv"
              value={form.NombreInv || ""}
              onChange={handleChange}
              required
            />

            <label>Fecha Instalación</label>
            <input
              type="date"
              name="FechaInstalacion"
              value={form.FechaInstalacion || ""}
              onChange={handleChange}
            />

            <label>Serial</label>
            <input
              name="Serial"
              value={form.Serial || ""}
              onChange={handleChange}
            />

            <label>
              Tipo Equipo{" "}
              <span style={{ color: "var(--color-primary)" }}>*</span>
            </label>
            <select
              name="TipoEquipoID"
              value={form.TipoEquipoID}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione tipo</option>
              {tipos
                .filter((t) => t.NombreTipo?.toLowerCase() === "swicth")
                .map((t) => (
                  <option key={t.TipoEquipoID} value={t.TipoEquipoID}>
                    {t.NombreTipo}
                  </option>
                ))}
            </select>

            {/* Marca autocomplete */}
            <label>Marca</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Buscar marca..."
                value={marcaSearch}
                onChange={(e) => {
                  setMarcaSearch(e.target.value);
                  setShowMarcaOptions(true);
                }}
                onFocus={() => setShowMarcaOptions(true)}
                onBlur={() => setTimeout(() => setShowMarcaOptions(false), 100)}
                className="autocomplete-input"
              />
              {showMarcaOptions && (
                <ul className="autocomplete-list">
                  {filteredMarcas.map((m) => (
                    <li
                      key={m.MarcaID}
                      onMouseDown={() => {
                        setForm((f) => ({ ...f, MarcaID: m.MarcaID }));
                        setMarcaSearch(m.NombreMarca);
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
            </div>

            <label>Modelo</label>
            <input
              name="Modelo"
              value={form.Modelo || ""}
              onChange={handleChange}
              required
            />

            <label>Nombre Equipo</label>
            <input
              name="NombreEquipo"
              value={form.NombreEquipo || ""}
              onChange={handleChange}
              required
            />

            <label>Dirección IP</label>
            <input
              name="DireccionIP"
              value={form.DireccionIP || ""}
              onChange={handleChange}
            />

            <label>MAC</label>
            <input name="Mac" value={form.Mac || ""} onChange={handleChange} />

            <label>Ubicación</label>
            <input
              name="Ubicacion"
              value={form.Ubicacion || ""}
              onChange={handleChange}
            />

            <label>Observaciones</label>
            <textarea
              name="Observaciones"
              value={form.Observaciones || ""}
              onChange={handleChange}
            />

            {/* Estado autocomplete */}
            <label>Estado</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Buscar estado..."
                value={estadoSearch}
                onChange={(e) => {
                  setEstadoSearch(e.target.value);
                  setShowEstadoOptions(true);
                }}
                onFocus={() => setShowEstadoOptions(true)}
                onBlur={() =>
                  setTimeout(() => setShowEstadoOptions(false), 100)
                }
                className="autocomplete-input"
              />
              {showEstadoOptions && (
                <ul className="autocomplete-list">
                  {filteredEstados.map((es) => (
                    <li
                      key={es.EstadoID}
                      onMouseDown={() => {
                        setForm((f) => ({ ...f, EstadoID: es.EstadoID }));
                        setEstadoSearch(es.EstadoEquipo);
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
            </div>

            <label>Marcación</label>
            <input
              name="Marcacion"
              value={form.Marcacion || ""}
              onChange={handleChange}
            />

            {/* Planta autocomplete */}
            <label>Planta</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Buscar planta..."
                value={plantaSearch}
                onChange={(e) => {
                  setPlantaSearch(e.target.value);
                  setShowPlantaOptions(true);
                }}
                onFocus={() => setShowPlantaOptions(true)}
                onBlur={() =>
                  setTimeout(() => setShowPlantaOptions(false), 100)
                }
                className="autocomplete-input"
              />
              {showPlantaOptions && (
                <ul className="autocomplete-list">
                  {filteredPlantas.map((p) => (
                    <li
                      key={p.PlantaID}
                      onMouseDown={() => {
                        setForm((f) => ({ ...f, PlantaID: p.PlantaID }));
                        setPlantaSearch(p.TipoPlanta);
                        setShowPlantaOptions(false);
                      }}
                    >
                      {p.TipoPlanta}
                    </li>
                  ))}
                  {filteredPlantas.length === 0 && (
                    <li className="no-results">No hay coincidencias</li>
                  )}
                </ul>
              )}
            </div>

            <label>Versión Firmware</label>
            <input
              name="VersionFirmware"
              value={form.VersionFirmware || ""}
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
          placeholder="Buscar por Nombre, Serie o NombreEquipo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla de switches */}
      <div className="table-container">
        {loading ? (
          <p className="loading-message">Cargando switches...</p>
        ) : filteredItems.length === 0 ? (
          <p className="no-results">
            No se encontraron switches que coincidan con la búsqueda
          </p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Serial</th>
                  <th>NombreEquipo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((sw) => (
                  <tr key={sw.EquipoSWID}>
                    <td data-label="Nombre">{sw.NombreInv}</td>
                    <td data-label="Serial">{sw.Serial}</td>
                    <td data-label="NombreEquipo">{sw.NombreEquipo}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => startEdit(sw)}
                        className="btn-edit"
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

// === Eliminar Switch ===
function EliminarSwitch() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSwitches();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter(
          (sw) =>
            (sw.NombreInv && sw.NombreInv.toLowerCase().includes(query)) ||
            (sw.Serial && sw.Serial.toLowerCase().includes(query)) ||
            (sw.NombreEquipo && sw.NombreEquipo.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, items]);

  async function fetchSwitches() {
    setLoading(true);
    try {
      const res = await getSwitches();
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      setError("Error al cargar switches: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "¿Deseas eliminar este switch? Esta acción no se puede deshacer."
      )
    )
      return;
    setError(null);
    try {
      await deleteSwitch(id);
      setItems(items.filter((sw) => sw.EquipoSWID !== id));
      setFilteredItems(filteredItems.filter((sw) => sw.EquipoSWID !== id));
      alert("Switch eliminado exitosamente");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="switch-section">
      <h2>Eliminar Switch</h2>
      {error && <div className="ce-error-message">{error}</div>}

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por Nombre, Serie o NombreEquipo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla de switches */}
      <div className="table-container">
        {loading ? (
          <p className="loading-message">Cargando switches...</p>
        ) : filteredItems.length === 0 ? (
          <p className="no-results">
            No se encontraron switches que coincidan con la búsqueda
          </p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Serial</th>
                  <th>NombreEquipo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((sw) => (
                  <tr key={sw.EquipoSWID}>
                    <td data-label="Nombre">{sw.NombreInv}</td>
                    <td data-label="Serial">{sw.Serial}</td>
                    <td data-label="NombreEquipo">{sw.NombreEquipo}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => handleDelete(sw.EquipoSWID)}
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

// Modal exclusivo para Control_Redes
function RedesModal({ title, onClose, children }) {
  return (
    <div className="redes-modal-backdrop" onClick={onClose}>
      <div className="redes-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="redes-modal-close" onClick={onClose}>
          &times;
        </button>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

function CRUDPuerto() {
  const [switches, setSwitches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [puertos, setPuertos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [switchActual, setSwitchActual] = useState(null);
  const [puertosLoading, setPuertosLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [puertoEditandoID, setPuertoEditandoID] = useState(null);
  const [puertoEditando, setPuertoEditando] = useState({});
  const [mensajePuerto, setMensajePuerto] = useState("");

  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [plantas, setPlantas] = useState([]);
  const [filtroSwitchID, setFiltroSwitchID] = useState(null);

  useEffect(() => {
    setLoading(true);
    getSwitches()
      .then((res) => setSwitches(res.data))
      .catch((err) => setError(err.message || "Error al cargar switches"))
      .finally(() => setLoading(false));

    getTipoMarcas()
      .then((res) => setMarcas(res.data))
      .catch(() => {});
    getTipoEquipos()
      .then((res) => setTipos(res.data))
      .catch(() => {});
    getEstados()
      .then((res) => setEstados(res.data))
      .catch(() => {});
    getPlantas()
      .then((res) => setPlantas(res.data))
      .catch(() => {});
  }, []);

  const getMarcaName = (id) =>
    marcas.find((m) => m.MarcaID === id)?.NombreMarca || "-";
  const getTipoName = (id) =>
    tipos.find((t) => t.TipoEquipoID === id)?.NombreTipo || "-";
  const getEstadoName = (id) =>
    estados.find((e) => e.EstadoID === id)?.EstadoEquipo || "-";
  const getPlantaName = (id) =>
    plantas.find((p) => p.PlantaID === id)?.TipoPlanta || "-";

  const filteredSwitches = switches.filter((sw) => {
    const normalizedSearch = search.toLowerCase().replace(/\s/g, "");
    const coincideBusqueda =
      (sw.NombreInv?.toLowerCase().replace(/\s/g, "") || "").includes(
        normalizedSearch
      ) ||
      (sw.NombreEquipo?.toLowerCase().replace(/\s/g, "") || "").includes(
        normalizedSearch
      ) ||
      (sw.Modelo?.toLowerCase().replace(/\s/g, "") || "").includes(
        normalizedSearch
      ) ||
      (sw.DireccionIP?.toLowerCase().replace(/\s/g, "") || "").includes(
        normalizedSearch
      );
    const coincideFiltro = filtroSwitchID
      ? sw.EquipoSWID === filtroSwitchID
      : true;
    return coincideBusqueda && coincideFiltro;
  });

  const handleVerPuertos = async (sw) => {
    setSwitchActual(sw);
    setFiltroSwitchID(sw.EquipoSWID);
    setPuertos([]);
    setShowModal(true);
    setPuertosLoading(true);
    setError(null);
    setPuertoEditandoID(null);
    setPuertoEditando({});
    setMensajePuerto("");
    try {
      const res = await getPuertosByEquipoSWID(sw.EquipoSWID);
      setPuertos(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "No se encontraron puertos para este switch"
      );
    } finally {
      setPuertosLoading(false);
    }
  };

  // --- EDICIÓN DE PUERTOS ---
  function inicializarPuertoEditando(puerto) {
    return {
      Puerto: puerto.Puerto || "",
      PoE: puerto.PoE || "",
      Tipo: puerto.Tipo || "",
      Dispositivo: puerto.Dispositivo || "",
      Marca: puerto.Marca || "",
      Modelo: puerto.Modelo || "",
      NombreEquipoPuerto: puerto.NombreEquipoPuerto || "",
      VlanNativa: puerto.VlanNativa || "",
      Vlan: puerto.Vlan || "",
      PRadius: puerto.PRadius || "",
      NombreUsuario: puerto.NombreUsuario || "",
      Observaciones: puerto.Observaciones || "",
      Status: puerto.Status || "",
      PuntoRed: puerto.PuntoRed || "",
      PuntoRack: puerto.PuntoRack || "",
      DireccionIP: puerto.DireccionIP || "",
      DireccionIPEquipo: puerto.DireccionIPEquipo || "",
      DireccionGateWay: puerto.DireccionGateWay || "",
      SerialEquipo: puerto.SerialEquipo || "",
      DireccionMac: puerto.DireccionMac || "",
      Ubicacion: puerto.Ubicacion || "",
      DireccionMask: puerto.DireccionMask || "",
      PuertoID: puerto.PuertoID,
    };
  }

  const handleEditarPuerto = (puerto) => {
    setPuertoEditandoID(puerto.PuertoID);
    setPuertoEditando(inicializarPuertoEditando(puerto));
    setMensajePuerto("");
  };

  function handlePuertoChange(e) {
    setPuertoEditando({
      ...puertoEditando,
      [e.target.name]: e.target.value,
    });
  }

  // Estado y lógica para crear un nuevo puerto
  const [nuevoPuerto, setNuevoPuerto] = useState({
    Puerto: "",
    PoE: "",
    Tipo: "",
    Dispositivo: "",
    Marca: "",
    Modelo: "",
    NombreEquipoPuerto: "",
    SerialEquipo: "",
    VlanNativa: "",
    Vlan: "",
    PRadius: "",
    NombreUsuario: "",
    Observaciones: "",
    Status: "",
    PuntoRed: "",
    PuntoRack: "",
    DireccionIP: "",
    DireccionIPEquipo: "",
    DireccionMask: "",
    DireccionGateWay: "",
    DireccionMac: "",
    Ubicacion: "",
  });
  const [creandoPuerto, setCreandoPuerto] = useState(false);
  const [errorNuevoPuerto, setErrorNuevoPuerto] = useState("");

  async function handleCrearPuertoNuevo() {
    setErrorNuevoPuerto("");
    if (!switchActual) {
      setErrorNuevoPuerto("Selecciona un switch.");
      return;
    }
    if (!nuevoPuerto.Puerto || !nuevoPuerto.PoE || !nuevoPuerto.Tipo) {
      setErrorNuevoPuerto("Puerto, PoE y Tipo son obligatorios.");
      return;
    }
    try {
      await createPuerto({
        ...nuevoPuerto,
        EquipoSWID: switchActual.EquipoSWID,
      });
      setMensajePuerto("Puerto creado exitosamente.");
      const res = await getPuertosByEquipoSWID(switchActual.EquipoSWID);
      setPuertos(res.data);
      setNuevoPuerto({
        Puerto: "",
        PoE: "",
        Tipo: "",
        Dispositivo: "",
        Marca: "",
        Modelo: "",
        NombreEquipoPuerto: "",
        SerialEquipo: "",
        VlanNativa: "",
        Vlan: "",
        PRadius: "",
        NombreUsuario: "",
        Observaciones: "",
        Status: "",
        PuntoRed: "",
        PuntoRack: "",
        DireccionIP: "",
        DireccionIPEquipo: "",
        DireccionMask: "",
        DireccionGateWay: "",
        DireccionMac: "",
        Ubicacion: "",
      });
      setCreandoPuerto(false);
      setTimeout(() => setMensajePuerto(""), 2000);
    } catch (err) {
      setErrorNuevoPuerto(err.message || "Error al crear puerto");
    }
  }

  async function handleGuardarPuerto() {
    function limpiarStrings(obj) {
      const limpio = {};
      for (const key in obj) {
        let val = obj[key];
        if (val == null) {
          limpio[key] = "";
        } else if (typeof val === "object") {
          limpio[key] = "";
        } else {
          limpio[key] = String(val);
        }
      }
      return limpio;
    }

    // Mapea NombreEquipoPuerto a NombreEquipo

    const datosPuerto = limpiarStrings({
      EquipoSWID: switchActual.EquipoSWID,
      Puerto: puertoEditando.Puerto,
      PoE: puertoEditando.PoE,
      Tipo: puertoEditando.Tipo,
      Dispositivo: puertoEditando.Dispositivo,
      Marca: puertoEditando.Marca,
      Modelo: puertoEditando.Modelo,
      NombreEquipoPuerto: puertoEditando.NombreEquipoPuerto,
      VlanNativa: puertoEditando.VlanNativa,
      Vlan: puertoEditando.Vlan,
      PRadius: puertoEditando.PRadius,
      NombreUsuario: puertoEditando.NombreUsuario,
      Observaciones: puertoEditando.Observaciones,
      Status: puertoEditando.Status,
      PuntoRed: puertoEditando.PuntoRed,
      PuntoRack: puertoEditando.PuntoRack,
      DireccionIP: puertoEditando.DireccionIP,
      DireccionIPEquipo: puertoEditando.DireccionIPEquipo,
      DireccionGateWay: puertoEditando.DireccionGateWay,
      SerialEquipo: puertoEditando.SerialEquipo,
      DireccionMac: puertoEditando.DireccionMac,
      Ubicacion: puertoEditando.Ubicacion,
      DireccionMask: puertoEditando.DireccionMask,
    });

    console.log("Enviando al backend:", datosPuerto);

    try {
      await updatePuerto(puertoEditandoID, datosPuerto);
      setMensajePuerto("Puerto actualizado exitosamente.");
      const res = await getPuertosByEquipoSWID(switchActual.EquipoSWID);
      setPuertos(res.data);
      setPuertoEditandoID(null);
      setPuertoEditando({});
      setTimeout(() => setMensajePuerto(""), 2000);
    } catch (err) {
      setMensajePuerto("Error al actualizar puerto");
      console.error("Error al actualizar puerto:", err);
    }
  }

  function handleCancelarPuerto() {
    setPuertoEditandoID(null);
    setPuertoEditando({});
    setMensajePuerto("");
  }

  async function handleEliminarPuerto(puertoID) {
    if (!window.confirm("¿Estás seguro de eliminar este puerto?")) return;
    try {
      await deletePuerto(puertoID);
      setMensajePuerto("Puerto eliminado exitosamente.");
      const res = await getPuertosByEquipoSWID(switchActual.EquipoSWID);
      setPuertos(res.data);
      setTimeout(() => setMensajePuerto(""), 2000);
    } catch (err) {
      setMensajePuerto(err.message || "Error al eliminar puerto");
    }
  }

  // --- COLUMNAS SWITCHES ---
  const columns = [
    {
      header: "Puertos",
      accessor: (item) => (
        <button className="btn-view" onClick={() => handleVerPuertos(item)}>
          Ver Puertos
        </button>
      ),
    },
    { header: "Nombre Inventario", accessor: "NombreInv" },
    { header: "Nombre Equipo", accessor: "NombreEquipo" },
    { header: "Modelo", accessor: "Modelo" },
    { header: "Tipo Eq", accessor: (item) => getTipoName(item.TipoEquipoID) },
    { header: "Marca", accessor: (item) => getMarcaName(item.MarcaID) },
    { header: "Serial", accessor: "Serial" },
    { header: "Dirección IP", accessor: "DireccionIP" },
    { header: "MAC", accessor: "Mac" },
    { header: "Ubicación", accessor: "Ubicacion" },
    { header: "Versión Firmware", accessor: "VersionFirmware" },
    { header: "Marcación", accessor: "Marcacion" },
    { header: "Estado", accessor: (item) => getEstadoName(item.EstadoID) },
    {
      header: "Fecha Instalación",
      accessor: (item) => {
        if (!item.FechaInstalacion) return "";
        return item.FechaInstalacion.split("T")[0];
      },
    },
    { header: "Planta", accessor: (item) => getPlantaName(item.PlantaID) },
    { header: "Observaciones", accessor: "Observaciones" },
  ];

  // --- COLUMNAS PUERTOS ---
  const puertoColumns = [
    {
      header: "Acciones",
      accessor: (item) =>
        item.__nuevo ? (
          <>
            <button onClick={handleCrearPuertoNuevo} style={{ marginRight: 4 }}>
              Guardar
            </button>
            <button
              onClick={() => {
                setNuevoPuerto({
                  Puerto: "",
                  PoE: "",
                  Tipo: "",
                  Dispositivo: "",
                  Marca: "",
                  Modelo: "",
                  NombreEquipoPuerto: "",
                  SerialEquipo: "",
                  VlanNativa: "",
                  Vlan: "",
                  PRadius: "",
                  NombreUsuario: "",
                  Observaciones: "",
                  Status: "",
                  PuntoRed: "",
                  PuntoRack: "",
                  DireccionIP: "",
                  DireccionIPEquipo: "",
                  DireccionMask: "",
                  DireccionGateWay: "",
                  DireccionMac: "",
                  Ubicacion: "",
                });
                setCreandoPuerto(false);
              }}
            >
              Cancelar
            </button>
          </>
        ) : item.PuertoID === puertoEditandoID ? (
          <>
            <button onClick={handleGuardarPuerto} style={{ marginRight: 4 }}>
              Guardar
            </button>
            <button onClick={handleCancelarPuerto}>Cancelar</button>
          </>
        ) : (
          <button onClick={() => handleEditarPuerto(item)}>Editar</button>
        ),
    },
    {
      header: "Eliminar",
      accessor: (item) =>
        !item.__nuevo && (
          <button
            className="btn-delete"
            style={{ color: "white" }}
            onClick={() => handleEliminarPuerto(item.PuertoID)}
          >
            Eliminar
          </button>
        ),
    },
    ...[
      "Puerto",
      "PoE",
      "Tipo",
      "Dispositivo",
      "Marca",
      "Modelo",
      "NombreEquipoPuerto",
      "SerialEquipo",
      "VlanNativa",
      "Vlan",
      "PRadius",
      "NombreUsuario",
      "Observaciones",
      "Status",
      "PuntoRed",
      "PuntoRack",
      "DireccionIP",
      "DireccionIPEquipo",
      "DireccionMask",
      "DireccionGateWay",
      "DireccionMac",
      "Ubicacion",
    ].map((campo) => ({
      header: campo
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase()),
      accessor: (item) =>
        item.__nuevo ? (
          <input
            name={campo}
            value={nuevoPuerto[campo] || ""}
            onChange={(e) =>
              setNuevoPuerto((n) => ({ ...n, [campo]: e.target.value }))
            }
            required={["Puerto", "PoE", "Tipo"].includes(campo)}
          />
        ) : item.PuertoID === puertoEditandoID ? (
          <input
            name={campo}
            value={puertoEditando[campo] || ""}
            onChange={handlePuertoChange}
            required={["Puerto", "PoE", "Tipo"].includes(campo)}
          />
        ) : (
          item[campo]
        ),
    })),
  ];

  return (
    <section className="table-section">
      <h2>Consultar Switches</h2>
      <p>Total de switches en pantalla: {filteredSwitches.length}</p>
      <input
        type="text"
        placeholder="Buscar por nombre, equipo, modelo o IP..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16, width: "100%", maxWidth: 400 }}
      />
      {filtroSwitchID && (
        <button
          onClick={() => setFiltroSwitchID(null)}
          style={{ marginBottom: 16 }}
          className="btn-clear-filter"
        >
          Mostrar todos los switches
        </button>
      )}
      {loading ? (
        <p>Cargando switches...</p>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <DataTable columns={columns} data={filteredSwitches} />
      )}

      {showModal && (
        <RedesModal
          title={
            switchActual
              ? `Puertos de ${switchActual.NombreInv} (${switchActual.NombreEquipo})`
              : "Puertos"
          }
          onClose={() => setShowModal(false)}
        >
          <p>
            Total de puertos en pantalla:{" "}
            {puertosLoading ? "Cargando..." : puertos.length}
          </p>
          {/* Botón de nuevo puerto debajo del total */}
          {creandoPuerto ? (
            errorNuevoPuerto && (
              <div style={{ color: "red", marginBottom: 8 }}>
                {errorNuevoPuerto}
              </div>
            )
          ) : (
            <button
              className="btn-primary"
              style={{ margin: "12px 0" }}
              onClick={() => setCreandoPuerto(true)}
            >
              + Nuevo Puerto
            </button>
          )}
          {mensajePuerto && (
            <div
              style={{
                color: mensajePuerto.includes("exitosamente") ? "green" : "red",
                marginBottom: 8,
              }}
            >
              {mensajePuerto}
            </div>
          )}
          {puertosLoading ? (
            <p>Cargando puertos...</p>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : puertos.length === 0 ? (
            <p>No hay puertos para este switch.</p>
          ) : (
            <DataTable
              columns={puertoColumns}
              data={(creandoPuerto
                ? [{ __nuevo: true, ...nuevoPuerto }, ...puertos]
                : puertos
              ).sort((a, b) =>
                (a.Puerto || "").localeCompare(b.Puerto || "", undefined, {
                  numeric: true,
                })
              )}
            />
          )}
        </RedesModal>
      )}
    </section>
  );
}
