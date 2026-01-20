export const show = () => '/settings/two-factor';
export const enable = () => '/settings/two-factor/enable';
export const confirm = () => '/settings/two-factor/confirm';
export const disable = () => '/settings/two-factor/disable';
export const qrCode = { url: () => '/settings/two-factor/qr-code' };
export const secretKey = { url: () => '/settings/two-factor/secret-key' };
export const recoveryCodes = { url: () => '/settings/two-factor/recovery-codes' };
export const regenerateRecoveryCodes = () => '/settings/two-factor/recovery-codes/regenerate';
