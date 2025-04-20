  import { useState } from "react";

  const Drawer = ({ setPage,isCollapsed,setIsCollapsed }) => {
    const [activePage, setActivePage] = useState(0);

    const handleSetPage = (page) => {
      setPage(page);
      setActivePage(page);
    };

    const toggleDrawer = () => {
      setIsCollapsed(!isCollapsed);
    };

    // Define all icon components (inchangé)
    const AddInvoiceIcon = ({ active }) => (
      <div className={`p-2 rounded-lg ${active ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    );

    const InvoiceListIcon = ({ active }) => (
      <div className={`p-2 rounded-lg ${active ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
    );

    const AddProductIcon = ({ active }) => (
      <div className={`p-2 rounded-lg ${active ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
    );

    const AddCategoryIcon = ({ active }) => (
      <div className={`p-2 rounded-lg ${active ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      </div>
    );

    const AddChiffreIcon = ({ active }) => (
      <div className={`p-2 rounded-lg ${active ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );

    const ProductListIcon = ({ active }) => (
      <div className={`p-2 rounded-lg ${active ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
    );

    const CategoryListIcon = ({ active }) => (
      <div className={`p-2 rounded-lg ${active ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
    );

    return (
      <div className={`inset-y-0 left-0 bg-white border-r border-gray-200 flex flex-col z-50 transition-all duration-300 class="flex-1 overflow-y-auto  space-y-1" ${isCollapsed ? 'w-[75px]' : 'w-[18%]'}`}>
        {/* Bouton pour toggler le drawer */}
        <div className=" py-4 border-b border-gray-200">
          <button
            onClick={toggleDrawer}
            className="w-full flex justify-center items-center p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
        </div>

        {/* Menu items */}
        <div className="flex-1  p-4 space-y-1">
          {[
            { id: 0, title: "Liste Catégories", icon: <CategoryListIcon active={activePage === 0} /> },
            { id: 2, title: "Liste Produit", icon: <ProductListIcon active={activePage === 2} /> },
            { id: 3, title: "Ajouter Produit", icon: <AddProductIcon active={activePage === 3} /> },
            { id: 4, title: "Caisse", icon: <AddInvoiceIcon active={activePage === 4} /> },
            { id: 5, title: "Liste D'achat", icon: <InvoiceListIcon active={activePage === 5} /> },
            { id: 6, title: "Chiffre d'affaire", icon: <AddChiffreIcon active={activePage === 6} /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleSetPage(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                activePage === item.id 
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              } ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
            >
              {item.icon}
              {!isCollapsed && <span>{item.title}</span>}
            </button>
          ))}
        </div>

        {/* Optional footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
            Version 1.1
          </div>
        )}
      </div>
    );
  };

  export default Drawer;