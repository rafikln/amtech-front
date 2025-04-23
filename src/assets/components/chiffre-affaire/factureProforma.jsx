import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const CashRegisterDashboard = () => {
  const [page, setPage] = useState(false);
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const [espaceRevenue, setEspaceRevenue] = useState(0);
  const [ccpRevenue, setCcpRevenue] = useState(0);
  const [yalidineRevenue, setYalidineRevenue] = useState(0);
  const [factures, setFactures] = useState([]);
  const [filteredFactures, setFilteredFactures] = useState([]);
  const [factureTotal, setFactureTotal] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Calculate cash register totals
  const generalTotal = espaceRevenue + ccpRevenue + yalidineRevenue;

  const calculateTotals = (filtered) => {
    let especeTotal = 0;
    let ccpTotal = 0;
    let yalidineTotal = 0;
    let calculatedTotal = 0;

    filtered.forEach(facture => {
      const isCanceled = facture.status === 'canceled' || facture.status === 'Annulée';
      const modifier = isCanceled ? -1 : 1;

      facture.payment_methods.forEach(payment => {
        payment.installments.forEach(installment => {
          const amount = parseFloat(installment.amount) || 0;
          
          if (payment.method === 'espece' || payment.method === 'cash') {
            especeTotal += amount * modifier;
          }
          if (payment.method === 'ccp') {
            ccpTotal += amount * modifier;
          }
          if (payment.method === 'yalidine') {
            yalidineTotal += amount * modifier;
          }
          
          calculatedTotal += amount * modifier;
        });
      });
    });

    setEspaceRevenue(especeTotal);
    setCcpRevenue(ccpTotal);
    setYalidineRevenue(yalidineTotal);
    setFactureTotal(calculatedTotal);
  };

  // Fetch factures data
  const fetchFactures = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://il-developer.com/api/factures");
      const { data } = await response.json();
      setFactures(data);
      applyFilters(data);
    } catch (err) {
      toast.error("Erreur lors de la récupération des factures");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (data) => {
    let filtered = data.filter(facture => {
      const isYalidinePending = facture.status === 'pending' && facture.delivery?.provider === 'yalidine';
      const isCanceledYalidine = facture.status === 'canceled' && facture.delivery?.provider === 'yalidine';
      const hasValidPayment = ['cash', 'espece', 'ccp'].some(m => 
        facture.payment_methods.some(p => p.method === m)
      );

      if (isYalidinePending || isCanceledYalidine) return false;
      if (facture.status === 'canceled' && !hasValidPayment) return false;
      return true;
    });

    // Apply status filter
    if (statusFilter === 'revenus') {
      filtered = filtered.filter(facture => facture.status !== 'canceled' && facture.status !== 'Annulée');
    } else if (statusFilter === 'perte') {
      filtered = filtered.filter(facture => facture.status === 'canceled' || facture.status === 'Annulée');
    }

    // Date filtering - now using installment dates
    let startDate, endDate;
    if (filter === 'day') {
      const today = new Date();
      startDate = new Date(today.setHours(0, 0, 0, 0));
      endDate = new Date(today.setHours(23, 59, 59, 999));
    } else if (filter === 'month') {
      const date = new Date();
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      endDate = new Date();
    } else if (filter === 'year') {
      const date = new Date();
      startDate = new Date(date.getFullYear(), 0, 1);
      endDate = new Date();
    } else if (dateStart && dateEnd) {
      startDate = new Date(dateStart);
      endDate = new Date(dateEnd);
      endDate.setHours(23, 59, 59, 999);
    }

    if (startDate && endDate) {
      filtered = filtered.filter(facture => {
        // Check if any installment falls within the date range
        return facture.payment_methods.some(payment => 
          payment.installments.some(installment => {
            const installmentDate = new Date(installment.date);
            return installmentDate >= startDate && installmentDate <= endDate;
          })
        );
      });
    }

    setFilteredFactures(filtered);
    calculateTotals(filtered);
  };

  useEffect(() => {
    if (page) {
      fetchFactures();
    }
  }, [page, filter, dateStart, dateEnd, statusFilter]);

  useEffect(() => {
    if (filter !== 'custom') {
      setDateStart('');
      setDateEnd('');
    }
  }, [filter]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
      {page ? (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
              Tableau de bord des caisses
            </h1>
            <button 
              onClick={() => setPage(false)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Déconnexion
            </button>
          </div>

          {/* Cash Registers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
            {/* Espace Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-red-100 p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-gray-700">Caisse Espace</h2>
                </div>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{espaceRevenue.toLocaleString('fr-DZ', {minimumFractionDigits: 2, maximumFractionDigits: 2})} DA</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Dernière mise à jour: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>

            {/* CCP Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-gray-700">Caisse CCP</h2>
                </div>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{ccpRevenue.toLocaleString('fr-DZ', {minimumFractionDigits: 2, maximumFractionDigits: 2})} DA</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Dernière mise à jour: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>

            {/* Yalidine Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-gray-700">Caisse Yalidine</h2>
                </div>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{yalidineRevenue.toLocaleString('fr-DZ', {minimumFractionDigits: 2, maximumFractionDigits: 2})} DA</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Dernière mise à jour: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          {/* General Total */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-700">Total Général</h2>
                <p className="text-3xl font-bold text-teal-600 mt-1">
                  {generalTotal.toLocaleString('fr-DZ', {minimumFractionDigits: 2, maximumFractionDigits: 2})} DA
                </p>
              </div>
              <div className="bg-teal-100 p-3 rounded-lg transform transition-transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Factures Table Section */}
          <div className="mb-8">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-lg font-bold text-gray-700">Période:</label>
                <select
                  className="p-2 border rounded-lg"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Toutes</option>
                  <option value="day">Aujourd&apos;hui</option>
                  <option value="month">Ce mois</option>
                  <option value="year">Cette année</option>
                  <option value="custom">Personnalisé</option>
                </select>
              </div>

              {filter === 'custom' && (
                <div className="flex items-center gap-2">
                  <label className="text-lg font-bold text-gray-700">De :</label>
                  <input
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    className="p-2 border rounded-lg"
                  />
                  <label className="text-lg font-bold text-gray-700">à :</label>
                  <input
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="p-2 border rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <label className="text-lg font-bold text-gray-700">Type:</label>
                <select
                  className="p-2 border rounded-lg"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Toutes</option>
                  <option value="revenus">Revenus</option>
                  <option value="perte">Pertes</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Chargement des factures...</p>
              </div>
            ) : filteredFactures.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Aucune facture trouvée pour les critères sélectionnés.</p>
              </div>
            ) : (
              <div className="overflow-y-auto h-[400px] mb-4">
        <table className="w-full bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-3 text-left">ID Facture</th>
              <th className="p-3 text-left">Montant</th>
              <th className="p-3 text-left">Méthode</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filteredFactures.flatMap(facture => 
              facture.payment_methods.flatMap(payment => 
                payment.installments.map((installment, idx) => {
                  const isCanceled = facture.status === 'canceled' || facture.status === 'Annulée';
                  const rowClass = isCanceled ? 'text-red-600 bg-red-50' : '';
                  
                  const statusText = {
                    'paid': 'Payé',
                    'pending': 'En attente',
                    'canceled': 'Annulée',
                    'Annulée': 'Annulée'
                  }[facture.status] || facture.status;

                  return (
                    <tr 
                      key={`${facture.id}-${payment.method}-${idx}`}
                      className={`border-t ${rowClass}`}
                    >
                      <td className="p-3">{facture.id}</td>
                      <td className="p-3">
                        {parseFloat(installment.amount).toFixed(2)} DA
                        {isCanceled && <span className="ml-2 text-xs">(Annulée)</span>}
                      </td>
                      <td className="p-3">{payment.method.toUpperCase()}</td>
                      <td className="p-3">
                      {installment.date 
                        ? new Date(installment.date).toLocaleDateString('fr-FR') 
                        : new Date(facture.date_creation).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded ${
                          facture.status === 'paid' || facture.status === 'pending' ? 
                          'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )
            )}
          </tbody>
        </table>
              </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-xl font-bold text-gray-800">
                Total des Factures: {factureTotal.toLocaleString('fr-DZ', {minimumFractionDigits: 2, maximumFractionDigits: 2})} DA
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Accès sécurisé</h2>
              <p className="text-gray-500 mt-2">Veuillez entrer vos identifiants</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (password === "admin123") {
                  setPage(true);
                  setHasError(false);
                } else {
                  setHasError(true);
                  toast.error("Mot de passe incorrect");
                }
              }}
            >
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <input
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setHasError(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    hasError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  } focus:ring-2 focus:outline-none transition placeholder-gray-400`}
                  required
                />
                {hasError && (
                  <p className="text-red-500 text-sm mt-2">Mot de passe incorrect. Essayez à nouveau.</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-md"
              >
                Se connecter
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashRegisterDashboard;