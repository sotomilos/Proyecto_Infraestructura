import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Navbar from "../../../Components/Navbar";
import DataTable from "../DataTable";
import {
  getSwitches,
  getPuertosByEquipoSWID,
  getTipoMarcas,
  getTipoEquipos,
  getEstados,
  getPlantas,
} from "../../../api/api";
import "../Control_Compu/Control_Compu.css";

const redesSections = [
  {
    title: "Control de Switches",
    mainHref: "/Home/Control-Redes",
    links: [
      {
        text: "Consultar Switch",
        href: "/Home/Control-Redes/consultar",
      },
    ],
  },
];

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

export default function Control_Redes({ usuario }) {
  const [navVisible, setNavVisible] = useState(true);
  const logoutRedirect =
    usuario?.rol === "admin" ? "/Home/Ingreso-Redes" : "/Home";

  return (
    <div className="control-compu-page">
      <Header titulo="Control de Inventario – Switches" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          sections={redesSections}
          logoutRedirect={logoutRedirect}
          onToggle={setNavVisible}
        />
        <main
          className={`layout-content ${!navVisible ? "navbar-hidden" : ""}`}
        >
          <ConsultarSwitches />
        </main>
      </div>
    </div>
  );
}

// ——————————————————————————————————
// Consultar Switches (con tabla y botón para ver puertos)
// ——————————————————————————————————
export function ConsultarSwitches() {
  const [switches, setSwitches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [puertos, setPuertos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [switchActual, setSwitchActual] = useState(null);
  const [puertosLoading, setPuertosLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [plantas, setPlantas] = useState([]);
  const [filtroSwitchID, setFiltroSwitchID] = useState(null);

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

  const handleVerPuertos = async (sw) => {
    setSwitchActual(sw);
    setFiltroSwitchID(sw.EquipoSWID);
    setPuertos([]);
    setShowModal(true);
    setPuertosLoading(true);
    setError(null);
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

  // Columnas para los puertos
  const puertoColumns = [
    { header: "Puerto", accessor: "Puerto" },
    { header: "PoE", accessor: "PoE" },
    { header: "Tipo", accessor: "Tipo" },
    { header: "Dispositivo", accessor: "Dispositivo" },
    { header: "Marca", accessor: "Marca" },
    { header: "Modelo", accessor: "Modelo" },
    { header: "Nombre Equipo", accessor: "NombreEquipo" },
    { header: "Serial Equipo", accessor: "SerialEquipo" },
    { header: "Vlan Nativa", accessor: "VlanNativa" },
    { header: "Vlan", accessor: "Vlan" },
    { header: "Nombre Usuario", accessor: "NombreUsuario" },
    { header: "Ubicación", accessor: "Ubicacion" },
    { header: "Observaciones", accessor: "Observaciones" },
    { header: "Status", accessor: "Status" },
    { header: "Punto Red", accessor: "PuntoRed" },
    { header: "Punto Rack", accessor: "PuntoRack" },
    { header: "Dirección IP", accessor: "DireccionIP" },
    { header: "Dirección IP Equipo", accessor: "DireccionIPEquipo" },
    { header: "Máscara", accessor: "DireccionMask" },
    { header: "Gateway", accessor: "DireccionGateWay" },
    { header: "MAC", accessor: "DireccionMac" },
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
          {puertosLoading ? (
            <p>Cargando puertos...</p>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : puertos.length === 0 ? (
            <p>No hay puertos para este switch.</p>
          ) : (
            <DataTable
              columns={puertoColumns}
              data={[...puertos].sort((a, b) =>
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
