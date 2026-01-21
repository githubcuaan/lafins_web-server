import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";
import { useSearchParams } from "react-router-dom";

import {
  TotalBalance,
  TotalIncome,
  TotalOutcome,
  JarDistributionPie,
  IncomeOutcomeBar,
  JarList,
} from "./dashboard/DashboardComponent";
import FillterBox from "@/components/FilterBox";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
];

export default function Dashboard() {
  useDocumentTitle("Dashboard");

  // Get filter parameters from URL
  const [searchParams] = useSearchParams();
  const range = searchParams.get("range");
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");
  const page = searchParams.get("page");

  // Build filter object (only include non-null values)
  const filters = Object.fromEntries(
    Object.entries({
      range,
      start_date: startDate,
      end_date: endDate,
      page,
    }).filter(([_, value]) => value !== null),
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", filters],
    queryFn: () => dashboardService.getDashboardData(filters),
  });

  if (isLoading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <main className="flex flex-1 flex-col gap-4 overflow-auto rounded-xl p-4">
          <div className="flex items-center justify-center h-full">
            <p>Loading...</p>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <main className="flex flex-1 flex-col gap-4 overflow-auto rounded-xl p-4">
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">Error loading dashboard data</p>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <main className="flex flex-1 flex-col gap-4 overflow-auto rounded-xl p-4">
        {/* fillter box */}
        <FillterBox className="flex" endpoint="/dashboard" />

        {/* Sumary */}
        <div
          id="sumary"
          className="relative z-20 flex-none overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"
        >
          <div className="grid auto-rows-auto gap-4 md:grid-cols-3 p-4">
            <div className="card-default">
              <TotalBalance total={data?.summary?.total_balance} />
            </div>
            <div className="card-default">
              <TotalIncome total={data?.summary?.total_income} />
            </div>
            <div className="card-default">
              <TotalOutcome total={data?.summary?.total_outcome} />
            </div>
          </div>
        </div>

        {/* chart: split into two columns (left: pie, right: income/outcome) */}
        <div
          id="chart"
          className="relative overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-[40vh] dark:border-sidebar-border bg-white dark:bg-[#0a0a0a]"
        >
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full items-center">
              <div className="flex items-center justify-center">
                <div className="w-full max-w-2xl">
                  <JarDistributionPie jars={data?.jars} />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-2x">
                  <IncomeOutcomeBar summary={data?.summary} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jar list */}
        <div
          id="jarlist"
          className="overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border bg-white dark:bg-[#0a0a0a]"
        >
          <div className="size-full overflow-auto p-4">
            <JarList className={"w-full h-full"} jars={data?.jars} />
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
