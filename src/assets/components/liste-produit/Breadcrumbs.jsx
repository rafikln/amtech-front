import React from "react";

const Breadcrumbs = () => {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <li className="text-[gray]"><a>Accueil</a></li>
        <li className="text-[blue]"><a>Liste Produit</a></li>
      </ul>
    </div>
  );
};

export default Breadcrumbs;