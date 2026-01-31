export const show = () => "/settings/2fa";
export const enable = () => "/settings/2fa/enable";
export const confirm = () => "/settings/2fa/confirm";
export const disable = () => "/settings/2fa/disable";
export const qrCode = { url: () => "/settings/2fa/qr-code" };
export const secretKey = { url: () => "/settings/2fa/secret-key" };
export const recoveryCodes = { url: () => "/settings/2fa/recovery-codes" };
export const regenerateRecoveryCodes = () =>
  "/settings/2fa/recovery-codes/regenerate";
