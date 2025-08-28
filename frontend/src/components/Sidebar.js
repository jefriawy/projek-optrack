// frontend/src/components/Sidebar.js
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
      { icon: expertIcon, name: "Expert", link: "/expert" },
      { icon: userManageIcon, name: "Manage User", link: "/users" },
    ];
  } else if (user && (user.role === "Sales" || user.role === "Head Sales")) {
    menuItems = [
      { icon: homeIcon, name: "Home", link: "/" },
      { icon: optiIcon, name: "Opti", link: "/opti" },
      { icon: customerIcon, name: "Customer", link: "/customer" },
      { icon: trainerIcon, name: "Trainer", link: "/training" },
      { icon: projectIcon, name: "Project", link: "/project" },
      { icon: outsourceIcon, name: "Outsource", link: "/outsource" },
    ];
  } else if (user && user.role === "Expert") {
    menuItems = [
      { icon: homeIcon, name: "Home", link: "/" },
      { icon: trainerIcon, name: "Training", link: "/training" },
      { icon: projectIcon, name: "Project", link: "/project" },
      { icon: outsourceIcon, name: "Outsource", link: "/outsource" },
    ];
  }

  return (
    <div className="h-screen flex flex-col bg-white shadow-lg">
      <div className={`flex items-center mb-4 p-4 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
        <Link to="/">
          <img
            src={isSidebarOpen ? require("../imgres/logo.png") : require("../imgres/minimize logo.png")}
            alt="OPTrack Logo"
            className={`object-contain transition-all duration-300 ease-in-out ${isSidebarOpen ? 'h-12' : 'h-10'}`}
          />
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-gray-200 transition hidden md:block"
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <polyline points={isSidebarOpen ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
          </svg>
        </button>
      </div>
      <nav className="flex-grow px-4">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className="my-1"
            >
              <Link
                to={item.link}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 ${!isSidebarOpen && 'justify-center'}`}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`object-contain transition-all duration-300 ease-in-out ${isSidebarOpen ? 'mr-4 w-6 h-6' : 'w-7 h-7'}`}
                />
                <span
                  className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <ul>
          <li
            className="my-1"
            onClick={handleLogout}
          >
            <div className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 text-red-500 ${!isSidebarOpen && 'justify-center'}`}>
              <img
                src={logoutIcon}
                alt="Log out"
                className={`object-contain transition-all duration-300 ease-in-out ${isSidebarOpen ? 'mr-4 w-6 h-6' : 'w-7 h-7'}`}
              />
              <span
                className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}
              >
                Log out
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;