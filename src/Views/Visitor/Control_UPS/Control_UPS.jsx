import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../../Components/Header";
import Navbar from "../../../Components/Navbar";
import DataTable from "../DataTable";
import "../Control_Compu/Control_Compu.css";
import {
  getConsultarUPS,
  getConsultarBodegaUPS,
  getConsultarReparacionesUPS,
  getPrefacturaUPS,
  downloadPrefacturaUPSExcel,
  getTipoMarcas,
  getTipoEquipos,
  getEstados,
} from "../../../api/api";

const upsSections = [
  {
    title: "Control de UPS",
    mainHref: "/Home/Control-UPS",
    links: [
      { text: "Consultar UPS", href: "/Home/Control-UPS/consultar" },
      { text: "Consultar Bodega", href: "/Home/Control-UPS/bodega" },
      {
        text: "Consultar Reparaciones",
        href: "/Home/Control-UPS/reparaciones",
      },
      { text: "Prefactura", href: "/Home/Control-UPS/prefactura" },
    ],
  },
];

export default function Control_UPS({ usuario }) {
  const [navVisible, setNavVisible] = useState(true);
  const logoutRedirect =
    usuario?.rol === "admin" ? "/Home/Ingreso-UPS" : "/Home";

  return (
    <div className="control-ups-page">
      <Header titulo="Control de Inventario – UPS" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          sections={upsSections}
          logoutRedirect={logoutRedirect}
          onToggle={setNavVisible}
        />
        <main
          className={`layout-content ${!navVisible ? "navbar-hidden" : ""}`}
        >
          <Routes>
            <Route path="consultar" element={<ConsultarUPS />} />
            <Route path="bodega" element={<ConsultarBodegaUPS />} />
            <Route path="reparaciones" element={<ConsultarReparacionesUPS />} />
            <Route path="prefactura" element={<PrefacturaUPS />} />
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
// 1) Consultar UPS
// ——————————————————————————————————
export function ConsultarUPS() {
  return (
    <UPSDataTable
      title="Consultar UPS"
      fetchData={getConsultarUPS}
      placeholder="Buscar UPS, serie, usuario o tipo"
    />
  );
}

// ——————————————————————————————————
// 2) Consultar Bodega UPS
// ——————————————————————————————————
export function ConsultarBodegaUPS() {
  return (
    <UPSDataTable
      title="Consultar Bodega UPS"
      fetchData={getConsultarBodegaUPS}
      placeholder="Buscar en bodega UPS..."
    />
  );
}

// ——————————————————————————————————
// 3) Consultar Reparaciones UPS
// ——————————————————————————————————
export function ConsultarReparacionesUPS() {
  return (
    <UPSDataTable
      title="Consultar Reparaciones UPS"
      fetchData={getConsultarReparacionesUPS}
      placeholder="Buscar reparaciones UPS..."
    />
  );
}

// ——————————————————————————————————
// 4) Prefactura UPS
// ——————————————————————————————————
export function PrefacturaUPS() {
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
    Promise.all([
      getTipoMarcas().then((r) => r.data),
      getTipoEquipos().then((r) => r.data),
      getEstados().then((r) => r.data),
    ])
      .then(([mRes, tRes, eRes]) => {
        setMarcas(mRes);
        setTipos(tRes);
        setEstados(eRes);
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
    { header: "Memoria", accessor: "Memoria" },
    { header: "CPU", accessor: "Procesador" },
    { header: "Tipo", accessor: (item) => getTipoName(item.TipoEquipoID) },
    { header: "Disco", accessor: "DiscoDuro" },
    { header: "Modelo", accessor: "Modelo" },
    { header: "Marca", accessor: (item) => getMarcaName(item.MarcaID) },
    { header: "SO", accessor: "SistemaOperativo" },
    { header: "Contrato", accessor: "Contrato" },
    { header: "Costo/Mes", accessor: (item) => formatPeso(item.CostoMes) },
    { header: "Seguro", accessor: (item) => formatPeso(item.ValorSeguro) },
    {
      header: "Costo Lic.",
      accessor: (item) => formatPeso(item.CostoLicAbsolute),
    },
    { header: "Responsable", accessor: "Responsable" },
    { header: "Serial Pantalla", accessor: "SerialPantalla" },
    { header: "IP", accessor: "DireccionIP" },
    { header: "EDR", accessor: "AgenteEDR" },
    { header: "VPN", accessor: "AgenteVPN" },
    { header: "FortiToken", accessor: "AgenteFortiToken" },
    { header: "SCCM", accessor: "AgenteSCCM" },
  ];

  const loadItems = () => {
    setFetching(true);
    getPrefacturaUPS(search)
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
    downloadPrefacturaUPSExcel(search)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "prefactura_ups.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  return (
    <section className="table-section">
      <h2>Prefactura de UPS (Excel)</h2>
      <p>Total de UPS en pantalla: {items.length}</p>

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
// Componente reutilizable para tablas de UPS
// ——————————————————————————————————
function UPSDataTable({ title, fetchData, placeholder }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    Promise.all([
      getTipoMarcas().then((r) => r.data),
      getTipoEquipos().then((r) => r.data),
      getEstados().then((r) => r.data),
    ])
      .then(([mRes, tRes, eRes]) => {
        setMarcas(mRes);
        setTipos(tRes);
        setEstados(eRes);
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
    { header: "Costo/Mes", accessor: (item) => item.CostoMes },
    { header: "Seguro", accessor: (item) => item.ValorSeguro },
    { header: "Costo Lic.", accessor: (item) => item.CostoLicAbsolute },
    { header: "Responsable", accessor: "Responsable" },
    { header: "Observacion", accessor: "Observacion" },
  ];

  useEffect(() => {
    setLoading(true);
    const clean = search.replace(/\s+/g, " ").trim();
    fetchData(clean)
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, fetchData]);

  return (
    <section className="table-section">
      <h2>{title}</h2>
      <p>Total de UPS en pantalla: {items.length}</p>
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
