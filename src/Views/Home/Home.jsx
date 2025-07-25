import React from "react";
import Header from "../../Components/Header";
import Navbar from "../../Components/Navbar";
import "./Home.css";

const linksPorRol = {
  visitante: [
    {
      title: "Control Inventarios RioCas",
      links: [
        {
          text: "Control Computadoras RioCas",
          href: "/Home/Control-Computadoras",
        },
        { text: "Control Impresoras RioCas", href: "/Home/Control-Impresoras" },
        { text: "Control Tabletas RioCas", href: "/Home/Control-Tabletas" },
        { text: "Control UPS RioCas", href: "/Home/Control-UPS" },
        { text: "Control Servidores RioCas", href: "/Home/Control-Servidores" },
      ],
    },
    {
      title: "Infraestructura de Red T.I",
      links: [{ text: "Control Redes RioCas", href: "/Home/Control-Redes" }],
    },
    // {
    //   title: "Infraestructura de Red O.T",
    //   links: [
    //     { text: "Plantas Riopaila Castilla O.T", href: "/Home/Plantas-OT" },
    //   ],
    // },
  ],

  admin: [
    {
      title: "Control Maestros",
      links: [{ text: "Ingreso Maestro", href: "/Home/Ingreso-Maestro" }],
    },
    {
      title: "Control Inventarios RioCas",
      links: [
        {
          text: "Ingreso Computadoras RioCas",
          href: "/Home/Ingreso-Computadoras",
        },
        { text: "Ingreso Impresoras RioCas", href: "/Home/Ingreso-Impresoras" },
        { text: "Ingreso Tabletas RioCas", href: "/Home/Ingreso-Tabletas" },
        { text: "Ingreso UPS RioCas", href: "/Home/Ingreso-UPS" },
      ],
    },
    {
      title: "Ingreso de Usuarios",
      links: [{ text: "Ingreso de Usuarios", href: "/Home/Ingreso-Usuarios" }],
    },
    {
      title: "Infraestructura de Red T.I",
      links: [{ text: "Ingreso Redes RioCas", href: "/Home/Ingreso-Redes" }],
    },
    // {
    //   title: "Infraestructura de Red O.T",
    //   links: [
    //     {
    //       text: "Ingreso Plantas Riopaila Castilla O.T",
    //       href: "/Home/Ingreso-Plantas-OT",
    //     },
    //   ],
    // },
  ],
};

export default function Home({ usuario, onLogout }) {
  const homeSections = linksPorRol[usuario?.rol] || [];

  return (
    <div className="app-layout">
      <Header
        titulo="Control de Inventario – Transformación Digital"
        usuario={usuario}
      />
      <div className="layout-body">
        <Navbar
          onLogout={onLogout}
          logoutRedirect="/login"
          sections={homeSections}
        />
      </div>
    </div>
  );
}
