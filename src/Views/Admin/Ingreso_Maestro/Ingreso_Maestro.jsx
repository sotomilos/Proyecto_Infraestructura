// src/Views/Admin/Ingreso_Maestro/Ingreso_Maestro.jsx

import React, { useState } from "react";
import Header from "../../../Components/Header";
import Navbar from "../../../Components/Navbar";
import "./Ingreso_Maestro.css";

const maestroSections = [
  {
    title: "Control Maestros",
    mainHref: "/Home/Ingreso-Maestro",
    links: [
      { text: "Ingreso Gerencia", href: "/Home/Ingreso-Maestro/Gerencia" },
      { text: "Ingreso Planta", href: "/Home/Ingreso-Maestro/Planta" },
      {
        text: "Ingreso Planta-Gerencia",
        href: "/Home/Ingreso-Maestro/Planta-Gerencia",
      },
      {
        text: "Ingreso Dependencia",
        href: "/Home/Ingreso-Maestro/Dependencia",
      },
      { text: "Ingreso Trabajador", href: "/Home/Ingreso-Maestro/Trabajador" },
      {
        text: "Ingreso Estado de Equipo",
        href: "/Home/Ingreso-Maestro/Estado-Equipo",
      },
      {
        text: "Ingreso Tipo de Cargo",
        href: "/Home/Ingreso-Maestro/Tipo-Cargo",
      },
      {
        text: "Ingreso Tipo de Marcas",
        href: "/Home/Ingreso-Maestro/Tipo-Marcas",
      },
      {
        text: "Ingreso Tipo de Equipos",
        href: "/Home/Ingreso-Maestro/Tipo-Equipos",
      },
    ],
  },
];

export default function Ingreso_Maestro({ usuario }) {
  const [navbarVisible, setNavbarVisible] = useState(true);

  return (
    <div className="app-layout">
      <Header titulo="Ingreso de Datos Maestros" usuario={usuario} />

      <div className="layout-body">
        <Navbar
          onLogout={() => {}}
          logoutRedirect="/Home"
          sections={maestroSections}
          onToggle={setNavbarVisible}
        />

        <main
          className={`layout-content ingreso-maestro-content ${
            !navbarVisible ? "navbar-hidden" : ""
          }`}
        ></main>
      </div>
    </div>
  );
}
