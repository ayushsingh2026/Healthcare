import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";


import '../css/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      

      <nav className={`nav-root${scrolled ? " scrolled" : ""}`}>
        <div className="nav-bar">
          <div className="nav-inner">
            {/* Logo */}
            <Link to="/" className="nav-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <span className="logo-name">
                Medi<span>Care</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="nav-links">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`nav-link${isActive(l.to) ? " active" : ""}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Desktop auth */}
            <div className="nav-auth">
              <div className="nav-divider" />
              <Link to="/login" className="btn-login">Sign In</Link>
              <Link to="/register" className="btn-register">Get Started</Link>
            </div>

            {/* Hamburger */}
            <button
              className={`hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <div className="ham-line" />
              <div className="ham-line" />
              <div className="ham-line" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`mobile-nav-link${isActive(l.to) ? " active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <div className="mobile-auth">
            <Link to="/login" className="mobile-btn-login">Sign In</Link>
            <Link to="/register" className="mobile-btn-register">Register</Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;


