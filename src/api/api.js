import axios from 'axios';


/**
 * @file API central para la comunicación entre el frontend y el backend.
 * Define funciones para consumir todos los endpoints del sistema de infraestructura.
 * @module api
 */


const API = axios.create({
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Interceptor para manejar errores de forma consistente en todas las peticiones.
 */
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      return Promise.reject({
        status: error.response.status,
        message: error.response.data.error || 'Error en el servidor'
      });
    } else if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'No se pudo conectar con el servidor'
      });
    } else {
      return Promise.reject({
        status: 0,
        message: 'Error al enviar la solicitud'
      });
    }
  }
);

// ------------------- AUTENTICACIÓN Y USUARIOS -------------------

export const login = (data) => API.post('/login', data);
export const getRoles = () => API.get('/roles');
export const getUsuarios = () => API.get('/usuarios');
export const createUsuario = (data) => API.post('/usuarios', data);
export const updateUsuario = (id, data) => API.put(`/usuarios/${id}`, data);
export const deleteUsuario = (id) => API.delete(`/usuarios/${id}`);

// ------------------- EQUIPOS (COMPUTADORAS) -------------------
export const getEquiposCM = () => API.get('/equiposCM');
export const getConsultarEquipo = (search = "") =>
  API.get(`/equiposCM/consultar?search=${encodeURIComponent(search)}`);
export const getConsultarBodega = (search = "") =>
  API.get(`/equiposCM/bodega?search=${encodeURIComponent(search)}`);
export const getConsultarDevoluciones = (search = "") =>
  API.get(`/equiposCM/devoluciones?search=${encodeURIComponent(search)}`);
export const getPrefacturaEquipos = (search = "") =>
  API.get(`/equiposCM/prefactura?search=${encodeURIComponent(search)}`);
export const downloadPrefacturaEquiposExcel = (search = "") =>
  API.get(`/equiposCM/prefactura/excel?search=${encodeURIComponent(search)}`, { responseType: 'blob' });
export const createEquipoCM = (data) => API.post('/equiposCM', data);
export const updateEquipoCM = (id, data) => API.put(`/equiposCM/${id}`, data);
export const deleteEquipoCM = (id) => API.delete(`/equiposCM/${id}`);

// ------------------- IMPRESORAS -------------------
export const getConsultarImpresora = (search = "") =>
  API.get(`/equiposCM/impresoras?search=${encodeURIComponent(search)}`);
export const getConsultarBodegaImpresora = (search = "") =>
  API.get(`/equiposCM/bodega-impresoras?search=${encodeURIComponent(search)}`);
export const getConsultarDevolucionImpresora = (search = "") =>
  API.get(`/equiposCM/devolucion-impresoras?search=${encodeURIComponent(search)}`);
export const getPrefacturaImpresora = (search = "") =>
  API.get(`/equiposCM/prefactura-impresoras?search=${encodeURIComponent(search)}`);
export const downloadPrefacturaImpresoraExcel = (search = "") =>
  API.get(`/equiposCM/prefactura-impresoras/excel?search=${encodeURIComponent(search)}`, { responseType: 'blob' });

// ------------------- TABLETAS / PDA -------------------
export const getConsultarTabletasPDA = (search = "") =>
  API.get(`/equiposCM/consultar-tabletas?search=${encodeURIComponent(search)}`);
export const getConsultarBodegaTabletasPDA = (search = "") =>
  API.get(`/equiposCM/bodega-tabletas?search=${encodeURIComponent(search)}`);
export const getConsultarDevolucionTabletasPDA = (search = "") =>
  API.get(`/equiposCM/devolucion-tabletas?search=${encodeURIComponent(search)}`);
export const getPrefacturaTabletasPDA = (search = "") =>
  API.get(`/equiposCM/prefactura-tabletas?search=${encodeURIComponent(search)}`);
export const downloadPrefacturaTabletasPDAExcel = (search = "") =>
  API.get(`/equiposCM/prefactura-tabletas/excel?search=${encodeURIComponent(search)}`, { responseType: 'blob' });

// ------------------- UPS -------------------
export const getConsultarUPS = (search = "") =>
  API.get(`/equiposCM/consultar-ups?search=${encodeURIComponent(search)}`);
export const getConsultarBodegaUPS = (search = "") =>
  API.get(`/equiposCM/bodega-ups?search=${encodeURIComponent(search)}`);
export const getConsultarReparacionesUPS = (search = "") =>
  API.get(`/equiposCM/reparaciones-ups?search=${encodeURIComponent(search)}`);
export const getPrefacturaUPS = (search = "") =>
  API.get(`/equiposCM/prefactura-ups?search=${encodeURIComponent(search)}`);
export const downloadPrefacturaUPSExcel = (search = "") =>
  API.get(`/equiposCM/prefactura-ups/excel?search=${encodeURIComponent(search)}`, { responseType: 'blob' });

// ------------------- SERVIDORES -------------------
export const getConsultarServidores = (search = "") =>
  API.get(`/equiposCM/consultar-servidores?search=${encodeURIComponent(search)}`);
export const getConsultarBodegaServidores = (search = "") =>
  API.get(`/equiposCM/bodega-servidores?search=${encodeURIComponent(search)}`);
export const getConsultarDevolucionesServidores = (search = "") =>
  API.get(`/equiposCM/devoluciones-servidores?search=${encodeURIComponent(search)}`);
export const getPrefacturaServidores = (search = "") =>
  API.get(`/equiposCM/prefactura-servidores?search=${encodeURIComponent(search)}`);
export const downloadPrefacturaServidoresExcel = (search = "") =>
  API.get(`/equiposCM/prefactura-servidores/excel?search=${encodeURIComponent(search)}`, { responseType: 'blob' });

// ------------------- SWITCHES -------------------
export const getSwitches = () =>
  API.get('/switches');

export const createSwitch = (data) =>
  API.post('/switches', data);

export const updateSwitch = (id, data) =>
  API.put(`/switches/${id}`, data);

export const deleteSwitch = (id) =>
  API.delete(`/switches/${id}`);

export const getPuertosByEquipoSWID = (nombre) =>
  API.get(`/switches/${encodeURIComponent(nombre)}/puertos`);

//-------------------------- PUERTOS DE SWITCHES -------------------
export const getPuertos = () => API.get('/puertos');

export const getPuertosBySwitchId = (equipoSWID) =>
  API.get(`/puertos/switch/${equipoSWID}`);

export const getPuertoById = (id) =>
  API.get(`/puertos/${id}`);

export const createPuerto = (data) =>
  API.post('/puertos', data);


export const updatePuerto = (id, data) =>
  API.put(`/puertos/${id}`, data);


export const deletePuerto = (id) =>
  API.delete(`/puertos/${id}`);

// ------------------- LICENCIAS -------------------
export const getLicenciasPorUsuario = (usuarioId) =>
  API.get(`/equiposCM/usuario-licencias?usuarioId=${encodeURIComponent(usuarioId)}`);
export const getConsultarLicencias = (search = "") =>
  API.get(`/equiposCM/usuario-licencias-buscar?search=${encodeURIComponent(search)}`);
// esta no sirve
export const downloadLicenciasExcel = (search = "") =>
  API.get(`/equiposCM/licencias/excel?search=${encodeURIComponent(search)}`, { responseType: 'blob' });


// ------------------- TRABAJADORES -------------------
export const getTrabajadores = () => API.get('/trabajadores');
export const createTrabajador = (data) => API.post('/trabajadores', data);
export const updateTrabajador = (id, data) => API.put(`/trabajadores/${id}`, data);
export const deleteTrabajador = (id) => API.delete(`/trabajadores/${id}`);
export const downloadPrefacturaLicenciasExcel = (search = "") =>
  API.get(`/licencias/prefactura/excel?search=${encodeURIComponent(search)}`, {
    responseType: "blob",
  });

// ------------------- DEPENDENCIAS -------------------
export const getDependencias = () => API.get('/dependencias');
export const createDependencia = (data) => API.post('/dependencias', data);
export const updateDependencia = (id, data) => API.put(`/dependencias/${id}`, data);
export const deleteDependencia = (id) => API.delete(`/dependencias/${id}`);

// ------------------- ESTADOS DE EQUIPOS -------------------
export const getEstados = () => API.get('/estados');
export const createEstados = (data) => API.post('/estados', data);
export const updateEstados = (id, data) => API.put(`/estados/${id}`, data);
export const deleteEstados = (id) => API.delete(`/estados/${id}`);

// ------------------- MARCAS DE EQUIPOS -------------------
export const getTipoMarcas = () => API.get('/tipomarcas');
export const createTipoMarca = (data) => API.post('/tipomarcas', data);
export const updateTipoMarca = (id, data) => API.put(`/tipomarcas/${id}`, data);
export const deleteTipoMarca = (id) => API.delete(`/tipomarcas/${id}`);

// ------------------- TIPO DE EQUIPOS -------------------
export const getTipoEquipos = () => API.get('/tipoequipos');
export const createTipoEquipo = (data) => API.post('/tipoequipos', data);
export const updateTipoEquipo = (id, data) => API.put(`/tipoequipos/${id}`, data);
export const deleteTipoEquipo = (id) => API.delete(`/tipoequipos/${id}`);

// ------------------- TIPO CARGOS -------------------
export const getTipoCargos = () => API.get('/tipocargos');
export const createTipoCargo = (data) => API.post('/tipocargos', data);
export const updateTipoCargo = (id, data) => API.put(`/tipocargos/${id}`, data);
export const deleteTipoCargo = (id) => API.delete(`/tipocargos/${id}`);

// ------------------- PLANTAS -------------------
export const getPlantas = () => API.get('/plantas');
export const createPlanta = (data) => API.post('/plantas', data);
export const updatePlanta = (id, data) => API.put(`/plantas/${id}`, data);
export const deletePlanta = (id) => API.delete(`/plantas/${id}`);

// ------------------- GERENCIAS -------------------
export const getGerencias = () => API.get('/gerencias');
export const createGerencia = (data) => API.post('/gerencias', data);
export const updateGerencia = (id, data) => API.put(`/gerencias/${id}`, data);
export const deleteGerencia = (id) => API.delete(`/gerencias/${id}`);

// ------------------- PLANTA-GERENCIAS -------------------
export const getPlantaGerencias = () => API.get('/planta-gerencias');
export const createPlantaGerencia = (data) => API.post('/planta-gerencias', data);
export const updatePlantaGerencia = (id, data) => API.put(`/planta-gerencias/${id}`, data);
export const deletePlantaGerencia = (id) => API.delete(`/planta-gerencias/${id}`);



export default API;