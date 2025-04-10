import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ sections = [], onLogout}) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Infraestructura de Red T.I',
      links: [{ text: 'Control Redes RioCas', href: '#' }],
    },
    {
      title: 'Control Inventarios RioCas',
      links: [
        { text: 'Control Computadoras RioCas', href: '#' },
        { text: 'Control Impresoras RioCas', href: '#' },
        { text: 'Control Tabletas RioCas', href: '#' },
        { text: 'Control UPS RioCas', href: '#' },
      ],
    },
    {
      title: 'Infraestructura de Red O.T',
      links: [{ text: 'Plantas Riopaila Castilla O.T', href: '#' }],
    },
  ];

  return (
    <nav className={`app-nav ${open ? 'open' : 'closed'}`}>
      <button 
        className="nav-toggle" 
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      <ul className="nav-list">
        {sections.map(sec => (
          <li key={sec.title} className="nav-section">
            <h3 className="nav-section-title">{sec.title}</h3>
            <ul>
              {sec.links.map(link => (
                <li key={link.text}>
                <button 
                  className="nav-link" 
                  onClick={() => navigate(link.href)}
                >
                  {link.text} <span className="nav-arrow">›</span>
                </button>
              </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button 
        className="nav-logout" 
        onClick={() => {
          onLogout();
          navigate('/login', { replace: true });
        }}
      >
        ‹ Salir
      </button>
    </nav>
  );
}