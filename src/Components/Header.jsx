import React from 'react';
import './Header.css';

export default function Header({ usuario }) {
  return (
    <header className="app-header">
      <h1 className="header-title">Control de inventario – Transformación Digital</h1>
      <div className="header-right">
        <span className="header-user">{usuario}</span>
        <img src="/Icono_Castilla.png" alt="logo" className="header-logo" />
      </div>
    </header>
  );
}