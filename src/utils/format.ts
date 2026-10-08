export const cop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export function formatPrice(value: number | null): string {
  return value === null ? 'Precio por confirmar' : cop.format(value);
}

export function whatsappUrl(contact: string): string | null {
  const digits = contact.match(/\d{10,13}/)?.[0];
  return digits ? `https://wa.me/57${digits}` : null;
}