// frontend/src/components/Sidebar.js
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import homeIcon from "../iconres/home2.png";
import salesIcon from "../iconres/team.png";
import trainerIcon from "../iconres/training2.png";
import expertIcon from "../iconres/expert2.png";
import projectIcon from "../iconres/project2.png";
import outsourceIcon from "../iconres/outsouce.png";
import userManageIcon from "../iconres/usermanage2.png";
import optiIcon from "../iconres/opti2.png";
import customerIcon from "../iconres/customer2.png";
import settingIcon from "../iconres/setting2.png";
import logoutIcon from "../iconres/logout2.png";

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  let menuItems = [];

  // Tentukan menu berdasarkan role
  if (user && user.role === "Admin") {
    menuItems = [
      { icon: homeIcon, name: "Home", link: "/" },
      { icon: salesIcon, name: "Sales", link: "/sales" },
      { icon: trainerIcon, name: "Trainer", link: "/training" },
      { icon: expertIcon, name: "Expert", link: "/expert" },
      { icon: projectIcon, name: "Project", link: "/project" },
      { icon: outsourceIcon, name: "Outsource", link: "/outsource" },
      { icon: userManageIcon, name: "Manage User", link: "/users" },
    ];
  } else if (user && (user.role === "Sales" || user.role === "Head Sales")) {
    menuItems = [
      { icon: homeIcon, name: "Home", link: "/" },
      { icon: optiIcon, name: "Opti", link: "/opti" },
      { icon: customerIcon, name: "Customer", link: "/customer" },
      { icon: trainerIcon, name: "Training", link: "/training" },
      { icon: projectIcon, name: "Project", link: "/project" },
      { icon: outsourceIcon, name: "Outsource", link: "/outsource" },
    ];
  }

  return (
    <div
      className={`bg-white h-screen flex flex-col shadow-lg fixed top-0 left-0 z-40 transition-all duration-500 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`}
      style={{
        padding: collapsed ? '16px 6px' : '16px',
        transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1), padding 0.5s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div className={`flex items-center mb-10 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <img
          src={require("../imgres/logo.png")}
          alt="OPTrack Logo"
          className={`object-contain transition-all duration-500 ease-in-out ${collapsed ? 'h-8' : 'h-12'}`}
          style={{
            opacity: 1,
            transition: 'height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className={`ml-2 p-1 rounded hover:bg-gray-200 transition`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            {collapsed ? (
              <polyline points="9 18 15 12 9 6" />
            ) : (
              <polyline points="15 18 9 12 15 6" />
            )}
          </svg>
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`flex items-center my-1 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 ${collapsed ? 'justify-center' : ''}`}
              style={{
                padding: collapsed ? '12px 0' : '12px',
                transition: 'padding 0.5s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <Link
                to={item.link}
                className="sidebar-link flex items-center w-full"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  width: '100%',
                  height: '100%',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`object-contain transition-all duration-500 ease-in-out ${collapsed ? 'w-7 h-7' : 'mr-4 w-6 h-6'}`}
                  style={{
                    opacity: 1,
                    transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1), margin 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
                {!collapsed && (
                  <span
                    style={{
                      opacity: 1,
                      maxWidth: 200,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      transition: 'opacity 0.4s, max-width 0.5s cubic-bezier(0.4,0,0.2,1)',
                      display: 'inline',
                    }}
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <ul>
          <li
            className={`flex items-center my-1 rounded-lg cursor-pointer hover:bg-gray-100 text-red-500 ${collapsed ? 'justify-center' : ''}`}
            style={{
              padding: collapsed ? '12px 0' : '12px',
              transition: 'padding 0.5s cubic-bezier(0.4,0,0.2,1)',
            }}
            onClick={handleLogout}
          >
            <img
              src={logoutIcon}
              alt="Log out"
              className={`object-contain transition-all duration-500 ease-in-out ${collapsed ? 'w-7 h-7' : 'mr-4 w-6 h-6'}`}
              style={{
                opacity: 1,
                transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1), margin 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
            <span
              style={{
                opacity: collapsed ? 0 : 1,
                maxWidth: collapsed ? 0 : 200,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.4s, max-width 0.5s cubic-bezier(0.4,0,0.2,1)',
                display: collapsed ? 'none' : 'inline',
              }}
            >
              Log out
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
