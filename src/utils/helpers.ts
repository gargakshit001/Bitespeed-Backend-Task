export const normalizeEmail = (email?: string) => email?.toLowerCase().trim() || null;

export const normalizePhone = (phone?: string | number) => {
  if (phone === undefined || phone === null) return null;
  return phone.toString().replace(/\D/g, '');
};