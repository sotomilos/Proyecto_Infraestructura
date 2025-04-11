import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ onLogout, logoutRedirect = '/login', sections = [] }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      <nav className={`app-nav ${open ? 'open' : 'closed'}`}>
      <span
        className="nav-toggle"
        onClick={() => setOpen(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpen(false)}
        aria-label="Cerrar menú"  
      >
          ✕
        </span>

        <ul className="nav-list">
          {sections.map(sec => (
            <li key={sec.title} className="nav-section">
              <h3 className="nav-section-title">{sec.title}</h3>
              <ul>
                {sec.links.map(link => (
                  <li 
                    key={link.text}
                    className='nav-link'
                    onClick={() => navigate(link.href)}
                  >
                    <span>{link.text}</span>
                    <img
                      src={ link.icon ||'/Icono_action.png'}
                      alt='flecha'
                      className='nav-arrow'                    
                    ></img>
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
            navigate(logoutRedirect, { replace: true });
          }}
        >
          <img 
            src="/Icono_exit.png" 
            alt="Icono salir"
            className='logout-icon' 
          />
          Salir
        </button>
      </nav>

      {!open && (
        <span
          className="nav-show-button"
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpen(true)}
          aria-label="Mostrar menú"
        >
          ☰
        </span>
      )}
    </>
  );
}
