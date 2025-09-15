import React from 'react'

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
  loading?: boolean
}

const Pagination: React.FC<PaginationProps> = ({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange, 
  loading = false 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const maxVisibleButtons = 5

  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const pages = []
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2))
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1)

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || loading}
      >
        首页
      </button>
      
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
      >
        上一页
      </button>

      {visiblePages[0] > 1 && (
        <span className="page-ellipsis">...</span>
      )}

      {visiblePages.map((page) => (
        <button
          key={page}
          className={`page-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
          disabled={loading}
        >
          {page}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <span className="page-ellipsis">...</span>
      )}

      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
      >
        下一页
      </button>
      
      <button
        className="page-btn"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || loading}
      >
        末页
      </button>

      <div className="pagination-info">
        共 {totalItems} 条记录，每页 {itemsPerPage} 条，共 {totalPages} 页
      </div>
    </div>
  )
}

export default Pagination
