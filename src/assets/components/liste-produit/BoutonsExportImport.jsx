import React from "react";

const BoutonsExportImport = ({ onExport, onImport }) => {
  return (
    <div className="flex gap-4 items-center">
      <button
        onClick={onImport}
        className="w-[120px] h-[40px] flex items-center justify-center gap-2 rounded-md bg-[#2196F3] text-white hover:bg-[#1976D2] transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M11.5 4a.5.5 0 0 1 .5.5V12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4.5a.5.5 0 0 1 1 0V12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4.5a.5.5 0 0 1 .5-.5z"/>
          <path d="M8 1a.5.5 0 0 1 .5.5v7.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 9.293V1.5A.5.5 0 0 1 8 1z"/>
        </svg>
        Importer
      </button>
      <button
        onClick={onExport}
        className="w-[120px] h-[40px] flex items-center justify-center gap-2 rounded-md bg-[#4CAF50] text-white hover:bg-[#388E3C] transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M11.5 12a.5.5 0 0 0 .5-.5V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a.5.5 0 0 0 1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7.5a.5.5 0 0 0 .5.5z"/>
          <path d="M8 15a.5.5 0 0 0 .5-.5V6.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 .708.708L7.5 6.707V14.5a.5.5 0 0 0 .5.5z"/>
        </svg>
        Exporter
      </button>
    </div>
  );
};

export default BoutonsExportImport;