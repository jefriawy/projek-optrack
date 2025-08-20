// frontend/src/components/Sidebar.js
import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
      { icon: "🏠", name: "Home", link: "/" },
      { icon: "👥", name: "Sales", link: "/sales" },
      { icon: "🎓", name: "Trainer", link: "/training" },
      { icon: "🧑‍💼", name: "Expert", link: "/expert" },
      { icon: "📂", name: "Project", link: "/project" },
      { icon: "🤝", name: "Outsource", link: "/outsource" },
      { icon: "🔧", name: "Manage User", link: "/users" }, // Tautan untuk manage user
    ];
  } else if (user && (user.role === "Sales" || user.role === "Head Sales")) {
    menuItems = [
      { icon: "🏠", name: "Home", link: "/" },
      { icon: "⚙️", name: "Opti", link: "/opti" },
      { icon: "👥", name: "Customer", link: "/customer" },
      { icon: "🎓", name: "Training", link: "/training" },
      { icon: "📂", name: "Project", link: "/project" },
      { icon: "🤝", name: "Outsource", link: "/outsource" },
    ];
  }

  return (
    <div className="w-64 bg-white h-screen flex flex-col p-4 shadow-lg fixed top-0 left-0 z-40">
      <div className="text-2xl font-bold mb-10">OPTrack</div>
      <nav className="flex-grow">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors hover:bg-gray-100`}
            >
              <span className="mr-4">{item.icon}</span>
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
            <span className="mr-4">⚙️</span>
            <span>Setting</span>
          </li>
          <li
            className="flex items-center p-3 my-1 rounded-lg cursor-pointer hover:bg-gray-100 text-red-500"
            onClick={handleLogout}
          >
            <span className="mr-4">➡️</span>
            <span>Log out</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;