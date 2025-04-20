const formatDate = (isoDate, detailed = false) => {
    if (detailed) {
      return new Date(isoDate).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return new Date(isoDate).toISOString().split("T")[0];
  };
  
  export { formatDate };