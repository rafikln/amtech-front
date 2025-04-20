import { useState } from "react";
import toast from "react-hot-toast";

const AjouterProduit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: "1", nom: "PC Portable" },
    { id: "2", nom: "Téléphone" },
    { id: "3", nom: "Accessoire" },
  ];

  const ecranTypes = ["HD", "FHD", "4K", "IPS"];

  // Updated initial state to match new JSON
  const [produit, setProduit] = useState({
    nom: "",
    marque: "",
    description: "",
    cpu: "", // Added
    cpu_generation: "",
    cpu_type: "",
    ram: "",
    ecran_pouce: "",
    ecran_tactile: false, // Changed to boolean
    ecran_type: "",
    stockage_ssd: "",
    stockage_hdd: "",
    gpu_1: "",
    gpu_2: "",
    double_gpu: "non", // Still used for conditional rendering
    prix_achat: "",
    prix_vente: "",
    prix_final: "", // Not in new JSON, but kept for consistency with previous request
    batterie: "",
    code_amoire: "",
    reference: "",
    etat: "",
    quantite: "",
    categorie_id: "1",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("PC Portable");

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setProduit((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const categorie_id = e.target.value;
    const category = categories.find((c) => c.id === categorie_id);
    setSelectedCategory(category?.nom);
    setProduit((prev) => ({ ...prev, categorie_id }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...produit.images, ...files];
    const newPreviews = [...imagePreviews, ...files.map((file) => URL.createObjectURL(file))];
    setProduit((prev) => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  const handleRemoveImage = (index) => {
    const newImages = produit.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setProduit((prev) => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("nom", produit.nom.trim());
      formData.append("marque", produit.marque.trim());
      formData.append("description", produit.description.trim());
      formData.append("cpu", produit.cpu.trim()); // Added
      formData.append("cpu_generation", produit.cpu_generation.trim());
      formData.append("cpu_type", produit.cpu_type.trim());
      formData.append("ram", produit.ram.trim());
      formData.append("ecran_pouce", produit.ecran_pouce);
      formData.append("ecran_tactile", produit.ecran_tactile); // Boolean
      formData.append("ecran_type", produit.ecran_type);
      formData.append("stockage_ssd", produit.stockage_ssd.trim());
      formData.append("stockage_hdd", produit.stockage_hdd.trim());
      formData.append("gpu_1", produit.gpu_1.trim());
      if (produit.double_gpu === "oui" && produit.gpu_2) {
        formData.append("gpu_2", produit.gpu_2.trim());
      } else {
        formData.append("gpu_2", ""); // Empty string if no second GPU
      }
      formData.append("prix_achat", produit.prix_achat);
      formData.append("prix_vente", produit.prix_vente);
      if (produit.prix_final) formData.append("prix_final", produit.prix_final); // Optional
      formData.append("batterie", produit.batterie.trim());
      formData.append("code_amoire", produit.code_amoire.trim());
      formData.append("reference", produit.reference.trim());
      formData.append("etat", produit.etat || "neuf");
      formData.append("quantite", produit.quantite);
      formData.append("categorie_id", produit.categorie_id);

      produit.images.forEach((image) => {
        formData.append("images", image); // Changed to "images" to match backend
      });

      const response = await fetch("https://il-developer.com/api/produits/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'ajout");
      }

      setProduit({
        nom: "",
        marque: "",
        description: "",
        cpu: "",
        cpu_generation: "",
        cpu_type: "",
        ram: "",
        ecran_pouce: "",
        ecran_tactile: false,
        ecran_type: "",
        stockage_ssd: "",
        stockage_hdd: "",
        gpu_1: "",
        gpu_2: "",
        double_gpu: "non",
        prix_achat: "",
        prix_vente: "",
        prix_final: "",
        batterie: "",
        code_amoire: "",
        reference: "",
        etat: "",
        quantite: "",
        categorie_id: "1",
        images: [],
      });
      setImagePreviews([]);
      toast.success("Produit ajouté avec succès !");
    } catch (error) {
      toast.error(error.message || "Une erreur est survenue lors de l'ajout du produit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSpecificFields = () => {
    switch (selectedCategory) {
      case "PC Portable":
        return (
          <>
            {/* CPU Fields */}
            <div>
              <label htmlFor="cpu" className="block mb-2 text-sm font-medium text-gray-900">
                CPU
              </label>
              <input
                type="text"
                id="cpu"
                value={produit.cpu}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Ex: i7"
                required
              />
            </div>
            <div>
              <label htmlFor="cpu_type" className="block mb-2 text-sm font-medium text-gray-900">
                Type CPU
              </label>
              <input
                type="text"
                id="cpu_type"
                value={produit.cpu_type}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Ex: Intel"
                required
              />
            </div>
            <div>
              <label htmlFor="cpu_generation" className="block mb-2 text-sm font-medium text-gray-900">
                Génération CPU
              </label>
              <input
                type="text"
                id="cpu_generation"
                value={produit.cpu_generation}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Ex: 13th Gen"
                required
              />
            </div>

            <div>
              <label htmlFor="ram" className="block mb-2 text-sm font-medium text-gray-900">
                RAM
              </label>
              <input
                type="text"
                id="ram"
                value={produit.ram}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>

            {/* Screen Fields */}
            <div>
              <label htmlFor="ecran_pouce" className="block mb-2 text-sm font-medium text-gray-900">
                Taille d'écran (pouces)
              </label>
              <input
                type="text"
                id="ecran_pouce"
                value={produit.ecran_pouce}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Ex: 15.0"
                required
              />
            </div>
            <div>
              <label htmlFor="ecran_tactile" className="block mb-2 text-sm font-medium text-gray-900">
                Écran Tactile
              </label>
              <input
                type="checkbox"
                id="ecran_tactile"
                checked={produit.ecran_tactile}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="ecran_type" className="block mb-2 text-sm font-medium text-gray-900">
                Type d'écran
              </label>
              <select
                id="ecran_type"
                value={produit.ecran_type}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="">Sélectionnez un type</option>
                {ecranTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Storage Fields */}
            <div>
              <label htmlFor="stockage_ssd" className="block mb-2 text-sm font-medium text-gray-900">
                Stockage SSD
              </label>
              <input
                type="text"
                id="stockage_ssd"
                value={produit.stockage_ssd}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Ex: 128GB"
              />
            </div>
            <div>
              <label htmlFor="stockage_hdd" className="block mb-2 text-sm font-medium text-gray-900">
                Stockage HDD
              </label>
              <input
                type="text"
                id="stockage_hdd"
                value={produit.stockage_hdd}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Ex: 1TB"
              />
            </div>

            {/* GPU Fields */}
            <div>
              <label htmlFor="double_gpu" className="block mb-2 text-sm font-medium text-gray-900">
                Double carte graphique
              </label>
              <select
                id="double_gpu"
                value={produit.double_gpu}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="non">Non</option>
                <option value="oui">Oui</option>
              </select>
            </div>
            <div>
              <label htmlFor="gpu_1" className="block mb-2 text-sm font-medium text-gray-900">
                GPU Principal
              </label>
              <input
                type="text"
                id="gpu_1"
                value={produit.gpu_1}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
            {produit.double_gpu === "oui" && (
              <div>
                <label htmlFor="gpu_2" className="block mb-2 text-sm font-medium text-gray-900">
                  GPU Secondaire
                </label>
                <input
                  type="text"
                  id="gpu_2"
                  value={produit.gpu_2}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
            )}

            <div>
              <label htmlFor="batterie" className="block mb-2 text-sm font-medium text-gray-900">
                Batterie
              </label>
              <input
                type="text"
                id="batterie"
                value={produit.batterie}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>

            <div>
              <label htmlFor="code_amoire" className="block mb-2 text-sm font-medium text-gray-900">
                Code Amoire
              </label>
              <input
                type="text"
                id="code_amoire"
                value={produit.code_amoire}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
          </>
        );

      case "Téléphone":
        return (
          <>
            <div>
              <label htmlFor="stockage_ssd" className="block mb-2 text-sm font-medium text-gray-900">
                Stockage
              </label>
              <input
                type="text"
                id="stockage_ssd"
                value={produit.stockage_ssd}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
            <div>
              <label htmlFor="batterie" className="block mb-2 text-sm font-medium text-gray-900">
                Batterie
              </label>
              <input
                type="text"
                id="batterie"
                value={produit.batterie}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
          </>
        );

      case "Accessoire":
        return null;

      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full h-[90px] flex justify-between items-center p-[30px]">
        <div className="breadcrumbs text-sm">
          <ul>
            <li className="text-[gray]">
              <a>Accueil</a>
            </li>
            <li className="text-[blue]">
              <a>Ajouter Produit</a>
            </li>
          </ul>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 px-[60px]">
        <div>
          <label htmlFor="categorie_id" className="block mb-2 text-sm font-medium text-gray-900">
            Catégorie
          </label>
          <select
            id="categorie_id"
            value={produit.categorie_id}
            onChange={handleCategoryChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="nom" className="block mb-2 text-sm font-medium text-gray-900">
            Nom du produit
          </label>
          <input
            type="text"
            id="nom"
            value={produit.nom}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        <div>
          <label htmlFor="marque" className="block mb-2 text-sm font-medium text-gray-900">
            Marque
          </label>
          <input
            type="text"
            id="marque"
            value={produit.marque}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            id="description"
            value={produit.description}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            rows="3"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{renderSpecificFields()}</div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="prix_achat" className="block mb-2 text-sm font-medium text-gray-900">
              Prix d'achat
            </label>
            <input
              type="number"
              id="prix_achat"
              value={produit.prix_achat}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label htmlFor="prix_vente" className="block mb-2 text-sm font-medium text-gray-900">
              Prix de vente
            </label>
            <input
              type="number"
              id="prix_vente"
              value={produit.prix_vente}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label htmlFor="prix_final" className="block mb-2 text-sm font-medium text-gray-900">
              Prix final
            </label>
            <input
              type="number"
              id="prix_final"
              value={produit.prix_final}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div>
            <label htmlFor="quantite" className="block mb-2 text-sm font-medium text-gray-900">
              Quantité
            </label>
            <input
              type="number"
              id="quantite"
              value={produit.quantite}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label htmlFor="reference" className="block mb-2 text-sm font-medium text-gray-900">
              Référence
            </label>
            <input
              type="text"
              id="reference"
              value={produit.reference}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
        </div>

        {selectedCategory !== "Accessoire" && (
          <div>
            <label htmlFor="etat" className="block mb-2 text-sm font-medium text-gray-900">
              État
            </label>
            <input
              type="text"
              id="etat"
              value={produit.etat}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required={selectedCategory !== "Accessoire"}
            />
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Images</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img src={preview} alt="Preview" className="h-24 rounded-lg" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 text-white rounded-lg ${
              isSubmitting ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Envoi en cours..." : "Ajouter le produit"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AjouterProduit;