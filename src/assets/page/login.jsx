import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Intro = ({ onIntroEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onIntroEnd(); // Trigger the end of intro after 5 seconds
    }, 5000); // 5000ms = 5 seconds

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [onIntroEnd]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6624e] via-[#1D3557] to-[#A8DADC]">
      <div className="text-center animate-fade-in">
        <img
          src="/logo-icon.png"
          alt="Logo"
          className="w-[400px] drop-shadow-lg mx-auto animate-pulse"
        />
      </div>
    </div>
  );
};

const Login = ({ setTokens }) => {
  const [user, setUser] = useState({
    Identifiant: "",
    password: "",
  });
  const [showIntro, setShowIntro] = useState(true); // State to toggle intro
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      id: user.Identifiant,
      password: user.password,
    };

    const response = await fetch("https://backendrafik.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (response.status === 200) {
      setTokens({ token: data.token }); 
      localStorage.setItem("token", data.token);
      toast.success(data.message);
      navigate(`/Accueil/${data.token}`);
    } else {
      toast.error(data.message || "Erreur inconnue");
    }
  };

  const handleIntroEnd = () => {
    setShowIntro(false); // Hide intro and show login form
  };

  if (showIntro) {
    return <Intro onIntroEnd={handleIntroEnd} />;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Section Gauche - Branding et Animation */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#e6624e] via-[#1D3557] to-[#A8DADC] text-white items-center justify-center p-10 relative animate-gradient">
        <div className="text-center">
          <img src="/logo-icon.png" alt="Logo" className="w-[400px] drop-shadow-lg mx-auto" />
          <h1 className="text-4xl font-bold mt-6 tracking-wide">Magasin De Matériel Informatique</h1>
          <p className="text-lg text-gray-200 mt-2 italic">Votre espace sécurisé et performant</p>
        </div>
      </div>

      {/* Section Droite - Formulaire */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md animate-slide-up">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Bienvenue</h1>
          <p className="text-sm text-gray-500 text-center mb-8">Connectez-vous à votre tableau de bord</p>

          <form onSubmit={handleSubmit}>
            {/* Champ Identifiant */}
            <div className="mb-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant</label>
              <input
                value={user.Identifiant}
                onChange={(e) => setUser({ ...user, Identifiant: e.target.value })}
                type="text"
                placeholder="Entrez votre identifiant"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] focus:border-transparent outline-none transition duration-200 hover:border-[#1D3557] shadow-sm"
              />
            </div>

            {/* Champ Mot de Passe */}
            <div className="mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                type="password"
                placeholder="Entrez votre mot de passe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] focus:border-transparent outline-none transition duration-200 hover:border-[#1D3557] shadow-sm"
              />
            </div>

            {/* Bouton Connexion */}
            <button
              type="submit"
              className="w-full bg-[#D62828] text-white py-2 rounded-lg font-semibold shadow-md hover:bg-[#1D3557] focus:ring-4 focus:ring-[#A8DADC] transition duration-300 transform hover:scale-105 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;