import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ListeProduits from "./ListeProduits.jsx";
import Panier from "./Panier.jsx";
import ModalClient from "./ModalClient.jsx";
import ModalGarantie from "./ModalGarantie.jsx";
import ModalVente from "./ModalVente.jsx";

const Caisse = () => {
  const [achat, setAchat] = useState({
    client: {
      nom: "anonyme",
      telephone: "",
      email: "",
      wilaya: "",
      recommandation: "",
    },
    produits: [],
  });
  const [totalPrix, setTotalPrix] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [produitsDisponibles, setProduitsDisponibles] = useState([]);
  const [barcode, setBarcode] = useState("");
  const barcodeInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [warrantyData, setWarrantyData] = useState({
    code_garantie: "",
    duree_garantie: "",
  });
  const [saleData, setSaleData] = useState({
    saleType: "comptoir",
    saleMode: "direct",
    deliveryProvider: "yalidine",
    deliveryPrice: "",
    deliveryCode: "",
    installmentRemark: "",
    comment: "",
    paymentMethods: [],
    pdf: {}, // Stockage des fichiers PDF (clé: nom du fichier, valeur: objet File)
  });

  const API_URL = "https://il-developer.com";

  const wilayas = [
    "Adrar",
    "Chlef",
    "Laghouat",
    "Oum El Bouaghi",
    "Batna",
    "Béjaïa",
    "Biskra",
    "Béchar",
    "Blida",
    "Bouira",
    "Tamanrasset",
    "Tébessa",
    "Tlemcen",
    "Tiaret",
    "Tizi Ouzou",
    "Alger",
    "Djelfa",
    "Jijel",
    "Sétif",
    "Saïda",
    "Skikda",
    "Sidi Bel Abbès",
    "Annaba",
    "Guelma",
    "Constantine",
    "Médéa",
    "Mostaganem",
    "M'Sila",
    "Mascara",
    "Ouargla",
    "Oran",
    "El Bayadh",
    "Illizi",
    "Bordj Bou Arréridj",
    "Boumerdès",
    "El Tarf",
    "Tindouf",
    "Tissemsilt",
    "El Oued",
    "Khenchela",
    "Souk Ahras",
    "Tipaza",
    "Mila",
    "Aïn Defla",
    "Naâma",
    "Aïn Témouchent",
    "Ghardaïa",
    "Relizane",
    "Timimoun",
    "Bordj Badji Mokhtar",
    "Ouled Djellal",
    "Béni Abbès",
    "In Salah",
    "In Guezzam",
    "Touggourt",
    "Djanet",
    "El M'Ghair",
    "El Meniaa",
  ];

  const recommandations = [
    "Réseaux sociaux",
    "Ami/Famille",
    "Publicité",
    "Site web",
    "Autre",
  ];

  const paymentOptions = [
    {
      value: "cash",
      label: "Cash",
      icon: (
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      value: "ccp",
      label: "CCP",
      icon: (
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      value: "yalidine",
      label: "Yalidine",
      icon: (
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    let barcodeBuffer = "";
    let lastKeyTime = 0;
    let timeoutId = null;

    const handleKeyDown = (e) => {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastKeyTime;
      const activeElement = document.activeElement;

      if (
        !activeElement ||
        activeElement === searchInputRef.current ||
        activeElement === barcodeInputRef.current
      ) {
        const keyMap = {
          "&": "1",
          "é": "2",
          '"': "3",
          "'": "4",
          "(": "5",
          "§": "6",
          "è": "7",
          "!": "8",
          "ç": "9",
          "à": "0",
        };

        if (/^[0-9]$/.test(e.key)) {
          barcodeBuffer += e.key;
          e.preventDefault();
        } else if (keyMap[e.key]) {
          barcodeBuffer += keyMap[e.key];
          e.preventDefault();
        } else if (e.key === "Enter" && barcodeBuffer.length > 0) {
          processBarcode(barcodeBuffer);
          barcodeBuffer = "";
          e.preventDefault();
        }

        lastKeyTime = currentTime;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (barcodeBuffer.length > 0) {
            processBarcode(barcodeBuffer);
            barcodeBuffer = "";
          }
        }, 300);
      }
    };

    const processBarcode = (code) => {
      const numericCode = code.replace(/[^0-9]/g, "");
      if (numericCode.length === 0) {
        toast.error("Code-barres invalide (aucun chiffre détecté).");
        return;
      }

      const produit = produitsDisponibles.find(
        (p) => p.id.toString() === numericCode
      );
      if (produit && produit.quantite > 0) {
        handleAddToCart(produit);
        toast.success(`${produit.nom} ajouté au panier !`);
        setSearchTerm("");
      } else {
        toast.error("Produit non trouvé ou en rupture de stock.");
      }
      setBarcode("");
      maintainBarcodeFocus();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [produitsDisponibles]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des catégories.");
        const result = await response.json();
        if (!result.success)
          throw new Error(result.message || "Erreur serveur.");
        setCategories(result.data || []);
      } catch (error) {
        toast.error(error.message || "Erreur serveur (catégories).");
      }
    };

    const fetchProduits = async () => {
      try {
        const response = await fetch(`${API_URL}/api/produits`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des produits.");
        const result = await response.json();
        if (!result.success)
          throw new Error(result.message || "Erreur serveur.");
        setProduitsDisponibles(result.data || []);
      } catch (error) {
        toast.error(error.message || "Erreur serveur (produits).");
      }
    };

    fetchCategories();
    fetchProduits();
  }, []);

  useEffect(() => {
    const total = achat.produits.reduce(
      (sum, produit) => sum + produit.prix * produit.quantite,
      0
    );
    setTotalPrix(total);
  }, [achat.produits]);

  const maintainBarcodeFocus = () => {
    setTimeout(() => {
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    }, 50);
  };

  const filteredProduits = produitsDisponibles.filter((prod) => {
    const matchesSearch = prod.nom
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || prod.categorie_id === Number(selectedCategory);
    const inStock = prod.quantite > 0;
    return matchesSearch && matchesCategory && inStock;
  });

  const handleAddToCart = (produit) => {
    setAchat((prevAchat) => {
      const produitExistant = prevAchat.produits.find(
        (p) => p.produit_id === produit.id
      );
      if (produitExistant) {
        return {
          ...prevAchat,
          produits: prevAchat.produits.map((p) =>
            p.produit_id === produit.id
              ? {
                  ...p,
                  quantite: Math.min(p.quantite + 1, produit.quantite),
                }
              : p
          ),
        };
      }
      const newProduit = {
        produit_id: produit.id,
        quantite: 1,
        prix: produit.prix_vente,
        code_garantie: "",
        duree_garantie: "",
      };
      return {
        ...prevAchat,
        produits: [...prevAchat.produits, newProduit],
      };
    });
    maintainBarcodeFocus();
  };

  const handleRemoveProduit = (produit_id) => {
    setAchat((prevAchat) => ({
      ...prevAchat,
      produits: prevAchat.produits.filter((p) => p.produit_id !== produit_id),
    }));
    maintainBarcodeFocus();
  };

  const handlePriceChange = (produit_id, newPrice) => {
    const normalizedPrice = newPrice.replace(",", ".");
    setAchat((prevAchat) => ({
      ...prevAchat,
      produits: prevAchat.produits.map((p) =>
        p.produit_id === produit_id
          ? {
              ...p,
              prix:
                normalizedPrice === ""
                  ? 0
                  : parseFloat(normalizedPrice) || p.prix,
            }
          : p
      ),
    }));
  };

  const handleOpenClientModal = () => setIsClientModalOpen(true);
  const handleCloseClientModal = () => setIsClientModalOpen(false);

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setAchat((prevAchat) => ({
      ...prevAchat,
      client: { ...prevAchat.client, [name]: value },
    }));
  };

  const handleSaveClient = () => {
    if (!achat.client.nom.trim()) {
      toast.error("Le nom du client est requis.");
      return;
    }
    handleCloseClientModal();
    toast.success("Informations du client enregistrées !");
  };

  const handleOpenWarrantyModal = (produit_id) => {
    setSelectedProductId(produit_id);
    const product = achat.produits.find((p) => p.produit_id === produit_id);
    setWarrantyData({
      code_garantie: product.code_garantie || "",
      duree_garantie: product.duree_garantie || "",
    });
    setIsWarrantyModalOpen(true);
  };

  const handleCloseWarrantyModal = () => {
    setIsWarrantyModalOpen(false);
    setSelectedProductId(null);
  };

  const handleWarrantyChange = (e) => {
    const { name, value } = e.target;
    setWarrantyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveWarranty = () => {
    setAchat((prevAchat) => ({
      ...prevAchat,
      produits: prevAchat.produits.map((p) =>
        p.produit_id === selectedProductId
          ? {
              ...p,
              code_garantie: warrantyData.code_garantie,
              duree_garantie: warrantyData.duree_garantie,
            }
          : p
      ),
    }));
    handleCloseWarrantyModal();
    toast.success("Garantie enregistrée !");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!achat.client.nom.trim()) {
      toast.error("Veuillez spécifier un nom pour le client.");
      handleOpenClientModal();
      return;
    }
    if (achat.produits.length === 0) {
      toast.error("Veuillez ajouter au moins un produit.");
      return;
    }
    setIsSaleModalOpen(true);
  };

  const handleCloseSaleModal = () => {
    setIsSaleModalOpen(false);
  };

  const handleSaleChange = (e) => {
    const { name, value } = e.target;
    setSaleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePaymentChange = (method, checked) => {
    setSaleData((prevData) => {
      if (checked) {
        if (!prevData.paymentMethods.find((pm) => pm.method === method)) {
          return {
            ...prevData,
            paymentMethods: [
              ...prevData.paymentMethods,
              {
                method,
                installments: [{ amount: "", date: "", pdf_file: "" }],
              },
            ],
          };
        }
      } else {
        // Supprimer les fichiers associés lors de la désélection du mode de paiement
        const filesToRemove = prevData.paymentMethods
          .find((pm) => pm.method === method)
          ?.installments.map((inst) => inst.pdf_file)
          .filter((pdf_file) => pdf_file) || [];
        const updatedFiles = { ...prevData.pdf };
        filesToRemove.forEach((fileName) => delete updatedFiles[fileName]);

        return {
          ...prevData,
          paymentMethods: prevData.paymentMethods.filter(
            (pm) => pm.method !== method
          ),
          pdf: updatedFiles,
        };
      }
      return prevData;
    });
  };

  const handlePaymentInstallmentChange = (method, index, field, value) => {
    setSaleData((prevData) => {
      if (field === "pdfFile" && value) {
        // Utiliser le nom du fichier original ou générer un nom unique
        const fileName = value.name || `recu_ccp_${method}_${index}_${Date.now()}.pdf`;
        return {
          ...prevData,
          paymentMethods: prevData.paymentMethods.map((pm) =>
            pm.method === method
              ? {
                  ...pm,
                  installments: pm.installments.map((inst, i) =>
                    i === index ? { ...inst, pdf_file: fileName } : inst
                  ),
                }
              : pm
          ),
          pdf: {
            ...prevData.pdf,
            [fileName]: value,
          },
        };
      }
      return {
        ...prevData,
        paymentMethods: prevData.paymentMethods.map((pm) =>
          pm.method === method
            ? {
                ...pm,
                installments: pm.installments.map((inst, i) =>
                  i === index ? { ...inst, [field]: value } : inst
                ),
              }
            : pm
        ),
      };
    });
  };

  const addInstallment = (method) => {
    setSaleData((prevData) => ({
      ...prevData,
      paymentMethods: prevData.paymentMethods.map((pm) =>
        pm.method === method
          ? {
              ...pm,
              installments: [
                ...pm.installments,
                { amount: "", date: "", pdf_file: "" },
              ],
            }
          : pm
      ),
    }));
  };

  const removeInstallment = (method, index) => {
    setSaleData((prevData) => {
      const fileName = prevData.paymentMethods
        .find((pm) => pm.method === method)
        ?.installments[index]?.pdf_file;
      const updatedFiles = { ...prevData.pdf };
      if (fileName) {
        delete updatedFiles[fileName];
      }

      return {
        ...prevData,
        paymentMethods: prevData.paymentMethods.map((pm) =>
          pm.method === method
            ? {
                ...pm,
                installments: pm.installments.filter((_, i) => i !== index),
              }
            : pm
        ),
        pdf: updatedFiles,
      };
    });
  };

  const handleConfirmSale = async () => {
    if (!achat.client.nom.trim()) {
      toast.error("Le nom du client est requis.");
      setIsSaleModalOpen(false);
      handleOpenClientModal();
      return;
    }
    if (achat.produits.length === 0) {
      toast.error("Veuillez ajouter au moins un produit.");
      setIsSaleModalOpen(false);
      return;
    }

    if (saleData.paymentMethods.length === 0) {
      toast.error("Veuillez sélectionner au moins un mode de paiement.");
      return;
    }

    if (saleData.saleMode === "versement") {
      const hasEmptyFields = saleData.paymentMethods.some((pm) =>
        pm.installments.some(
          (inst) =>
            !inst.amount ||
            !inst.date ||
            (pm.method === "ccp" && !inst.pdf_file)
        )
      );
      if (hasEmptyFields) {
        toast.error(
          "Veuillez remplir tous les montants, dates et justificatifs CCP pour les versements."
        );
        return;
      }
    }

    const clientObject = {
      nom: achat.client.nom.trim(),
      telephone: achat.client.telephone || null,
      email: achat.client.email || null,
      wilaya: achat.client.wilaya || null,
      recommandation: achat.client.recommandation || null,
    };

    const productsArray = achat.produits.map((produit) => ({
      produit_id: produit.produit_id,
      quantite: produit.quantite,
      prix: produit.prix,
      code_garantie: produit.code_garantie || null,
      duree_garantie: produit.duree_garantie || null,
    }));

    const paymentMethodsArray = saleData.paymentMethods.map((pm) => ({
      method: pm.method,
      installments: pm.installments.map((inst) => ({
        amount: parseFloat(inst.amount) || 0,
        date: inst.date || null,
        pdf_file: inst.pdf_file || inst.pdfFile || null, // Accepter pdfFile ou pdf_file
      })),
    }));
    const formData = new FormData();
    formData.append("client", JSON.stringify(clientObject));
    formData.append("produits", JSON.stringify(productsArray));
    formData.append("paymentMethods", JSON.stringify(paymentMethodsArray));
    formData.append("saleType", saleData.saleType);
    formData.append("saleMode", saleData.saleMode);
    formData.append(
      "deliveryProvider",
      saleData.saleType === "livraison" ? saleData.deliveryProvider : null
    );
    formData.append(
      "deliveryPrice",
      saleData.saleType === "livraison" ? saleData.deliveryPrice || "0" : "0"
    );
    formData.append(
      "deliveryCode",
      saleData.saleType === "livraison" ? saleData.deliveryCode : null
    );
    formData.append(
      "installmentRemark",
      saleData.saleMode === "versement" ? saleData.installmentRemark : null
    );
    formData.append("comment", saleData.comment || null);

    Object.entries(saleData.pdf).forEach(([fileName, file]) => {
      if (file) {
        formData.append(fileName, file);
      }
    });

    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(`${API_URL}/api/factures/with-client`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Erreur HTTP ${response.status}`);
      }

      toast.success(result.message || "Facture et client créés avec succès !");

      setAchat({
        client: {
          nom: "",
          telephone: "",
          email: "",
          wilaya: "",
          recommandation: "",
        },
        produits: [],
      });
      setSaleData({
        saleType: "comptoir",
        saleMode: "direct",
        deliveryProvider: "yalidine",
        deliveryPrice: "",
        deliveryCode: "",
        installmentRemark: "",
        comment: "",
        paymentMethods: [],
        pdf: {},
      });

      const refreshResponse = await fetch(`${API_URL}/api/produits`);
      if (!refreshResponse.ok) {
        throw new Error("Erreur lors de la mise à jour des produits.");
      }
      const refreshResult = await refreshResponse.json();
      setProduitsDisponibles(refreshResult.data || []);

      maintainBarcodeFocus();
      handleCloseSaleModal();
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      toast.error(
        error.message || "Erreur serveur lors de la création de la facture."
      );
    }
  };

  const getProductImage = (produit) => {
    try {
      if (produit.image && Array.isArray(produit.image) && produit.image[0]?.path) {
        return `${API_URL}/${produit.image[0].path}`;
      }
      return `${API_URL}/uploads/default.jpg`;
    } catch {
      return `${API_URL}/uploads/default.jpg`;
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      const numericCode = searchTerm.replace(/[^0-9]/g, "");
      if (numericCode.length === 0) {
        toast.error("Veuillez entrer un code-barres valide (chiffres uniquement).");
        return;
      }
      const produit = produitsDisponibles.find(
        (p) => p.id.toString() === numericCode
      );
      if (produit && produit.quantite > 0) {
        handleAddToCart(produit);
        toast.success(`${produit.nom} ajouté au panier !`);
        setSearchTerm("");
      } else {
        toast.error("Produit non trouvé ou en rupture de stock.");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 80px)",
        backgroundColor: "#f4f6f9",
        userSelect: "none",
      }}
    >
      <input
        type="text"
        ref={barcodeInputRef}
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        style={{
          position: "absolute",
          left: "-9999px",
          opacity: 0,
          width: "1px",
          height: "1px",
        }}
        aria-hidden="true"
      />
      <ListeProduits
        filteredProduits={filteredProduits}
        categories={categories}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        searchInputRef={searchInputRef}
        handleSearchChange={handleSearchChange}
        handleSearchKeyPress={handleSearchKeyPress}
        setSelectedCategory={setSelectedCategory}
        handleAddToCart={handleAddToCart}
        getProductImage={getProductImage}
      />
      <Panier
        achat={achat}
        totalPrix={totalPrix}
        produitsDisponibles={produitsDisponibles}
        truncateText={truncateText}
        handlePriceChange={handlePriceChange}
        handleRemoveProduit={handleRemoveProduit}
        handleOpenWarrantyModal={handleOpenWarrantyModal}
        handleOpenClientModal={handleOpenClientModal}
        handleSubmit={handleSubmit}
        getProductImage={getProductImage}
      />
      {isClientModalOpen && (
        <ModalClient
          client={achat.client}
          wilayas={wilayas}
          recommandations={recommandations}
          handleClientChange={handleClientChange}
          handleSaveClient={handleSaveClient}
          handleCloseClientModal={handleCloseClientModal}
        />
      )}
      {isWarrantyModalOpen && (
        <ModalGarantie
          warrantyData={warrantyData}
          handleWarrantyChange={handleWarrantyChange}
          handleSaveWarranty={handleSaveWarranty}
          handleCloseWarrantyModal={handleCloseWarrantyModal}
        />
      )}
      {isSaleModalOpen && (
        <ModalVente
          saleData={saleData}
          paymentOptions={paymentOptions}
          totalPrix={totalPrix}
          handleSaleChange={handleSaleChange}
          handlePaymentChange={handlePaymentChange}
          handlePaymentInstallmentChange={handlePaymentInstallmentChange}
          addInstallment={addInstallment}
          removeInstallment={removeInstallment}
          handleConfirmSale={handleConfirmSale}
          handleCloseSaleModal={handleCloseSaleModal}
        />
      )}
    </div>
  );
};

export default Caisse;