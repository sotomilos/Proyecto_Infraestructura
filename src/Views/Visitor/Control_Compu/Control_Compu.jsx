import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../../Components/Header";
import Navbar from "../../../Components/Navbar";
import DataTable from "../DataTable";
import {
  getConsultarEquipo,
  getConsultarBodega,
  getConsultarDevoluciones,
  getConsultarLicencias,
  getPrefacturaEquipos,
  downloadPrefacturaEquiposExcel,
  getTipoMarcas,
  getTipoEquipos,
  getEstados,
  getLicenciasPorUsuario,
  downloadPrefacturaLicenciasExcel,
} from "../../../api/api";
import "./Control_Compu.css";

// Modal reutilizable
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

const compuSections = [
  {
    title: "Control de Computadoras",
    mainHref: "/Home/Control-Computadoras",
    links: [
      {
        text: "Consultar Equipo",
        href: "/Home/Control-Computadoras/consultar",
      },
      { text: "Consultar Bodega", href: "/Home/Control-Computadoras/bodega" },
      {
        text: "Consultar Devoluciones",
        href: "/Home/Control-Computadoras/devoluciones",
      },
      {
        text: "Consultar Licencias",
        href: "/Home/Control-Computadoras/licencias",
      },
      { text: "Prefactura", href: "/Home/Control-Computadoras/prefactura" },
    ],
  },
];

export default function Control_Compu({ usuario }) {
  const [navVisible, setNavVisible] = useState(true);
  const logoutRedirect =
    usuario?.rol === "admin" ? "/Home/Ingreso-Computadoras" : "/Home";

  return (
    <div className="control-compu-page">
      <Header titulo="Control de Inventario – Computadoras" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          sections={compuSections}
          logoutRedirect={logoutRedirect}
          onToggle={setNavVisible}
        />
        <main
          className={`layout-content ${!navVisible ? "navbar-hidden" : ""}`}
        >
          <Routes>
            <Route path="consultar" element={<ConsultarEquipo />} />
            <Route path="bodega" element={<ConsultarBodega />} />
            <Route path="devoluciones" element={<ConsultarDevoluciones />} />
            <Route path="licencias" element={<ConsultarLicencias />} />
            <Route path="prefactura" element={<PrefacturaEquipos />} />
            <Route
              index
              element={
                <p className="content-placeholder">
                  Selecciona una opción en el menú lateral.
                </p>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// ——————————————————————————————————
// 1) Consultar Equipo (con botón Lic en Usuario/Ficha)
// ——————————————————————————————————
export function ConsultarEquipo() {
  const [showLicModal, setShowLicModal] = useState(false);
  const [licencias, setLicencias] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);

  // Handler para mostrar licencias
  const handleShowLic = async (item) => {
    setUsuarioActual(item);
    try {
      // Usamos item.UsuarioID (entero), que es lo que espera el backend
      const res = await getLicenciasPorUsuario(item.UsuarioID);
      // res.data es un objeto con claves de licencia y sus valores
      const licObj = res.data;
      // Convertimos ese objeto en un array de { NombreLicencia, TipoLicencia }
      const licArray = Object.entries(licObj).map(([key, value]) => ({
        NombreLicencia: key,
        TipoLicencia: value,
      }));
      setLicencias(licArray);
    } catch {
      setLicencias([]);
    }
    setShowLicModal(true);
  };

  // Columnas con botón Lic en Usuario (Ficha)
  const columns = [
    { header: "Inventario", accessor: "NombreInventario" },
    { header: "Serie", accessor: "Serie" },
    {
      header: "Usuario (Ficha)",
      accessor: (item) =>
        item.UsuarioNombre ? (
          <span>
            {`${item.UsuarioNombre} (${item.UsuarioFicha})`}
            <button
              className="btn-view"
              title="Ver licencias"
              style={{ marginLeft: 8 }}
              onClick={() => handleShowLic(item)}
            >
              Lic
            </button>
          </span>
        ) : (
          "-"
        ),
    },
    { header: "Tipo de cargo", accessor: "NombreCargo" },
    {
      header: "Dependencia (Ccosto)",
      accessor: (item) =>
        item.DependenciaNombre
          ? `${item.DependenciaNombre} (${item.DependenciaCcosto})`
          : "-",
    },
    { header: "Ubicación", accessor: "Ubicacion" },
    {
      header: "Planta / Gerencia",
      accessor: (item) =>
        item.PlantaNombre && item.GerenciaNombre
          ? `${item.PlantaNombre} - ${item.GerenciaNombre}`
          : "-",
    },
    { header: "Estado", accessor: (item) => getEstadoName(item.EstadoID) },
    { header: "Tipo", accessor: (item) => getTipoName(item.TipoEquipoID) },
    { header: "Modelo", accessor: "Modelo" },
    { header: "Marca", accessor: (item) => getMarcaName(item.MarcaID) },
    { header: "SO", accessor: "SistemaOperativo" },
    { header: "Disco", accessor: "DiscoDuro" },
    { header: "Memoria", accessor: "Memoria" },
    { header: "CPU", accessor: "Procesador" },
    { header: "Contrato", accessor: "Contrato" },
    { header: "IP", accessor: "DireccionIP" },
    { header: "Serial Pantalla", accessor: "SerialPantalla" },
    {
      header: "Fecha llegada",
      accessor: (item) => {
        if (!item.FechaLlegada) return "";
        return item.FechaLlegada.split("T")[0];
      },
    },
    {
      header: "Fecha Instalación",
      accessor: (item) => {
        if (!item.FechaInstalacion) return "";
        return item.FechaInstalacion.split("T")[0];
      },
    },
    {
      header: "Fecha novedad",
      accessor: (item) => {
        if (!item.FechaNovedad) return "";
        return item.FechaNovedad.split("T")[0];
      },
    },
    { header: "EDR", accessor: "AgenteEDR" },
    { header: "VPN", accessor: "AgenteVPN" },
    { header: "FortiToken", accessor: "AgenteFortiToken" },
    { header: "SCCM", accessor: "AgenteSCCM" },
    {
      header: "Costo/Mes",
      accessor: (item) =>
        item.CostoMes == null
          ? ""
          : "$" + Number(item.CostoMes).toLocaleString("es-CO"),
    },
    {
      header: "Seguro",
      accessor: (item) =>
        item.ValorSeguro == null
          ? ""
          : "$" + Number(item.ValorSeguro).toLocaleString("es-CO"),
    },
    {
      header: "Costo Lic.",
      accessor: (item) =>
        item.CostoLicAbsolute == null
          ? ""
          : "$" + Number(item.CostoLicAbsolute).toLocaleString("es-CO"),
    },
    { header: "Responsable", accessor: "Responsable" },
    { header: "Observacion", accessor: "Observacion" },
  ];

  // Helpers para nombres
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    Promise.all([getTipoMarcas(), getTipoEquipos(), getEstados()])
      .then(([mRes, tRes, eRes]) => {
        setMarcas(mRes.data);
        setTipos(tRes.data);
        setEstados(eRes.data);
      })
      .catch(console.error);
  }, []);

  const getMarcaName = (id) =>
    marcas.find((m) => m.MarcaID === id)?.NombreMarca || "-";
  const getTipoName = (id) =>
    tipos.find((t) => t.TipoEquipoID === id)?.NombreTipo || "-";
  const getEstadoName = (id) =>
    estados.find((e) => e.EstadoID === id)?.EstadoEquipo || "-";

  // Tabla
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = (query) => {
    setLoading(true);
    getConsultarEquipo(query)
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Elimina espacios al inicio/final y entre palabras
    const clean = search.replace(/\s+/g, " ").trim();
    fetchData(clean);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <>
      <section className="table-section">
        <h2>Consultar Computadoras</h2>
        <p>Total de computadoras en pantalla: {items.length}</p>
        <div className="search-form">
          <input
            type="text"
            placeholder="Buscar inventario, serie, usuario o tipo"
            value={search}
            onChange={(e) => setSearch(e.target.value.replace(/\s+/g, " "))}
          />
        </div>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <DataTable columns={columns} data={items} />
        )}
      </section>

      {showLicModal && (
        <Modal
          title={
            usuarioActual
              ? `Licencias de ${usuarioActual.UsuarioNombre} (${usuarioActual.UsuarioFicha})`
              : "Licencias"
          }
          onClose={() => setShowLicModal(false)}
        >
          {licencias.length === 0 ? (
            <p>No hay licencias para este usuario.</p>
          ) : (
            <ul className="lic-list">
              {licencias.map((lic) => (
                <li key={lic.NombreLicencia}>
                  <b>{lic.NombreLicencia}</b>: {lic.TipoLicencia}
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </>
  );
}

// ——————————————————————————————————
// 2) Consultar Bodega
// ——————————————————————————————————
export function ConsultarBodega() {
  return (
    <CompuDataTable
      title="Consultar Bodega Computadoras"
      apiFn={getConsultarBodega}
      placeholder="Buscar en bodega computadoras..."
    />
  );
}

// ——————————————————————————————————
// 3) Consultar Devoluciones
// ——————————————————————————————————
export function ConsultarDevoluciones() {
  return (
    <CompuDataTable
      title="Consultar Devoluciones Computadoras"
      apiFn={getConsultarDevoluciones}
      placeholder="Buscar devoluciones computadoras..."
    />
  );
}

// ——————————————————————————————————
// 4) Consultar Licencias
// ——————————————————————————————————
export function ConsultarLicencias() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const clean = search.replace(/\s+/g, " ").trim();
    getConsultarLicencias(clean)
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search]);

  const columns = [
    { header: "Nombre", accessor: "UsuarioNombre" },
    { header: "Ficha", accessor: "UsuarioFicha" },
    {
      header: "Dependencia (Ccosto)",
      accessor: (item) => `${item.NombreDependencia} (${item.Ccosto})`,
    },
    { header: "Cargo", accessor: "NombreCargo" },
    { header: "SAP", accessor: "LicenciaSAP" },
    { header: "Office", accessor: "LicenciaOffice" },
    { header: "Autodesk", accessor: "LicenciaAutodesk" },
    { header: "Adobe", accessor: "LicenciaAdobe" },
    { header: "PowerBI", accessor: "LicenciaPowerBI" },
    { header: "Project", accessor: "LicenciaProject" },
    { header: "Visio", accessor: "LicenciaVisio" },
    { header: "Copilot", accessor: "LicenciaCopilot" },
    { header: "MFA", accessor: "LicenciaMFA" },
    { header: "Otra Licencia", accessor: "LicenciaOtra" },
    { header: "Teléfono", accessor: "Telefono" },
    { header: "Email", accessor: "Email" },
  ];

  const handleDownload = () => {
    setLoading(true);
    downloadPrefacturaLicenciasExcel(search)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "prefactura_licencias.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <section className="table-section">
      <h2>Consultar Licencias</h2>
      <p>Total de licencias en pantalla: {items.length}</p>
      <div className="search-form">
        <input
          type="text"
          placeholder="Buscar usuario, licencia, ficha..."
          value={search}
          onChange={(e) => setSearch(e.target.value.replace(/\s+/g, " "))}
        />
        <button
          type="button"
          onClick={handleDownload}
          disabled={loading}
          style={{ marginLeft: "8px" }}
        >
          Descargar Excel
        </button>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DataTable columns={columns} data={items} />
      )}
    </section>
  );
}

// ——————————————————————————————————
// 5) Prefactura de Equipos
// ——————————————————————————————————
export function PrefacturaEquipos() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);

  const formatPeso = (amt) =>
    amt == null ? "" : "$" + Number(amt).toLocaleString("es-CO");

  useEffect(() => {
    Promise.all([getTipoMarcas(), getTipoEquipos(), getEstados()])
      .then(([mRes, tRes, eRes]) => {
        setMarcas(mRes.data);
        setTipos(tRes.data);
        setEstados(eRes.data);
      })
      .catch(console.error);
  }, []);

  const getMarcaName = (id) =>
    marcas.find((m) => m.MarcaID === id)?.NombreMarca || "-";
  const getTipoName = (id) =>
    tipos.find((t) => t.TipoEquipoID === id)?.NombreTipo || "-";
  const getEstadoName = (id) =>
    estados.find((e) => e.EstadoID === id)?.EstadoEquipo || "-";

  const columns = [
    { header: "Inventario", accessor: "NombreInventario" },
    { header: "Serie", accessor: "Serie" },
    {
      header: "Usuario (Ficha)",
      accessor: (item) =>
        item.UsuarioNombre
          ? `${item.UsuarioNombre} (${item.UsuarioFicha})`
          : "-",
    },
    { header: "Tipo de cargo", accessor: "NombreCargo" },
    {
      header: "Dependencia (Ccosto)",
      accessor: (item) =>
        item.DependenciaNombre
          ? `${item.DependenciaNombre} (${item.DependenciaCcosto})`
          : "-",
    },
    { header: "Ubicación", accessor: "Ubicacion" },
    {
      header: "Planta / Gerencia",
      accessor: (item) =>
        item.PlantaNombre && item.GerenciaNombre
          ? `${item.PlantaNombre} - ${item.GerenciaNombre}`
          : "-",
    },
    { header: "Estado", accessor: (item) => getEstadoName(item.EstadoID) },
    { header: "Tipo", accessor: (item) => getTipoName(item.TipoEquipoID) },
    { header: "Modelo", accessor: "Modelo" },
    { header: "Marca", accessor: (item) => getMarcaName(item.MarcaID) },
    { header: "SO", accessor: "SistemaOperativo" },
    { header: "Disco", accessor: "DiscoDuro" },
    { header: "Memoria", accessor: "Memoria" },
    { header: "CPU", accessor: "Procesador" },
    { header: "Contrato", accessor: "Contrato" },
    { header: "IP", accessor: "DireccionIP" },
    { header: "Serial Pantalla", accessor: "SerialPantalla" },
    {
      header: "Fecha llegada",
      accessor: (item) => {
        if (!item.FechaLlegada) return "";
        return item.FechaLlegada.split("T")[0];
      },
    },
    {
      header: "Fecha Instalación",
      accessor: (item) => {
        if (!item.FechaInstalacion) return "";
        return item.FechaInstalacion.split("T")[0];
      },
    },
    {
      header: "Fecha novedad",
      accessor: (item) => {
        if (!item.FechaNovedad) return "";
        return item.FechaNovedad.split("T")[0];
      },
    },
    { header: "EDR", accessor: "AgenteEDR" },
    { header: "VPN", accessor: "AgenteVPN" },
    { header: "FortiToken", accessor: "AgenteFortiToken" },
    { header: "SCCM", accessor: "AgenteSCCM" },
    { header: "Costo/Mes", accessor: (item) => formatPeso(item.CostoMes) },
    { header: "Seguro", accessor: (item) => formatPeso(item.ValorSeguro) },
    {
      header: "Costo Lic.",
      accessor: (item) => formatPeso(item.CostoLicAbsolute),
    },
    { header: "Responsable", accessor: "Responsable" },
    { header: "Observacion", accessor: "Observacion" },
  ];

  const loadItems = () => {
    setFetching(true);
    getPrefacturaEquipos(search)
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setFetching(false));
  };

  useEffect(loadItems, []);

  function handleFilter(e) {
    e.preventDefault();
    setLoading(false);
    loadItems();
  }

  function handleDownload() {
    setLoading(true);
    downloadPrefacturaEquiposExcel(search)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "prefactura_computadoras.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  return (
    <section className="table-section">
      <h2>Prefactura de Computadoras (Excel)</h2>
      <p>Total de computadoras en pantalla: {items.length}</p>

      <form
        onSubmit={handleFilter}
        className="search-form"
        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        <input
          type="text"
          placeholder="Buscar inventario, serie, usuario, estado o tipo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Filtrar</button>
        <button type="button" onClick={handleDownload} disabled={loading}>
          {loading ? "Preparando Excel…" : "Descargar Prefactura (Excel)"}
        </button>
      </form>

      {fetching ? (
        <p>Cargando...</p>
      ) : (
        <DataTable columns={columns} data={items} />
      )}
    </section>
  );
}

// ——————————————————————————————————
// Componente reutilizable para tablas de Computadoras
// ——————————————————————————————————
function CompuDataTable({ title, apiFn, placeholder }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    Promise.all([getTipoMarcas(), getTipoEquipos(), getEstados()])
      .then(([mRes, tRes, eRes]) => {
        setMarcas(mRes.data);
        setTipos(tRes.data);
        setEstados(eRes.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const clean = search.replace(/\s+/g, " ").trim();
    apiFn(clean)
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, apiFn]);

  const getMarcaName = (id) =>
    marcas.find((m) => m.MarcaID === id)?.NombreMarca || "-";
  const getTipoName = (id) =>
    tipos.find((t) => t.TipoEquipoID === id)?.NombreTipo || "-";
  const getEstadoName = (id) =>
    estados.find((e) => e.EstadoID === id)?.EstadoEquipo || "-";

  const columns = [
    { header: "Inventario", accessor: "NombreInventario" },
    { header: "Serie", accessor: "Serie" },
    {
      header: "Usuario (Ficha)",
      accessor: (item) =>
        item.UsuarioNombre
          ? `${item.UsuarioNombre} (${item.UsuarioFicha})`
          : "-",
    },
    { header: "Tipo de cargo", accessor: "NombreCargo" },
    {
      header: "Dependencia (Ccosto)",
      accessor: (item) =>
        item.DependenciaNombre
          ? `${item.DependenciaNombre} (${item.DependenciaCcosto})`
          : "-",
    },
    { header: "Ubicación", accessor: "Ubicacion" },
    {
      header: "Planta / Gerencia",
      accessor: (item) =>
        item.PlantaNombre && item.GerenciaNombre
          ? `${item.PlantaNombre} - ${item.GerenciaNombre}`
          : "-",
    },
    { header: "Estado", accessor: (item) => getEstadoName(item.EstadoID) },
    { header: "Tipo", accessor: (item) => getTipoName(item.TipoEquipoID) },
    { header: "Modelo", accessor: "Modelo" },
    { header: "Marca", accessor: (item) => getMarcaName(item.MarcaID) },
    { header: "SO", accessor: "SistemaOperativo" },
    { header: "Disco", accessor: "DiscoDuro" },
    { header: "Memoria", accessor: "Memoria" },
    { header: "CPU", accessor: "Procesador" },
    { header: "Contrato", accessor: "Contrato" },
    { header: "IP", accessor: "DireccionIP" },
    { header: "Serial Pantalla", accessor: "SerialPantalla" },
    {
      header: "Fecha llegada",
      accessor: (item) => {
        if (!item.FechaLlegada) return "";
        return item.FechaLlegada.split("T")[0];
      },
    },
    {
      header: "Fecha Instalación",
      accessor: (item) => {
        if (!item.FechaInstalacion) return "";
        return item.FechaInstalacion.split("T")[0];
      },
    },
    {
      header: "Fecha novedad",
      accessor: (item) => {
        if (!item.FechaNovedad) return "";
        return item.FechaNovedad.split("T")[0];
      },
    },
    { header: "EDR", accessor: "AgenteEDR" },
    { header: "VPN", accessor: "AgenteVPN" },
    { header: "FortiToken", accessor: "AgenteFortiToken" },
    { header: "SCCM", accessor: "AgenteSCCM" },
    {
      header: "Costo/Mes",
      accessor: (item) =>
        item.CostoMes == null
          ? ""
          : "$" + Number(item.CostoMes).toLocaleString("es-CO"),
    },
    {
      header: "Seguro",
      accessor: (item) =>
        item.ValorSeguro == null
          ? ""
          : "$" + Number(item.ValorSeguro).toLocaleString("es-CO"),
    },
    {
      header: "Costo Lic.",
      accessor: (item) =>
        item.CostoLicAbsolute == null
          ? ""
          : "$" + Number(item.CostoLicAbsolute).toLocaleString("es-CO"),
    },
    { header: "Responsable", accessor: "Responsable" },
    { header: "Observacion", accessor: "Observacion" },
  ];

  return (
    <section className="table-section">
      <h2>{title}</h2>
      <p>Total de computadoras en pantalla: {items.length}</p>
      <div className="search-form">
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value.replace(/\s+/g, " "))}
        />
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DataTable columns={columns} data={items} />
      )}
    </section>
  );
}
