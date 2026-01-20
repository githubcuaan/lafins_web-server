import HeadingSmall from "@/components/heading-small";
import TwoFactorRecoveryCodes from "@/components/two-factor-recovery-codes";
import TwoFactorSetupModal from "@/components/two-factor-setup-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";
import { show } from "@/routes/two-factor";
import { type BreadcrumbItem } from "@/types";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ShieldBan, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { authService } from "@/services/auth";
import { useTwoFactorAuth } from "@/hooks/useTwoFactorAuth";

interface TwoFactorProps {
  requiresConfirmation?: boolean;
  twoFactorEnabled?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Two-Factor Authentication",
    href: show(),
  },
];

export default function TwoFactor({
  requiresConfirmation = false,
  twoFactorEnabled = false,
}: TwoFactorProps) {
  useDocumentTitle("Two-Factor Authentication");

  const {
    qrCodeSvg,
    hasSetupData,
    manualSetupKey,
    clearSetupData,
    fetchSetupData,
    recoveryCodesList,
    fetchRecoveryCodes,
    errors,
  } = useTwoFactorAuth();
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [processing, setProcessing] = useState(false);

  const handleEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await authService.enable2FA();
      setShowSetupModal(true);
    } catch (error) {
      console.error("Failed to enable 2FA:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await authService.disable2FA();
      window.location.reload();
    } catch (error) {
      console.error("Failed to disable 2FA:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Two-Factor Authentication"
            description="Manage your two-factor authentication settings"
          />
          {twoFactorEnabled ? (
            <div className="flex flex-col items-start justify-start space-y-4">
              <Badge variant="default">Enabled</Badge>
              <p className="text-muted-foreground">
                With two-factor authentication enabled, you will be prompted for
                a secure, random pin during login, which you can retrieve from
                the TOTP-supported application on your phone.
              </p>

              <TwoFactorRecoveryCodes
                recoveryCodesList={recoveryCodesList}
                fetchRecoveryCodes={fetchRecoveryCodes}
                errors={errors}
              />

              <div className="relative inline">
                <form onSubmit={handleDisable2FA}>
                  <Button
                    variant="destructive"
                    type="submit"
                    disabled={processing}
                  >
                    <ShieldBan /> Disable 2FA
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start justify-start space-y-4">
              <Badge variant="destructive">Disabled</Badge>
              <p className="text-muted-foreground">
                When you enable two-factor authentication, you will be prompted
                for a secure pin during login. This pin can be retrieved from a
                TOTP-supported application on your phone.
              </p>

              <div>
                {hasSetupData ? (
                  <Button onClick={() => setShowSetupModal(true)}>
                    <ShieldCheck />
                    Continue Setup
                  </Button>
                ) : (
                  <form onSubmit={handleEnable2FA}>
                    <Button type="submit" disabled={processing}>
                      <ShieldCheck />
                      Enable 2FA
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )}

          <TwoFactorSetupModal
            isOpen={showSetupModal}
            onClose={() => setShowSetupModal(false)}
            requiresConfirmation={requiresConfirmation}
            twoFactorEnabled={twoFactorEnabled}
            qrCodeSvg={qrCodeSvg}
            manualSetupKey={manualSetupKey}
            clearSetupData={clearSetupData}
            fetchSetupData={fetchSetupData}
            errors={errors}
          />
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
