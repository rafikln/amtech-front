import React from "react";
import { Page, Text, View, Document, StyleSheet, Font, Image } from "@react-pdf/renderer";
import genererCodeBarres from "../utils/genererCodeBarres";

import logo from "/amtech.png";
import factur from "/facture.png";

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helvetica/v15/Helvetica.ttf" },
    {
      src: "https://fonts.gstatic.com/s/helvetica/v15/Helvetica-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#333",
    backgroundColor: "#fff",
  },
  header: {
    textAlign: "center",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#1A3C5A",
    paddingBottom: 10,
  },
  headers: {
    textAlign: "center",
    marginBottom: 10,
  },
  logo: {
    width: 200,
    height: 50,
    marginBottom: 10,
    alignSelf: "center",
  },
  logoo: {
    width: 200,
    alignSelf: "center",
  },
  subHeader: {
    fontSize: 12,
    marginTop: 5,
    color: "#555",
  },
  contactInfo: {
    fontSize: 10,
    marginTop: 5,
    color: "#777",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
  },
  clientInfo: {
    flex: 1,
  },
  invoiceInfo: {
    flex: 1,
    textAlign: "left",
  },
  barcodeSection: {
    flex: 1,
    textAlign: "center",
  },
  barcodeImage: {
    width: 150,
    height: 60,
    alignSelf: "center",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1A3C5A",
    color: "#fff",
    padding: 8,
    fontWeight: "bold",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tableRowEven: {
    backgroundColor: "#F5F5F5",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  totalsTable: {
    width: "40%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  totalsRowLast: {
    borderBottomWidth: 0,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: "#1A3C5A",
    paddingTop: 10,
    fontSize: 9,
    color: "#555",
    textAlign: "center",
  },
  textBold: {
    fontWeight: "bold",
  },
  textRight: {
    textAlign: "right",
  },
  additionalInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
  },
  additionalInfoTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

const FacturePDF = ({ facture = {} }) => {
  const {
    id = "N/A",
    nom_client = "Non spécifié",
    date_creation = new Date().toISOString(),
    prix_total = "0.00",
    produits = [],
    client = {},
    sale_type = "Non spécifié",
    sale_mode = "Non spécifié",
    delivery = {},
    installment_remark = "",
    payment_methods = [],
    comment = "",
  } = facture;

  const { email = "", telephone = "", wilaya = "", recommandation = "" } = client;
  const { provider = "", price = "0.00", code = "" } = delivery;

  const calculatedTotal = produits
    .reduce(
      (sum, produit) =>
        sum + parseFloat(produit.prix || 0) * parseFloat(produit.quantite || 0),
      0
    )
    .toFixed(2);

  const formattedDate = new Date(date_creation).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const barcodeImageUrl = genererCodeBarres(id);

  const formattedPaymentMethods = payment_methods
    .map((method) => {
      const installments = method.installments
        .map((inst) => {
          const date = inst.date
            ? new Date(inst.date).toLocaleDateString("fr-FR")
            : "Non spécifiée";
          return `${inst.amount} DA (Date: ${date}${
            inst.pdf_file ? ", Justificatif: " + inst.pdf_file : ""
          })`;
        })
        .join("; ");
      return `${method.method}: ${installments}`;
    })
    .join(" | ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <Text style={styles.subHeader}>
            Magasin de Vente Matériel Informatique : Laptop / Smartphone /
            Accessoires
          </Text>
          <Text style={styles.contactInfo}>
            Adresse: 15 Rue Bois des Cars 1, Dely Ibrahim, Code Postal: 16302,
            Alger
          </Text>
          <Text style={styles.contactInfo}>Tél: 0792 294 989 / 0556 294 989</Text>
        </View>

        <View style={styles.headers}>
          <Image src={factur} style={styles.logoo} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.clientInfo}>
            <Text style={styles.textBold}>Client: {nom_client}</Text>
            <Text>Email: {email || "Non spécifié"}</Text>
            <Text>Téléphone: {telephone || "Non spécifié"}</Text>
            <Text>Wilaya: {wilaya || "Non spécifiée"}</Text>
            <Text>Recommandation: {recommandation || "Non spécifiée"}</Text>
          </View>

          <View style={styles.barcodeSection}>
            <Image src={barcodeImageUrl} style={styles.barcodeImage} />
          </View>

          <View style={styles.invoiceInfo}>
            <Text style={styles.textBold}>Facture #{id}</Text>
            <Text>Date: {formattedDate}</Text>
            <Text>Type de vente: {sale_type}</Text>
            <Text>Mode de paiement: {sale_mode}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 0.5 }]}>N°</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Désignation</Text>
            <Text style={styles.tableCell}>Quantité</Text>
            <Text style={styles.tableCell}>Prix Unitaire</Text>
            <Text style={styles.tableCell}>Remise</Text>
            <Text style={styles.tableCell}>Total</Text>
            <Text style={styles.tableCell}>Code Garantie</Text>
            <Text style={styles.tableCell}>Durée Garantie</Text>
          </View>
          {produits.length > 0 ? (
            produits.map((produit, index) => {
              const unitDiscount =
                parseFloat(produit.prix_original || 0) -
                parseFloat(produit.prix || 0);
              const totalDiscount = (
                unitDiscount * parseFloat(produit.quantite || 0)
              ).toFixed(2);
              const totalPrice = (
                parseFloat(produit.prix || 0) * parseFloat(produit.quantite || 0)
              ).toFixed(2);
              return (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowEven : {},
                  ]}
                >
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>
                    {produit.nom || "Non spécifié"}
                  </Text>
                  <Text style={styles.tableCell}>{produit.quantite || 0}</Text>
                  <Text style={styles.tableCell}>
                    {parseFloat(produit.prix || 0).toFixed(2)} DA
                  </Text>
                  <Text style={styles.tableCell}>
                    {unitDiscount >= 0 ? `${totalDiscount} DA` : "0.00 DA"}
                  </Text>
                  <Text style={styles.tableCell}>{totalPrice} DA</Text>
                  <Text style={styles.tableCell}>
                    {produit.code_garantie || "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {produit.duree_garantie || "-"}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>1</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Aucun produit</Text>
              <Text style={styles.tableCell}>0</Text>
              <Text style={styles.tableCell}>0.00 DA</Text>
              <Text style={styles.tableCell}>0.00 DA</Text>
              <Text style={styles.tableCell}>0.00 DA</Text>
              <Text style={styles.tableCell}>-</Text>
              <Text style={styles.tableCell}>-</Text>
            </View>
          )}
          {produits.length > 0 && (
            <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <Text style={[styles.tableCell, { flex: 0.5 }]}></Text>
              <Text style={[styles.tableCell, { flex: 2, textAlign: "right" }]}>
                Total Calculé:
              </Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}>{calculatedTotal} DA</Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
            </View>
          )}
        </View>

        <View style={styles.totalsContainer}>
          <View style={styles.totalsTable}>
            <View style={styles.totalsRow}>
              <Text style={styles.textBold}>Total HT:</Text>
              <Text style={styles.textRight}>{calculatedTotal} DA</Text>
            </View>
            {parseFloat(price) > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.textBold}>Frais de livraison:</Text>
                <Text style={styles.textRight}>
                  {parseFloat(price).toFixed(2)} DA
                </Text>
              </View>
            )}
            <View style={[styles.totalsRow, styles.totalsRowLast]}>
              <Text style={styles.textBold}>Total TTC (Facture):</Text>
              <Text style={styles.textRight}>
                {parseFloat(prix_total).toFixed(2)} DA
              </Text>
            </View>
          </View>
        </View>

        {parseFloat(prix_total) !==
          parseFloat(calculatedTotal) + parseFloat(price) && (
          <Text
            style={{ color: "#D32F2F", fontSize: 9, textAlign: "right", marginTop: 5 }}
          >
            Note: Le total de la facture diffère du total calculé des produits et
            frais de livraison.
          </Text>
        )}

        {(formattedPaymentMethods || installment_remark || comment) && (
          <View style={styles.additionalInfo}>
            <Text style={styles.additionalInfoTitle}>
              Informations supplémentaires
            </Text>
            {formattedPaymentMethods && (
              <Text>Méthodes de paiement: {formattedPaymentMethods}</Text>
            )}
            {installment_remark && (
              <Text>Remarque sur les versements: {installment_remark}</Text>
            )}
            {comment && <Text>Commentaire: {comment}</Text>}
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text>NOUS VOUS REMERCIONS DE VOTRE CONFIANCE</Text>
          <Text>AMTECH DELY IBRAHIM - Tous droits réservés</Text>
        </View>
      </Page>
    </Document>
  );
};

export default FacturePDF;