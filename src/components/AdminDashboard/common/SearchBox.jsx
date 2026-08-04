"use client";

export default function SearchBox({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
}) {
  return (
    <div className="search-box">
      <i className="bi bi-search search-icon"></i>

      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {value && (
        <button type="button" className="search-clear" onClick={onClear}>
          <i className="bi bi-x-lg"></i>
        </button>
      )}
    </div>
  );
}
