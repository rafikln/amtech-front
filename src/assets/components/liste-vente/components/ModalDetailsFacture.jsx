import { useState } from "react";
import Barcode from "react-barcode";
import { ClipboardIcon, DocumentArrowDownIcon, PencilIcon, PlusIcon, Cog8ToothIcon } from "@heroicons/react/24/outline";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PaiementsPDF from "../pdf/PaiementsPDF";
import FormulaireMiseAJourGarantie from "./FormulaireMiseAJourGarantie";
import FormulaireAjoutVersement from "./FormulaireAjoutVersement";
import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";

const ModalDetailsFacture = ({
  isModalOpen,
  selectedFacture,
  handleCloseModal,
  updateFactureData,
}) => {
  const [copied, setCopied] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateType, setUpdateType] = useState(null);
  const [warrantyData, setWarrantyData] = useState([]);
  const [paymentData, setPaymentData] = useState({
    method: "",
    amount: "",
    date: "",
    pdfFile: null,
  });
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  if (!selectedFacture) return null;

  const calculatedProductTotal = selectedFacture.produits
    ? selectedFacture.produits.reduce(
        (sum, produit) => sum + produit.prix * produit.quantite,
        0
      )
    : 0;

  // Calculer le total payé
  const totalPaid = selectedFacture.paymentMethods
    ? selectedFacture.paymentMethods.reduce((sum, method) => {
        return (
          sum +
          method.installments.reduce(
            (installmentSum, installment) =>
              installmentSum + (parseFloat(installment.amount) || 0),
            0
          )
        );
      }, 0)
    : 0;

  // Calculer le montant restant à payer
  const remainingAmount = (parseFloat(selectedFacture.prix_total) || 0) - totalPaid;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PriceDisplay = ({ value }) => (
    <span className="text-gray-700 dark:text-gray-300">
      {parseFloat(value || 0).toFixed(2)} DA
    </span>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleActionMenu = () => {
    setIsActionMenuOpen(!isActionMenuOpen);
  };

  const handleValidate = async () => {
    // Vérifier si le montant restant est 0
    if (remainingAmount !== 0) {
      toast.error("La facture ne peut être validée tant que le montant restant n'est pas de 0 DA.");
      return;
    }

    try {
      const response = await fetch(`https://il-developer.com/api/factures/status/${selectedFacture.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Ajouter le token d'authentification si nécessaire
          // "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "paid" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la validation de la facture");
      }

      // Mettre à jour l'état local de la facture
      updateFactureData({ ...selectedFacture, status: "paid" });

      toast.success("Facture validée avec succès !");
      setIsActionMenuOpen(false);
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || "Erreur lors de la validation de la facture");
    }
  };

  const handleCancel = async () => {
    try {
      const response = await fetch(`https://il-developer.com/api/factures/status/${selectedFacture.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Ajouter le token d'authentification si nécessaire
          // "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "canceled" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'annulation de la facture");
      }

      // Mettre à jour l'état local de la facture
      updateFactureData({ ...selectedFacture, status: "canceled" });

      toast.success("Facture annulée avec succès !");
      setIsActionMenuOpen(false);
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || "Erreur lors de l'annulation de la facture");
    }
  };

  // Fonction pour ouvrir la modale de mise à jour (garantie ou paiement)
  const openUpdateModal = (type) => {
    setUpdateType(type);
    setIsUpdateModalOpen(true);
  };

  return (
    <>
      {isModalOpen && (
        <div
          id="crud-modal"
          className="fixed inset-0 z-50 flex justify-center items-center w-full h-screen bg-[#00000058] bg-opacity-60"
          onClick={handleCloseModal}
        >
          <div
            className="relative p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Facture #{selectedFacture.id} - {selectedFacture.nom_client}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedFacture.status !== "paid" &&
                  selectedFacture.status !== "canceled" && (
                    <div className="relative">
                      <button
                        onClick={toggleActionMenu}
                        className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 dark:hover:bg-gray-600 dark:hover:text-white"
                        aria-label="Actions"
                      >
                        <Cog8ToothIcon className="w-5 h-5" />
                      </button>
                      {isActionMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-20 overflow-hidden transform transition-all duration-200 ease-in-out scale-95 origin-top-right animate-fadeIn">
                          <ul className="py-2">
                            <li>
                              <button
                                onClick={handleValidate}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-700 hover:text-green-800 dark:hover:text-green-100 transition-colors duration-150 w-full"
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Valider la commande
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={handleCancel}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-700 hover:text-red-800 dark:hover:text-red-100 transition-colors duration-150 w-full"
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
                                Annuler la commande
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                <button
                  type="button"
                  className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={handleCloseModal}
                  aria-label="Fermer la modale"
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
            </div>

            <div className="mt-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Numéro de facture
                    </p>
                    <div className="flex items-center space-x-2">
                      <Barcode
                        value={selectedFacture.id.toString()}
                        width={1.5}
                        height={40}
                        fontSize={14}
                        margin={10}
                        displayValue={true}
                        background="transparent"
                      />
                      <button
                        onClick={() => handleCopy(selectedFacture.id.toString())}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        title="Copier l'ID"
                        aria-label="Copier le numéro de facture"
                      >
                        <ClipboardIcon className="w-5 h-5" />
                      </button>
                      {copied && (
                        <span className="text-xs text-green-500">Copié !</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Date de création
                    </p>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {formatDate(selectedFacture.date_creation, true)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Type de vente
                    </p>
                    <p className="text-lg capitalize text-gray-900 dark:text-white">
                      {selectedFacture.saleType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Mode de paiement
                    </p>
                    <p className="text-lg capitalize text-gray-900 dark:text-white">
                      {selectedFacture.saleMode}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Client
                    </p>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {selectedFacture.client.nomComplet}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedFacture.client.telephone}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedFacture.client.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Wilaya: {selectedFacture.client.wilaya}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Recommandation: {selectedFacture.client.recommandation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Prix total
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      <PriceDisplay value={selectedFacture.prix_total} />
                    </p>
                  </div>
                  {selectedFacture.saleType === "livraison" && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Livraison
                      </p>
                      <p className="text-lg text-gray-900 dark:text-white">
                        Fournisseur: {selectedFacture.deliveryProvider}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Prix: <PriceDisplay value={selectedFacture.deliveryPrice} />
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Code: {selectedFacture.deliveryCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 flex-wrap">
                {selectedFacture.status !== "canceled" && (
                  <button
                    onClick={() => openUpdateModal("warranty")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    <PencilIcon className="w-5 h-5" />
                    Modifier Garanties
                  </button>
                )}
                {selectedFacture.status === "pending" &&
                  selectedFacture.saleMode === "versement" && (
                    <button
                      onClick={() => openUpdateModal("payment")}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                    >
                      <PlusIcon className="w-5 h-5" />
                      Ajouter Versement
                    </button>
                  )}
                {(selectedFacture.status === "canceled" ||
                  selectedFacture.paymentMethods?.length > 0) && (
                  <PDFDownloadLink
                    document={<PaiementsPDF facture={selectedFacture} />}
                    fileName={`paiements_facture_${selectedFacture.id}.pdf`}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                  >
                    {({ loading }) => (
                      <>
                        <DocumentArrowDownIcon className="w-5 h-5" />
                        {loading
                          ? "Génération..."
                          : "Télécharger Détails Paiements"}
                      </>
                    )}
                  </PDFDownloadLink>
                )}
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Produits
                </h4>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 font-medium">Nom Produit</th>
                        <th className="px-4 py-3 font-medium">ID Produit</th>
                        <th className="px-4 py-3 font-medium">Quantité</th>
                        <th className="px-4 py-3 font-medium">Prix Unitaire</th>
                        <th className="px-4 py-3 font-medium">Remise</th>
                        <th className="px-4 py-3 font-medium">Prix Total</th>
                        <th className="px-4 py-3 font-medium">Code Garantie</th>
                        <th className="px-4 py-3 font-medium">
                          Durée Garantie
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFacture.produits &&
                      selectedFacture.produits.length > 0 ? (
                        selectedFacture.produits.map((produit, index) => {
                          const discount =
                            ((produit.prix_original || 0) - produit.prix) *
                            produit.quantite;
                          return (
                            <tr
                              key={index}
                              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                              <td className="px-4 py-3">
                                {produit.nom || "N/A"}
                              </td>
                              <td className="px-4 py-3">
                                {produit.produit_id || "N/A"}
                              </td>
                              <td className="px-4 py-3">{produit.quantite}</td>
                              <td className="px-4 py-3">
                                <PriceDisplay value={produit.prix} />
                              </td>
                              <td className="px-4 py-3">
                                <PriceDisplay value={discount} />
                              </td>
                              <td className="px-4 py-3">
                                <PriceDisplay
                                  value={produit.prix * produit.quantite}
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                {produit.code_garantie || "-"}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {produit.duree_garantie || "-"}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
                            className="px-4 py-3 text-center text-gray-500 dark:text-gray-400"
                          >
                            Aucun produit trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      {totalPaid > 0 && (
                        <tr className="font-semibold bg-gray-50 dark:bg-gray-700">
                          <td
                            colSpan="5"
                            className="px-4 py-3 w-[200px] text-right"
                          >
                            Total payé :
                          </td>
                          <td className="px-4 py-3 text-green-600 dark:text-green-400">
                            <PriceDisplay value={totalPaid} />
                          </td>
                          <td colSpan="2" className="px-4 py-3"></td>
                        </tr>
                      )}
                      {selectedFacture.prix_total && (
                        <tr className="font-semibold bg-gray-50 dark:bg-gray-700">
                          <td
                            colSpan="5"
                            className="px-4 py-3 text-right"
                          >
                            Montant restant à payer :
                          </td>
                          <td
                            className={`px-4 py-3 ${
                              remainingAmount > 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-green-600 dark:text-green-400"
                            }`}
                          >
                            <PriceDisplay value={remainingAmount} />
                          </td>
                          <td colSpan="2" className="px-4 py-3"></td>
                        </tr>
                      )}
                      <tr className="font-semibold bg-gray-50 dark:bg-gray-700">
                        <td
                          colSpan="5"
                          className="px-4 py-3 text-right"
                        >
                          Total produits :
                        </td>
                        <td className="px-4 py-3">
                          <PriceDisplay value={calculatedProductTotal} />
                        </td>
                        <td colSpan="2" className="px-4 py-3"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {selectedFacture.paymentMethods &&
                selectedFacture.paymentMethods.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Détails des paiements
                    </h4>
                    <div className="space-y-4">
                      {selectedFacture.paymentMethods.map((method, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 min-h-[150px]"
                        >
                          <h5 className="text-md font-medium text-gray-800 dark:text-gray-200 capitalize mb-2">
                            Méthode: {method.method}
                          </h5>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                              <thead className="bg-gray-100 dark:bg-gray-600">
                                <tr>
                                  <th className="px-4 py-2 font-medium">Montant</th>
                                  <th className="px-4 py-2 font-medium">Date</th>
                                  <th className="px-4 py-2 font-medium">Justificatif</th>
                                </tr>
                              </thead>
                              <tbody>
                                {method.installments.map((installment, i) => (
                                  <tr
                                    key={i}
                                    className="border-b dark:border-gray-600 min-h-[50px]"
                                  >
                                    <td className="px-4 py-2 leading-5">
                                      <PriceDisplay value={installment.amount} />
                                    </td>
                                    <td className="px-4 py-2 leading-5">
                                      {installment.date
                                        ? formatDate(installment.date, true)
                                        : "-"}
                                    </td>
                                    <td className="px-4 py-2 leading-5">
                                      {installment.pdfFile ? (
                                        <a
                                          href={`/files/${installment.pdfFile}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline"
                                        >
                                          {installment.pdfFile}
                                        </a>
                                      ) : "-"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedFacture.installmentRemark && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Remarque sur les versements
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {selectedFacture.installmentRemark}
                        </p>
                      </div>
                    )}
                  </div>
                )}

              {selectedFacture.comment && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Commentaire
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedFacture.comment}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && updateType === "warranty" && (
        <FormulaireMiseAJourGarantie
          warrantyData={warrantyData}
          setWarrantyData={setWarrantyData}
          handleWarrantyUpdate={handleWarrantyUpdate}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
        />
      )}

      {isUpdateModalOpen && updateType === "payment" && (
        <FormulaireAjoutVersement
          paymentData={paymentData}
          setPaymentData={setPaymentData}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
        />git status
