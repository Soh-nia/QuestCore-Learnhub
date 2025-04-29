'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface Props {
  itemCount: number;
  pageSize: number;
  currentPage: number;
}

const Pagination = ({ itemCount, pageSize, currentPage }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageCount = Math.ceil(itemCount / pageSize);
  if (pageCount <= 1) return null;

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push('?' + params.toString());
  };

  const pages = [];
  const maxPages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
  const endPage = Math.min(pageCount, startPage + maxPages - 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center items-center gap-x-1 py-4 px-4" aria-label="Pagination">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
        className="min-h-10 min-w-10 py-2 px-3 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
        aria-label="Previous"
      >
        <HiChevronLeft className="shrink-0 h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>
      <div className="flex items-center gap-x-1">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => changePage(page)}
            className={`min-h-10 min-w-10 flex justify-center items-center py-2 px-3 text-sm rounded-lg ${
              page === currentPage
                ? 'bg-gray-200 text-gray-800 dark:bg-neutral-600 dark:text-white'
                : 'text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-700'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={currentPage === pageCount}
        onClick={() => changePage(currentPage + 1)}
        className="min-h-10 min-w-10 py-2 px-3 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
        aria-label="Next"
      >
        <span className="hidden sm:inline">Next</span>
        <HiChevronRight className="shrink-0 h-4 w-4" />
      </button>
    </nav>
  );
};

export default Pagination;