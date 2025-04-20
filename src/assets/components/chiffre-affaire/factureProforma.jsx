import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const CashRegisterDashboard = () => {
  const [page, setPage] = useState(false);
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const [espaceRevenue, setEspaceRevenue] = useState(0);
  const [ccpRevenue, setCcpRevenue] = useState(0);
  const [yalidineRevenue, setYalidineRevenue] = useState(0);

  // Calculate general total
  const generalTotal = espaceRevenue + ccpRevenue + yalidineRevenue;

  // Fetch cash register data (simulated or replace with real API)
  const fetchCashRegisters = async () => {
    try {
      // Simulated API response (replace with real API if available)
      const response = await new Promise((resolve) =>
        setTimeout(() =>
          resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                espace: 15000.50,
                ccp: 23000.75,
                yalidine: 8700.25,
              }),
          }), 500)
      );

      if (!response.ok) throw new Error("Erreur lors de la récupération des données des caisses");

      const data = await response.json();
      setEspaceRevenue(data.espace || 0);
      setCcpRevenue(data.ccp || 0);
      setYalidineRevenue(data.yalidine || 0);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la récupération des données.");
    }
  };

  useEffect(() => {
    if (page) fetchCashRegisters();
  }, [page]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {page ? (
        <div className="p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Tableau de bord des caisses
          </h1>

          {/* Cash Register Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Espace Cash Register */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Caisse Espace</h2>
              <p className="text-lg font-bold text-red-600">
                Total: {espaceRevenue.toFixed(2)} DA
              </p>
            </div>

            {/* CCP Cash Register */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Caisse CCP</h2>
              <p className="text-lg font-bold text-yellow-600">
                Total: {ccpRevenue.toFixed(2)} DA
              </p>
            </div>

            {/* Yalidine Cash Register */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Caisse Yalidine</h2>
              <p className="text-lg font-bold text-green-600">
                Total: {yalidineRevenue.toFixed(2)} DA
              </p>
            </div>

            {/* General Cash Register */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Caisse Générale</h2>
              <p className="text-lg font-bold text-blue-600">
                Total: {generalTotal.toFixed(2)} DA
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          <div className="bg-white/80 backdrop-blur-lg p-10 rounded-lg shadow-xl w-[400px]">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Connexion sécurisée</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (password === "admin123") {
                  setPage(true);
                  setHasError(false);
                } else {
                  setHasError(true);
                  toast.error("Mot de passe incorrect. Veuillez réessayer.");
                }
              }}
            >
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setHasError(false);
                  }}
                  className={`w-full p-3 rounded-lg border ${
                    hasError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  } focus:ring-2 focus:outline-none transition`}
                  required
                />
                {hasError && (
                  <p className="text-red-500 text-sm mt-2">Mot de passe incorrect. Essayez à nouveau.</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full p-3 text-lg font-semibold text-white bg-[#070c2b] hover:bg-[#070c2bc8] rounded-lg focus:ring-4 focus:ring-blue-300 transition"
              >
                Se connecter
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashRegisterDashboard;