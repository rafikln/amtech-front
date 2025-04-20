import React from "react";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import toast from "react-hot-toast";

const GenerationTicketPDF = ({ produit }) => {
  const generateProductTicket = () => {
    try {
      if (!produit.nom || !produit.prix_vente) {
        throw new Error("Nom ou prix du produit manquant.");
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [45, 35],
      });

      let code = produit.reference || produit.id?.toString() || "N/A";
      if (code === "N/A") {
        throw new Error("Référence ou ID du produit manquant pour le code-barres.");
      }
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, code, {
        format: "CODE128",
        width: 2,
        height: 40,
        displayValue: false,
        background: "#FFFFFF",
        lineColor: "#000000",
        margin: 0,
      });
      const barcodeDataUrl = canvas.toDataURL("image/png", 1.0);

      doc.addImage(barcodeDataUrl, "PNG", 5, 2, 35, 8);

      doc.setLineWidth(0.3);
      doc.setDrawColor(0, 0, 0);
      doc.rect(1, 1, 43, 33);

      doc.setFont("times", "bold");
      doc.setFontSize(7);
      doc.setTextColor(0, 51, 102);
      const nomProduit = produit.nom.length > 20 ? produit.nom.substring(0, 17) + "..." : produit.nom;
      doc.text(nomProduit, 22.5, 12, { align: "center" });

      const col1X = 5;
      const col2X = 25;
      const startY = 15;
      const lineHeight = 4;

      doc.setFont("times", "normal");
      doc.setFontSize(6);
      doc.setTextColor(33, 33, 33);

      doc.text(`Réf: ${produit.reference || code}`, col1X, startY);
      doc.text(`Armoire: ${produit.code_armoire || "N/A"}`, col1X, startY + lineHeight);
      doc.text(`Marque: ${produit.marque || "N/A"}`, col2X, startY);
      doc.text(`État: ${produit.etat || "N/A"}`, col2X, startY + lineHeight);

      doc.setFillColor(240, 240, 240);
      doc.rect(5, 25, 35, 7, "F");
      doc.setLineWidth(0.2);
      doc.setDrawColor(0, 51, 102);
      doc.rect(5, 25, 35, 7);
      doc.setFontSize(8);
      doc.setFont("times", "bold");
      doc.setTextColor(0, 102, 0);
      const prixText = `${produit.prix_vente || "N/A"} DA`;
      doc.text(prixText, 22.5, 29.5, { align: "center" });

      doc.save(`ticket_${produit.reference || produit.id}.pdf`);
    } catch (error) {
      console.error("Erreur lors de la génération du ticket:", error);
      toast.error("Erreur lors de la génération du ticket: " + error.message);
    }
  };

  return (
    <div
      className="w-[33px] h-[30px] flex justify-center p-1 items-center rounded-md bg-[#4CAF50] cursor-pointer"
      onClick={generateProductTicket}
      title="Générer ticket PDF"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="white"
        viewBox="0 0 16 16"
      >
        <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
        <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
      </svg>
    </div>
  );
};

export default GenerationTicketPDF;