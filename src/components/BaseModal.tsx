import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import api from "@/services/api";
import { formatMoney, parseMoney } from "@/lib/utils";

type ModalType = "add" | "update";

// interfaces of input field
export interface BaseModalField {
  name: string;
  label: string;
  type: "text" | "date" | "number" | "textarea" | "select" | "currency";
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  required?: boolean;
}

// interfaces of props
interface BaseModalProps {
  type: ModalType;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: BaseModalField[];
  initialData?: Partial<
    Record<string, string | number | null | undefined>
  > | null;
  onSuccess?: () => void;
  storeUrl: string;
  updateUrl: (id: number) => string;
  // Optional renderer for extra content under a specific field.
  fieldExtra?: (
    fieldName: string,
    value: string,
    data: Record<string, string>,
  ) => ReactNode;
}

// main funct
export default function BaseModal({
  type,
  isOpen,
  onClose,
  title,
  fields,
  initialData = null,
  onSuccess,
  storeUrl,
  updateUrl,
  fieldExtra,
}: BaseModalProps) {
  // Create initial form data from fields
  const initialFormData = fields.reduce(
    (acc, field) => {
      acc[field.name] = "";
      return acc;
    },
    {} as Record<string, string>,
  );

  const [data, setDataState] =
    useState<Record<string, string>>(initialFormData);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setData = useCallback((key: string, value: string) => {
    setDataState((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Update form when modal is open
  useEffect(() => {
    if (!isOpen) return;

    setErrors({});

    const nextData: Record<string, string> = {};

    if (initialData) {
      fields.forEach((field) => {
        const value = initialData[field.name];
        if (field.type === "currency" && value != null) {
          // Format currency values for display
          nextData[field.name] = formatMoney(String(value));
        } else {
          nextData[field.name] = value != null ? String(value) : "";
        }
      });
    } else if (type === "add") {
      // reset to initial then set any date fields to today

      const today = new Date().toISOString().split("T")[0];
      fields.forEach((field) => {
        if (field.type === "date") {
          nextData[field.name] = today;
        } else {
          nextData[field.name] = "";
        }
      });
    }

    setDataState(nextData);
    // Dependency Array chuẩn chỉ:
    // Chỉ chạy lại khi: Modal mở/đóng, Data đầu vào đổi, hoặc Loại form đổi.
    // fields thường là tĩnh (static config) nên bỏ vào cũng an toàn.
  }, [initialData, type, isOpen, fields]);

  // Handle input change
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    const field = fields.find((f) => f.name === name);

    if (field?.type === "currency") {
      // Auto-format currency as user types
      setData(name as keyof typeof data, formatMoney(value));
    } else {
      setData(name as keyof typeof data, value);
    }
  }

  // Handle submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    // Normalize number and currency fields
    const submitData = { ...data };
    fields.forEach((field) => {
      if (field.type === "number") {
        submitData[field.name] = String(Number(data[field.name]) || 0);
      } else if (field.type === "currency") {
        // Parse "10.000" → "10000" before sending to API
        submitData[field.name] = parseMoney(data[field.name] || "0");
      }
    });

    try {
      if (type === "add") {
        await api.post(storeUrl, submitData);
      } else {
        const id = initialData?.id;
        if (!id) return;
        await api.put(updateUrl(Number(id)), submitData);
      }
      onClose();
      onSuccess?.();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general: error.response?.data?.message || "An error occurred",
        });
      }
    } finally {
      setProcessing(false);
    }
  }

  // render view of modal
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* map -> foreach -> create input div */}
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={data[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full rounded-md border px-3 py-2 min-h-20"
                  required={field.required}
                />
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={data[field.name] || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2"
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  value={data[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full rounded-md border px-3 py-2"
                  required={field.required}
                />
              )}

              {errors[field.name] && (
                <div className="text-red-500 text-sm mt-1">
                  {String(errors[field.name])}
                </div>
              )}

              {/* optional extra renderer for a field (e.g. show jar balance under jar select) */}
              {fieldExtra && fieldExtra(field.name, data[field.name], data)}
            </div>
          ))}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
