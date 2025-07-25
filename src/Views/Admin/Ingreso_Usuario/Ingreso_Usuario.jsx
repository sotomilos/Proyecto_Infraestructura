import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Header from "../../../Components/Header";
import Navbar from "../../../Components/Navbar";
import "./Ingreso_Usuario.css";

const usuarioSections = [
  {
    title: "Usuarios",
    mainHref: "/Home/Ingreso-Usuarios",
    links: [
      { text: "Crear Usuario", href: "/Home/Ingreso-Usuarios/Crear-Usuario" },
      {
        text: "Actualizar Usuario",
        href: "/Home/Ingreso-Usuarios/Actualizar-Usuario",
      },
      {
        text: "Eliminar Usuario",
        href: "/Home/Ingreso-Usuarios/Eliminar-Usuario",
      },
    ],
  },
];

import {
  getUsuarios,
  getRoles,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../../../api/api";

export default function Ingreso_Usuario({ usuario }) {
  const location = useLocation();
  const [formData, setFormData] = useState({
    usuario: "",
    contraseña: "",
    rolId: "",
  });
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [updateData, setUpdateData] = useState({
    id: "",
    usuario: "",
    contraseña: "",
    rolId: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usa la API centralizada
        const usuariosRes = await getUsuarios();
        const rolesRes = await getRoles();

        setUsuarios(usuariosRes.data);
        setRoles(rolesRes.data);
      } catch (err) {
        setError(err.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCrearInput = (e) => {
    const { name, value } = e.target;
    // Generamos contraseña automática solo cuando el nombre cambia y está vacía
    let nuevaContraseña = formData.contraseña;
    if (
      name === "usuario" &&
      (!formData.contraseña || formData.contraseña === `${formData.usuario}*`)
    ) {
      nuevaContraseña = `${value}*`;
    }

    setFormData({
      ...formData,
      [name]: value,
      ...(name === "usuario" ? { contraseña: nuevaContraseña } : {}),
    });
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const res = await createUsuario(formData);
      const newUser = res.data;
      const rol =
        roles.find((r) => r.id === parseInt(formData.rolId))?.nombreRol || "";
      setUsuarios([
        ...usuarios,
        {
          ...newUser,
          rol,
        },
      ]);
      setFormData({ usuario: "", contraseña: "", rolId: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBuscarUsuario = () => {
    setError(null);
    const user = usuarios.find(
      (u) => u.nombreUsuario.toLowerCase() === searchUsername.toLowerCase()
    );
    if (user) {
      setUpdateData({
        id: user.id,
        usuario: user.nombreUsuario,
        contraseña: `${user.nombreUsuario}*`,
        rolId: roles.find((r) => r.nombreRol === user.rol)?.id || "",
      });
    } else {
      setError(`No se encontró el usuario "${searchUsername}"`);
    }
  };

  const handleUpdateInput = (e) => {
    const { name, value } = e.target;
    setUpdateData({ ...updateData, [name]: value });
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await updateUsuario(updateData.id, updateData);
      const rol =
        roles.find((r) => r.id === parseInt(updateData.rolId))?.nombreRol || "";
      const updatedUsuarios = usuarios.map((u) =>
        u.id === updateData.id
          ? {
              ...u,
              nombreUsuario: updateData.usuario,
              rol,
            }
          : u
      );
      setUsuarios(updatedUsuarios);
      setUpdateData({ id: "", usuario: "", contraseña: "", rolId: "" });
      setSearchUsername("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Está seguro que desea eliminar este usuario?")) {
      return;
    }
    try {
      setError(null);
      await deleteUsuario(id);
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const [navbarVisible, setNavbarVisible] = useState(true);

  // Mostrar mensaje de carga o error
  if (loading) {
    return (
      <div className="app-layout">
        <Header titulo="Gestión de Usuarios" usuario={usuario} />
        <div className="layout-body">
          <Navbar
            onLogout={() => {}}
            logoutRedirect="/Home"
            sections={usuarioSections}
            onToggle={setNavbarVisible}
          />
          <main
            className={`layout-content ${
              !navbarVisible ? "navbar-hidden" : ""
            }`}
          >
            <div className="loading-container">
              <p>Cargando datos...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header titulo="Gestión de Usuarios" usuario={usuario} />
      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home"
          sections={usuarioSections}
          onToggle={setNavbarVisible}
        />

        <main
          className={`layout-content ingreso-usuario-content ${
            !navbarVisible ? "navbar-hidden" : ""
          }`}
        >
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <Routes>
            <Route
              path="Crear-Usuario"
              element={
                <section className="form-section">
                  <h2>Crear Usuario</h2>
                  <form onSubmit={handleCrear} className="form-grid">
                    <label>Usuario</label>
                    <input
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleCrearInput}
                      required
                    />
                    <label>Contraseña</label>
                    <input
                      name="contraseña"
                      value={formData.contraseña}
                      onChange={handleCrearInput}
                      required
                    />
                    <label>Rol</label>
                    <select
                      name="rolId"
                      value={formData.rolId}
                      onChange={handleCrearInput}
                      required
                    >
                      <option value="">Seleccione un rol</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nombreRol}
                        </option>
                      ))}
                    </select>
                    <button type="submit">Crear</button>
                  </form>
                  <div className="table-section">
                    <h2>Usuarios registrados</h2>
                    {usuarios.length > 0 ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Usuario</th>
                            <th>Rol</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usuarios.map((user) => (
                            <tr key={user.id}>
                              <td>{user.nombreUsuario}</td>
                              <td>{user.rol}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No hay usuarios registrados</p>
                    )}
                  </div>
                </section>
              }
            />

            <Route
              path="Actualizar-Usuario"
              element={
                <section className="form-section">
                  <h2>Actualizar Usuario</h2>
                  <div className="form-grid">
                    <label>Nombre de Usuario</label>
                    <div className="input-button-group">
                      <input
                        type="text"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                        placeholder="Ingrese el nombre de usuario"
                      />
                      <button
                        type="button"
                        onClick={handleBuscarUsuario}
                        disabled={!searchUsername}
                      >
                        Buscar
                      </button>
                    </div>
                  </div>
                  {updateData.id && (
                    <form onSubmit={handleActualizar} className="form-grid">
                      <label>Usuario</label>
                      <input
                        name="usuario"
                        value={updateData.usuario}
                        onChange={handleUpdateInput}
                        required
                      />
                      <label>Contraseña</label>
                      <input
                        name="contraseña"
                        value={updateData.contraseña}
                        onChange={handleUpdateInput}
                        required
                      />
                      <label>Rol</label>
                      <select
                        name="rolId"
                        value={updateData.rolId}
                        onChange={handleUpdateInput}
                        required
                      >
                        <option value="">Seleccione un rol</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nombreRol}
                          </option>
                        ))}
                      </select>
                      <button type="submit">Actualizar</button>
                    </form>
                  )}
                  <div className="table-section">
                    <h2>Usuarios registrados</h2>
                    {usuarios.length > 0 ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Usuario</th>
                            <th>Rol</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usuarios.map((user) => (
                            <tr key={user.id}>
                              <td>{user.nombreUsuario}</td>
                              <td>{user.rol}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No hay usuarios registrados</p>
                    )}
                  </div>
                </section>
              }
            />

            <Route
              path="Eliminar-Usuario"
              element={
                <section className="table-section">
                  <h2>Eliminar Usuario</h2>
                  {usuarios.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Usuario</th>
                          <th>Rol</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.map((u) => (
                          <tr key={u.id}>
                            <td>{u.nombreUsuario}</td>
                            <td>{u.rol}</td>
                            <td>
                              <button
                                className="delete-button"
                                onClick={() => handleEliminar(u.id)}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No hay usuarios registrados</p>
                  )}
                </section>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
