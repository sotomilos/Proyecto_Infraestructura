import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../../Components/Header";
import Navbar from "../../../Components/Navbar";
import DataTable from "../DataTable";
import {
  getConsultarServidores,
  getConsultarBodegaServidores,
  getConsultarDevolucionesServidores,
  getPrefacturaServidores,
  downloadPrefacturaServidoresExcel,
  getTipoMarcas,
  getTipoEquipos,
  getEstados,
} from "../../../api/api";

import "../Control_Compu/Control_Compu.css";

// Secciones para el navbar
const servidoresSections = [
  {
    title: "Control de Servidores",
    mainHref: "/Home/Control-Servidores",
    links: [
      {
        text: "Consultar Servidores",
        href: "/Home/Control-Servidores/consultar",
      },
      { text: "Consultar Bodega", href: "/Home/Control-Servidores/bodega" },
      {
        text: "Consultar Devoluciones",
        href: "/Home/Control-Servidores/devoluciones",
      },
      { text: "Prefactura", href: "/Home/Control-Servidores/prefactura" },
    ],
  },
];

export default function Control_Servidores({ usuario }) {
  const [navVisible, setNavVisible] = useState(true);
  const logoutRedirect =
    usuario?.rol === "admin" ? "/Home/Ingreso-Computadoras" : "/Home";

  return (
    <div className="control-servidores-page">
      <Header titulo="Control de Inventario – Servidores" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          sections={servidoresSections}
          logoutRedirect={logoutRedirect}
          onToggle={setNavVisible}
        />
        <main
          className={`layout-content ${!navVisible ? "navbar-hidden" : ""}`}
        >
          <Routes>
            <Route path="consultar" element={<ConsultarServidores />} />
            <Route path="bodega" element={<ConsultarBodegaServidores />} />
            <Route
              path="devoluciones"
              element={<ConsultarDevolucionesServidores />}
            />
            <Route path="prefactura" element={<PrefacturaServidores />} />
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
// 1) Consultar Servidores
// ——————————————————————————————————
export function ConsultarServidores() {
  return (
    <ServidoresDataTable
      title="Consultar Servidores"
      apiFn={getConsultarServidores}
      placeholder="Buscar inventario, serie, usuario o tipo"
    />
  );
}

// ——————————————————————————————————
// 2) Consultar Bodega Servidores
// ——————————————————————————————————
export function ConsultarBodegaServidores() {
  return (
    <ServidoresDataTable
      title="Consultar Bodega Servidores"
      apiFn={getConsultarBodegaServidores}
      placeholder="Buscar en bodega servidores..."
    />
  );
}

// ——————————————————————————————————
// 3) Consultar Devoluciones Servidores
// ——————————————————————————————————
export function ConsultarDevolucionesServidores() {
  return (
    <ServidoresDataTable
      title="Consultar Devoluciones Servidores"
      apiFn={getConsultarDevolucionesServidores}
      placeholder="Buscar devoluciones servidores..."
    />
  );
}

// ——————————————————————————————————
// 4) Prefactura de Servidores
// ——————————————————————————————————
export function PrefacturaServidores() {
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
    getPrefacturaServidores(search)
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
    downloadPrefacturaServidoresExcel(search)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "prefactura_servidores.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  return (
    <section className="table-section">
      <h2>Prefactura de Servidores (Excel)</h2>
      <p>Total de servidores en pantalla: {items.length}</p>

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
// Componente reutilizable para tablas de Servidores
// ——————————————————————————————————
function ServidoresDataTable({ title, apiFn, placeholder }) {
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
      <p>Total de servidores en pantalla: {items.length}</p>
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
