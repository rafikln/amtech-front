import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="h-[80px] top-0 w-full bg-gradient-to-r from-blue-900 to-blue-800 shadow-xl  px-8 flex justify-between items-center border-b border-blue-700">
      {/* Logo avec effet hover */}
      <div className="flex items-center">
        <img 
          src="/amtech.png" 
          alt="Logo" 
          className="h-12 w-auto transition-transform duration-300 hover:scale-105 filter brightness-0 invert"
        />
      </div>

      {/* Bouton Déconnexion premium */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("../");
        }}
        className="flex items-center gap-3 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <FaSignOutAlt className="text-lg transition-transform group-hover:rotate-180 duration-500" />
        <span className="font-medium text-sm relative after:absolute after:w-0 after:h-0.5 after:bg-white after:bottom-0 after:left-0 group-hover:after:w-full after:transition-all after:duration-300">
          Déconnexion
        </span>
      </button>
    </nav>
  );
};

export default NavBar;