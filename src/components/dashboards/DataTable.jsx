export function DataTable({ columns, rows, onRowClick }) {
  return (
    <div className="table-shell">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr>{columns.map((column) => <th key={column.key} className="px-4 py-3">{column.label}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id || index} onClick={() => onRowClick?.(row)} className={onRowClick ? 'cursor-pointer' : ''}>
                {columns.map((column) => <td key={column.key} className="px-4 py-3">{column.render ? column.render(row) : row[column.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
