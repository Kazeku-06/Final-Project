const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxPagesToShow = 5;
  
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-3">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-full border-2 border-blue-500 text-blue-500 bg-transparent font-semibold 
               disabled:opacity-40 disabled:cursor-not-allowed 
               hover:bg-blue-500 hover:text-black 
               shadow-[0_0_10px_rgba(59,130,246,0.5)] 
               hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] 
               transition-all duration-300"
      >
        ←
      </button>

      {/* First Page */}
      {currentPage > Math.floor(maxPagesToShow / 2) + 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded-full border-2 border-blue-500 text-blue-500 bg-transparent font-semibold 
                   hover:bg-blue-500 hover:text-black 
                   shadow-[0_0_10px_rgba(59,130,246,0.5)] 
                   hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] 
                   transition-all duration-300"
          >
            1
          </button>
          {currentPage > Math.floor(maxPagesToShow / 2) + 2 && (
            <span className="px-2 text-blue-400">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-full font-semibold transition-all duration-300
        ${currentPage === page
            ? 'bg-blue-500 text-black shadow-[0_0_20px_rgba(59,130,246,0.8)]'
            : 'border-2 border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-black shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]'
        }`}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {currentPage < totalPages - Math.floor(maxPagesToShow / 2) && (
        <>
          {currentPage < totalPages - Math.floor(maxPagesToShow / 2) - 1 && (
            <span className="px-2 text-blue-400">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded-full border-2 border-blue-500 text-blue-500 bg-transparent font-semibold 
                   hover:bg-blue-500 hover:text-black 
                   shadow-[0_0_10px_rgba(59,130,246,0.5)] 
                   hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] 
                   transition-all duration-300"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-full border-2 border-blue-500 text-blue-500 bg-transparent font-semibold 
               disabled:opacity-40 disabled:cursor-not-allowed 
               hover:bg-blue-500 hover:text-black 
               shadow-[0_0_10px_rgba(59,130,246,0.5)] 
               hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] 
               transition-all duration-300"
      >
        →
      </button>
    </div>
  );
};

export default Pagination;