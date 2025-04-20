import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import TableauProduits from "./TableauProduits";
import BarreRecherche from "./BarreRecherche";
import BoutonsExportImport from "./BoutonsExportImport";
import Breadcrumbs from "./Breadcrumbs";
import ConfirmedeleteProduit from "./ConfirmedeleteProduit";
import ModelShowProduit from "./ModelShowProduit";
import ModelUpdateProduit from "./ModelUpdateProduit";
import * as XLSX from "xlsx";

const ListeProduits = () => {
  const [produits, setProduits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://il-developer.com";

  const fetchProduits = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/produits`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Erreur lors de la récupération des produits");
      setProduits(result.data || []);
    } catch (error) {
      console.error("Erreur fetchProduits:", error);
      toast.error(error.message || "Erreur serveur");
      setProduits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const exportToExcel = () => {
    const exportData = produits.map((produit) => {
      const flatProduit = { ...produit };
      if (flatProduit.image) {
        if (Array.isArray(flatProduit.image)) {
          flatProduit.image = flatProduit.image.map((img) => img.path || img).join(", ");
        } else if (typeof flatProduit.image === "string") {
          try {
            const parsed = JSON.parse(flatProduit.image);
            flatProduit.image = Array.isArray(parsed)
              ? parsed.map((img) => img.path || img).join(", ")
              : parsed.path || parsed;
          } catch {
            flatProduit.image = flatProduit.image;
          }
        }
      }
      if (flatProduit.prix_vente) {
        flatProduit.prix_vente = `${flatProduit.prix_vente} DA`;
      }
      return flatProduit;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produits");
    worksheet["!cols"] = Object.keys(exportData[0] || {}).map(() => ({ wch: 20 }));
    XLSX.writeFile(workbook, "liste_produits_complet.xlsx");
    toast.success("Produits exportés avec succès en Excel !");
  };

  const handleImport = () => {
    toast.info("Fonctionnalité d'importation à implémenter.");
  };

  const handleShowModal = (produit) => {
    setSelectedProduct(produit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleShowUpdateModal = (produit) => {
    setSelectedProduct(produit);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProduct(null);
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedProductId(id);
    setIsConfirmModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setSelectedProductId(null);
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/api/produits/${selectedProductId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erreur lors de la suppression");
      setProduits((prev) => prev.filter((p) => p.id !== selectedProductId));
      setIsConfirmModalOpen(false);
      toast.success(result.message || "Produit supprimé avec succès");
    } catch (error) {
      console.error("Erreur handleDeleteProduct:", error);
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const produitsFiltres = produits.filter(
    (produit) =>
      produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (produit.reference && produit.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-[90px] flex justify-between items-center p-[30px]">
        <Breadcrumbs />
        <BoutonsExportImport onExport={exportToExcel} onImport={handleImport} />
        <BarreRecherche searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <TableauProduits
        produits={produits}
        produitsFiltres={produitsFiltres}
        API_URL={API_URL}
        handleShowModal={handleShowModal}
        handleShowUpdateModal={handleShowUpdateModal}
        handleOpenDeleteModal={handleOpenDeleteModal}
      />

      <ConfirmedeleteProduit
        isConfirmModalOpen={isConfirmModalOpen}
        handleDeleteCategory={handleDeleteProduct}
        handleCancelDelete={handleCancelDelete}
      />
      <ModelShowProduit
        isModalOpen={isModalOpen}
        selectedProduct={selectedProduct}
        handleCloseModal={handleCloseModal}
      />
      <ModelUpdateProduit
        fetchProduits={fetchProduits}
        isUpdateModalOpen={isUpdateModalOpen}
        selectedProduct={selectedProduct}
        handleCloseUpdateModal={handleCloseUpdateModal}
      />
    </>
  );
};

export default ListeProduits;