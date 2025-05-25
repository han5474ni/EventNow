import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showPageNumbers = true,
  showPageInfo = true,
  showFirstLast = true,
  showPrevNext = true,
  size = 'md',
  variant = 'default',
  disabled = false,
}) => {
  // Don't render if there's only one page
  if (totalPages <= 1) return null;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
  };

  const variantClasses = {
    default: 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Show max 5 page numbers at a time
    
    if (totalPages <= maxVisiblePages) {
      // If total pages are less than or equal to max visible pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the start or end
      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage || disabled) return;
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    if (!showPageNumbers) return null;
    
    return getPageNumbers().map((page, index) => {
      if (page === '...') {
        return (
          <span 
            key={`ellipsis-${index}`} 
            className={`${sizeClasses[size]} flex items-center justify-center px-2`}
          >
            ...
          </span>
        );
      }
      
      const isCurrent = page === currentPage;
      
      return (
        <button
          key={page}
          type="button"
          onClick={() => handlePageChange(page)}
          disabled={disabled}
          className={cn(
            'flex items-center justify-center rounded-md border font-medium transition-colors',
            sizeClasses[size],
            isCurrent 
              ? 'bg-blue-600 text-white border-blue-600' 
              : `${variantClasses[variant]} hover:bg-gray-100`,
            { 'opacity-50 cursor-not-allowed': disabled }
          )}
          aria-current={isCurrent ? 'page' : undefined}
          aria-label={`Go to page ${page}`}
        >
          {page}
        </button>
      );
    });
  };

  const renderPageInfo = () => {
    if (!showPageInfo) return null;
    
    return (
      <div className="hidden sm:flex items-center text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </div>
    );
  };

  const renderFirstButton = () => {
    if (!showFirstLast) return null;
    
    return (
      <button
        type="button"
        onClick={() => handlePageChange(1)}
        disabled={isFirstPage || disabled}
        className={cn(
          'flex items-center justify-center rounded-l-md border border-r-0',
          sizeClasses[size],
          'text-gray-700 bg-white hover:bg-gray-50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          { 'opacity-50 cursor-not-allowed': disabled }
        )}
        aria-label="Go to first page"
      >
        <ChevronsLeft size={20} />
      </button>
    );
  };

  const renderPrevButton = () => {
    if (!showPrevNext) return null;
    
    return (
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={isFirstPage || disabled}
        className={cn(
          'flex items-center justify-center border border-r-0',
          sizeClasses[size],
          'text-gray-700 bg-white hover:bg-gray-50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          { 'opacity-50 cursor-not-allowed': disabled }
        )}
        aria-label="Go to previous page"
      >
        <ChevronLeft size={20} />
      </button>
    );
  };

  const renderNextButton = () => {
    if (!showPrevNext) return null;
    
    return (
      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={isLastPage || disabled}
        className={cn(
          'flex items-center justify-center border border-l-0',
          sizeClasses[size],
          'text-gray-700 bg-white hover:bg-gray-50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          { 'opacity-50 cursor-not-allowed': disabled }
        )}
        aria-label="Go to next page"
      >
        <ChevronRight size={20} />
      </button>
    );
  };

  const renderLastButton = () => {
    if (!showFirstLast) return null;
    
    return (
      <button
        type="button"
        onClick={() => handlePageChange(totalPages)}
        disabled={isLastPage || disabled}
        className={cn(
          'flex items-center justify-center rounded-r-md border border-l-0',
          sizeClasses[size],
          'text-gray-700 bg-white hover:bg-gray-50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          { 'opacity-50 cursor-not-allowed': disabled }
        )}
        aria-label="Go to last page"
      >
        <ChevronsRight size={20} />
      </button>
    );
  };

  return (
    <nav 
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between',
        'space-y-4 sm:space-y-0 sm:space-x-2',
        className
      )}
      aria-label="Pagination"
    >
      {renderPageInfo()}
      
      <div className="flex items-center">
        {renderFirstButton()}
        {renderPrevButton()}
        
        <div className="flex -space-x-px">
          {renderPageNumbers()}
        </div>
        
        {renderNextButton()}
        {renderLastButton()}
      </div>
    </nav>
  );
};

export default Pagination;
