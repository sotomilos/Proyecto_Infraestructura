import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faTimes,
  faBars,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

export default function Navbar({
  onLogout,
  logoutRedirect = "/login",
  sections = [],
  onToggle,
}) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && open && toggleNav(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && open) toggleNav(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  const toggleNav = useCallback(
    (state) => {
      const nxt = typeof state === "boolean" ? state : !open;
      setOpen(nxt);
      onToggle?.(nxt);
    },
    [open, onToggle]
  );

  const handleLinkClick = (href) => {
    navigate(href);
    if (window.innerWidth <= 768) toggleNav(false);
  };

  const isActive = (href) => location.pathname === href;

  const handleLogout = () => {
    onLogout?.();
    navigate(logoutRedirect, { replace: true });
  };

  const getSectionMainHref = () => {
    for (const sec of sections) {
      if (
        sec.mainHref &&
        (location.pathname === sec.mainHref ||
          sec.links.some((link) => location.pathname.startsWith(link.href)))
      ) {
        return sec.mainHref;
      }
    }
    return "/Home";
  };

  const handleBack = () => {
    const mainHref = getSectionMainHref();
    if (location.pathname !== mainHref && mainHref) {
      navigate(mainHref, { replace: true });
    } else {
      navigate("/Home", { replace: true });
    }
  };

  return (
    <>
      <nav
        className={`app-nav ${open ? "open" : "closed"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="nav-toggle"
          onClick={() => toggleNav(false)}
          aria-label="Cerrar menú"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="nav-list">
          {sections.map((sec) => (
            <div key={sec.title} className="nav-section">
              <h3 className="nav-section-title">{sec.title}</h3>
              <ul>
                {sec.links.map((link) => (
                  <li
                    key={link.text}
                    className={`nav-link ${
                      isActive(link.href) ? "active" : ""
                    }`}
                    onClick={() => handleLinkClick(link.href)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      handleLinkClick(link.href)
                    }
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    <span>{link.text}</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="nav-arrow"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {location.pathname === "/Home" ? (
          <button
            type="button"
            className="nav-logout"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="logout-icon"
            />
            <span>Salir</span>
          </button>
        ) : (
          <button
            type="button"
            className="nav-logout"
            onClick={handleLogout}
            aria-label="Volver"
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className="logout-icon"
              style={{ transform: "rotate(180deg)" }}
            />
            <span>Volver</span>
          </button>
        )}
      </nav>

      {!open && (
        <button
          type="button"
          className="nav-show-button"
          onClick={() => toggleNav(true)}
          aria-label="Mostrar menú"
          aria-expanded="false"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}
    </>
  );
}
