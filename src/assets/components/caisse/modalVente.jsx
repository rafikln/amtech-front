import React from "react";
import toast from "react-hot-toast";

const ModalVente = ({
  saleData,
  paymentOptions,
  totalPrix,
  handleSaleChange,
  handlePaymentChange,
  handlePaymentInstallmentChange,
  addInstallment,
  removeInstallment,
  handleConfirmSale,
  handleCloseSaleModal,
}) => {
  const validateDirectSale = () => {
    if (saleData.saleMode === "direct") {
      const totalPayments = saleData.paymentMethods.reduce(
        (sum, pm) =>
          sum +
          pm.installments.reduce(
            (instSum, inst) => instSum + (parseFloat(inst.amount) || 0),
            0
          ),
        0
      );
      if (totalPayments !== totalPrix) {
        toast.error(
          `Pour une vente directe, le total des paiements (${totalPayments.toFixed(
            2
          )} DA) doit correspondre au total à payer (${totalPrix.toFixed(2)} DA).`
        );
        return false;
      }
    }
    return true;
  };

  const onConfirmSale = () => {
    if (validateDirectSale()) {
      handleConfirmSale();
    }
  };

  return (
    <div
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50"
      onClick={handleCloseSaleModal}
    >
      <div
        className="relative p-6 w-full max-w-4xl bg-white rounded-xl shadow-xl"
        style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t">
          <h3 className="text-2xl font-semibold text-gray-800">
            Détails de la vente
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full p-2 transition-colors duration-200"
            onClick={handleCloseSaleModal}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="sr-only">Fermer</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto" style={{ flex: 1 }}>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Objet de vente
              </label>
              <div className="flex gap-6">
                <label className="flex items-center text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="saleType"
                    value="comptoir"
                    checked={saleData.saleType === "comptoir"}
                    onChange={handleSaleChange}
                    className="mr-2 accent-blue-600 w-4 h-4"
                  />
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  Comptoir
                </label>
                <label className="flex items-center text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="saleType"
                    value="livraison"
                    checked={saleData.saleType === "livraison"}
                    onChange={handleSaleChange}
                    className="mr-2 accent-blue-600 w-4 h-4"
                  />
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  Livraison
                </label>
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Mode de vente
              </label>
              <div className="flex gap-6">
                <label className="flex items-center text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="saleMode"
                    value="direct"
                    checked={saleData.saleMode === "direct"}
                    onChange={handleSaleChange}
                    className="mr-2 accent-blue-600 w-4 h-4"
                  />
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Direct
                </label>
                <label className="flex items-center text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="saleMode"
                    value="versement"
                    checked={saleData.saleMode === "versement"}
                    onChange={handleSaleChange}
                    className="mr-2 accent-blue-600 w-4 h-4"
                  />
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6h4m-4-6V4m0 8v2m6-6h-2m-4 0H6m12 6h-2m-4 0H6"
                    />
                  </svg>
                  Versement
                </label>
              </div>
            </div>
          </div>
          {saleData.saleType === "livraison" && (
            <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Détails de la livraison
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Fournisseur de livraison
                  </label>
                  <select
                    name="deliveryProvider"
                    value={saleData.deliveryProvider}
                    onChange={handleSaleChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="yalidine">Yalidine</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Prix de livraison (DA)
                  </label>
                  <input
                    type="text"
                    name="deliveryPrice"
                    value={saleData.deliveryPrice}
                    onChange={handleSaleChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Entrez le prix"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Code livraison
                  </label>
                  <input
                    type="text"
                    name="deliveryCode"
                    value={saleData.deliveryCode}
                    onChange={handleSaleChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Entrez le code livraison"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Résumé financier
            </h4>
            <div className="space-y-3">
              <p className="text-base text-gray-600">
                Total à payer :{" "}
                <span className="font-semibold text-gray-800">
                  {totalPrix.toFixed(2)} DA
                </span>
              </p>
              <p className="text-base text-gray-600">
                Total versé :{" "}
                <span className="font-semibold text-green-600">
                  {saleData.paymentMethods
                    .reduce(
                      (sum, pm) =>
                        sum +
                        pm.installments.reduce(
                          (instSum, inst) =>
                            instSum + (parseFloat(inst.amount) || 0),
                          0
                        ),
                      0
                    )
                    .toFixed(2)}{" "}
                  DA
                </span>
              </p>
              <p className="text-base text-gray-600">
                Reste à payer :{" "}
                <span className="font-semibold text-red-600">
                  {(
                    totalPrix -
                    saleData.paymentMethods.reduce(
                      (sum, pm) =>
                        sum +
                        pm.installments.reduce(
                          (instSum, inst) =>
                            instSum + (parseFloat(inst.amount) || 0),
                          0
                        ),
                      0
                    )
                  ).toFixed(2)}{" "}
                  DA
                </span>
              </p>
            </div>
          </div>
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Modes de paiement
            </h4>
            <div className="space-y-6">
              {paymentOptions
                .filter((option) =>
                  saleData.saleType === "comptoir"
                    ? option.value !== "yalidine"
                    : true
                )
                .map((option) => {
                  const isChecked = saleData.paymentMethods.some(
                    (pm) => pm.method === option.value
                  );
                  const payment =
                    saleData.paymentMethods.find(
                      (pm) => pm.method === option.value
                    ) || {
                      installments: [
                        { amount: "", date: "", pdf_file: "" },
                      ],
                    };
                  return (
                    <div
                      key={option.value}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <label className="flex items-center text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handlePaymentChange(
                              option.value,
                              e.target.checked
                            )
                          }
                          className="mr-3 accent-blue-600 w-4 h-4"
                        />
                        {option.icon}
                        <span className="font-medium text-base">
                          {option.label}
                        </span>
                      </label>
                      {isChecked && (
                        <div className="mt-4 ml-8 space-y-4">
                          {payment.installments.map((inst, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block mb-2 text-sm font-medium text-gray-600">
                                    Montant (DA)
                                  </label>
                                  <input
                                    type="text"
                                    value={inst.amount}
                                    onChange={(e) =>
                                      handlePaymentInstallmentChange(
                                        option.value,
                                        index,
                                        "amount",
                                        e.target.value
                                      )
                                    }
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Montant en DA"
                                  />
                                </div>
                                {saleData.saleMode === "versement" && (
                                  <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-600">
                                      Date
                                    </label>
                                    <input
                                      type="date"
                                      value={inst.date}
                                      onChange={(e) =>
                                        handlePaymentInstallmentChange(
                                          option.value,
                                          index,
                                          "date",
                                          e.target.value
                                        )
                                      }
                                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                )}
                              </div>
                              {option.value === "ccp" && (
                                <div className="mt-4">
                                  <label className="block mb-2 text-sm font-medium text-gray-600">
                                    Justificatif CCP (PDF)
                                  </label>
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        const fileName = file.name || `ccp_recu_${option.value}_${index}_${Date.now()}.pdf`;
                                        handlePaymentInstallmentChange(
                                          option.value,
                                          index,
                                          "pdf_file", // Utiliser pdf_file pour correspondre à l'API
                                          fileName
                                        );
                                        handlePaymentInstallmentChange(
                                          option.value,
                                          index,
                                          "fileObject", // Stocker l'objet File temporairement
                                          file
                                        );
                                      }
                                    }}
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-3"
                                  />
                                  {inst.pdf_file && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      Fichier sélectionné : {inst.pdf_file}
                                    </p>
                                  )}
                                </div>
                              )}
                              {saleData.saleMode === "versement" &&
                                index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeInstallment(option.value, index)
                                    }
                                    className="mt-3 text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                                  >
                                    Supprimer ce versement
                                  </button>
                                )}
                            </div>
                          ))}
                          {saleData.saleMode === "versement" && (
                            <button
                              type="button"
                              onClick={() => addInstallment(option.value)}
                              className="text-bluenuclear
600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                            >
                              + Ajouter un versement
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          {saleData.saleMode === "versement" && (
            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Remarque sur le versement
              </label>
              <textarea
                name="installmentRemark"
                value={saleData.installmentRemark}
                onChange={handleSaleChange}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Ajouter une remarque sur le versement"
              />
            </div>
          )}
          <div className="mb-8">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Commentaire
            </label>
            <textarea
              name="comment"
              value={saleData.comment}
              onChange={handleSaleChange}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Ajoutez un commentaire..."
            />
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onConfirmSale}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 transition-colors duration-200"
          >
            Confirmer la vente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVente;