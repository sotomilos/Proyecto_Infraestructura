import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "../../../Components/Header";
import Navbar from "../../../Components/Navbar";
import ConsultarTabletas from "../../Visitor/Control_Tabletas/Control_Tabletas";
import "../Ingreso_Compu/CrearEquipo.css";
import "../Ingreso_Compu/Ingreso_Compu.css";
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
  FaTabletAlt,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Ingreso_Tabletas({ usuario }) {
  const [navVisible, setNavVisible] = useState(true);
  const navigate = useNavigate();

  const IngresoTabletSections = [
    {
      title: "Tabletas",
      mainHref: "/Home/Ingreso-Tabletas",
      links: [
        {
          text: "Crear Tableta",
          href: "/Home/Ingreso-Tabletas/Crear-Tableta",
          icon: <FaPlus style={{ marginRight: 6 }} />,
        },
        {
          text: "Actualizar Tableta",
          href: "/Home/Ingreso-Tabletas/Actualizar-Tableta",
          icon: <FaEdit style={{ marginRight: 6 }} />,
        },
        {
          text: "Eliminar Tableta",
          href: "/Home/Ingreso-Tabletas/Eliminar-Tableta",
          icon: <FaTrash style={{ marginRight: 6 }} />,
        },
        {
          text: "Consultar Tableta",
          href: "/Home/Control-Tabletas/consultar",
          icon: <FaSearch style={{ marginRight: 6 }} />,
        },
      ],
    },
  ];
  return (
    <div className="app-layout">
      <Header titulo="Gestión de Impresoras" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home"
          sections={IngresoTabletSections}
          onToggle={setNavVisible}
        />
        <main
          className={`layout-content ingreso-print-main ${
            !navVisible ? "navbar-hidden" : ""
          }`}
        >
          <Routes>
            <Route path="Crear-Tableta" element={<CrearTableta />} />
            <Route path="Actualizar-Tableta" element={<ActualizarTableta />} />
            <Route path="Eliminar-Tableta" element={<EliminarTableta />} />
            <Route path="Consultar-Tableta" element={<ConsultarTabletas />} />
            <Route
              index
              element={
                <div className="welcome-container">
                  <div className="welcome-card">
                    <h2>
                      <FaTabletAlt
                        style={{ marginRight: 8, color: "#D81C23" }}
                      />
                      Gestión de Tabletas / PDA
                    </h2>
                    <p className="placeholder">
                      Selecciona una acción del menú lateral o usa las opciones
                      rápidas:
                    </p>
                    <div className="welcome-options">
                      <div
                        className="option-card"
                        onClick={() => navigate("Crear-Tableta")}
                      >
                        <FaPlus className="option-icon" />
                        <span>Crear</span>
                      </div>
                      <div
                        className="option-card"
                        onClick={() => navigate("Actualizar-Tableta")}
                      >
                        <FaEdit className="option-icon" />
                        <span>Actualizar</span>
                      </div>
                      <div
                        className="option-card"
                        onClick={() => navigate("Eliminar-Tableta")}
                      >
                        <FaTrash className="option-icon" />
                        <span>Eliminar</span>
                      </div>
                      <div
                        className="option-card"
                        onClick={() =>
                          navigate("/Home/Control-Tabletas/consultar")
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
          <ToastContainer position="top-right" autoClose={3000} />
        </main>
      </div>
    </div>
  );
}

function CrearTableta() {
  const [form, setForm] = useState({
    NombreInventario: "",
    MarcaID: null,
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
    UsuarioID: null,
    DependenciaID: null,
    Ubicacion: "",
    EstadoID: null,
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

  // Estados para autocompletar
  const [marcaSearch, setMarcaSearch] = useState("");
  const [showMarcaOptions, setShowMarcaOptions] = useState(false);
  const [estadoSearch, setEstadoSearch] = useState("");
  const [showEstadoOptions, setShowEstadoOptions] = useState(false);
  const [depSearch, setDepSearch] = useState("");
  const [showDepOptions, setShowDepOptions] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [showUserOptions, setShowUserOptions] = useState(false);

  // Campos obligatorios
  const requiredFields = [
    "NombreInventario",
    "MarcaID",
    "TipoEquipoID",
    "Modelo",
    "Serie",
    "SistemaOperativo",
    "DiscoDuro",
    "Memoria",
    "Procesador",
    "UsuarioID",
    "DependenciaID",
    "Ubicacion",
    "EstadoID",
    "Contrato",
    "Responsable",
  ];

  // Helpers para formatear/parsear moneda
  const formatPeso = (amt) =>
    amt == null ? "" : "$" + Number(amt).toLocaleString("es-CO");
  const parsePeso = (str) => {
    const digits = str.replace(/[^0-9]/g, "");
    return digits === "" ? null : Number(digits);
  };
  const handleCostoMesChange = (e) =>
    setForm((f) => ({ ...f, CostoMes: parsePeso(e.target.value) }));

  // Carga de datos al montar
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

  // Filtrar solo “tableta” o “pda” (asegúrate de que en tu BD existan esos registros con ese nombre exacto)
  const tabletaTipos = useMemo(() => {
    return tipos.filter(
      (t) =>
        t.NombreTipo?.toLowerCase().trim() === "tableta" ||
        t.NombreTipo?.toLowerCase().trim() === "pda"
    );
  }, [tipos]);

  // Filtrados para autocompletar
  const filteredMarcas = useMemo(() => {
    const txt = marcaSearch.toLowerCase().trim();
    return marcas.filter((m) =>
      (m.NombreMarca || "").toLowerCase().trim().includes(txt)
    );
  }, [marcaSearch, marcas]);

  const filteredEstados = useMemo(() => {
    const txt = estadoSearch.toLowerCase().trim();
    return estados.filter((es) =>
      (es.EstadoEquipo || "").toLowerCase().trim().includes(txt)
    );
  }, [estadoSearch, estados]);

  const filteredDeps = useMemo(() => {
    const txt = depSearch.toLowerCase().trim();
    return dependencias.filter((d) =>
      (d.NombreDependencia || "").toLowerCase().trim().includes(txt)
    );
  }, [depSearch, dependencias]);

  const filteredUsers = useMemo(() => {
    const txt = userSearch.toLowerCase().trim();
    return trabajadores.filter((u) =>
      `${u.NombreCompleto} (${u.Ficha})`.toLowerCase().trim().includes(txt)
    );
  }, [userSearch, trabajadores]);

  // Manejador genérico para inputs
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCrear = async (e) => {
    e.preventDefault();
    setErrors({});
    const errorsLocal = {};

    // Validación de campos obligatorios
    requiredFields.forEach((f) => {
      if (
        form[f] === "" ||
        form[f] === null ||
        typeof form[f] === "undefined"
      ) {
        errorsLocal[f] = "Este campo es obligatorio";
      }
    });

    if (Object.keys(errorsLocal).length > 0) {
      setErrors(errorsLocal);
      return;
    }

    // Construir payload con los campos reflejados en el formulario
    const payload = {
      NombreInventario: form.NombreInventario,
      MarcaID: form.MarcaID,
      TipoEquipoID: form.TipoEquipoID,
      Modelo: form.Modelo,
      Serie: form.Serie,
      SistemaOperativo: form.SistemaOperativo,
      DiscoDuro: form.DiscoDuro,
      Memoria: form.Memoria,
      Procesador: form.Procesador,
      FechaLlegada: form.FechaLlegada || null,
      FechaInstalacion: form.FechaInstalacion || null,
      FechaNovedad: form.FechaNovedad || null,
      UsuarioID: form.UsuarioID,
      DependenciaID: form.DependenciaID,
      Ubicacion: form.Ubicacion,
      EstadoID: form.EstadoID,
      Contrato: form.Contrato,
      CostoMes: form.CostoMes,
      Responsable: form.Responsable,
      Observacion: form.Observacion || "",
    };

    try {
      console.log("🚀 Payload:", payload);
      const respuesta = await createEquipoCM(payload);
      toast.success("✅ Tableta/PDA creada exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });

      // Resetear formulario
      setForm({
        NombreInventario: "",
        MarcaID: null,
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
        UsuarioID: null,
        DependenciaID: null,
        Ubicacion: "",
        EstadoID: null,
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
      console.error("❌ Error al crear tableta:", err);
      toast.error("❌ " + (err.message || "Error al crear tableta/PDA"), {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <form onSubmit={handleCrear} className="ce-form-grid">
      <h3 className="ce-form-section-title">Datos de la Tableta / PDA</h3>

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
        Marca <span style={{ color: "var(--color-primary)" }}> *</span>
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
                (m) =>
                  m.NombreMarca.toLowerCase().trim() ===
                  marcaSearch.toLowerCase().trim()
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

      {/* Select TipoEquipo */}
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
        {tabletaTipos.map((t) => (
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
        Modelo <span style={{ color: "var(--color-primary)" }}> *</span>
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
        Serie <span style={{ color: "var(--color-primary)" }}> *</span>
      </label>
      <input name="Serie" value={form.Serie} onChange={handleChange} required />
      {errors.Serie && (
        <small className="ce-error-message">{errors.Serie}</small>
      )}

      {/* Sistema Operativo */}
      <label>
        Sistema Operativo{" "}
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

      {/* Disco Duro */}
      <label>
        Disco Duro <span style={{ color: "var(--color-primary)" }}> *</span>
      </label>
      <input
        name="DiscoDuro"
        value={form.DiscoDuro}
        onChange={handleChange}
        required
      />
      {errors.DiscoDuro && (
        <small className="ce-error-message">{errors.DiscoDuro}</small>
      )}

      {/* Memoria */}
      <label>
        Memoria <span style={{ color: "var(--color-primary)" }}> *</span>
      </label>
      <input
        name="Memoria"
        value={form.Memoria}
        onChange={handleChange}
        required
      />
      {errors.Memoria && (
        <small className="ce-error-message">{errors.Memoria}</small>
      )}

      {/* Procesador */}
      <label>
        Procesador <span style={{ color: "var(--color-primary)" }}> *</span>
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

      {/* Autocomplete Usuario */}
      <label>
        Ficha (Usuario){" "}
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
                (u) =>
                  `${u.NombreCompleto} (${u.Ficha})`.toLowerCase().trim() ===
                  userSearch.toLowerCase().trim()
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
        Dependencia <span style={{ color: "var(--color-primary)" }}> *</span>
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
                (d) =>
                  d.NombreDependencia.toLowerCase().trim() ===
                  depSearch.toLowerCase().trim()
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

      {/* Ubicación */}
      <label>
        Ubicación <span style={{ color: "var(--color-primary)" }}> *</span>
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
        Estado <span style={{ color: "var(--color-primary)" }}> *</span>
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
                (es) =>
                  es.EstadoEquipo.toLowerCase().trim() ===
                  estadoSearch.toLowerCase().trim()
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
        Contrato <span style={{ color: "var(--color-primary)" }}> *</span>
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
        Responsable <span style={{ color: "var(--color-primary)" }}> *</span>
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
        Crear Tableta
      </button>
    </form>
  );
}

// === Actualizar Impresora ===

function ActualizarTableta() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Formato/parsing de moneda
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

  // Filtrados para autocompletes
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

  // Filtrar solo tipos TABLETA o PDA
  const tabletaTipos = useMemo(() => {
    return tipos.filter(
      (t) =>
        t.NombreTipo.toLowerCase() === "tableta" ||
        t.NombreTipo.toLowerCase() === "pda"
    );
  }, [tipos]);

  // 1) useEffect inicial: cargar “lookups” y luego tabla de items
  useEffect(() => {
    fetchListas();
  }, []);

  // 2) Cuando `tipos` esté cargado, cargar “tabletas/pda”
  useEffect(() => {
    if (tipos.length > 0) {
      fetchTabletas();
    }
  }, [tipos]);

  // 3) Filtrar items según búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter(
          (t) =>
            (t.NombreInventario &&
              t.NombreInventario.toLowerCase().includes(q)) ||
            (t.Serie && t.Serie.toLowerCase().includes(q)) ||
            (t.Responsable && t.Responsable.toLowerCase().includes(q))
        )
      );
    }
  }, [searchQuery, items]);

  // Carga de listas de lookup
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

  // Obtener “tabletas” y “pda” del backend
  async function fetchTabletas() {
    setLoading(true);
    try {
      // 1. Traer todos los equipos y tipos usando los helpers de la API
      const resEquipos = await getEquiposCM();
      const resTipos = await getTipoEquipos();

      // 2. Filtrar los IDs de tipo cuyo NombreTipo sea “tableta” o “pda”
      const tabletaTipoIds = resTipos.data
        .filter(
          (t) =>
            t.NombreTipo.toLowerCase() === "tableta" ||
            t.NombreTipo.toLowerCase() === "pda"
        )
        .map((t) => t.TipoEquipoID);

      // 3. Filtrar únicamente los equipos cuyo TipoEquipoID esté en tabletaTipoIds
      const filtrados = resEquipos.data.filter((item) =>
        tabletaTipoIds.includes(item.TipoEquipoID)
      );

      setItems(filtrados);
      setFilteredItems(filtrados);
    } catch (err) {
      setError("Error al cargar tabletas/PDA: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(item) {
    setSelected(item.EquipoID);
    setForm({
      ...item,
      FechaLlegada: item.FechaLlegada?.split("T")[0] || "",
      FechaInstalacion: item.FechaInstalacion?.split("T")[0] || "",
      FechaNovedad: item.FechaNovedad?.split("T")[0] || "",
    });

    const sm = marcas.find((m) => m.MarcaID === item.MarcaID);
    const se = estados.find((es) => es.EstadoID === item.EstadoID);
    const sd = dependencias.find((d) => d.DependenciaID === item.DependenciaID);
    const su = trabajadores.find((u) => u.UsuarioID === item.UsuarioID);
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
      toast.success("✅ Tableta/PDA actualizada exitosamente");
      setItems((prev) =>
        prev.map((t) => (t.EquipoID === selected ? { ...t, ...payload } : t))
      );
      setFilteredItems((prev) =>
        prev.map((t) => (t.EquipoID === selected ? { ...t, ...payload } : t))
      );
      setSelected(null);
      setForm({});
    } catch (err) {
      toast.error("❌ " + (err.message || "Error al actualizar tableta/PDA"));
    }
  };

  const handleCancel = () => {
    setSelected(null);
    setForm({});
    setError(null);
  };

  return (
    <section className="tableta-section">
      <h2>Actualizar Tableta / PDA</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Formulario de edición */}
      {selected && (
        <div className="edit-form-container">
          <form onSubmit={handleActualizar} className="form-grid">
            <h3 className="form-section-title">
              Editar Tableta/PDA #{form.EquipoID}
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
              Marca <span style={{ color: "var(--color-primary)" }}> *</span>
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
                      (m) =>
                        m.NombreMarca.toLowerCase().trim() ===
                        marcaSearch.toLowerCase().trim()
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

            {/* Select TipoEquipo */}
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
              {tabletaTipos.map((t) => (
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
              Modelo <span style={{ color: "var(--color-primary)" }}> *</span>
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
              Serie <span style={{ color: "var(--color-primary)" }}> *</span>
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
              Sistema Operativo{" "}
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

            {/* Disco Duro */}
            <label>
              Disco Duro{" "}
              <span style={{ color: "var(--color-primary)" }}> *</span>
            </label>
            <input
              name="DiscoDuro"
              value={form.DiscoDuro}
              onChange={handleChange}
              required
            />
            {errors.DiscoDuro && (
              <small className="ce-error-message">{errors.DiscoDuro}</small>
            )}

            {/* Memoria */}
            <label>
              Memoria <span style={{ color: "var(--color-primary)" }}> *</span>
            </label>
            <input
              name="Memoria"
              value={form.Memoria}
              onChange={handleChange}
              required
            />
            {errors.Memoria && (
              <small className="ce-error-message">{errors.Memoria}</small>
            )}

            {/* Procesador */}
            <label>
              Procesador{" "}
              <span style={{ color: "var(--color-primary)" }}> *</span>
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

            {/* Autocomplete Usuario */}
            <label>
              Ficha (Usuario){" "}
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
                      (u) =>
                        `${u.NombreCompleto} (${u.Ficha})`
                          .toLowerCase()
                          .trim() === userSearch.toLowerCase().trim()
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
              Dependencia{" "}
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
                      (d) =>
                        d.NombreDependencia.toLowerCase().trim() ===
                        depSearch.toLowerCase().trim()
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
              Ubicación{" "}
              <span style={{ color: "var(--color-primary)" }}> *</span>
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
              Estado <span style={{ color: "var(--color-primary)" }}> *</span>
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
                      (es) =>
                        es.EstadoEquipo.toLowerCase().trim() ===
                        estadoSearch.toLowerCase().trim()
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
              Contrato <span style={{ color: "var(--color-primary)" }}> *</span>
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
              Responsable{" "}
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

      {/* Tabla de tabletas/PDA */}
      <div className="table-container">
        {loading ? (
          <p className="loading-message">Cargando tabletas/PDA...</p>
        ) : filteredItems.length === 0 ? (
          <p className="no-results">
            No se encontraron tabletas/PDA que coincidan con la búsqueda
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
                {filteredItems.map((t) => (
                  <tr key={t.EquipoID}>
                    <td data-label="Nombre">{t.NombreInventario}</td>
                    <td data-label="Serie">{t.Serie}</td>
                    <td data-label="Responsable">{t.Responsable || "-"}</td>
                    <td data-label="Acción">
                      <button onClick={() => startEdit(t)} className="btn-edit">
                        <FaEdit style={{ marginRight: 4 }} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.EquipoID)}
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

function EliminarTableta() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) Al montar, cargar todos los equipos y tipos, luego filtrar solo “TABLETA” o “PDA”
  useEffect(() => {
    fetchTabletas();
  }, []);

  // 2) Cada vez que cambie searchQuery o la lista de items, actualizar filteredItems
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter(
          (t) =>
            (t.NombreInventario &&
              t.NombreInventario.toLowerCase().includes(q)) ||
            (t.Serie && t.Serie.toLowerCase().includes(q)) ||
            (t.Responsable && t.Responsable.toLowerCase().includes(q))
        )
      );
    }
  }, [searchQuery, items]);

  async function fetchTabletas() {
    setLoading(true);
    try {
      const resEquipos = await getEquiposCM();
      const resTipos = await getTipoEquipos();

      // Filtrar los IDs de tipo cuyo NombreTipo sea “tableta” o “pda”
      const tabletaTipoIds = resTipos.data
        .filter(
          (t) =>
            t.NombreTipo.toLowerCase() === "tableta" ||
            t.NombreTipo.toLowerCase() === "pda"
        )
        .map((t) => t.TipoEquipoID);

      // Filtrar únicamente los equipos cuyo TipoEquipoID esté en tabletaTipoIds
      const filtrados = resEquipos.data.filter((item) =>
        tabletaTipoIds.includes(item.TipoEquipoID)
      );

      setItems(filtrados);
      setFilteredItems(filtrados);
    } catch (err) {
      setError("Error al cargar tabletas: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "¿Deseas eliminar esta tableta/PDA? Esta acción no se puede deshacer."
      )
    )
      return;
    setError(null);
    try {
      await deleteEquipoCM(id);
      setItems((prev) => prev.filter((item) => item.EquipoID !== id));
      setFilteredItems((prev) => prev.filter((item) => item.EquipoID !== id));
      toast.success("🗑️ Tableta/PDA eliminada exitosamente");
    } catch (err) {
      toast.error("❌ " + (err.message || "Error al eliminar tableta/PDA"));
    }
  };

  return (
    <section className="tableta-section">
      <h2>Eliminar Tableta / PDA</h2>
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

      {/* Tabla de tabletas */}
      <div className="table-container">
        {loading ? (
          <p className="loading-message">Cargando tabletas/PDA...</p>
        ) : filteredItems.length === 0 ? (
          <p className="no-results">
            No se encontraron tabletas/PDA que coincidan con la búsqueda
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
                {filteredItems.map((item) => (
                  <tr key={item.EquipoID}>
                    <td data-label="Nombre">{item.NombreInventario}</td>
                    <td data-label="Serie">{item.Serie}</td>
                    <td data-label="Responsable">{item.Responsable || "-"}</td>
                    <td data-label="Acción">
                      <button
                        onClick={() => handleDelete(item.EquipoID)}
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
