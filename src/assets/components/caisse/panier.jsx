import React from "react";

const Panier = ({
  achat,
  totalPrix,
  produitsDisponibles,
  truncateText,
  handlePriceChange,
  handleRemoveProduit,
  handleOpenWarrantyModal,
  handleOpenClientModal,
  handleSubmit,
  getProductImage,
}) => {
  return (
    <div
      style={{
        width: "35%",
        backgroundColor: "#fff",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #e5e7eb",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1e3a8a",
          borderRadius: "10px",
          padding: "15px",
          marginBottom: "20px",
          color: "#fff",
          fontFamily: "'Roboto', sans-serif",
          fontSize: "1.8rem",
          fontWeight: "bold",
        }}
      >
        {totalPrix.toFixed(2)} DA
      </div>
      <div className="flex-1 overflow-y-auto mb-6">
        {achat.produits.length === 0 ? (
          <p className="text-center text-gray-500 text-base font-medium py-8">
            Aucun produit ajouté.
          </p>
        ) : (
          <ul className="list-none p-0 space-y-4">
            {achat.produits.map((produit) => {
              const produitDetails = produitsDisponibles.find((p) => p.id === produit.produit_id);
              return (
                <li
                  key={produit.produit_id}
                  className="bg-white p-2 rounded-lg flex flex-col justify-between shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between px-2">
                    <div className="flex">
                      <div className="w-[60px]">
                        <img
                          src={getProductImage(produitDetails)}
                          alt={produitDetails?.nom}
                          className="min-w-[70%] h-[50px] rounded-md object-cover mr-4"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="m-0 text-base font-semibold text-gray-800">
                          {truncateText(produitDetails?.nom || "", 8)}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          Quantité : {produit.quantite}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={produit.prix}
                        onChange={(e) => handlePriceChange(produit.produit_id, e.target.value)}
                        className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200"
                      />
                      <button
                        onClick={() => handleOpenWarrantyModal(produit.produit_id)}
                        className="bg-green-500 text-white p-1 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-colors duration-200 text-sm font-medium"
                      >
                        Garantie
                      </button>
                      <button
                        onClick={() => handleRemoveProduit(produit.produit_id)}
                        className="bg-red-500 text-white p-1 rounded-[40%] hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors duration-200 text-sm font-medium"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 6h18M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2M5 6h14l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <button
            type="button"
            className={`bg-[#ffffff] border-[2px] rounded-lg ${
              !achat.client.nom ? 'text-[#bcb7b7ce] border-[#bcb7b7ce]' : "text-[#16933f] border-[#16934090]"
            }`}
            onClick={handleOpenClientModal}
            style={{
              width: "100%",
              padding: "12px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
          >
            {achat.client.nom ? `Client: ${achat.client.nom}` : "Sélectionner un client"}
          </button>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#1e3a8a",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e3a8a")}
        >
          Enregistrer l'achat
        </button>
      </form>
    </div>
  );
};

export default Panier;