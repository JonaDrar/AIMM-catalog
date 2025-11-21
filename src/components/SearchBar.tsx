type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar producto",
}: Props) {
  return (
    <div className="flex w-full items-center rounded-xl border border-[#b3b3b3] bg-[#f1f4f8] px-5 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#10456f]">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-[--primary-strong] outline-none placeholder:text-[--muted]"
      />
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="ml-3 h-5 w-5 text-[--muted]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-4.35-4.35m0 0a7.5 7.5 0 1 0-10.61-10.61 7.5 7.5 0 0 0 10.61 10.61Z"
        />
      </svg>
    </div>
  );
}
