import FSbox from "@/components/FSbox";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import AddOutcomeModal from "./outcomes_components/AddOutcomeModal";
import OutcomeTable from "./outcomes_components/OutcomeTable";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Outcome",
    href: "/outcomes",
  },
];

export default function Outcomes() {
  useDocumentTitle("Outcomes");

  // Get filter parameters from URL
  const [searchParams] = useSearchParams();
  const range = searchParams.get("range");
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
    queryKey: ["outcomes", filters],
    queryFn: async () => {
      const res = await api.get("/outcomes", { params: filters });
      return res.data.data.outcomes; // Extract the paginated outcomes object
    },
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <main className="flex flex-1 flex-col gap-4 overflow-auto rounded-xl p-4">
        <FSbox
          endpoint="/outcomes"
          addTitle="Add new outcome"
          AddModalComponent={AddOutcomeModal}
          sortFields={[
            { label: "Date", value: "date" },
            { label: "Amount", value: "amount" },
          ]}
          defaultSortBy="date"
          defaultSortDir="desc"
        />
        <OutcomeTable
          outcomes={data}
          loading={isLoading}
          error={isError ? "Error loading outcomes" : null}
        />
      </main>
    </AppLayout>
  );
}
