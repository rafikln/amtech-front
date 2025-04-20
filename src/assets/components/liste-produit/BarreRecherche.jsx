import React from "react";

const BarreRecherche = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-[190px] h-[50px]">
      <input
        type="text"
        className="grow rounded-md w-full h-full px-2 border border-gray-300"
        placeholder="Rechercher"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default BarreRecherche;