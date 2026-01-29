import SuccessDialog from "@/components/alert-dialog";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import FSbox from "../components/FSbox";
import AddIncomeModal from "./incomes_components/addModal";
import IncomesTable from "./incomes_components/IncomesTable";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/services/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Income",
    href: "/incomes",
  },
];

export default function Incomes() {
  useDocumentTitle("Incomes");

  const queryClient = useQueryClient();
  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["incomes"] });
  };

  // Get filter parameters from URL
  const [searchParams] = useSearchParams();
  const range = searchParams.get("range") || "day";
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");
  const page = searchParams.get("page");
  const sortBy = searchParams.get("sort_by");
  const sortDir = searchParams.get("sort_dir");
  const search = searchParams.get("search");

  // Build filter object (only include non-null values)
  const filters = Object.fromEntries(
    Object.entries({
      range,
      start_date: startDate,
      end_date: endDate,
      page,
      sort_by: sortBy,
      sort_dir: sortDir,
      search,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }).filter(([_, value]) => value !== null),
  );

  // Fetch data using Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["incomes", filters],
    queryFn: async () => {
      const res = await api.get("/incomes", { params: filters });
      return res.data.data.incomes; // Extract the paginated incomes object
    },
  });

  const [successMessage, setSuccessMessage] = useState<string | undefined>(
    undefined,
  );

  // Clear success message after some time
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(undefined), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <main className="flex flex-1 flex-col gap-4 overflow-auto rounded-xl p-4">
          <FSbox
            endpoint="/incomes"
            addTitle="Add new income"
            AddModalComponent={AddIncomeModal}
            sortFields={[
              { label: "Date", value: "date" },
              { label: "Amount", value: "amount" },
            ]}
            defaultSortBy="date"
            defaultSortDir="desc"
            onSuccess={onSuccess}
          />
          <IncomesTable
            incomes={data}
            loading={isLoading}
            error={isError ? "Error loading incomes" : null}
          />
        </main>
        <SuccessDialog message={successMessage ?? undefined} />
      </AppLayout>
    </>
  );
}
