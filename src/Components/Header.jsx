import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

/**
 * @file Componente Header para mostrar el título de la página, el usuario actual y el logo.
 * @module Components/Header
 */

/**
 * Header
 * Muestra el título de la aplicación, el nombre del usuario y el logo de la empresa.
 *
 * @param {Object} props
 * @param {string} props.titulo - Título a mostrar en el header.
 * @param {Object} props.usuario - Objeto con información del usuario.
 * @param {string} props.usuario.nombreUsuario - Nombre del usuario autenticado.
 * @returns {JSX.Element} Componente de cabecera.
 */

export default function Header({ titulo, usuario }) {
  return (
    <header className="app-header">
      <h1 className="header-title">{titulo}</h1>
      <div className="header-right">
        {usuario?.nombreUsuario && (
          <span className="header-user">
            <FontAwesomeIcon icon={faUser} className="header-user-icon" />
            {usuario.nombreUsuario}
          </span>
        )}
        <img src="/Icono_Castilla.png" alt="logo" className="header-logo" />
      </div>
    </header>
  );
}
