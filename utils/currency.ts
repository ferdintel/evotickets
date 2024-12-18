export const currencyFormatter = (value: number, currency: string = "") => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
