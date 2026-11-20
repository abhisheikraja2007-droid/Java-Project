import React from 'react';

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  responsive?: boolean;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'NO RECORDS FOUND',
  loading = false,
  className = '',
  striped = false,
  hoverable = true,
  responsive = true,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className={responsive ? 'overflow-x-auto' : ''}>
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 font-mono border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`py-2.5 px-3 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map((col) => (
                  <td key={col.key} className={`py-3 px-3 ${col.className || ''}`}>
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={responsive ? 'overflow-x-auto' : ''}>
      <table className="w-full text-left text-xs text-slate-700">
        <thead className="bg-slate-50 text-slate-500 font-mono border-b border-slate-200">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`py-2.5 px-3 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-xs text-slate-400 font-mono py-12">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={keyExtractor(item)}
                className={`
                  ${striped && index % 2 === 0 ? 'bg-slate-50/50' : ''}
                  ${hoverable && onRowClick ? 'hover:bg-slate-50 cursor-pointer transition-colors' : ''}
                `}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`py-3 px-3 ${col.className || ''}`}>
                    {col.render ? col.render(item, index) : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}