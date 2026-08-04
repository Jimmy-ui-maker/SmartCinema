"use client";

import { useMemo, useState } from "react";

export default function DataTable({
  columns = [],
  data = [],
  search = "",
  loading = false,
  pageSize = 10,
  actions,
  emptyText = "No records found.",
}) {
  const [page, setPage] = useState(1);

  // -----------------------------
  // Filter
  // -----------------------------

  const filteredData = useMemo(() => {
    if (!search) return data;

    const query = search.toLowerCase();

    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(query),
      ),
    );
  }, [data, search]);

  // -----------------------------
  // Pagination
  // -----------------------------

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const start = (page - 1) * pageSize;

  const currentRows = filteredData.slice(start, start + pageSize);

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // reset page if search reduces rows

  if (page > totalPages) {
    setTimeout(() => setPage(1), 0);
  }

  return (
    <div className="admin-table-card">
      <div className="table-responsive">
        <table className="table admin-table align-middle">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}

              {actions && <th width="150">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={actions ? columns.length + 1 : columns.length}
                  className="text-center py-5"
                >
                  <div className="spinner-border text-primary" role="status" />
                </td>
              </tr>
            ) : currentRows.length === 0 ? (
              <tr>
                <td
                  colSpan={actions ? columns.length + 1 : columns.length}
                  className="text-center py-5"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              currentRows.map((row, index) => (
                <tr key={row._id || index}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}

                  {actions && <td>{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}

      <div className="admin-pagination">
        <span>
          Showing <strong>{currentRows.length}</strong> of{" "}
          <strong>{filteredData.length}</strong>
        </span>

        <div className="pagination-buttons">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === 1}
            onClick={prevPage}
          >
            Previous
          </button>

          <span className="page-number">
            {page} / {totalPages}
          </span>

          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === totalPages}
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
