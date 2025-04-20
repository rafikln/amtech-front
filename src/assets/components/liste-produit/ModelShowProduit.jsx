import { useState } from "react";
import Barcode from "react-barcode";

const ModelShowProduit = ({ isModalOpen, selectedProduct, handleCloseModal }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!selectedProduct) return null;

  let images = [];
  try {
    images = selectedProduct.image
      ? Array.isArray(selectedProduct.image)
        ? selectedProduct.image
        : JSON.parse(selectedProduct.image)
      : [];
  } catch (error) {
    console.error("Erreur lors du parsing des images:", error);
    images = [];
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const hasTechnicalSpecs =
    selectedProduct.cpu ||
    selectedProduct.ram ||
    selectedProduct.stockage_ssd ||
    selectedProduct.stockage_hdd ||
    selectedProduct.gpu_1 ||
    selectedProduct.gpu_2 ||
    selectedProduct.ecran_pouce ||
    selectedProduct.batterie;

  return (
    <>
      {isModalOpen && (
        <div
          id="crud-modal"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div
            className="relative p-4 w-[90vw] max-w-3xl bg-white rounded-lg shadow dark:bg-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-2 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedProduct.nom}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-6 h-6 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={handleCloseModal}
              >
                <svg
                  className="w-3 h-3"
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

            <div className="grid md:grid-cols-2 gap-4 p-2">
              <div className="space-y-2">
                <div className="flex justify-center mb-2">
                  <div className="bg-white p-1 rounded">
                    <Barcode
                      value={selectedProduct.reference || selectedProduct.id.toString()}
                      width={1.5}
                      height={50}
                      fontSize={12}
                      margin={5}
                      displayValue={true}
                    />
                  </div>
                </div>

                <div
                  id="default-carousel"
                  className="relative w-full h-48 overflow-hidden rounded-lg"
                >
                  {images.length > 0 ? (
                    <>
                      {images.map((img, index) => {
                        const imgSrc =
                          typeof img === "object"
                            ? `https://il-developer.com/${img.path}`
                            : `https://il-developer.com/${img}`;
                        return (
                          <div
                            key={index}
                            className={`absolute w-full h-full transition-opacity duration-300 flex justify-center items-center ${
                              index === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            <img
                              src={imgSrc}
                              className="max-h-full max-w-full object-contain"
                              alt={`Image ${index + 1}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/path/to/placeholder-image.jpg";
                              }}
                            />
                          </div>
                        );
                      })}
                      {images.length > 1 && (
                        <>
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            {images.map((_, index) => (
                              <button
                                key={index}
                                className={`w-2 h-2 rounded-full ${
                                  index === currentSlide ? "bg-blue-600" : "bg-gray-400"
                                }`}
                                onClick={() => setCurrentSlide(index)}
                              />
                            ))}
                          </div>
                          <button
                            className="absolute top-1/2 left-1 transform -translate-y-1/2 bg-gray-800/30 text-white p-1 rounded-full text-xs"
                            onClick={prevSlide}
                          >
                            ◀
                          </button>
                          <button
                            className="absolute top-1/2 right-1 transform -translate-y-1/2 bg-gray-800/30 text-white p-1 rounded-full text-xs"
                            onClick={nextSlide}
                          >
                            ▶
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Aucune image</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Référence</p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProduct.reference || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Code Armoire</p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProduct.code_amoire || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Marque</p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProduct.marque || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">État</p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProduct.etat || "-"}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Prix d'Achat</p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProduct.prix_achat ? `${selectedProduct.prix_achat} DA` : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Prix de Vente</p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProduct.prix_vente ? `${selectedProduct.prix_vente} DA` : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Quantité</p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProduct.quantite || "0"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Catégorie</p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProduct.categorie_nom || "-"}
                    </p>
                  </div>
                </div>

                {hasTechnicalSpecs && (
                  <div className="col-span-2 mt-2 space-y-1">
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      Spécifications Techniques
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {selectedProduct.cpu && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">CPU</p>
                          <p className="text-gray-900 dark:text-white">
                            {`${selectedProduct.cpu} (${selectedProduct.cpu_type || "N/A"} ${
                              selectedProduct.cpu_generation || "N/A"
                            })`}
                          </p>
                        </div>
                      )}
                      {selectedProduct.ram && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">RAM</p>
                          <p className="text-gray-900 dark:text-white">{selectedProduct.ram}</p>
                        </div>
                      )}
                      {selectedProduct.stockage_ssd && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Stockage SSD</p>
                          <p className="text-gray-900 dark:text-white">
                            {selectedProduct.stockage_ssd}
                          </p>
                        </div>
                      )}
                      {selectedProduct.stockage_hdd && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Stockage HDD</p>
                          <p className="text-gray-900 dark:text-white">
                            {selectedProduct.stockage_hdd}
                          </p>
                        </div>
                      )}
                      {selectedProduct.gpu_1 && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">GPU Principal</p>
                          <p className="text-gray-900 dark:text-white">{selectedProduct.gpu_1}</p>
                        </div>
                      )}
                      {selectedProduct.gpu_2 && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">GPU Secondaire</p>
                          <p className="text-gray-900 dark:text-white">{selectedProduct.gpu_2}</p>
                        </div>
                      )}
                      {selectedProduct.ecran_pouce && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Écran</p>
                          <p className="text-gray-900 dark:text-white">
                            {`${selectedProduct.ecran_pouce}" ${selectedProduct.ecran_type || "N/A"}`}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Écran Tactile</p>
                        <p className="text-gray-900 dark:text-white">
                          {selectedProduct.ecran_tactile ? "Oui" : "Non"}
                        </p>
                      </div>
                      {selectedProduct.batterie && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Batterie</p>
                          <p className="text-gray-900 dark:text-white">{selectedProduct.batterie}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="col-span-2 mt-1">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-gray-900 dark:text-white text-sm whitespace-pre-line">
                    {selectedProduct.description || "Aucune description"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModelShowProduit;