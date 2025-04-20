import React from "react";

const FormulaireMiseAJourGarantie = ({
  warrantyData,
  setWarrantyData,
  handleWarrantyUpdate,
  setIsUpdateModalOpen,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-screen bg-[#00000058] bg-opacity-60">
      <div
        className="relative p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Mettre à jour les garanties
          </h3>
          <button
            onClick={() => setIsUpdateModalOpen(false)}
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {warrantyData.map((produit, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Produit ID
                </label>
                <input
                  type="text"
                  value={produit.produit_id}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Code Garantie
                </label>
                <input
                  type="text"
                  value={produit.code_garantie}
                  onChange={(e) => {
                    const newData = [...warrantyData];
                    newData[index].code_garantie = e.target.value;
                    setWarrantyData(newData);
                  }}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Durée Garantie
                </label>
                <input
                  type="text"
                  value={produit.duree_garantie}
                  onChange={(e) => {
                    const newData = [...warrantyData];
                    newData[index].duree_garantie = e.target.value;
                    setWarrantyData(newData);
                  }}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
            </div>
          ))}
          <button
            onClick={handleWarrantyUpdate}
            className="w-full mt-4 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormulaireMiseAJourGarantie;