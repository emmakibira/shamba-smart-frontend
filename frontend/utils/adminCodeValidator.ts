const ADMIN_CODE =
  process.env.EXPO_PUBLIC_ADMIN_REGISTRATION_CODE ?? "SHAMBA_ADMIN_2026";
const OFFICER_CODE =
  process.env.EXPO_PUBLIC_OFFICER_REGISTRATION_CODE ?? "SHAMBA_OFFICER_2026";

export function validateAdminCode(code: string): boolean {
  return code.trim() === ADMIN_CODE;
}

export function validateOfficerRegistrationCode(code: string): boolean {
  return code.trim() === OFFICER_CODE || validateAdminCode(code);
}

export function getAdminCodeHint(): string {
  return "Set EXPO_PUBLIC_ADMIN_REGISTRATION_CODE in .env";
}
