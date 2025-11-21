type Props = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const maxNumbers = 5;
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + maxNumbers - 1);

  for (let page = Math.max(1, end - maxNumbers + 1); page <= end; page += 1) {
    pages.push(page);
  }

  return (
    <div className="flex items-center justify-center gap-2 text-[--primary]">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 text-lg font-bold text-[--primary] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {"<"}
      </button>

      {pages.map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => onChange(page)}
          className={`px-3 py-2 text-lg font-bold ${
            page === currentPage
              ? "text-[--primary-strong]"
              : "text-[--primary]"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-lg font-bold text-[--primary] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {">"}
      </button>
    </div>
  );
}
