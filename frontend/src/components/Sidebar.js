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

const Sidebar = () => {
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
    <div className="w-64 bg-white h-screen flex flex-col p-4 shadow-lg fixed top-0 left-0 z-40">
      <div className="flex justify-center items-center mb-10">
        <img src={require("../imgres/logo.png")} alt="OPTrack Logo" className="h-12 object-contain" />
      </div>
      <nav className="flex-grow">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors hover:bg-gray-100`}
            >
              <img src={item.icon} alt={item.name} className="mr-4 w-6 h-6 object-contain" />
              <Link to={item.link} className="sidebar-link w-full">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <ul>
          <li className="flex items-center p-3 my-1 rounded-lg cursor-pointer hover:bg-gray-100">
            <img src={settingIcon} alt="Setting" className="mr-4 w-6 h-6 object-contain" />
            <span>Setting</span>
          </li>
          <li
            className="flex items-center p-3 my-1 rounded-lg cursor-pointer hover:bg-gray-100 text-red-500"
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="Log out" className="mr-4 w-6 h-6 object-contain" />
            <span>Log out</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
