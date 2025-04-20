import { Page, Text, View, Document, StyleSheet, Font, Image } from "@react-pdf/renderer";
import genererCodeBarres from "../utils/genererCodeBarres";

import logo from "/amtech.png";
import facturee from "/facturee.png";

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
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
  },
  clientInfo: {
    flex: 2,
    paddingRight: 10,
  },
  barcodeSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  barcodeImage: {
    width: 120,
    height: 48,
  },
  invoiceInfo: {
    flex: 2,
    paddingLeft: 10,
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
});

const PaiementsPDF = ({ facture }) => {
  const {
    id = "N/A",
    paymentMethods = [],
    nom_client = "Non spécifié",
    date_creation = new Date().toISOString(),
    client = {},
    saleType = "Non spécifié",
    saleMode = "Non spécifié",
  } = facture;

  const barcodeImageUrl = genererCodeBarres(id);
  const formattedDate = new Date(date_creation).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
          <Image src={facturee} style={styles.logoo} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.clientInfo}>
            <Text style={[styles.textBold, { fontSize: 11, marginBottom: 8 }]}>
              Client
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 5, color: "#555" }}>
              Nom: {client.nomComplet || "Non spécifié"}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 5, color: "#555" }}>
              Email: {client.email || "Non spécifié"}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 5, color: "#555" }}>
              Téléphone: {client.telephone || "Non spécifié"}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 5, color: "#555" }}>
              Wilaya: {client.wilaya || "Non spécifiée"}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 5, color: "#555" }}>
              Recommandation: {client.recommandation || "Non spécifiée"}
            </Text>
          </View>

          <View style={styles.barcodeSection}>
            <Image src={barcodeImageUrl} style={styles.barcodeImage} />
          </View>

          <View style={styles.invoiceInfo}>
            <Text style={{ fontSize: 10, marginBottom: 5, color: "#555" }}>
              Numéro: #{id}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 5, color: "#555" }}>
              Date: {formattedDate}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 0.5 }]}>N°</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Méthode</Text>
            <Text style={styles.tableCell}>Montant</Text>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Justificatif</Text>
          </View>
          {paymentMethods.length > 0 ? (
            paymentMethods.flatMap((method, methodIndex) =>
              method.installments.map((installment, instIndex) => (
                <View
                  key={`${methodIndex}-${instIndex}`}
                  style={[
                    styles.tableRow,
                    (methodIndex * method.installments.length + instIndex) % 2 ===
                    0
                      ? styles.tableRowEven
                      : {},
                  ]}
                >
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>
                    {methodIndex * method.installments.length + instIndex + 1}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>
                    {method.method || "Non spécifié"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {parseFloat(installment.amount || 0).toFixed(2)} DA
                  </Text>
                  <Text style={styles.tableCell}>
                    {installment.date
                      ? new Date(installment.date).toLocaleDateString("fr-FR")
                      : "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {installment.pdfFile ? "Oui" : "-"}
                  </Text>
                </View>
              ))
            )
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>-</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Aucun paiement</Text>
              <Text style={styles.tableCell}>0.00 DA</Text>
              <Text style={styles.tableCell}>-</Text>
              <Text style={styles.tableCell}>-</Text>
            </View>
          )}
        </View>

        {paymentMethods.length > 0 && (
          <View
            style={{
              marginBottom: 20,
              padding: 10,
              backgroundColor: "#F9F9F9",
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 5,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Text style={styles.textBold}>
              Total des paiements :{" "}
              {paymentMethods
                .reduce(
                  (total, method) =>
                    total +
                    method.installments.reduce(
                      (sum, inst) => sum + parseFloat(inst.amount || 0),
                      0
                    ),
                  0
                )
                .toFixed(2)}{" "}
              DA
            </Text>
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

export default PaiementsPDF;