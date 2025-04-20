import React from "react";

const FormulaireAjoutVersement = ({
  paymentData,
  setPaymentData,
  handlePaymentUpdate,
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
            Ajouter un versement
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
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Méthode de paiement
            </label>
            <select
              value={paymentData.method}
              onChange={(e) =>
                setPaymentData({ ...paymentData, method: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="">Sélectionner...</option>
              <option value="ccp">CCP</option>
              <option value="cash">Espèces</option>
              <option value="yalidine">Yalidine</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Montant (DA)
            </label>
            <input
              type="number"
              value={paymentData.amount}
              onChange={(e) =>
                setPaymentData({ ...paymentData, amount: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Date
            </label>
            <input
              type="date"
              value={paymentData.date}
              onChange={(e) =>
                setPaymentData({ ...paymentData, date: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            />
          </div>
          {paymentData.method === "ccp" && (
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Justificatif (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setPaymentData({ ...paymentData, pdfFile: e.target.files[0] })
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              />
            </div>
          )}
          <button
            onClick={handlePaymentUpdate}
            className="w-full mt-4 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Ajouter Versement
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormulaireAjoutVersement;