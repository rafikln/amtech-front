import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FacturePDF from "../pdf/FacturePDF";
import pdf from "../../../icon/pdf.svg";
import Delete from "../../../icon/delete.svg";
import Show from "../../../icon/show.svg";
import { formatDate } from "../utils/formatDate";

const TableauFactures = ({
  filteredFactures,
  getRowColor,
  handleOpenShowModal,
  handleOpenDeleteModal,
}) => {
  const facturesPerPage = 6; // Nombre de lignes à afficher (fixe à 6)

  // Remplir avec des lignes vides si moins de 6 factures
  const filledFactures = [
    ...filteredFactures,
    ...Array(facturesPerPage - filteredFactures.length).fill(null),
  ].slice(0, facturesPerPage);

  return (
    <div className="overflow-x-auto mt-6">
      <div className="w-full pl-[30px] pr-[80px]">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">#Num</th>
              <th className="px-4 py-2 text-left">Nom du client</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Prix Total</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filledFactures.map((facture, index) =>
              facture ? (
                <tr
                  key={facture.id}
                  className={`${getRowColor(facture.status)} hover:opacity-90 h-12`}
                >
                  <td className="px-4 py-2">{facture.id}</td>
                  <td className="px-4 py-2">{facture.nom_client}</td>
                  <td className="px-4 py-2">{formatDate(facture.date_creation)}</td>
                  <td className="px-4 py-2">{facture.prix_total} DA</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleOpenShowModal(facture)}
                      className="w-8 h-8 flex justify-center items-center bg-blue-600 text-white rounded-md hover:bg-blue-500"
                    >
                      <img src={Show} alt="show" className="w-5 h-5" />
                    </button>
                    <PDFDownloadLink
                      document={<FacturePDF facture={facture} />}
                      fileName={`Facture_${facture.id}.pdf`}
                    >
                      <button
                        disabled={facture.status === "pending" || facture.status === "canceled"}
                        className={`w-8 h-8 flex justify-center items-center rounded-md text-white ${
                          facture.status === "pending" || facture.status === "canceled"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gray-600 hover:bg-gray-500"
                        }`}
                      >
                        <img src={pdf} alt="pdf" className="w-5 h-5" />
                      </button>
                    </PDFDownloadLink>
                    <button
                      onClick={() => 
                         {handleOpenDeleteModal(facture.id)
                        console.log("Bouton de suppression cliqué pour facture ID:", facture.id); }
                      }
                      className="w-8 h-8 flex justify-center items-center bg-red-600 text-white rounded-md hover:bg-red-500"
                    >
                      <img src={Delete} alt="delete" className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={`empty-${index}`} className="bg-white h-12">
                  <td colSpan="5" className="px-4 py-2"></td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        table {
          min-height: 288px; /* Hauteur pour 6 lignes (48px par ligne) + en-tête */
        }
        tr {
          height: 48px; /* Hauteur fixe par ligne */
        }
        tbody {
          display: table-row-group;
        }
      `}</style>
    </div>
  );
};

export default TableauFactures;