import React from "react";

const ConfirmedeleteProduit = ({ isConfirmModalOpen, handleDeleteCategory, handleCancelDelete }) => {
  return (
    <>
      {isConfirmModalOpen && (
        <div
          id="popup-modal"
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
        >
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-4 max-w-md w-full">
            <h3 className="text-[20px] font-normal text-gray-500 dark:text-gray-400 text-center">
              Êtes-vous sûr de vouloir supprimer ce produit ?
            </h3>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={handleDeleteCategory}
                className="text-white bg-red-600 hover:bg-red-800 rounded-lg px-5 py-2"
              >
                Oui, supprimer
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-200 hover:bg-gray-300 rounded-lg px-5 py-2"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmedeleteProduit;