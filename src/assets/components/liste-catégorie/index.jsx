import React, { useState, useEffect } from "react";



const ListeCat = ({isCollapsed,setIsCollapsed}) => {
  const [liste, setListe] = useState([]);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  // Charger les catégories depuis l'API
  const Liste = async () => {
    try {
      const response = await fetch("https://il-developer.com/api/categories ");
      if (response.ok) {
        const data = await response.json();
        setListe(data.data);
        setFilteredList(data.data); // Synchroniser la liste filtrée avec les données
      } else {
      }
    } catch (error) {
      toast.error("Erreur de connexion à l'API.");
    }
  };

  useEffect(() => {
    Liste();
  }, []);

  // Filtrage basé sur la recherche
  useEffect(() => {
    const filtered = liste.filter(
      (item) =>
        item.nom.toLowerCase().includes(searchTerm.toLowerCase()) || // Filtrer par nom
        item.id.toString().includes(searchTerm) // Filtrer par ID
    );
    setFilteredList(filtered);
  }, [searchTerm, liste]);

  const handleShowModal = (category) => {
    setSelectedCategory(category);
    setIsShowModalOpen(true);
  };

  const handleCloseShowModal = () => {
    setIsShowModalOpen(false);
    setSelectedCategory(null);
  };

  const handleUpdateModal = (category) => {
    setSelectedCategory(category);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedCategory(null);
  };

  const handleUpdateCategory = () => {
    Liste(); // Recharge les données après une mise à jour
  };

  const handleOpenConfirmModal = (id) => {
    setSelectedId(id);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!selectedId) return;

    try {
      const response = await fetch(`https://api.trendybox-dz.com/CategorieDelete/${selectedId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Catégorie supprimée avec succès !");
        setListe((prevListe) => prevListe.filter((item) => item.id !== selectedId));
        setFilteredList((prevListe) => prevListe.filter((item) => item.id !== selectedId));
        setIsConfirmModalOpen(false);
        setSelectedId(null);
      } else {
        const error = await response.json();
        toast.error( "Vous n'avez pas le droit de supprimer car il est utilisé. ");
      }
    } catch (error) {
      toast.error("Erreur de connexion à l'API.");
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setSelectedId(null);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <div className="w-full h-[90px] flex justify-between items-center p-[30px]">
        <div className="breadcrumbs text-sm">
          <ul>
            <li className="text-[gray]">
              <a>Accueil</a>
            </li>
            <li className="text-[blue]">
              <a>Liste Catégorie</a>
            </li>
          </ul>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="px-4 py-2 rounded-md shadow-md border focus:outline-none"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Recherche en temps réel
          />
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <div className="w-full pl-[30px] pr-[80px]">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">#Num</th>
                <th className="px-4 py-2 text-left">Nom de catégorie</th>
           
              </tr>
            </thead>
            <tbody>
              {filteredList.length > 0 ? (
                filteredList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.nom}</td>
                 
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 px-4 py-2">
                    Aucune catégorie trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

   
    </>
  );
};

export default ListeCat;
