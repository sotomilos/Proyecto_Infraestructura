import React from 'react';
import Header from '../../Components/Header';
import Navbar from '../../Components/Navbar';
import './Control_Compu.css';

const compuSections = [
  {
    links: [
      { text: 'Ingresar Equipo', href: '/Control-Computadoras/ingresar' },
      { text: 'Consultar Equipo', href: '/Control-Computadoras/consultar' },
      { text: 'Consultar Bodega', href: '/Control-Computadoras/bodega' },
      { text: 'Listado Total Equipos', href: '/Control-Computadoras/listado' },
      { text: 'Consultar Prefactura', href: '/Control-Computadoras/prefactura' },
    ],
  },
];

export default function Control_Compu({ usuario, onLogout }) {
  return (
    <div className="app-layout">
      <Header 
        titulo="Control de Inventario – Computadoras" 
        usuario={usuario} 
      />
      <div className="layout-body">
        <Navbar 
          onLogout={() => {}} 
          logoutRedirect="/Home" 
          sections={compuSections} 
        />
        <main className="layout-content">
          {/* Aquí tu form-section, tablas, etc. */}
        </main>
      </div>
    </div>
  );
}