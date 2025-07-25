import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../../Components/Header";
import Navbar from "../../../Components/Navbar";
import "../Control_Compu/Control_Compu.css";
import DataTable from "../DataTable";
import {
  getConsultarTabletasPDA,
  getConsultarBodegaTabletasPDA,
  getConsultarDevolucionTabletasPDA,
  getPrefacturaTabletasPDA,
  downloadPrefacturaTabletasPDAExcel,
  getTipoMarcas,
  getTipoEquipos,
  getEstados,
} from "../../../api/api";

const ControlTabletsSections = [
  {
    title: "Control de Tabletas",
    mainHref: "/Home/Control-Tabletas",
    links: [
      {
        text: "Consultar tabletas",
        href: "/Home/Control-Tabletas/consultar",
      },
      { text: "Consultar Bodega", href: "/Home/Control-Tabletas/bodega" },
      {
        text: "Consultar Devoluciones",
        href: "/Home/Control-Tabletas/devoluciones",
      },
      {
        text: "Prefactura",
        href: "/Home/Control-Tabletas/prefactura",
      },
    ],
  },
];

export default function ControlImpresoras({ usuario }) {
  const [navVisible, setNavVisible] = useState(true);
  const logoutRedirect =
    usuario?.rol === "admin" ? "/Home/Ingreso-Tabletas" : "/Home";

  return (
    <div className="control-Impresora-page">
      <Header titulo="Control de Inventario – Impresora" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          sections={ControlTabletsSections}
          logoutRedirect={logoutRedirect}
          onToggle={setNavVisible}
        />
        <main
          className={`layout-content ${!navVisible ? "navbar-hidden" : ""}`}
        >
          <Routes>
            <Route path="consultar" element={<ConsultarTabletas />} />
            <Route path="bodega" element={<ConsultarBodega />} />
            <Route path="devoluciones" element={<ConsultarDevoluciones />} />
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

export function ConsultarTabletas() {
  return (
    <TabletasDataTable
      title="Consultar Equipo"
      apiFn={getConsultarTabletasPDA}
      placeholder="Buscar inventario, serie, usuario o tipo"
    />
  );
}

export function ConsultarBodega() {
  return (
    <TabletasDataTable
      title="Consultar Bodega"
      apiFn={getConsultarBodegaTabletasPDA}
      placeholder="Buscar en bodega..."
    />
  );
}

export function ConsultarDevoluciones() {
  return (
    <TabletasDataTable
      title="Consultar Devoluciones"
      apiFn={getConsultarDevolucionTabletasPDA}
      placeholder="Buscar devoluciones..."
    />
  );
}

export function PrefacturaEquipos() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(false);
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
    setFetching(true);
    const clean = search.replace(/\s+/g, " ").trim();
    getPrefacturaTabletasPDA(clean)
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [search]);

  const formatPeso = (amt) =>
    amt == null ? "" : "$" + Number(amt).toLocaleString("es-CO");
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

  function handleDownload() {
    setLoading(true);
    downloadPrefacturaTabletasPDAExcel(search.replace(/\s+/g, " ").trim())
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "prefactura_tabletas.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  return (
    <section className="table-section">
      <h2>Prefactura de Equipos (Excel)</h2>
      <p>Total de equipos en pantalla: {items.length}</p>
      <div
        className="search-form"
        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        <input
          type="text"
          placeholder="Buscar inventario, serie, usuario, estado o tipo"
          value={search}
          onChange={(e) => setSearch(e.target.value.replace(/\s+/g, " "))}
        />
        <button type="button" onClick={handleDownload} disabled={loading}>
          {loading ? "Preparando Excel…" : "Descargar Prefactura (Excel)"}
        </button>
      </div>
      {fetching ? (
        <p>Cargando...</p>
      ) : (
        <DataTable columns={columns} data={items} />
      )}
    </section>
  );
}

function TabletasDataTable({ title, apiFn, placeholder }) {
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

  const formatPeso = (amt) =>
    amt == null ? "" : "$" + Number(amt).toLocaleString("es-CO");
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
      accessor: (item) =>
        item.FechaLlegada ? item.FechaLlegada.split("T")[0] : "",
    },
    {
      header: "Fecha Instalación",
      accessor: (item) =>
        item.FechaInstalacion ? item.FechaInstalacion.split("T")[0] : "",
    },
    {
      header: "Fecha novedad",
      accessor: (item) =>
        item.FechaNovedad ? item.FechaNovedad.split("T")[0] : "",
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

  return (
    <section className="table-section">
      <h2>{title}</h2>
      <p>Total de tabletas en pantalla: {items.length}</p>
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
