import React from 'react';
import './Header.css';

export default function Header({ titulo,usuario }) {
  return (
    <header className="app-header">
      <h1 className="header-title">{titulo}</h1>
      <div className="header-right">
        <span className="header-user">{usuario.usuario}</span>
        <img src="/Icono_Castilla.png" alt="logo" className="header-logo" />
      </div>
    </header>
  );
}