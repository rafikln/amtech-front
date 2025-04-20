import React from "react";

const FiltresFactures = ({
  searchTerm,
  setSearchTerm,
  dateStart,
  setDateStart,
  dateEnd,
  setDateEnd,
  statusFilter, // Nouvelle prop
  setStatusFilter, // Nouvelle prop
}) => {
  return (
    <div>
      <div className="w-full h-[90px] flex justify-between items-center p-[30px]">
        <div className="breadcrumbs text-sm">
          <ul>
            <li className="text-[gray]">
              <a>Accueil</a>
            </li>
            <li className="text-[blue]">
              <a>Liste Facture</a>
            </li>
          </ul>
        </div>
        <input
          type="text"
          className="px-4 py-2 rounded-md shadow-md border focus:outline-none"
          placeholder="Rechercher par nom ou ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-center gap-2 space-x-4 mt-4">
        <div className="flex items-center gap-2">
          <label className="text-gray-700">De :</label>
          <input
            type="date"
            className="p-2 border rounded-md"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-700">À :</label>
          <input
            type="date"
            className="p-2 border rounded-md"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 ">
          <label className="text-gray-700">Statut :</label>
          <select
            className="p-2 border rounded-md w-[120px] "
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous</option>
            <option value="pending">En cours</option>
            <option value="paid">Validée</option>
            <option value="canceled">Retournée</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltresFactures;