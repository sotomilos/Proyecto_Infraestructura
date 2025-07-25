import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../../../Components/Header";
import Navbar from "../../../Components/Navbar";
import ConsultarImpresora from "../../Visitor/Control_Impresoras/Control_Impresoras";
import "../Ingreso_Compu/CrearEquipo.css";
import "../Ingreso_Compu/Ingreso_Compu.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaSearch,
  FaUser,
  FaLaptop,
  FaBuilding,
  FaKey,
  FaCheckCircle,
  FaServer,
  FaPrint,
} from "react-icons/fa";

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

export default function Ingreso_Impresoras({ usuario }) {
  const [navVisible, setNavVisible] = useState(true);
  const navigate = useNavigate();

  const IngresoPrintSections = [
    {
      title: "Impresoras",
      mainHref: "/Home/Ingreso-Impresoras",
      links: [
        {
          text: "Crear Impresora",
          href: "/Home/Ingreso-Impresoras/Crear-Impresora",
        },
        {
          text: "Actualizar Impresora",
          href: "/Home/Ingreso-Impresoras/Actualizar-Impresora",
        },
        {
          text: "Eliminar Impresora",
          href: "/Home/Ingreso-Impresoras/Eliminar-Impresora",
        },
        {
          text: "Consultar Impresora",
          href: "/Home/Control-Impresoras/consultar",
        },
      ],
    },
  ];

  // Accesos rápidos usando los href del menú lateral
  const quickLinks = IngresoPrintSections[0].links;

  return (
    <div className="app-layout">
      <Header titulo="Gestión de Impresoras" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home"
          sections={IngresoPrintSections}
          onToggle={setNavVisible}
        />
        <main
          className={`layout-content ingreso-print-main ${
            !navVisible ? "navbar-hidden" : ""
          }`}
        >
          <Routes>
            <Route path="Crear-Impresora" element={<CrearImpresora />} />
            <Route
              path="Actualizar-Impresora"
              element={<ActualizarImpresora />}
            />
            <Route path="Eliminar-Impresora" element={<EliminarImpresora />} />
            <Route
              path="Consultar-Impresora"
              element={<ConsultarImpresora />}
            />
            <Route
              index
              element={
                <div className="welcome-container">
                  <div className="welcome-card">
                    <h2>Gestión de Impresoras</h2>
                    <p className="placeholder">
                      Selecciona una acción del menú lateral o usa las opciones
                      rápidas:
                    </p>
                    <div className="welcome-options">
                      <div
                        className="option-card"
                        onClick={() => navigate("Crear-Impresora")}
                      >
                        <FaPlus className="option-icon" />
                        <span>Crear</span>
                      </div>
                      <div
                        className="option-card"
                        onClick={() => navigate("Actualizar-Impresora")}
                      >
                        <FaEdit className="option-icon" />
                        <span>Actualizar</span>
                      </div>
                      <div
                        className="option-card"
                        onClick={() => navigate("Eliminar-Impresora")}
                      >
                        <FaTrash className="option-icon" />
                        <span>Eliminar</span>
                      </div>
                      <div
                        className="option-card"
                        onClick={() =>
                          navigate("/Home/Control-Impresoras/consultar")
                        }
                      >
                        <FaSearch className="option-icon" />
                        <span>Consultar</span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

// === Crear Impresora ===
function CrearImpresora() {
  const [form, setForm] = useState({
    NombreInventario: "",
    MarcaID: "",
    TipoEquipoID: "",
    Modelo: "",
    Serie: "",
    SistemaOperativo: "",
    TipoConexion: "",
    DireccionIP: "",
    FechaLlegada: "",
    FechaInstalacion: "",
    FechaNovedad: "",
    UsuarioID: "", // “Ficha”
    DependenciaID: "",
    Ubicacion: "",
    EstadoID: "",
    Contrato: "",
    CostoMes: null,
    Responsable: "",
    Observacion: "",
  });

  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);

  const [errors, setErrors] = useState({});
  // Campos obligatorios según tu imagen (en negrita)
  const requiredFields = [
    "NombreInventario",
    "MarcaID",
    "TipoEquipoID",
    "Modelo",
    "Serie",
    "SistemaOperativo",
    "TipoConexion",
    "DireccionIP",
    "UsuarioID",
    "DependenciaID",
    "Ubicacion",
    "EstadoID",
    "Contrato",
    "Responsable",
  ];

  // Estados auxiliares para los autocompletes
  const [marcaSearch, setMarcaSearch] = useState("");
  const [showMarcaOptions, setShowMarcaOptions] = useState(false);
  const [estadoSearch, setEstadoSearch] = useState("");
  const [showEstadoOptions, setShowEstadoOptions] = useState(false);
  const [depSearch, setDepSearch] = useState("");
  const [showDepOptions, setShowDepOptions] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [showUserOptions, setShowUserOptions] = useState(false);

  // Helpers de moneda
  const formatPeso = (amt) => {
    if (amt == null) return "";
    return "$" + Number(amt).toLocaleString("es-CO");
  };
  const parsePeso = (str) => {
    const digits = str.replace(/[^0-9]/g, "");
    return digits === "" ? null : Number(digits);
  };

  const handleCostoMesChange = (e) => {
    setForm((f) => ({ ...f, CostoMes: parsePeso(e.target.value) }));
  };

  // Cargar listas de lookup al montarse
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

  // Filtrar solo “IMPRESORA” dentro de tipos
  const impresoraTipos = useMemo(() => {
    return tipos.filter((t) => t.NombreTipo.toLowerCase() === "impresora");
  }, [tipos]);

  // Filtrados para autocompletar
  const filteredMarcas = useMemo(() => {
    const txt = marcaSearch.toLowerCase();
    return marcas.filter((m) => m.NombreMarca.toLowerCase().includes(txt));
  }, [marcaSearch, marcas]);

  const filteredEstados = useMemo(() => {
    const txt = estadoSearch.toLowerCase();
    return estados.filter((es) => es.EstadoEquipo.toLowerCase().includes(txt));
  }, [estadoSearch, estados]);

  const filteredDeps = useMemo(() => {
    const txt = depSearch.toLowerCase();
    return dependencias.filter((d) =>
      d.NombreDependencia.toLowerCase().includes(txt)
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

    // 1) Validar campos obligatorios
    const errorsLocal = {};
    requiredFields.forEach((f) => {
      if (!form[f]) {
        errorsLocal[f] = "Este campo es obligatorio";
      }
    });
    if (Object.keys(errorsLocal).length > 0) {
      setErrors(errorsLocal);

      // Mostrar todos los errores en un solo toast
      const campos = Object.keys(errorsLocal)
        .map((campo) => {
          switch (campo) {
            case "NombreInventario":
              return "Nombre Inventario";
            case "MarcaID":
              return "Marca";
            case "TipoEquipoID":
              return "Tipo";
            case "Modelo":
              return "Modelo";
            case "Serie":
              return "Serie";
            case "SistemaOperativo":
              return "Sistema Operativo";
            case "TipoConexion":
              return "Tipo Conexión";
            case "DireccionIP":
              return "Dirección IP";
            case "UsuarioID":
              return "Ficha (Usuario)";
            case "DependenciaID":
              return "Dependencia";
            case "Ubicacion":
              return "Ubicación";
            case "EstadoID":
              return "Estado";
            case "Contrato":
              return "Contrato";
            case "Responsable":
              return "Responsable";
            default:
              return campo;
          }
        })
        .join(", ");
      toast.error(`Completa los siguientes campos obligatorios: ${campos}`);
      return;
    }

    // 2) Preparar payload (fechas vacías a null)
    const payload = {
      ...form,
      FechaLlegada: form.FechaLlegada || null,
      FechaInstalacion: form.FechaInstalacion || null,
      FechaNovedad: form.FechaNovedad || null,
    };

    // 3) Enviar al backend
    try {
      await createEquipoCM(payload);
      toast.success("✅ Impresora creada exitosamente");
      // 4) Resetear formulario
      setForm({
        NombreInventario: "",
        MarcaID: "",
        TipoEquipoID: "",
        Modelo: "",
        Serie: "",
        SistemaOperativo: "",
        TipoConexion: "",
        DireccionIP: "",
        FechaLlegada: "",
        FechaInstalacion: "",
        FechaNovedad: "",
        UsuarioID: "",
        DependenciaID: "",
        Ubicacion: "",
        EstadoID: "",
        Contrato: "",
        CostoMes: null,
        Responsable: "",
        Observacion: "",
      });
      setMarcaSearch("");
      setEstadoSearch("");
      setDepSearch("");
      setUserSearch("");
    } catch (err) {
      toast.error("❌ " + (err.message || "Error al crear impresora"));
    }
  };

  return (
    <form onSubmit={handleCrear} className="ce-form-grid">
      <h3 className="ce-form-section-title">Datos de la Impresora</h3>

      {/* Nombre Inventario */}
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
        Marca<span style={{ color: "var(--color-primary)" }}> *</span>
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

      {/* Select TipoEquipo (sólo “IMPRESORA”) */}
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
        {impresoraTipos.map((t) => (
          <option key={t.TipoEquipoID} value={t.TipoEquipoID}>
            {t.NombreTipo}
          </option>
        ))}
      </select>
      {errors.TipoEquipoID && (
        <small className="ce-error-message">{errors.TipoEquipoID}</small>
      )}

      {/* Modelo */}
      <label>
        Modelo<span style={{ color: "var(--color-primary)" }}> *</span>
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

      {/* Serie */}
      <label>
        Serie<span style={{ color: "var(--color-primary)" }}> *</span>
      </label>
      <input name="Serie" value={form.Serie} onChange={handleChange} required />
      {errors.Serie && (
        <small className="ce-error-message">{errors.Serie}</small>
      )}

      {/* Sistema Operativo */}
      <label>
        Sistema Operativo
        <span style={{ color: "var(--color-primary)" }}> *</span>
      </label>
      <input
        name="SistemaOperativo"
        value={form.SistemaOperativo}
        onChange={handleChange}
        required
      />
      {errors.SistemaOperativo && (
        <small className="ce-error-message">{errors.SistemaOperativo}</small>
      )}

      {/* Tipo Conexión */}
      <label>
        Tipo Conexión<span style={{ color: "var(--color-primary)" }}> *</span>
      </label>
      <input
        name="TipoConexion"
        value={form.TipoConexion}
        onChange={handleChange}
        required
      />
      {errors.TipoConexion && (
        <small className="ce-error-message">{errors.TipoConexion}</small>
      )}

      {/* Dirección IP */}
      <label>
        Dirección IP<span style={{ color: "var(--color-primary)" }}> *</span>
      </label>
      <input
        name="DireccionIP"
        value={form.DireccionIP}
        onChange={handleChange}
        required
      />
      {errors.DireccionIP && (
        <small className="ce-error-message">{errors.DireccionIP}</small>
      )}

      {/* Fecha Llegada */}
      <label>Fecha Llegada</label>
      <input
        type="date"
        name="FechaLlegada"
        value={form.FechaLlegada}
        onChange={handleChange}
      />

      {/* Fecha Instalación */}
      <label>Fecha Instalación</label>
      <input
        type="date"
        name="FechaInstalacion"
        value={form.FechaInstalacion}
        onChange={handleChange}
      />

      {/* Fecha Novedad */}
      <label>Fecha Novedad</label>
      <input
        type="date"
        name="FechaNovedad"
        value={form.FechaNovedad}
        onChange={handleChange}
      />

      {/* Autocomplete Usuario (Ficha) */}
      <label>
        Ficha (Usuario)<span style={{ color: "var(--color-primary)" }}> *</span>
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={userSearch}
          onChange={(e) => {
            setUserSearch(e.target.value);
            setShowUserOptions(true);
            setForm((f) => ({ ...f, UsuarioID: null }));
            setErrors((errs) => {
              const { UsuarioID, ...rest } = errs;
              return rest;
            });
          }}
          required
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
        Dependencia<span style={{ color: "var(--color-primary)" }}> *</span>
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Buscar dependencia..."
          value={depSearch}
          onChange={(e) => {
            setDepSearch(e.target.value);
            setShowDepOptions(true);
            setForm((f) => ({ ...f, DependenciaID: null }));
            setErrors((errs) => {
              const { DependenciaID, ...rest } = errs;
              return rest;
            });
          }}
          required
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

      {/* Ubicación */}
      <label>
        Ubicación<span style={{ color: "var(--color-primary)" }}> *</span>
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
        Estado<span style={{ color: "var(--color-primary)" }}> *</span>
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Buscar estado..."
          value={estadoSearch}
          onChange={(e) => {
            setEstadoSearch(e.target.value);
            setShowEstadoOptions(true);
            setForm((f) => ({ ...f, EstadoID: null }));
            setErrors((errs) => {
              const { EstadoID, ...rest } = errs;
              return rest;
            });
          }}
          required
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

      {/* Contrato */}
      <label>
        Contrato<span style={{ color: "var(--color-primary)" }}> *</span>
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

      {/* Costo Mensual */}
      <label>Costo Mensual</label>
      <input
        type="text"
        name="CostoMes"
        value={formatPeso(form.CostoMes)}
        onChange={handleCostoMesChange}
      />

      {/* Responsable */}
      <label>
        Responsable<span style={{ color: "var(--color-primary)" }}> *</span>
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

      {/* Observación */}
      <label>Observación</label>
      <textarea
        name="Observacion"
        value={form.Observacion}
        onChange={handleChange}
      />

      <button type="submit" className="ce-submit-button">
        <FaPrint style={{ marginRight: 6 }} />
        Crear Impresora
      </button>
    </form>
  );
}

// === Actualizar Impresora ===

function ActualizarImpresora() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Lookups
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);

  // Autocomplete states
  const [marcaSearch, setMarcaSearch] = useState("");
  const [showMarcaOptions, setShowMarcaOptions] = useState(false);
  const [estadoSearch, setEstadoSearch] = useState("");
  const [showEstadoOptions, setShowEstadoOptions] = useState(false);
  const [depSearch, setDepSearch] = useState("");
  const [showDepOptions, setShowDepOptions] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [showUserOptions, setShowUserOptions] = useState(false);

  // Funciones de formateo/parsing
  const formatPeso = (amt) => {
    if (amt == null) return "";
    return "$" + Number(amt).toLocaleString("es-CO");
  };
  const parsePeso = (str) => {
    const digits = str.replace(/[^0-9]/g, "");
    return digits === "" ? null : Number(digits);
  };
  const handleCostoMesChange = (e) => {
    setForm((f) => ({ ...f, CostoMes: parsePeso(e.target.value) }));
  };

  // Filtrado para autocompletes
  const filteredMarcas = useMemo(() => {
    const txt = marcaSearch.toLowerCase();
    return marcas.filter((m) => m.NombreMarca.toLowerCase().includes(txt));
  }, [marcaSearch, marcas]);

  const filteredEstados = useMemo(() => {
    const txt = estadoSearch.toLowerCase();
    return estados.filter((es) => es.EstadoEquipo.toLowerCase().includes(txt));
  }, [estadoSearch, estados]);

  const filteredDeps = useMemo(() => {
    const txt = depSearch.toLowerCase();
    return dependencias.filter((d) =>
      d.NombreDependencia.toLowerCase().includes(txt)
    );
  }, [depSearch, dependencias]);

  const filteredUsers = useMemo(() => {
    const txt = userSearch.toLowerCase();
    return trabajadores.filter((u) =>
      `${u.NombreCompleto} (${u.Ficha})`.toLowerCase().includes(txt)
    );
  }, [userSearch, trabajadores]);

  // Filtrar solo el tipo “IMPRESORA” (para cuando tipos ya esté cargado)
  const impresoraTipos = useMemo(() => {
    return tipos.filter((t) => t.NombreTipo.toLowerCase() === "impresora");
  }, [tipos]);

  // 1) useEffect inicial: solo cargamos las “listas” (marcas, tipos, estados, dependencias, trabajadores)
  useEffect(() => {
    fetchListas();
  }, []);

  // 2) useEffect que vigila `tipos`. Apenas tenemos datos en `tipos`, llamamos a fetchImpresoras()
  useEffect(() => {
    if (tipos.length > 0) {
      fetchImpresoras();
    }
  }, [tipos]);

  // 3) Cada vez que cambian items o searchQuery, actualizamos filteredItems
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter(
          (imp) =>
            (imp.NombreInventario &&
              imp.NombreInventario.toLowerCase().includes(q)) ||
            (imp.Serie && imp.Serie.toLowerCase().includes(q)) ||
            (imp.Responsable && imp.Responsable.toLowerCase().includes(q))
        )
      );
    }
  }, [searchQuery, items]);

  // Función para obtener impresoras (ahora sí, sabiendo que `impresoraTipos` ya tiene datos)
  async function fetchImpresoras() {
    setLoading(true);
    try {
      const res = await getEquiposCM();

      // Filtramos solo los que coincidan con “IMPRESORA”
      const tipoIds = impresoraTipos.map((t) => t.TipoEquipoID);
      const filtrados = res.data.filter((imp) =>
        tipoIds.includes(imp.TipoEquipoID)
      );

      setItems(filtrados);
      setFilteredItems(filtrados);
    } catch (err) {
      setError("Error al cargar impresoras: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Función para cargar todas las “listas” de lookup (marcas, tipos, etc.)
  async function fetchListas() {
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
      setError("Error al cargar listas: " + err.message);
    }
  }

  function startEdit(imp) {
    setSelected(imp.EquipoID);

    // Poblamos el form con el objeto, transformando fechas a yyyy-MM-dd
    setForm({
      ...imp,
      FechaLlegada: imp.FechaLlegada?.split("T")[0] || "",
      FechaInstalacion: imp.FechaInstalacion?.split("T")[0] || "",
      FechaNovedad: imp.FechaNovedad?.split("T")[0] || "",
    });

    // Poner texto inicial en autocompletes
    const sm = marcas.find((m) => m.MarcaID === imp.MarcaID);
    const se = estados.find((es) => es.EstadoID === imp.EstadoID);
    const sd = dependencias.find((d) => d.DependenciaID === imp.DependenciaID);
    const su = trabajadores.find((u) => u.UsuarioID === imp.UsuarioID);
    setMarcaSearch(sm ? sm.NombreMarca : "");
    setEstadoSearch(se ? se.EstadoEquipo : "");
    setDepSearch(sd ? sd.NombreDependencia : "");
    setUserSearch(su ? `${su.NombreCompleto} (${su.Ficha})` : "");

    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "MarcaID",
      "TipoEquipoID",
      "EstadoID",
      "UsuarioID",
      "DependenciaID",
    ];
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

    const payload = {
      ...form,
      FechaLlegada: form.FechaLlegada || null,
      FechaInstalacion: form.FechaInstalacion || null,
      FechaNovedad: form.FechaNovedad || null,
    };

    try {
      await updateEquipoCM(selected, payload);
      toast.success("✅ Impresora actualizada exitosamente");
      setItems((prev) =>
        prev.map((imp) =>
          imp.EquipoID === selected ? { ...imp, ...payload } : imp
        )
      );
      setFilteredItems((prev) =>
        prev.map((imp) =>
          imp.EquipoID === selected ? { ...imp, ...payload } : imp
        )
      );
      setSelected(null);
      setForm({});
    } catch (err) {
      toast.error("❌ " + (err.message || "Error al actualizar impresora"));
    }
  };

  const handleCancel = () => {
    setSelected(null);
    setForm({});
    setError(null);
  };

  return (
    <section className="impresora-section">
      <h2>Actualizar Impresora</h2>
      {error && <div className="ci-error-message">{error}</div>}

      {/* Formulario de edición */}
      {selected && (
        <div className="edit-form-container">
          <form onSubmit={handleActualizar} className="form-grid">
            <h3 className="form-section-title">
              Editar Impresora #{form.EquipoID}
            </h3>

            {/* Nombre Inventario */}
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
              Marca<span style={{ color: "var(--color-primary)" }}> *</span>
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
                    const match = marcas.find(
                      (m) => m.NombreMarca === marcaSearch
                    );
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

            {/* Select TipoEquipo (sólo “IMPRESORA”) */}
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
              {impresoraTipos.map((t) => (
                <option key={t.TipoEquipoID} value={t.TipoEquipoID}>
                  {t.NombreTipo}
                </option>
              ))}
            </select>
            {errors.TipoEquipoID && (
              <small className="ce-error-message">{errors.TipoEquipoID}</small>
            )}

            {/* Modelo */}
            <label>
              Modelo<span style={{ color: "var(--color-primary)" }}> *</span>
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

            {/* Serie */}
            <label>
              Serie<span style={{ color: "var(--color-primary)" }}> *</span>
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

            {/* Sistema Operativo */}
            <label>
              Sistema Operativo
              <span style={{ color: "var(--color-primary)" }}> *</span>
            </label>
            <input
              name="SistemaOperativo"
              value={form.SistemaOperativo}
              onChange={handleChange}
              required
            />
            {errors.SistemaOperativo && (
              <small className="ce-error-message">
                {errors.SistemaOperativo}
              </small>
            )}

            {/* Tipo Conexión */}
            <label>
              Tipo Conexión
              <span style={{ color: "var(--color-primary)" }}> *</span>
            </label>
            <input
              name="TipoConexion"
              value={form.TipoConexion}
              onChange={handleChange}
              required
            />
            {errors.TipoConexion && (
              <small className="ce-error-message">{errors.TipoConexion}</small>
            )}

            {/* Dirección IP */}
            <label>
              Dirección IP
              <span style={{ color: "var(--color-primary)" }}> *</span>
            </label>
            <input
              name="DireccionIP"
              value={form.DireccionIP}
              onChange={handleChange}
              required
            />
            {errors.DireccionIP && (
              <small className="ce-error-message">{errors.DireccionIP}</small>
            )}

            {/* Fecha Llegada */}
            <label>Fecha Llegada</label>
            <input
              type="date"
              name="FechaLlegada"
              value={form.FechaLlegada}
              onChange={handleChange}
            />

            {/* Fecha Instalación */}
            <label>Fecha Instalación</label>
            <input
              type="date"
              name="FechaInstalacion"
              value={form.FechaInstalacion}
              onChange={handleChange}
            />

            {/* Fecha Novedad */}
            <label>Fecha Novedad</label>
            <input
              type="date"
              name="FechaNovedad"
              value={form.FechaNovedad}
              onChange={handleChange}
            />

            {/* Autocomplete Usuario (Ficha) */}
            <label>
              Ficha (Usuario)
              <span style={{ color: "var(--color-primary)" }}> *</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setShowUserOptions(true);
                  setForm((f) => ({ ...f, UsuarioID: null }));
                  setErrors((errs) => {
                    const { UsuarioID, ...rest } = errs;
                    return rest;
                  });
                }}
                required
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
              Dependencia
              <span style={{ color: "var(--color-primary)" }}> *</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Buscar dependencia..."
                value={depSearch}
                onChange={(e) => {
                  setDepSearch(e.target.value);
                  setShowDepOptions(true);
                  setForm((f) => ({ ...f, DependenciaID: null }));
                  setErrors((errs) => {
                    const { DependenciaID, ...rest } = errs;
                    return rest;
                  });
                }}
                required
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
                <small className="ce-error-message">
                  {errors.DependenciaID}
                </small>
              )}
            </div>

            {/* Ubicación */}
            <label>
              Ubicación<span style={{ color: "var(--color-primary)" }}> *</span>
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
              Estado<span style={{ color: "var(--color-primary)" }}> *</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Buscar estado..."
                value={estadoSearch}
                onChange={(e) => {
                  setEstadoSearch(e.target.value);
                  setShowEstadoOptions(true);
                  setForm((f) => ({ ...f, EstadoID: null }));
                  setErrors((errs) => {
                    const { EstadoID, ...rest } = errs;
                    return rest;
                  });
                }}
                required
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

            {/* Contrato */}
            <label>
              Contrato<span style={{ color: "var(--color-primary)" }}> *</span>
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

            {/* Costo Mensual */}
            <label>Costo Mensual</label>
            <input
              type="text"
              name="CostoMes"
              value={formatPeso(form.CostoMes)}
              onChange={handleCostoMesChange}
            />

            {/* Responsable */}
            <label>
              Responsable
              <span style={{ color: "var(--color-primary)" }}> *</span>
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

            {/* Observación */}
            <label>Observación</label>
            <textarea
              name="Observacion"
              value={form.Observacion}
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
          placeholder="Buscar por Nombre, Serie o Responsable..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla de impresoras */}
      <div className="table-container">
        {loading ? (
          <p className="loading-message">Cargando impresoras...</p>
        ) : filteredItems.length === 0 ? (
          <p className="no-results">
            No se encontraron impresoras que coincidan con la búsqueda
          </p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Serie</th>
                  <th>Responsable</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((imp) => (
                  <tr key={imp.EquipoID}>
                    <td data-label="Nombre">{imp.NombreInventario}</td>
                    <td data-label="Serie">{imp.Serie}</td>
                    <td data-label="Responsable">{imp.Responsable || "-"}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => startEdit(imp)}
                        className="btn-edit"
                      >
                        <FaEdit style={{ marginRight: 4 }} />
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(imp.EquipoID)}
                        className="btn-delete"
                      >
                        <FaTrash style={{ marginRight: 4 }} />
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

function EliminarImpresora() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) Al montar, cargar todos los equipos y tipos, luego filtrar solo “IMPRESORA”
  useEffect(() => {
    fetchImpresoras();
  }, []);

  // 2) Cada vez que cambie el término de búsqueda o la lista de items, actualizar filteredItems
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = items.filter(
        (imp) =>
          (imp.NombreInventario &&
            imp.NombreInventario.toLowerCase().includes(q)) ||
          (imp.Serie && imp.Serie.toLowerCase().includes(q)) ||
          (imp.Responsable && imp.Responsable.toLowerCase().includes(q))
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  async function fetchImpresoras() {
    setLoading(true);
    try {
      // Usar helpers de la API para obtener equipos y tipos
      const res = await getEquiposCM();
      const tiposRes = await getTipoEquipos();
      const impresoraTipoIds = tiposRes.data
        .filter((t) => t.NombreTipo.toLowerCase() === "impresora")
        .map((t) => t.TipoEquipoID);

      const filtrados = res.data.filter((imp) =>
        impresoraTipoIds.includes(imp.TipoEquipoID)
      );
      setItems(filtrados);
      setFilteredItems(filtrados);
    } catch (err) {
      setError("Error al cargar impresoras: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "¿Deseas eliminar esta impresora? Esta acción no se puede deshacer."
      )
    )
      return;
    setError(null);
    try {
      await deleteEquipoCM(id);
      setItems((prev) => prev.filter((imp) => imp.EquipoID !== id));
      setFilteredItems((prev) => prev.filter((imp) => imp.EquipoID !== id));
      toast.success("🗑️ Impresora eliminada exitosamente");
    } catch (err) {
      toast.error("❌ " + (err.message || "Error al eliminar impresora"));
    }
  };

  return (
    <section className="impresora-section">
      <h2>Eliminar Impresora</h2>
      {error && <div className="ce-error-message">{error}</div>}

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por Nombre, Serie o Responsable..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla de impresoras */}
      <div className="table-container">
        {loading ? (
          <p className="loading-message">Cargando impresoras...</p>
        ) : filteredItems.length === 0 ? (
          <p className="no-results">
            No se encontraron impresoras que coincidan con la búsqueda
          </p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Serie</th>
                  <th>Responsable</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((imp) => (
                  <tr key={imp.EquipoID}>
                    <td data-label="Nombre">{imp.NombreInventario}</td>
                    <td data-label="Serie">{imp.Serie}</td>
                    <td data-label="Responsable">{imp.Responsable || "-"}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => handleDelete(imp.EquipoID)}
                        className="btn-delete"
                      >
                        <FaTrash style={{ marginRight: 4 }} />
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
