import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import NavBar from "../layout/navbar.jsx";
import Drawer from "../layout/drawer.jsx";

// Pour les pages
import ListeCat from "../components/liste-catégorie/index.jsx";
import AjouterProduit from "../components/ajouter-produit/index.jsx";
import ListeProduit from "../components/liste-produit/index.jsx";
import Caisse from "../components/caisse/index.jsx";
import ListeVente from "../components/liste-vente/pages/index.jsx";
import CashRegisterDashboard from "../components/chiffre-affaire/factureProforma.jsx";
import toast from "react-hot-toast";

function Accueil({ tokens, setTokens }) {
  const [isCollapsed, setIsCollapsed] = useState(false); // État pour gérer l'ouverture/fermeture

  const { id } = useParams(); // Récupérer l'ID depuis l'URL
  
  // Redirection si l'ID ne correspond pas au token
  if (id !== tokens.token) {
    return <Navigate to="/" replace />;
  }

  const [liste, setListe] = useState([]); // Catégories
  const [listproduit, setListeproduit] = useState([]); // Produits
  const [page, setPage] = useState(0); // Gestion de la page active
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Gestion de la visibilité du drawer

  // Fonction pour charger les données depuis l'API
  const fetchData = async (url, setData, errorMessage) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setData(data.data); // Mise à jour de l'état
      } else {
      }
    } catch (error) {
      toast.error("Erreur serveur.");
    }
  };



  return (
    <div className="w-full h-[100vh]">
      {/* Barre de navigation */}
      <NavBar />

      {/* Contenu principal */}
      <div className="w-full flex">
        {/* Drawer (barre latérale) */}
        {isDrawerOpen && <Drawer setPage={setPage}    isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} closeDrawer={() => setIsDrawerOpen(false)} />}

        {/* Contenu principal */}
        <div
          style={{
            width: ! isCollapsed ? "calc(100vw - 18vw)" : "100vw",
            height: "calc(100vh - 80px)",
            overflow: "auto",
          }}
        >
          {/* Bouton pour rouvrir le drawer */}
          {!isDrawerOpen && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              style={{
                position: "fixed",
                top: "20px",
                left: "20px",
                padding: "10px",
                backgroundColor: "#004d00",
                color: "#fff",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Ouvrir le menu
            </button>
          )}

          {/* Rendu conditionnel des composants */}
          {page === 0 && <ListeCat liste={liste} setListe={setListe} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
          {page === 2 && <ListeProduit produits={listproduit} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}  />}
          {page === 3 && <AjouterProduit liste={liste} fetchData={fetchData}  isCollapsed={isCollapsed}  setIsCollapsed={setIsCollapsed}  />}
          {page === 4 && <Caisse listproduit={listproduit}  liste={liste} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
          {page === 5 && <ListeVente isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
          {page === 6 && <CashRegisterDashboard isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}

        </div>
      </div>
    </div>
  );
}

export default Accueil;
