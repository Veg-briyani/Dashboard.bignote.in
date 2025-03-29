import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import menuData from "../data/menuData.json";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside
      id="layout-menu"
      className="layout-menu menu-vertical menu bg-menu-theme"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div className="app-brand demo">
        <Link
          aria-label="Navigate to  homepage"
          to="/"
          className="app-brand-link"
        >
          <span className="app-brand-logo demo">
            <img
              src="https://bignotepublications.com/image/logo.jpg"
              alt="logo"
              aria-label="BigNote logo image"
              style={{
                width: "155px",
                height: "155px",
                objectFit: "contain",
                borderRadius: "15px",
              }}
            />
          </span>
        </Link>

        <a
          href="#"
          className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none"
        >
          <i className="bx bx-chevron-left bx-sm align-middle"></i>
        </a>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {menuData.map((section) => (
          <React.Fragment key={section.header}>
            {section.header && (
              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">{section.header}</span>
              </li>
            )}
            {section.items.map((item, index) => (
              <MenuItem
                key={`${section.header}-${item.link}-${index}`}
                {...item}
              />
            ))}
          </React.Fragment>
        ))}
      </ul>

      <div className="mt-auto mb-3">
        <ul className="menu-inner">
          <li className="menu-item">
            <a
              className="menu-link"
              onClick={handleLogout}
              style={{
                cursor: "pointer",
                backgroundColor: darkMode ? "#404656" : "#696cff",
                color: "#fff",
                borderRadius: "5px",
                margin: "0 15px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? "#2b3547" : "#484bff";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? "#404656" : "#696cff";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <i className="menu-icon tf-icons bx bx-log-out"></i>
              <div>Logout</div>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

const MenuItem = (item) => {
  const location = useLocation();
  const isActive = location.pathname === item.link;
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isSubmenuActive =
    hasSubmenu &&
    item.submenu.some((subitem) => location.pathname === subitem.link);

  return (
    <li
      className={`menu-item ${isActive || isSubmenuActive ? "active" : ""} ${
        hasSubmenu && isSubmenuActive ? "open" : ""
      }`}
    >
      <NavLink
        aria-label={`Navigate to ${item.text} ${!item.available ? "Pro" : ""}`}
        to={item.link}
        className={`menu-link ${item.submenu ? "menu-toggle" : ""}`}
        target={item.link.includes("http") ? "_blank" : undefined}
      >
        <i className={`menu-icon tf-icons ${item.icon}`}></i>
        <div>{item.text}</div>
        {item.available === false && (
          <div className="badge bg-label-primary fs-tiny rounded-pill ms-auto">
            Pro
          </div>
        )}
      </NavLink>
      {item.submenu && (
        <ul className="menu-sub">{item.submenu.map(MenuItem)}</ul>
      )}
    </li>
  );
};

export default Sidebar;
 