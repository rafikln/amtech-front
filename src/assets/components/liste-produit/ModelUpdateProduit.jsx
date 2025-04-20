import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const ModelUpdateProduit = ({
  fetchProduits,
  isUpdateModalOpen,
  selectedProduct,
  handleCloseUpdateModal,
}) => {
  const [productData, setProductData] = useState({
    nom: "",
    description: "",
    prix_vente: 0,
    prix_achat: 0,
    quantite: 0,
    reference: "",
    categorie_id: "",
    marque: "",
    cpu: "",
    cpu_type: "",
    cpu_generation: "",
    ram: "",
    ecran_pouce: "",
    ecran_tactile: false,
    ecran_type: "",
    stockage_ssd: "",
    stockage_hdd: "",
    gpu_1: "",
    gpu_2: "",
    batterie: "",
    code_amoire: "",
    etat: "neuf",
    images: [],
    newImages: [],
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://il-developer.com/api/categories");
        const data = await response.json();
        if (response.ok) {
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error("Erreur chargement catégories:", error);
      }
    };

    fetchCategories();

    if (selectedProduct) {
      let images = [];
      try {
        images = selectedProduct.image
          ? Array.isArray(selectedProduct.image)
            ? selectedProduct.image
            : JSON.parse(selectedProduct.image)
          : [];
      } catch {
        images = [];
      }

      setProductData({
        nom: selectedProduct.nom || "",
        description: selectedProduct.description || "",
        prix_vente: selectedProduct.prix_vente || 0,
        prix_achat: selectedProduct.prix_achat || 0,
        quantite: selectedProduct.quantite || 0,
        reference: selectedProduct.reference || "",
        categorie_id: selectedProduct.categorie_id || "",
        marque: selectedProduct.marque || "",
        cpu: selectedProduct.cpu || "",
        cpu_type: selectedProduct.cpu_type || "",
        cpu_generation: selectedProduct.cpu_generation || "",
        ram: selectedProduct.ram || "",
        ecran_pouce: selectedProduct.ecran_pouce || "",
        ecran_tactile: selectedProduct.ecran_tactile || false,
        ecran_type: selectedProduct.ecran_type || "",
        stockage_ssd: selectedProduct.stockage_ssd || "",
        stockage_hdd: selectedProduct.stockage_hdd || "",
        gpu_1: selectedProduct.gpu_1 || "",
        gpu_2: selectedProduct.gpu_2 || "",
        batterie: selectedProduct.batterie || "",
        code_amoire: selectedProduct.code_amoire || "",
        etat: selectedProduct.etat || "neuf",
        images: images,
        newImages: [],
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProductData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...files],
    }));
  };

  const removeImage = (index, isNew) => {
    if (isNew) {
      setProductData((prev) => ({
        ...prev,
        newImages: prev.newImages.filter((_, i) => i !== index),
      }));
    } else {
      setProductData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.nom.trim()) {
      toast.error("Le nom du produit est obligatoire");
      return;
    }

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key !== "images" && key !== "newImages") {
        formData.append(key, value);
      }
    });

    productData.newImages.forEach((file) => {
      formData.append("images", file);
    });

    productData.images.forEach((img) => {
      formData.append(
        "existingImages",
        typeof img === "object" ? JSON.stringify(img) : img
      );
    });

    try {
      const response = await fetch(
        `https://il-developer.com/api/produits/${selectedProduct.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la mise à jour");
      }

      toast.success("Produit mis à jour avec succès");
      fetchProduits();
      handleCloseUpdateModal();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(error.message || "Erreur serveur");
    }
  };

  if (!isUpdateModalOpen || !selectedProduct) return null;

  const allImages = [
    ...productData.images.map((img) => ({
      src:
        typeof img === "object"
          ? `https://il-developer.com/${img.path}`
          : `https://il-developer.com/${img}`,
      isNew: false,
    })),
    ...productData.newImages.map((file) => ({
      src: URL.createObjectURL(file),
      isNew: true,
    })),
  ];

  const hasTechnicalSpecs =
    productData.cpu ||
    productData.cpu_type ||
    productData.cpu_generation ||
    productData.ram ||
    productData.ecran_pouce ||
    productData.ecran_type ||
    productData.stockage_ssd ||
    productData.stockage_hdd ||
    productData.gpu_1 ||
    productData.gpu_2 ||
    productData.batterie;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold">
            Modifier Produit: {selectedProduct.nom}
          </h3>
          <button
            onClick={handleCloseUpdateModal}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Images du produit</h4>
              {allImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {allImages.map((img, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={img.src}
                        className="w-full h-full object-cover rounded border"
                        alt={`Produit ${index}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, img.isNew)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <p>Aucune image</p>
                </div>
              )}
              <div className="mt-2">
                <label className="block mb-1">Ajouter des images</label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Informations de base</h4>
              <div className="space-y-3">
                <div>
                  <label className="block mb-1">Nom*</label>
                  <input
                    type="text"
                    name="nom"
                    value={productData.nom || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Référence</label>
                  <input
                    type="text"
                    name="reference"
                    value={productData.reference || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Code Armoire</label>
                  <input
                    type="text"
                    name="code_amoire"
                    value={productData.code_amoire || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Marque</label>
                  <input
                    type="text"
                    name="marque"
                    value={productData.marque || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Catégorie</label>
                  <select
                    name="categorie_id"
                    value={productData.categorie_id || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">État</label>
                  <select
                    name="etat"
                    value={productData.etat || "neuf"}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="neuf">Neuf</option>
                    <option value="occasion">Occasion</option>
                    <option value="reconditionne">Reconditionné</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Prix et stock</h4>
              <div className="space-y-3">
                <div>
                  <label className="block mb-1">Prix d'achat*</label>
                  <input
                    type="number"
                    name="prix_achat"
                    value={productData.prix_achat || 0}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Prix de vente*</label>
                  <input
                    type="number"
                    name="prix_vente"
                    value={productData.prix_vente || 0}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Quantité*</label>
                  <input
                    type="number"
                    name="quantite"
                    value={productData.quantite || 0}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <textarea
                name="description"
                value={productData.description || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="6"
              />
            </div>
          </div>

          {hasTechnicalSpecs && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Spécifications techniques</h4>
                <div className="space-y-3">
                  {productData.cpu && (
                    <div>
                      <label className="block mb-1">CPU</label>
                      <input
                        type="text"
                        name="cpu"
                        value={productData.cpu || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                  {productData.cpu_type && (
                    <div>
                      <label className="block mb-1">Type CPU</label>
                      <input
                        type="text"
                        name="cpu_type"
                        value={productData.cpu_type || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                  {productData.cpu_generation && (
                    <div>
                      <label className="block mb-1">Génération CPU</label>
                      <input
                        type="text"
                        name="cpu_generation"
                        value={productData.cpu_generation || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                  {productData.ram && (
                    <div>
                      <label className="block mb-1">RAM</label>
                      <input
                        type="text"
                        name="ram"
                        value={productData.ram || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                  {productData.ecran_pouce && (
                    <div>
                      <label className="block mb-1">Taille Écran (pouces)</label>
                      <input
                        type="text"
                        name="ecran_pouce"
                        value={productData.ecran_pouce || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="ecran_tactile"
                      name="ecran_tactile"
                      checked={productData.ecran_tactile || false}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor="ecran_tactile">Écran tactile</label>
                  </div>
                  {productData.ecran_type && (
                    <div>
                      <label className="block mb-1">Type d'écran</label>
                      <input
                        type="text"
                        name="ecran_type"
                        value={productData.ecran_type || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                  {productData.stockage_ssd && (
                    <div>
                      <label className="block mb-1">Stockage SSD</label>
                      <input
                        type="text"
                        name="stockage_ssd"
                        value={productData.stockage_ssd || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                  {productData.stockage_hdd && (
                    <div>
                      <label className="block mb-1">Stockage HDD</label>
                      <input
                        type="text"
                        name="stockage_hdd"
                        value={productData.stockage_hdd || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                  {productData.gpu_1 && (
                    <div>
                      <label className="block mb-1">GPU Principal</label>
                      <input
                        type="text"
                        name="gpu_1"
                        value={productData.gpu_1 || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                  {productData.gpu_2 && (
                    <div>
                      <label className="block mb-1">GPU Secondaire</label>
                      <input
                        type="text"
                        name="gpu_2"
                        value={productData.gpu_2 || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                  {productData.batterie && (
                    <div>
                      <label className="block mb-1">Batterie</label>
                      <input
                        type="text"
                        name="batterie"
                        value={productData.batterie || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="md:col-span-3 flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleCloseUpdateModal}
              className="px-5 py-2 border rounded hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModelUpdateProduit;