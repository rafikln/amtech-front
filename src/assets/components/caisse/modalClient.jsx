import React from "react";

const ModalClient = ({
  client,
  wilayas,
  recommandations,
  handleClientChange,
  handleSaveClient,
  handleCloseClientModal,
}) => {
  return (
    <div
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50"
      onClick={handleCloseClientModal}
    >
      <div
        className="relative p-4 w-full max-w-md bg-white rounded-lg shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b rounded-t">
          <h3 className="text-lg font-semibold text-gray-900">
            Informations du client
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            onClick={handleCloseClientModal}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
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
            <span className="sr-only">Fermer</span>
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nom"
              value={client.nom}
              onChange={handleClientChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Numéro de téléphone
            </label>
            <input
              type="text"
              name="telephone"
              value={client.telephone}
              onChange={handleClientChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={client.email}
              onChange={handleClientChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Wilaya
            </label>
            <select
              name="wilaya"
              value={client.wilaya}
              onChange={handleClientChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            >
              <option value="">Sélectionner une wilaya</option>
              {wilayas.map((wilaya, index) => (
                <option key={index} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Recommandation
            </label>
            <select
              name="recommandation"
              value={client.recommandation}
              onChange={handleClientChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            >
              <option value="">Sélectionner une source</option>
              {recommandations.map((recommandation, index) => (
                <option key={index} value={recommandation}>
                  {recommandation}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleSaveClient}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalClient;