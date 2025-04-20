import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ModalConfirmationSuppression from "../components/ModalConfirmationSuppression";
import TableauFactures from "../components/TableauFactures";
import FiltresFactures from "../components/FiltresFactures";
import ModalDetailsFacture from "../components/ModalDetailsFacture";

const ListeVente = () => {
  const [factures, setFactures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFactures, setFilteredFactures] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteFactureId, setDeleteFactureId] = useState(null);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Add statusFilter state
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const facturesPerPage = 6;

  useEffect(() => {
    const fetchFactures = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://il-developer.com/api/factures/");
        const result = await response.json();
        if (result.success) {
          const transformedFactures = result.data.map((facture) => ({
            id: facture.id,
            nom_client: facture.client.nom || "anonyme",
            date_creation: facture.date_creation,
            prix_total: parseFloat(facture.prix_total),
            status: facture.status,
            client: {
              nomComplet: facture.client.nom || "anonyme",
              telephone: facture.client.telephone || "",
              email: facture.client.email || "",
              wilaya: facture.client.wilaya || "",
              recommandation: facture.client.recommandation || "",
            },
            produits: facture.produits.map((produit) => ({
              produit_id: produit.id,
              nom: produit.nom,
              quantite: produit.quantite,
              prix: parseFloat(produit.prix_vente),
              prix_original: parseFloat(produit.prix_original),
              code_garantie: produit.code_garantie || "",
              duree_garantie: produit.duree_garantie || "",
            })),
            saleType: facture.sale_type,
            saleMode: facture.sale_mode,
            deliveryProvider: facture.delivery.provider || "",
            deliveryPrice: parseFloat(facture.delivery.price) || 0,
            deliveryCode: facture.delivery.code || "",
            installmentRemark: facture.installment_remark || "",
            paymentMethods: facture.payment_methods.map((method) => ({
              method: method.method,
              installments: method.installments.map((installment) => ({
                amount: parseFloat(installment.amount),
                date: installment.date || "",
                pdfFile: installment.pdf_file || "",
              })),
            })),
            comment: facture.comment || "",
          }));
          setFactures(transformedFactures);
          setFilteredFactures(transformedFactures);
        } else {
          throw new Error(result.message || "Erreur lors du chargement des factures");
        }
      } catch (err) {
        setError(err.message);
        toast.error("Erreur lors du chargement des factures");
      } finally {
        setLoading(false);
      }
    };
    fetchFactures();
  }, []);

  useEffect(() => {
    let filtered = factures.filter(
      (facture) =>
        facture.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facture.id.toString().includes(searchTerm)
    );

    if (dateStart && dateEnd) {
      const start = new Date(dateStart);
      const end = new Date(dateEnd);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((facture) => {
        const factureDate = new Date(facture.date_creation);
        return factureDate >= start && factureDate <= end;
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((facture) => facture.status === statusFilter);
    }

    setFilteredFactures(filtered);
    setCurrentPage(1); // Reset to first page on new filter
  }, [searchTerm, dateStart, dateEnd, statusFilter, factures]); // Add statusFilter to dependencies

  // Pagination logic
  const indexOfLastFacture = currentPage * facturesPerPage;
  const indexOfFirstFacture = indexOfLastFacture - facturesPerPage;
  const currentFactures = filteredFactures.slice(indexOfFirstFacture, indexOfLastFacture);
  const totalPages = Math.ceil(filteredFactures.length / facturesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenDeleteModal = (factureId) => {
    setDeleteFactureId(factureId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`https://il-developer.com/api/factures/${deleteFactureId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Erreur HTTP ${response.status}`);
      }

      setFactures((prev) => prev.filter((facture) => facture.id !== deleteFactureId));
      setFilteredFactures((prev) => {
        const updated = prev.filter((facture) => facture.id !== deleteFactureId);
        const totalPages = Math.ceil(updated.length / facturesPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
        return updated;
      });

      toast.success("Facture supprimée avec succès !");
    } catch (error) {
      toast.error(error.message || "Impossible de supprimer la facture");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteFactureId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteFactureId(null);
    setIsDeleteModalOpen(false);
  };

  const handleOpenShowModal = (facture) => {
    setSelectedFacture(facture);
    setIsShowModalOpen(true);
  };

  const handleCloseShowModal = () => {
    setSelectedFacture(null);
    setIsShowModalOpen(false);
  };

  const updateFactureStatus = (factureId, newStatus) => {
    setFactures((prev) =>
      prev.map((facture) =>
        facture.id === factureId ? { ...facture, status: newStatus } : facture
      )
    );
    setFilteredFactures((prev) =>
      prev.map((facture) =>
        facture.id === factureId ? { ...facture, status: newStatus } : facture
      )
    );
    setSelectedFacture((prev) =>
      prev && prev.id === factureId ? { ...prev, status: newStatus } : prev
    );
    toast.success("Statut mis à jour avec succès !");
  };

  const updateFactureData = (factureId, updatedData) => {
    setFactures((prev) =>
      prev.map((facture) =>
        facture.id === factureId ? { ...facture, ...updatedData } : facture
      )
    );
    setFilteredFactures((prev) =>
      prev.map((facture) =>
        facture.id === factureId ? { ...facture, ...updatedData } : facture
      )
    );
    setSelectedFacture((prev) =>
      prev && prev.id === factureId ? { ...prev, ...updatedData } : prev
    );
  };

  const getRowColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100";
      case "paid":
        return "bg-green-100";
      case "canceled":
        return "bg-red-100";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="p-4">
      <FiltresFactures
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateStart={dateStart}
        setDateStart={setDateStart}
        dateEnd={dateEnd}
        setDateEnd={setDateEnd}
        statusFilter={statusFilter} // Pass statusFilter
        setStatusFilter={setStatusFilter} // Pass setStatusFilter
      />

      {loading && <div className="text-center mt-4">Chargement...</div>}
      {error && <div className="text-center mt-4 text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          <TableauFactures
            filteredFactures={currentFactures}
            getRowColor={getRowColor}
            handleOpenShowModal={handleOpenShowModal}
            handleOpenDeleteModal={handleOpenDeleteModal}
          />

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Précédent
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageClick(pageNumber)}
                  className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}

      <ModalConfirmationSuppression
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
      <ModalDetailsFacture
        isModalOpen={isShowModalOpen}
        selectedFacture={selectedFacture}
        handleCloseModal={handleCloseShowModal}
        updateFactureStatus={updateFactureStatus}
        updateFactureData={updateFactureData}
      />
    </div>
  );
};

export default ListeVente;