import BaseModal, { type BaseModalField } from "./BaseModal";
import { useJars } from "@/hooks/useJars";
import type { Jar } from "@/types";
import { useMemo } from "react";
// import OutcomeController from '@/actions/App/Http/Controllers/OutcomeController';

type ModalType = "add" | "update";

interface OutcomeModalProps {
  type: ModalType;
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id?: number | string;
    date?: string;
    category?: string;
    description?: string;
    amount?: number | string;
    jar_id?: number | string | null;
  } | null;
  onSuccess?: () => void;
}

export default function OutcomeModal({
  type,
  isOpen,
  onClose,
  initialData = null,
  onSuccess,
}: OutcomeModalProps) {
  const { jars, isLoading } = useJars();

  const outcomeFields: BaseModalField[] = useMemo(() => {
    const jarOptions = jars.map((jar: Jar) => ({
      label: jar.name || jar.key || jar.id.toString(),
      value: jar.id,
    }));
    return [
      {
        name: "date",
        label: "Date",
        type: "date",
        required: true,
      },
      {
        name: "category",
        label: "Category",
        type: "text",
        required: true,
      },
      {
        name: "jar_id",
        label: "Jar",
        type: "select",
        required: true,
        options: jarOptions,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
      },
      {
        name: "amount",
        label: "Amount",
        type: "currency",
        required: true,
      },
    ];
  }, [jars]);

  // helper to format currency
  function formatCurrency(amount: number | null | undefined) {
    if (amount == null) return "-";
    try {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(Number(amount));
    } catch (e) {
      console.error("something wrong when format the amount: ", e);
      return String(amount);
    }
  }

  // renderer to show extra content under a field
  function renderFieldExtra(
    fieldName: string,
    value: string,
    data: Record<string, string>,
  ) {
    if (fieldName !== "jar_id") return null;

    if (isLoading) {
      return <div className="mt-2 text-xs text-gray-400">Loading jars...</div>;
    }

    const selectedId = Number(
      value || data["jar_id"] || initialData?.jar_id || "",
    );
    const jar = jars.find((j: Jar) => Number(j.id) === selectedId) as
      | Jar
      | undefined;
    if (!jar) return null;

    return (
      <div className="mt-2 text-sm text-gray-600">
        Balance:{" "}
        <span className="font-medium">{formatCurrency(jar.balance)}</span>
      </div>
    );
  }

  return (
    <BaseModal
      type={type}
      isOpen={isOpen}
      onClose={onClose}
      title={type === "add" ? "Add Outcome" : "Edit Outcome"}
      fields={outcomeFields}
      initialData={initialData}
      onSuccess={onSuccess}
      storeUrl="/outcomes"
      updateUrl={(id) => `/outcomes/${id}`}
      fieldExtra={renderFieldExtra}
    />
  );
}
