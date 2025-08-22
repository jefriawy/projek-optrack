import React, { useContext } from "react";
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

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

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
      className="h-screen flex flex-col"
    >
      <div className={`flex items-center mb-10 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
        <Link to="/">
          <img
            src={isSidebarOpen ? require("../imgres/logo.png") : require("../imgres/minimize logo.png")}
            alt="OPTrack Logo"
            className={`object-contain transition-all duration-500 ease-in-out ${isSidebarOpen ? 'h-12' : 'h-10'}`}
          />
        </Link>
        <button
          onClick={toggleSidebar}
          className={`ml-2 p-1 rounded hover:bg-gray-200 transition`}
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            {isSidebarOpen ? (
              <polyline points="15 18 9 12 15 6" />
            ) : (
              <polyline points="9 18 15 12 9 6" />
            )}
          </svg>
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`flex items-center my-1 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 ${isSidebarOpen ? '' : 'justify-center'}`}
              style={{
                padding: isSidebarOpen ? '12px' : '12px 0',
              }}
            >
              <Link
                to={item.link}
                className="sidebar-link flex items-center w-full"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                  width: '100%',
                  height: '100%',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`object-contain transition-all duration-500 ease-in-out ${isSidebarOpen ? 'mr-4 w-6 h-6' : 'w-7 h-7'}`}
                />
                {isSidebarOpen && (
                  <span
                    style={{
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
            className={`flex items-center my-1 rounded-lg cursor-pointer hover:bg-gray-100 text-red-500 ${isSidebarOpen ? '' : 'justify-center'}`}
            style={{
              padding: isSidebarOpen ? '12px' : '12px 0',
            }}
            onClick={handleLogout}
          >
            <img
              src={logoutIcon}
              alt="Log out"
              className={`object-contain transition-all duration-500 ease-in-out ${isSidebarOpen ? 'mr-4 w-6 h-6' : 'w-7 h-7'}`}
            />
            <span
              style={{
                opacity: isSidebarOpen ? 1 : 0,
                maxWidth: isSidebarOpen ? 200 : 0,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.4s, max-width 0.5s cubic-bezier(0.4,0,0.2,1)',
                display: isSidebarOpen ? 'inline' : 'none',
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
