import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { incomeApi } from '@/lib/api';
import IncomeModal from '../../components/IncomeModal';
import BaseResourceTable, { type Column } from '@/components/BaseResourceTable';


// Kiểu paginator đơn giản
type Paginator<T> = { data: T[]; meta?: Record<string, unknown> };

// Type guard: kiểm tra xem value có phải paginator không
function isPaginator<T>(v: unknown): v is Paginator<T> {
  return typeof v === 'object' && v !== null && 'data' in (v as object) && Array.isArray((v as Paginator<unknown>).data);
}

// Local paginator shape for passing to Pagination component
type PaginatorShape = {
  current_page?: number;
  last_page?: number;
  last?: number;
  total?: number;
  path?: string;
  meta?: { current_page?: number; last_page?: number };
};

// interfaces props 
interface Income {
  id: number | string;
  date?: string;
  source?: string;
  description?: string;
  amount?: number | string;
  formatted_amount?: string;
}

interface IncomesTableProps {
  incomes?: Income[] | Paginator<Income>;
  loading?: boolean;
  error?: string | null;
}

export default function IncomesTable({ incomes: incomesData, loading = false, error = null }: IncomesTableProps) {
  const queryClient = useQueryClient();

  // Normalize data
  const raw: unknown = incomesData as unknown;
  const isPag = isPaginator<Income>(raw);
  const incomes = isPag
    ? raw.data
    : Array.isArray(raw)
      ? (raw as Income[])
      : [] as Income[];

  const [editing, setEditing] = useState<Income | null>(null);

  // Danh sách đã lọc đơn giản hiện tại (sẽ kết nối tìm kiếm/lọc sau)
  const filtered: Income[] = Array.isArray(incomes) ? incomes : [];

  // format
  function formatCurrency(value: number | string) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  }

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => incomeApi.deleteIncome(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
    },
  });

  function handleDelete(id: number | string) {
    deleteMutation.mutate(id);
  }

  const columns: Column<Income>[] = [
    { key: 'date', header: 'Date' },
    { key: 'source', header: 'Category' },
    { key: 'description', header: 'Description', className: 'truncate max-w-[28rem]' },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (item) => item.formatted_amount ?? formatCurrency(item.amount ?? 0),
    },
  ];

  return (
    <>
      {loading ? (
        <p className="text-center py-6">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-6">Lỗi: {String(error)}</p>
      ) : (
        <BaseResourceTable<Income>
          data={filtered}
          columns={columns}
          onEdit={(item) => setEditing(item)}
          onDelete={(id) => handleDelete(id)}
          emptyMessage={'You dont have any incomes :) .'}
          paginator={isPag ? (raw as PaginatorShape) : undefined}
        />
      )}

      {/* Update modal: open when editing is set */}
      <IncomeModal
        type="update"
        isOpen={Boolean(editing)}
        onClose={() => setEditing(null)}
        initialData={editing}
        onSuccess={() => { setEditing(null);}}
      />
    </>
  );
}