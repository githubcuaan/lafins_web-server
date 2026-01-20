import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import JarList from "./jarconfigs/jar-list";
import ConfigHeader from "./jarconfigs/jarconfig-head";
import { useState, useEffect } from "react";
import type { Jar } from "@/types";
import { jarsService } from "@/services/jars";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteAllDataBox from "./jarconfigs/del-data";
import SuccessDialog from "@/components/success-dialog";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Jarsconfig",
    href: "/jarsconfig",
  },
];

export default function Jarsconfig() {
  useDocumentTitle("Jarconfigs");
  const queryClient = useQueryClient();

  // Fetch jars data with TanStack Query
  const {
    data: serverJars = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jars"],
    queryFn: jarsService.getJars,
  });

  // local editable state for percentages: { id: percent }
  const [percentages, setPercentages] = useState<
    Record<string | number, number>
  >({});

  // Initialize and sync percentages when serverJars changes
  useEffect(() => {
    if (serverJars.length > 0) {
      const map: Record<string | number, number> = {};
      (serverJars as Jar[]).forEach((j) => {
        map[j.id] = Number(j.percentage ?? 0);
      });
      setPercentages((prevPercentages) => {
        // Only update if there's actual change
        const hasChanged = Object.keys(map).some(
          (id) => map[id] !== prevPercentages[id],
        );
        return hasChanged ? map : prevPercentages;
      });
    }
  }, [serverJars]);

  function handlePercentChange(id: number | string, percent: number) {
    setPercentages((s) => ({ ...s, [id]: percent }));
  }

  // Local alert state used to drive the shared alert dialog
  const [alert, setAlert] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);
  function clearAlert() {
    setAlert(null);
  }

  // Mutations
  const bulkUpdateMutation = useMutation({
    mutationFn: jarsService.bulkUpdate,
    onSuccess: () => {
      setAlert({
        message: "Jar percentages saved successfully.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["jars"] });
    },
    onError: () => {
      setAlert({
        message: "Failed to save jar percentages.",
        variant: "error",
      });
    },
  });

  const resetMutation = useMutation({
    mutationFn: jarsService.reset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jars"] });
    },
  });

  async function handleSave() {
    // convert keys to strings and ensure values are numbers
    const payload: Record<string, number> = {};
    Object.entries(percentages).forEach(
      ([k, v]) => (payload[String(k)] = Number(v || 0)),
    );

    // Validate total equals 100 (allow small epsilon)
    const total = Object.values(payload).reduce(
      (a, b) => a + Number(b || 0),
      0,
    );
    const epsilon = 0.01;
    if (Math.abs(total - 100) > epsilon) {
      // show fail alert and prevent save
      setAlert({
        message: `Total percentage must equal 100%. Current total is ${total.toFixed(2)}%.`,
        variant: "error",
      });
      return;
    }

    bulkUpdateMutation.mutate(payload);
  }

  async function handleReset() {
    resetMutation.mutate();
  }

  const totalPercent = Object.values(percentages).reduce(
    (a, b) => a + (Number(b) || 0),
    0,
  );

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
            <p className="text-red-500">Error loading jars data</p>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <main className="flex flex-1 flex-col gap-4 overflow-auto rounded-xl p-4">
        <ConfigHeader
          onSave={handleSave}
          onReset={handleReset}
          totalPercent={totalPercent}
        />

        <JarList 
          className="w-full" 
          jars={serverJars as Jar[]}
          onPercentChange={handlePercentChange} 
        />
        <DeleteAllDataBox />
        <SuccessDialog
          message={alert?.message ?? undefined}
          variant={alert?.variant}
          onClose={clearAlert}
          suppressFlash={!!alert}
        />
      </main>
    </AppLayout>
  );
}

