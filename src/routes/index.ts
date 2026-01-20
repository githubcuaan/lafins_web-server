// Route helper functions for backward compatibility
// These match the Laravel Ziggy-style route helpers

// Auth routes
export const login = () => '/login';
export const register = () => '/register';
export const logout = () => '/logout';

// Dashboard
export const dashboard = () => '/dashboard';

// Profile routes
export const profile = {
  edit: () => '/settings/profile',
};

// Settings routes
export const password = {
  edit: () => '/settings/password',
};

export const appearance = {
  edit: () => '/settings/appearance',
};

// Two-factor routes
export const twoFactor = {
  show: () => '/settings/two-factor',
  enable: () => '/settings/two-factor/enable',
  confirm: () => '/settings/two-factor/confirm',
  disable: () => '/settings/two-factor/disable',
};

// Verification
export const verification = {
  send: () => '/email/verification-notification',
};

// Home
export const home = () => '/';

// Shorthand exports
export const edit = profile.edit;
export const show = twoFactor.show;
