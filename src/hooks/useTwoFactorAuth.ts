import { authService } from "@/services/auth";
import { useCallback, useMemo, useState } from "react";

export const OTP_MAX_LENGTH = 6;

export const useTwoFactorAuth = () => {
  const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null);
  const [manualSetupKey, setManualSetupKey] = useState<string | null>(null);
  const [recoveryCodesList, setRecoveryCodesList] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const hasSetupData = useMemo<boolean>(
    () => qrCodeSvg !== null && manualSetupKey !== null,
    [qrCodeSvg, manualSetupKey],
  );

  const fetchQrCode = useCallback(async (): Promise<void> => {
    try {
      const res = await authService.showQrCode();
      const svg = res.svg;
      setQrCodeSvg(svg);
    } catch {
      setErrors((prev) => [...prev, "Failed to fetch QR code"]);
      setQrCodeSvg(null);
    }
  }, []);

  const fetchSetupKey = useCallback(async (): Promise<void> => {
    try {
      const res = await authService.showSecretKey();
      const key = res.secretKey;
      setManualSetupKey(key);
    } catch {
      setErrors((prev) => [...prev, "Failed to fetch a setup key"]);
      setManualSetupKey(null);
    }
  }, []);

  const clearErrors = useCallback((): void => {
    setErrors([]);
  }, []);

  const clearSetupData = useCallback((): void => {
    setManualSetupKey(null);
    setQrCodeSvg(null);
    clearErrors();
  }, [clearErrors]);

  const fetchRecoveryCodes = useCallback(
    async (data: { password: string }): Promise<void> => {
      try {
        clearErrors();
        const res = await authService.getRecoveryCodes(data);
        const codes = res.recovery_codes;
        setRecoveryCodesList(codes);
      } catch {
        setErrors((prev) => [...prev, "Failed to fetch recovery codes"]);
        setRecoveryCodesList([]);
      }
    },
    [clearErrors],
  );

  const fetchSetupData = useCallback(async (): Promise<void> => {
    try {
      clearErrors();
      await Promise.all([fetchQrCode(), fetchSetupKey()]);
    } catch {
      setQrCodeSvg(null);
      setManualSetupKey(null);
    }
  }, [clearErrors, fetchQrCode, fetchSetupKey]);

  return {
    qrCodeSvg,
    manualSetupKey,
    recoveryCodesList,
    hasSetupData,
    errors,
    clearErrors,
    clearSetupData,
    fetchQrCode,
    fetchSetupKey,
    fetchSetupData,
    fetchRecoveryCodes,
  };
};
