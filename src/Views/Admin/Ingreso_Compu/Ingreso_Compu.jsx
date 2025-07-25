import React, { useState, useEffect, useMemo, useContext } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "../../../Components/Header";
import Navbar from "../../../Components/Navbar";
import ConsultarEquipo from "../../Visitor/Control_Compu/Control_Compu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConsultarServidores from "../../Visitor/Control_Servidores/Control_Servidores";
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
import "./Ingreso_Compu.css";
import "./CrearEquipo.css";
import DataTableAdmin from "../DataTableAdmin";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
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
} from "react-icons/fa";

/**
 * Componente principal para la gestión de equipos de cómputo.
 * Renderiza el layout, navegación y rutas para crear, actualizar, eliminar y consultar equipos.
 * @param {object} props
 * @param {object} props.usuario - Información del usuario autenticado
 */
export default function Ingreso_Compu({ usuario }) {
  const [navVisible, setNavVisible] = useState(true);
  const navigate = useNavigate();

  /**
   * Secciones de navegación lateral con iconos y rutas.
   * @type {Array}
   */
  const IngresoCMSections = [
    {
      title: "Equipos",
      links: [
        {
          text: "Crear Equipo",
          href: "/Home/Ingreso-Computadoras/Crear-Equipo",
          icon: <FaPlus style={{ marginRight: 6 }} />,
        },
        {
          text: "Actualizar Equipo",
          href: "/Home/Ingreso-Computadoras/Actualizar-Equipo",
          icon: <FaEdit style={{ marginRight: 6 }} />,
        },
        {
          text: "Eliminar Equipo",
          href: "/Home/Ingreso-Computadoras/Eliminar-Equipo",
          icon: <FaTrash style={{ marginRight: 6 }} />,
        },
        {
          text: "Consultar Equipo",
          href: "/Home/Control-Computadoras/consultar",
          icon: <FaSearch style={{ marginRight: 6 }} />,
        },
        {
          text: "Consultar Servidores",
          href: "/Home/Control-Servidores/consultar",
          icon: <FaServer style={{ marginRight: 6 }} />,
        },
      ],
    },
  ];

  return (
    <div className="app-layout">
      {/* Header superior */}
      <Header titulo="Gestión de Equipos" usuario={usuario} />
      <div className="layout-body">
        {/* Barra lateral de navegación */}
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home"
          sections={IngresoCMSections}
          onToggle={setNavVisible}
        />
        {/* Contenido principal con rutas */}
        <main
          className={`layout-content ingreso-compu-main ${
            !navVisible ? "navbar-hidden" : ""
          }`}
        >
          <Routes>
            {/* Ruta para crear equipo */}
            <Route
              path="Crear-Equipo"
              element={
                <>
                  <h2>
                    <FaPlus style={{ marginRight: 8, color: "#D81C23" }} />
                    Crear Equipo
                  </h2>
                  <CrearEquipo />
                </>
              }
            />
            {/* Ruta para actualizar equipo */}
            <Route
              path="Actualizar-Equipo"
              element={
                <>
                  <h2>
                    <FaEdit style={{ marginRight: 8, color: "#D81C23" }} />
                    Actualizar Equipo
                  </h2>
                  <ActualizarEquipo />
                </>
              }
            />
            {/* Ruta para eliminar equipo */}
            <Route
              path="Eliminar-Equipo"
              element={
                <>
                  <h2>
                    <FaTrash style={{ marginRight: 8, color: "#D81C23" }} />
                    Eliminar Equipo
                  </h2>
                  <EliminarEquipo />
                </>
              }
            />
            {/* Ruta para consultar equipos */}
            <Route
              path="Control-Computadoras"
              element={
                <>
                  <h2>
                    <FaSearch style={{ marginRight: 8, color: "#D81C23" }} />
                    Consultar Equipo
                  </h2>
                  <ConsultarEquipo />
                </>
              }
            />
            {/* Ruta para consultar servidores */}
            <Route
              path="Consultar-Servidores"
              element={
                <>
                  <h2>
                    <FaServer style={{ marginRight: 8, color: "#D81C23" }} />
                    Consultar Servidores
                  </h2>
                  <ConsultarServidores />
                </>
              }
            />
            {/* Pantalla de bienvenida por defecto */}
            <Route
              index
              element={
                <div className="welcome-container">
                  <div className="welcome-card">
                    <h2>Gestión de Equipos de Cómputo</h2>
                    <p className="placeholder">
                      Selecciona una acción del menú lateral o usa las opciones
                      rápidas:
                    </p>
                    <div className="welcome-options">
                      <div
                        className="option-card"
                        onClick={() => navigate("Crear-Equipo")}
                      >
                        <FaPlus className="option-icon" />
                        <span>Crear</span>
                      </div>
                      <div
                        className="option-card"
                        onClick={() => navigate("Actualizar-Equipo")}
                      >
                        <FaEdit className="option-icon" />
                        <span>Actualizar</span>
                      </div>
                      <div
                        className="option-card"
                        onClick={() => navigate("Eliminar-Equipo")}
                      >
                        <FaTrash className="option-icon" />
                        <span>Eliminar</span>
                      </div>
                      <div
                        className="option-card"
                        onClick={() =>
                          navigate("/Home/Control-Computadoras/consultar")
                        }
                      >
                        <FaSearch className="option-icon" />
                        <span>Consultar</span>
                      </div>
                      <div
                        className="option-card"
                        onClick={() =>
                          navigate("/Home/Control-Servidores/consultar")
                        }
                      >
                        <FaServer className="option-icon" />
                        <span>Servidores</span>
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

/**
 * Componente para crear un nuevo equipo de cómputo.
 * Incluye autocompletados para usuario, dependencia, marca y estado.
 */
function CrearEquipo() {
  // Estado del formulario
  const [form, setForm] = useState({
    NombreInventario: "",
    MarcaID: "",
    TipoEquipoID: "",
    Modelo: "",
    Serie: "",
    SistemaOperativo: "",
    DiscoDuro: "",
    Memoria: "",
    Procesador: "",
    FechaLlegada: "",
    FechaInstalacion: "",
    FechaNovedad: "",
    Responsable: "",
    Observacion: "",
    EstadoID: "",
    UsuarioID: "",
    DependenciaID: "",
    Ubicacion: "",
    Contrato: "",
    CostoMes: "",
    ValorSeguro: "",
    CostoLicAbsolute: "",
    SerialPantalla: "",
    SerialTeclado: "",
    SerialMouse: "",
    Capacidad: "",
    TipoConexion: "",
    DireccionIP: "",
    AgenteEDR: "",
    AgenteVPN: "",
    AgenteFortiToken: "",
    AgenteSCCM: "",
  });

  // Listas para selects y autocompletados
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [errors, setErrors] = useState({});

  // Estados para autocompletados
  const [marcaSearch, setMarcaSearch] = useState("");
  const [showMarcaOptions, setShowMarcaOptions] = useState(false);
  const [estadoSearch, setEstadoSearch] = useState("");
  const [showEstadoOptions, setShowEstadoOptions] = useState(false);
  const [depSearch, setDepSearch] = useState("");
  const [showDepOptions, setShowDepOptions] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [showUserOptions, setShowUserOptions] = useState(false);

  // Campos obligatorios para validación
  const requiredFields = [
    "NombreInventario",
    "MarcaID",
    "TipoEquipoID",
    "Modelo",
    "Serie",
    "SistemaOperativo",
    "Procesador",
    "Responsable",
    "EstadoID",
    "UsuarioID",
    "DependenciaID",
    "Ubicacion",
    "Contrato",
    "AgenteEDR",
    "AgenteVPN",
    "AgenteFortiToken",
    "AgenteSCCM",
  ];

  // Helpers para campos de moneda
  const formatPeso = (amt) => {
    if (amt == null) return "";
    return "$" + Number(amt).toLocaleString("es-CO");
  };
  const parsePeso = (str) => {
    const digits = str.replace(/[^0-9]/g, "");
    return digits === "" ? null : Number(digits);
  };

  // Manejadores para campos de moneda
  const handleCostoMesChange = (e) => {
    setForm((f) => ({ ...f, CostoMes: parsePeso(e.target.value) }));
  };
  const handleValorSeguroChange = (e) => {
    setForm((f) => ({ ...f, ValorSeguro: parsePeso(e.target.value) }));
  };
  const handleCostoLicChange = (e) => {
    setForm((f) => ({ ...f, CostoLicAbsolute: parsePeso(e.target.value) }));
  };

  // Cargar listas de opciones al montar
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

  // Filtrados para autocompletados
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

  // Manejador de cambios generales
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  /**
   * Envía el formulario para crear un nuevo equipo.
   * Realiza validación de campos obligatorios y muestra errores si faltan.
   */
  const handleCrear = async (e) => {
    e.preventDefault();
    setErrors({});
    const errorsLocal = {};
    requiredFields.forEach((f) => {
      if (!form[f]) errorsLocal[f] = "Este campo es obligatorio";
    });

    if (Object.keys(errorsLocal).length > 0) {
      setErrors(errorsLocal);

      // Mostrar todos los errores en un solo toast
      const campos = Object.keys(errorsLocal)
        .map((campo) => {
          // Puedes personalizar los nombres de los campos si lo deseas
          switch (campo) {
            case "NombreInventario":
              return "Nombre Inventario";
            case "MarcaID":
              return "Marca";
            case "TipoEquipoID":
              return "Tipo Equipo";
            case "Modelo":
              return "Modelo";
            case "Serie":
              return "Serie";
            case "SistemaOperativo":
              return "Sistema Operativo";
            case "Procesador":
              return "Procesador";
            case "Responsable":
              return "Responsable";
            case "EstadoID":
              return "Estado";
            case "UsuarioID":
              return "Usuario";
            case "DependenciaID":
              return "Dependencia";
            case "Ubicacion":
              return "Ubicación";
            case "Contrato":
              return "Contrato";
            case "AgenteEDR":
              return "Agente EDR";
            case "AgenteVPN":
              return "Agente VPN";
            case "AgenteFortiToken":
              return "Agente FortiToken";
            case "AgenteSCCM":
              return "Agente SCCM";
            default:
              return campo;
          }
        })
        .join(", ");
      toast.error(`Completa los siguientes campos obligatorios: ${campos}`);
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
      toast.success("Equipo creado exitosamente");
      // Limpia el formulario
      setForm({
        NombreInventario: "",
        MarcaID: "",
        TipoEquipoID: "",
        Modelo: "",
        Serie: "",
        SistemaOperativo: "",
        DiscoDuro: "",
        Memoria: "",
        Procesador: "",
        FechaLlegada: "",
        FechaInstalacion: "",
        FechaNovedad: "",
        Responsable: "",
        Observacion: "",
        EstadoID: "",
        UsuarioID: "",
        DependenciaID: "",
        Ubicacion: "",
        Contrato: "",
        CostoMes: "",
        ValorSeguro: "",
        CostoLicAbsolute: "",
        SerialPantalla: "",
        SerialTeclado: "",
        SerialMouse: "",
        Capacidad: "",
        TipoConexion: "",
        DireccionIP: "",
        AgenteEDR: "",
        AgenteVPN: "",
        AgenteFortiToken: "",
        AgenteSCCM: "",
      });
    } catch (err) {
      toast.error(err.message || "Error al crear equipo");
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

      <label>
        Serie <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <input name="Serie" value={form.Serie} onChange={handleChange} required />
      {errors.Serie && (
        <small className="ce-error-message">{errors.Serie}</small>
      )}

      {/* Autocomplete Usuario */}
      <label>
        <FaUser style={{ marginRight: 4 }} />
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

      {/* Autocomplete TipoEquipo */}
      <label>
        Tipo Equipo <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <select
        name="TipoEquipoID"
        value={form.TipoEquipoID}
        onChange={handleChange}
        required
        className="ce-autocomplete-input"
      >
        <option value="">Seleccione tipo</option>
        {tipos
          .filter((t) =>
            ["portatil", "escritorio", "workstation", "servidor"].includes(
              t.NombreTipo.toLowerCase()
            )
          )
          .map((t) => (
            <option key={t.TipoEquipoID} value={t.TipoEquipoID}>
              {t.NombreTipo}
            </option>
          ))}
        {errors.TipoEquipoID && (
          <small className="ce-error-message">{errors.TipoEquipoID}</small>
        )}
      </select>

      <label>
        <FaLaptop style={{ marginRight: 4 }} />
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

      <label>
        Sistema Operativo{" "}
        <span style={{ color: "var(--color-primary)" }}>*</span>
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

      <label>Disco Duro</label>
      <input name="DiscoDuro" value={form.DiscoDuro} onChange={handleChange} />

      <label>Memoria</label>
      <input name="Memoria" value={form.Memoria} onChange={handleChange} />

      <label>
        Procesador <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <input
        name="Procesador"
        value={form.Procesador}
        onChange={handleChange}
        required
      />
      {errors.Procesador && (
        <small className="ce-error-message">{errors.Procesador}</small>
      )}

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

      <label>Dirección IP</label>
      <input
        name="DireccionIP"
        value={form.DireccionIP}
        onChange={handleChange}
      />

      <label>Serial Pantalla</label>
      <input
        name="SerialPantalla"
        value={form.SerialPantalla}
        onChange={handleChange}
      />

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
        Agente EDR <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <input
        name="AgenteEDR"
        value={form.AgenteEDR}
        onChange={handleChange}
        required
      />
      {errors.AgenteEDR && (
        <small className="ce-error-message">{errors.AgenteEDR}</small>
      )}

      <label>
        Agente VPN <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <input
        name="AgenteVPN"
        value={form.AgenteVPN}
        onChange={handleChange}
        required
      />
      {errors.AgenteVPN && (
        <small className="ce-error-message">{errors.AgenteVPN}</small>
      )}

      <label>
        Agente FortiToken{" "}
        <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <input
        name="AgenteFortiToken"
        value={form.AgenteFortiToken}
        onChange={handleChange}
        required
      />
      {errors.AgenteFortiToken && (
        <small className="ce-error-message">{errors.AgenteFortiToken}</small>
      )}

      <label>
        Agente SCCM <span style={{ color: "var(--color-primary)" }}>*</span>
      </label>
      <input
        name="AgenteSCCM"
        value={form.AgenteSCCM}
        onChange={handleChange}
        required
      />
      {errors.AgenteSCCM && (
        <small className="ce-error-message">{errors.AgenteSCCM}</small>
      )}

      <label>Costo Mensual</label>
      <input
        type="text"
        name="CostoMes"
        value={formatPeso(form.CostoMes)}
        onChange={handleCostoMesChange}
      />

      <label>Valor Seguro</label>
      <input
        type="text"
        name="ValorSeguro"
        value={formatPeso(form.ValorSeguro)}
        onChange={handleValorSeguroChange}
      />

      <label>Costo Licencia Absolute</label>
      <input
        type="text"
        name="CostoLicAbsolute"
        value={formatPeso(form.CostoLicAbsolute)}
        onChange={handleCostoLicChange}
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

      {/* Autocomplete Dependencia */}
      <label>
        <FaBuilding style={{ marginRight: 4 }} />
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

      <label>Serial Teclado</label>
      <input
        name="SerialTeclado"
        value={form.SerialTeclado}
        onChange={handleChange}
      />

      <label>Serial Mouse</label>
      <input
        name="SerialMouse"
        value={form.SerialMouse}
        onChange={handleChange}
      />

      <label>Capacidad</label>
      <input name="Capacidad" value={form.Capacidad} onChange={handleChange} />

      <label>Tipo Conexión</label>
      <input
        name="TipoConexion"
        value={form.TipoConexion}
        onChange={handleChange}
      />

      <button type="submit" className="ce-submit-button">
        <FaPlus style={{ marginRight: 6 }} />
        Crear Equipo
      </button>
    </form>
  );
}

/**
 * Componente para actualizar equipos de cómputo.
 * Permite editar en línea los datos de los equipos y guardar cambios.
 */
function ActualizarEquipo() {
  // Estados principales
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState(null);
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Estados para autocompletados
  const [marcaSearch, setMarcaSearch] = useState("");
  const [showMarcaOptions, setShowMarcaOptions] = useState(false);
  const [estadoSearch, setEstadoSearch] = useState("");
  const [showEstadoOptions, setShowEstadoOptions] = useState(false);
  const [depSearch, setDepSearch] = useState("");
  const [showDepOptions, setShowDepOptions] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [showUserOptions, setShowUserOptions] = useState(false);

  // Helpers de moneda
  const formatPeso = (amt) =>
    amt == null ? "" : "$" + Number(amt).toLocaleString("es-CO");
  const parsePeso = (str) => {
    const digits = str.replace(/[^0-9]/g, "");
    return digits === "" ? null : Number(digits);
  };

  const tiposPermitidos = useMemo(
    () =>
      tipos.filter((t) =>
        ["portatil", "escritorio", "workstation", "servidor"].includes(
          (t.NombreTipo || "").toLowerCase()
        )
      ),
    [tipos]
  );

  // Filtrados para autocompletados
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
    return dependencias.filter(
      (d) =>
        (d.NombreDependencia || "").toLowerCase().includes(txt) ||
        (d.Ccosto || d.DependenciaCcosto || "").toLowerCase().includes(txt)
    );
  }, [depSearch, dependencias]);
  const filteredUsers = useMemo(() => {
    const txt = userSearch.toLowerCase();
    return trabajadores.filter((u) =>
      `${u.NombreCompleto} (${u.Ficha})`.toLowerCase().includes(txt)
    );
  }, [userSearch, trabajadores]);

  // Carga inicial de equipos y listas
  useEffect(() => {
    fetchListas();
  }, []);

  useEffect(() => {
    if (tipos.length > 0) {
      fetchEquipos();
    }
  }, [tipos]);

  // Filtra los equipos según la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter(
          (eq) =>
            (eq.NombreInventario &&
              eq.NombreInventario.toLowerCase().includes(q)) ||
            (eq.Serie && eq.Serie.toLowerCase().includes(q)) ||
            (eq.Responsable && eq.Responsable.toLowerCase().includes(q)) ||
            (eq.DependenciaNombre &&
              eq.DependenciaNombre.toLowerCase().includes(q)) ||
            (eq.DependenciaCcosto &&
              eq.DependenciaCcosto.toLowerCase().includes(q)) ||
            (eq.Ccosto && eq.Ccosto.toLowerCase().includes(q))
        )
      );
    }
  }, [searchQuery, items]);

  /**
   * Obtiene todos los equipos de la API.
   */
  async function fetchEquipos() {
    setLoading(true);
    try {
      const res = await getEquiposCM();
      // Solo equipos de tipos permitidos
      const filtrados = res.data.filter((eq) =>
        tiposPermitidos.some((t) => t.TipoEquipoID === eq.TipoEquipoID)
      );
      setItems(filtrados);
      setFilteredItems(filtrados);
    } catch (err) {
      setError("Error al cargar equipos: " + err.message);
      toast.error("Error al cargar equipos");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Carga listas de marcas, tipos, estados, dependencias y trabajadores.
   */
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

  /**
   * Inicia la edición de una fila.
   * @param {object} eq - Equipo a editar
   */
  function handleEdit(eq) {
    setEditId(eq.EquipoID);
    setEditForm({
      ...eq,
      FechaLlegada: eq.FechaLlegada?.split("T")[0] || "",
      FechaInstalacion: eq.FechaInstalacion?.split("T")[0] || "",
      FechaNovedad: eq.FechaNovedad?.split("T")[0] || "",
    });
    setMarcaSearch(
      marcas.find((m) => m.MarcaID === eq.MarcaID)?.NombreMarca || ""
    );
    setEstadoSearch(
      estados.find((es) => es.EstadoID === eq.EstadoID)?.EstadoEquipo || ""
    );
    setDepSearch(
      dependencias.find((d) => d.DependenciaID === eq.DependenciaID)
        ? `${
            dependencias.find((d) => d.DependenciaID === eq.DependenciaID)
              .NombreDependencia
          } (${
            dependencias.find((d) => d.DependenciaID === eq.DependenciaID)
              .Ccosto ||
            dependencias.find((d) => d.DependenciaID === eq.DependenciaID)
              .DependenciaCcosto ||
            ""
          })`
        : ""
    );
    setUserSearch(
      (() => {
        const u = trabajadores.find((u) => u.UsuarioID === eq.UsuarioID);
        return u ? `${u.NombreCompleto} (${u.Ficha})` : "";
      })()
    );
    setError(null);
  }

  /**
   * Manejador de cambios en los inputs de edición.
   */
  function handleEditChange(e) {
    const { name, value } = e.target;
    const numericFields = [
      "MarcaID",
      "TipoEquipoID",
      "EstadoID",
      "UsuarioID",
      "DependenciaID",
    ];
    setEditForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? value === ""
          ? null
          : parseInt(value, 10)
        : value,
    }));
  }

  /**
   * Manejador para campos de moneda en edición.
   */
  function handleEditPesoChange(e) {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: parsePeso(e.target.value),
    }));
  }

  /**
   * Guarda los cambios de la fila editada.
   */
  async function handleSave() {
    try {
      const payload = {
        ...editForm,
        FechaLlegada: editForm.FechaLlegada || null,
        FechaInstalacion: editForm.FechaInstalacion || null,
        FechaNovedad: editForm.FechaNovedad || null,
      };
      setIsSaving(true);
      await updateEquipoCM(editId, payload);
      await fetchEquipos();
      setEditId(null);
      setEditForm({});
      toast.success("Equipo actualizado correctamente.");
    } catch (err) {
      toast.error("Error al actualizar equipo");
    } finally {
      setIsSaving(false);
    }
  }

  /**
   * Cancela la edición de la fila.
   */
  function handleCancel() {
    setEditId(null);
    setEditForm({});
    setError(null);
  }
  // Definición de columnas para DataTableAdmin (ver archivo original para detalle)
  const columns = [
    // 31. Acción
    {
      header: "Acción",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <>
            <button onClick={handleSave} disabled={isSaving}>
              <FaSave style={{ marginRight: 4 }} />
              Guardar
            </button>
            <button onClick={handleCancel}>
              <FaTimes style={{ marginRight: 4 }} />
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={() => handleEdit(item)}
            disabled={editId !== null && editId !== item.EquipoID}
          >
            <FaEdit style={{ marginRight: 4 }} />
            Editar
          </button>
        ),
    },
    // 1. Nombre Inventario
    {
      header: "Nombre Inventario",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="NombreInventario"
            value={editForm.NombreInventario || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.NombreInventario
        ),
    },
    // 2. Serie
    {
      header: "Serie",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="Serie"
            value={editForm.Serie || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.Serie
        ),
    },
    // 3. Usuario (Ficha)
    {
      header: "Usuario (Ficha)",
      accessor: (item) => {
        const isEditing = editId === item.EquipoID;
        return isEditing ? (
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                setShowUserOptions(true);
                setEditForm((f) => ({ ...f, UsuarioID: null }));
                setError(null);
              }}
              onFocus={() => setShowUserOptions(true)}
              onBlur={() => {
                setTimeout(() => {
                  setShowUserOptions(false);
                  const match = trabajadores.find(
                    (u) => `${u.NombreCompleto} (${u.Ficha})` === userSearch
                  );
                  if (!match) {
                    setEditForm((f) => ({ ...f, UsuarioID: null }));
                    setError("Selecciona un usuario válido");
                  } else {
                    setEditForm((f) => ({ ...f, UsuarioID: match.UsuarioID }));
                    setError(null);
                  }
                }, 150);
              }}
              className="ce-autocomplete-input"
            />
            {showUserOptions && (
              <ul className="ce-autocomplete-list">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <li
                      key={u.UsuarioID}
                      onMouseDown={() => {
                        setEditForm((f) => ({ ...f, UsuarioID: u.UsuarioID }));
                        setUserSearch(`${u.NombreCompleto} (${u.Ficha})`);
                        setError(null);
                        setShowUserOptions(false);
                      }}
                    >
                      {u.NombreCompleto} ({u.Ficha})
                    </li>
                  ))
                ) : (
                  <li className="no-results">No hay coincidencias</li>
                )}
              </ul>
            )}
            {error && <small className="ce-error-message">{error}</small>}
          </div>
        ) : item.UsuarioNombre ? (
          `${item.UsuarioNombre} (${item.UsuarioFicha})`
        ) : (
          "-"
        );
      },
    },
    // 4. Tipo de Cargo (NO editable)
    {
      header: "Tipo de Cargo",
      accessor: (item) => item.NombreCargo || "-",
    },
    // 5. Dependencia (Ccosto)
    {
      header: "Dependencia (Ccosto)",
      accessor: (item) => {
        const isEditing = editId === item.EquipoID;
        return isEditing ? (
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Buscar dependencia o ccosto..."
              value={depSearch}
              onChange={(e) => {
                setDepSearch(e.target.value);
                setShowDepOptions(true);
                setEditForm((f) => ({ ...f, DependenciaID: null }));
                setError(null);
              }}
              onFocus={() => setShowDepOptions(true)}
              onBlur={() => {
                setTimeout(() => {
                  setShowDepOptions(false);
                  const match = dependencias.find(
                    (d) =>
                      `${d.NombreDependencia} (${
                        d.Ccosto || d.DependenciaCcosto
                      })`.toLowerCase() === depSearch.toLowerCase()
                  );
                  if (!match) {
                    setEditForm((f) => ({ ...f, DependenciaID: null }));
                    setError("Selecciona una dependencia válida");
                  } else {
                    setEditForm((f) => ({
                      ...f,
                      DependenciaID: match.DependenciaID,
                    }));
                    setError(null);
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
                      setEditForm((f) => ({
                        ...f,
                        DependenciaID: d.DependenciaID,
                      }));
                      setDepSearch(
                        `${d.NombreDependencia} (${
                          d.Ccosto || d.DependenciaCcosto
                        })`
                      );
                      setError(null);
                      setShowDepOptions(false);
                    }}
                  >
                    {d.NombreDependencia} ({d.Ccosto || d.DependenciaCcosto})
                  </li>
                ))}
                {filteredDeps.length === 0 && (
                  <li className="no-results">No hay coincidencias</li>
                )}
              </ul>
            )}
            {error && <small className="ce-error-message">{error}</small>}
          </div>
        ) : item.DependenciaNombre ? (
          `${item.DependenciaNombre} (${
            item.DependenciaCcosto || item.Ccosto || ""
          })`
        ) : (
          "-"
        );
      },
    },
    // 6. Ubicación
    {
      header: "Ubicación",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="Ubicacion"
            value={editForm.Ubicacion || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.Ubicacion
        ),
    },
    // 7. Planta/Gerencia (NO editable)
    {
      header: "Planta/Gerencia",
      accessor: (item) => item.PlantaGerencia || "-",
    },
    // 8. Estado
    {
      header: "Estado",
      accessor: (item) => {
        const isEditing = editId === item.EquipoID;
        return isEditing ? (
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Buscar estado..."
              value={estadoSearch}
              onChange={(e) => {
                setEstadoSearch(e.target.value);
                setShowEstadoOptions(true);
                setEditForm((f) => ({ ...f, EstadoID: null }));
                setError(null);
              }}
              onFocus={() => setShowEstadoOptions(true)}
              onBlur={() => {
                setTimeout(() => {
                  setShowEstadoOptions(false);
                  const match = estados.find(
                    (es) =>
                      es.EstadoEquipo.toLowerCase() ===
                      estadoSearch.toLowerCase()
                  );
                  if (!match) {
                    setEditForm((f) => ({ ...f, EstadoID: null }));
                    setError("Selecciona un estado válido");
                  } else {
                    setEditForm((f) => ({ ...f, EstadoID: match.EstadoID }));
                    setError(null);
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
                      setEditForm((f) => ({ ...f, EstadoID: es.EstadoID }));
                      setEstadoSearch(es.EstadoEquipo);
                      setError(null);
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
            {error && <small className="ce-error-message">{error}</small>}
          </div>
        ) : (
          estados.find((es) => es.EstadoID === item.EstadoID)?.EstadoEquipo ||
            "-"
        );
      },
    },
    // 9. Tipo Equipo
    {
      header: "Tipo Equipo",
      accessor: (item) => {
        const isEditing = editId === item.EquipoID;
        return isEditing ? (
          <select
            name="TipoEquipoID"
            value={editForm.TipoEquipoID || ""}
            onChange={handleEditChange}
            className="ce-autocomplete-input"
          >
            <option value="">Seleccione tipo</option>
            {tiposPermitidos.map((t) => (
              <option key={t.TipoEquipoID} value={t.TipoEquipoID}>
                {t.NombreTipo}
              </option>
            ))}
          </select>
        ) : (
          tiposPermitidos.find((t) => t.TipoEquipoID === item.TipoEquipoID)
            ?.NombreTipo || "-"
        );
      },
    },
    // 10. Modelo
    {
      header: "Modelo",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="Modelo"
            value={editForm.Modelo || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.Modelo
        ),
    },
    // 11. Marca
    {
      header: "Marca",
      accessor: (item) => {
        const isEditing = editId === item.EquipoID;
        return isEditing ? (
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Buscar marca..."
              value={marcaSearch}
              onChange={(e) => {
                setMarcaSearch(e.target.value);
                setShowMarcaOptions(true);
                setEditForm((f) => ({ ...f, MarcaID: null }));
                setError(null);
              }}
              onFocus={() => setShowMarcaOptions(true)}
              onBlur={() => {
                setTimeout(() => {
                  setShowMarcaOptions(false);
                  const match = marcas.find(
                    (m) =>
                      m.NombreMarca.toLowerCase() === marcaSearch.toLowerCase()
                  );
                  if (!match) {
                    setEditForm((f) => ({ ...f, MarcaID: null }));
                    setError("Selecciona una marca válida");
                  } else {
                    setEditForm((f) => ({ ...f, MarcaID: match.MarcaID }));
                    setError(null);
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
                      setEditForm((f) => ({ ...f, MarcaID: m.MarcaID }));
                      setMarcaSearch(m.NombreMarca);
                      setError(null);
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
            {error && <small className="ce-error-message">{error}</small>}
          </div>
        ) : (
          marcas.find((m) => m.MarcaID === item.MarcaID)?.NombreMarca || "-"
        );
      },
    },
    // 12. SO
    {
      header: "SO",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="SistemaOperativo"
            value={editForm.SistemaOperativo || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.SistemaOperativo
        ),
    },
    // 13. Disco
    {
      header: "Disco",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="DiscoDuro"
            value={editForm.DiscoDuro || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.DiscoDuro
        ),
    },
    // 14. Memoria
    {
      header: "Memoria",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="Memoria"
            value={editForm.Memoria || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.Memoria
        ),
    },
    // 15. CPU
    {
      header: "CPU",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="Procesador"
            value={editForm.Procesador || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.Procesador
        ),
    },
    // 16. Contrato
    {
      header: "Contrato",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="Contrato"
            value={editForm.Contrato || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.Contrato
        ),
    },
    // 17. IP
    {
      header: "IP",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="DireccionIP"
            value={editForm.DireccionIP || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.DireccionIP
        ),
    },
    // 18. Serial Pantalla
    {
      header: "Serial Pantalla",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="SerialPantalla"
            value={editForm.SerialPantalla || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.SerialPantalla
        ),
    },
    // 19. Fecha Llegada
    {
      header: "Fecha Llegada",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            type="date"
            name="FechaLlegada"
            value={editForm.FechaLlegada || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.FechaLlegada?.split("T")[0] || ""
        ),
    },
    // 20. Fecha Instalación
    {
      header: "Fecha Instalación",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            type="date"
            name="FechaInstalacion"
            value={editForm.FechaInstalacion || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.FechaInstalacion?.split("T")[0] || ""
        ),
    },
    // 21. Fecha Novedad
    {
      header: "Fecha Novedad",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            type="date"
            name="FechaNovedad"
            value={editForm.FechaNovedad || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.FechaNovedad?.split("T")[0] || ""
        ),
    },
    // 22. EDR
    {
      header: "EDR",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="AgenteEDR"
            value={editForm.AgenteEDR || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.AgenteEDR
        ),
    },
    // 23. VPN
    {
      header: "VPN",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="AgenteVPN"
            value={editForm.AgenteVPN || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.AgenteVPN
        ),
    },
    // 24. FortiToken
    {
      header: "FortiToken",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="AgenteFortiToken"
            value={editForm.AgenteFortiToken || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.AgenteFortiToken
        ),
    },
    // 25. SCCM
    {
      header: "SCCM",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="AgenteSCCM"
            value={editForm.AgenteSCCM || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.AgenteSCCM
        ),
    },
    // 26. Costo/Mes
    {
      header: "Costo/Mes",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            type="text"
            name="CostoMes"
            value={formatPeso(editForm.CostoMes)}
            onChange={handleEditPesoChange}
          />
        ) : item.CostoMes == null ? (
          ""
        ) : (
          "$" + Number(item.CostoMes).toLocaleString("es-CO")
        ),
    },
    // 27. Valor Seguro
    {
      header: "Valor Seguro",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            type="text"
            name="ValorSeguro"
            value={formatPeso(editForm.ValorSeguro)}
            onChange={handleEditPesoChange}
          />
        ) : item.ValorSeguro == null ? (
          ""
        ) : (
          "$" + Number(item.ValorSeguro).toLocaleString("es-CO")
        ),
    },
    // 28. Costo Lic
    {
      header: "Costo Lic",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            type="text"
            name="CostoLicAbsolute"
            value={formatPeso(editForm.CostoLicAbsolute)}
            onChange={handleEditPesoChange}
          />
        ) : item.CostoLicAbsolute == null ? (
          ""
        ) : (
          "$" + Number(item.CostoLicAbsolute).toLocaleString("es-CO")
        ),
    },
    // 29. Responsable
    {
      header: "Responsable",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <input
            name="Responsable"
            value={editForm.Responsable || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.Responsable
        ),
    },
    // 30. Observación
    {
      header: "Observación",
      accessor: (item) =>
        editId === item.EquipoID ? (
          <textarea
            name="Observacion"
            value={editForm.Observacion || ""}
            onChange={handleEditChange}
          />
        ) : (
          item.Observacion
        ),
    },
  ];

  const [pendingNavigation, setPendingNavigation] = useState(null);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (editId !== null) {
        e.preventDefault();
        e.returnValue =
          "Tienes una edición sin guardar. ¿Seguro que quieres salir?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [editId]);

  // Puedes mostrar un botón para continuar la navegación si el usuario confirma.
  const handleConfirmNavigation = () => {
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  usePrompt(
    "Tienes una edición sin guardar. ¿Seguro que quieres salir?",
    editId !== null
  );

  return (
    <section className="equipo-section">
      <h2>Actualizar Equipo</h2>
      {mensaje && (
        <div
          className="ce-success-message"
          style={{ color: "green", marginBottom: 8 }}
        >
          <FaCheckCircle style={{ marginRight: 6, color: "#388e3c" }} />
          {mensaje}
        </div>
      )}
      {error && (
        <div className="ce-error-message">
          <FaExclamationTriangle style={{ marginRight: 6, color: "#d32f2f" }} />
          {error}
        </div>
      )}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por Nombre, Serie o Responsable..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <DataTableAdmin columns={columns} data={filteredItems} />

      {/* Confirmación de navegación pendiente */}
      {pendingNavigation && (
        <div className="navigation-confirmation">
          <p>Tienes cambios sin guardar. ¿Deseas salir y perder los cambios?</p>
          <button onClick={handleConfirmNavigation}>Sí, salir</button>
          <button onClick={() => setPendingNavigation(null)}>
            No, quedarme
          </button>
        </div>
      )}
    </section>
  );
}

/**
 * Componente para eliminar equipos de cómputo.
 * Permite buscar y eliminar equipos desde una tabla.
 */
function EliminarEquipo() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga inicial de equipos
  useEffect(() => {
    fetchEquipos();
  }, []);

  // Filtra equipos según búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter(
          (eq) =>
            (eq.NombreInventario &&
              eq.NombreInventario.toLowerCase().includes(query)) ||
            (eq.Serie && eq.Serie.toLowerCase().includes(query)) ||
            (eq.Responsable && eq.Responsable.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, items]);

  /**
   * Obtiene los equipos de la API y filtra por tipo.
   */
  async function fetchEquipos() {
    setLoading(true);
    try {
      const res = await getEquiposCM();
      const tiposRes = await getTipoEquipos();
      const tiposIds = tiposRes.data
        .filter((t) =>
          ["portatil", "escritorio", "workstation", "servidor"].includes(
            t.NombreTipo.toLowerCase()
          )
        )
        .map((t) => t.TipoEquipoID);
      const filtrados = res.data.filter((eq) =>
        tiposIds.includes(eq.TipoEquipoID)
      );
      setItems(filtrados);
      setFilteredItems(filtrados);
    } catch (err) {
      setError("Error al cargar equipos: " + err.message);
      toast.error("Error al cargar equipos");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Elimina un equipo por su ID.
   */
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "¿Deseas eliminar este equipo? Esta acción no se puede deshacer."
      )
    )
      return;
    setError(null);
    try {
      await deleteEquipoCM(id);
      setItems(items.filter((eq) => eq.EquipoID !== id));
      setFilteredItems(filteredItems.filter((eq) => eq.EquipoID !== id));
      toast.success("Equipo eliminado exitosamente");
    } catch (err) {
      toast.error(err.message || "Error al eliminar equipo");
    }
  };

  return (
    <section className="equipo-section">
      <h2>Eliminar Equipo</h2>
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

      {/* Tabla de equipos */}
      <div className="table-container">
        {loading ? (
          <p className="loading-message">Cargando equipos...</p>
        ) : filteredItems.length === 0 ? (
          <p className="no-results">
            No se encontraron equipos que coincidan con la búsqueda
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
                {filteredItems.map((eq) => (
                  <tr key={eq.EquipoID}>
                    <td data-label="Nombre">{eq.NombreInventario}</td>
                    <td data-label="Serie">{eq.Serie}</td>
                    <td data-label="Responsable">{eq.Responsable || "-"}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => handleDelete(eq.EquipoID)}
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

function usePrompt(message, when) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;

    navigator.push = (...args) => {
      if (window.confirm(message)) {
        navigator.push = push;
        push(...args);
      }
    };

    return () => {
      navigator.push = push;
    };
  }, [message, when, navigator]);
}
