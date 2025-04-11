import React from 'react';
import Header from '../../Components/Header';
import Navbar from '../../Components/Navbar';
import './Home.css';

const linksPorRol = {
  visitante: [
    {
      title: 'Control Inventarios RioCas',
      links: [
        { text: 'Control Computadoras RioCas', href: '/Control-Computadoras' },
        { text: 'Control Impresoras RioCas', href: '/Control-Impresoras' },
        { text: 'Control Tabletas RioCas', href: '/Control-Tabletas' },
        { text: 'Control UPS RioCas', href: '/Control-UPS' },
      ],
    },
    {
      title: 'Infraestructura de Red T.I',
      links: [
        { text: 'Control Redes RioCas', href: '/Control-Redes' }
      ],
    },
    {
      title: 'Infraestructura de Red O.T',
      links: [
        { text: 'Plantas Riopaila Castilla O.T', href: '/Plantas-OT' }
      ],
    },
  ],

  admin: [
    {
      title: 'Control Inventarios RioCas',
      links: [
        { text: 'Ingreso Computadoras RioCas', href: '/Ingreso-Computadoras' },
        { text: 'Ingreso Impresoras RioCas', href: '/Ingreso-Impresoras' },
        { text: 'Ingreso Tabletas RioCas', href: '/Ingreso-Tabletas' },
        { text: 'Ingreso UPS RioCas', href: '/Ingreso-UPS' },
      ],
    },
    {
      title: 'Infraestructura de Red T.I',
      links: [
        { text: 'Ingreso Redes RioCas', href: '/Ingreso-Redes' }
      ],
    },
    {
      title: 'Infraestructura de Red O.T',
      links: [
        { text: 'Ingreso Plantas Riopaila Castilla O.T', href: '/Ingreso-Plantas-OT' }
      ],
    },
  ]
};

  export default function Home({ usuario, onLogout }) {

    const homeSections = linksPorRol[usuario?.rol] || [];

    return (
      <div className="app-layout">
        <Header 
          titulo= "Control de Inventario – Transformación Digital" 
          usuario={usuario} 
        />
        <div className="layout-body">
          <Navbar 
            onLogout={onLogout} 
            logoutRedirect="/login"
            sections={homeSections} 
          />
          <main className="layout-content">
          <h2>Bienvenido, rol: {usuario.rol}</h2>
          <pre>{JSON.stringify(usuario, null, 2)}</pre>
          </main>
        </div>
      </div>
    );
  }