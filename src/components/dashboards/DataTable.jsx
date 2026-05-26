export function DataTable({ columns, rows, onRowClick }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/10 text-xs uppercase text-taxo-gold">
            <tr>{columns.map((column) => <th key={column.key} className="px-4 py-3">{column.label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((row, index) => (
              <tr key={row.id || index} onClick={() => onRowClick?.(row)} className={onRowClick ? 'cursor-pointer hover:bg-white/10' : 'hover:bg-white/5'}>
                {columns.map((column) => <td key={column.key} className="px-4 py-3 text-taxo-light">{column.render ? column.render(row) : row[column.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
