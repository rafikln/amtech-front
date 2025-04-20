import React from "react";
import GenerationTicketPDF from "./GenerationTicketPDF";
import show from "../../icon/show.svg";
import update from "../../icon/update.svg";
import delet from "../../icon/delete.svg";

const TableauProduits = ({
  produits,
  produitsFiltres,
  API_URL,
  handleShowModal,
  handleShowUpdateModal,
  handleOpenDeleteModal,
}) => {
  const getProductImage = (produit) => {
    try {
      if (!produit.image) return null;
      if (Array.isArray(produit.image)) {
        const firstImage = produit.image[0];
        return firstImage?.path ? `${API_URL}/${firstImage.path}` : null;
      }
      if (typeof produit.image === "string") {
        try {
          const parsed = JSON.parse(produit.image);
          if (Array.isArray(parsed)) {
            const firstImg = parsed[0];
            return firstImg?.path ? `${API_URL}/${firstImg.path}` : null;
          }
          return parsed?.path ? `${API_URL}/${parsed.path}` : null;
        } catch {
          return `${API_URL}/${produit.image}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Erreur traitement image:", error);
      return null;
    }
  };

  return (
    <div className="pl-[30px] pr-[80px]">
      {produits.length === 0 ? (
        <div className="text-center py-10">
          <p>Aucun produit disponible</p>
        </div>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-16 py-3"><span>Image</span></th>
                <th scope="col" className="px-6 py-3">Nom de produit</th>
                <th scope="col" className="px-6 py-3">Qte</th>
                <th scope="col" className="px-6 py-3">Prix</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {produitsFiltres.map((produit) => (
                <tr
                  key={produit.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="p-4">
                    <div className="w-[160px] h-[160px] flex flex-col justify-center items-center">
                      <img
                        src={getProductImage(produit)}
                        className="w-[90%]"
                        style={{
                          margin: "0 auto",
                          display: "block",
                          borderRadius: "5px",
                          userSelect: "none",
                          objectFit: "cover",
                        }}
                        alt={produit.nom}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/path/to/placeholder-image.jpg";
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 w-[30%] font-semibold text-gray-900 dark:text-white">
                    {produit.nom}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <input
                        type="number"
                        disabled
                        value={produit.quantite}
                        className="bg-gray-50 w-[65px] text-center border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold w-[13%] text-gray-900 dark:text-white">
                    {produit.prix_vente} DA
                  </td>
                  <td className="h-[170px] flex gap-2 items-center">
                    <div
                      className="w-[33px] h-[30px] flex justify-center p-1 items-center rounded-md bg-[#827474] cursor-pointer"
                      onClick={() => handleShowModal(produit)}
                    >
                      <img src={show} alt="show" />
                    </div>
                    <div
                      className="w-[33px] h-[30px] flex justify-center p-1 items-center rounded-md bg-[#3e47f5] cursor-pointer"
                      onClick={() => handleShowUpdateModal(produit)}
                    >
                      <img src={update} alt="update" />
                    </div>
                    <div
                      className="w-[33px] h-[30px] flex justify-center p-1 items-center rounded-md bg-[#d14f4f] cursor-pointer"
                      onClick={() => handleOpenDeleteModal(produit.id)}
                    >
                      <img src={delet} alt="delete" />
                    </div>
                    <GenerationTicketPDF produit={produit} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TableauProduits;