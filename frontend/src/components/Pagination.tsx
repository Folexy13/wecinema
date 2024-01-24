// Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="pagination">
          {pages.map((page) => (
            <li
              key={page}
              className={`pagination-item ${
                page === currentPage ? 'pagination-item-active' : ''
              }`}
            >
              <button
                onClick={() => onPageChange(page)}
                className="pagination-link"
              >
                {page}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
