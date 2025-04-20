import React from "react";

const ModalConfirmationSuppression = ({ isOpen, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-labelledby="deleteDialogTitle"
      aria-describedby="deleteDialogDesc"
    >
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
        <h3 id="deleteDialogTitle" className="text-lg font-bold mb-4">
          Confirmer la suppression
        </h3>
        <p id="deleteDialogDesc" className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={`px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  ></path>
                </svg>
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmationSuppression;