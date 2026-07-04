interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const canPrev = page > 1;
  const canNext = totalPages > 0 && page < totalPages;

  return (
    <div className="pagination">
      <span className="pagination-info">
        Pagina {totalPages === 0 ? 0 : page} de {totalPages} &middot; {totalItems} registros
      </span>
      <div className="pagination-buttons">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
