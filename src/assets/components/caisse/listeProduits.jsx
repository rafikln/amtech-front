import React from "react";

const ListeProduits = ({
  filteredProduits,
  categories,
  searchTerm,
  selectedCategory,
  searchInputRef,
  handleSearchChange,
  handleSearchKeyPress,
  setSelectedCategory,
  handleAddToCart,
  getProductImage,
}) => {
  return (
    <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "15px" }} className="w-[100%]">
        <input
          type="text"
          ref={searchInputRef}
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
          placeholder="Rechercher ou scanner un produit (chiffres uniquement)"
          className="w-[60%]"
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        />
        <select
          value={selectedCategory}
          className="w-[30%]"
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            backgroundColor: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nom}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {filteredProduits.map((prod) => (
          <div
            key={prod.id}
            className="flex flex-col justify-between"
            onClick={() => handleAddToCart(prod)}
            style={{
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.06)",
              cursor: prod.quantite > 0 ? "pointer" : "not-allowed",
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              minHeight: "300px",
            }}
            onMouseEnter={(e) => prod.quantite > 0 && (e.currentTarget.style.transform = "scale(1.03)") && (e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)") && (e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.06)")}
          >
            <div className="w-full flex justify-center">
              <img
                src={getProductImage(prod)}
                alt={prod.nom}
                className="w-[60%] object-cover rounded-lg"
                style={{ maxWidth: "100%", border: "1px solid #f1f5f9" }}
              />
            </div>
            <h3
              style={{
                textAlign: "center",
                margin: "15px 0 10px",
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#1f2937",
                lineHeight: "1.4",
              }}
            >
              {prod.nom}
            </h3>
            <div className="flex flex-col items-center gap-2">
              <p
                style={{
                  textAlign: "center",
                  color: "#4b5563",
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
                Prix : <span style={{ color: "#1e40af", fontWeight: "600" }}>{prod.prix_vente} DA</span>
              </p>
              <p
                style={{
                  textAlign: "center",
                  color: prod.quantite > 0 ? "#059669" : "#dc2626",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  padding: "4px 8px",
                  backgroundColor: prod.quantite > 0 ? "#ecfdf5" : "#fee2e2",
                  borderRadius: "4px",
                }}
              >
                Stock : {prod.quantite}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeProduits;