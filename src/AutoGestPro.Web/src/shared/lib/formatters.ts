export const numberFormatter = new Intl.NumberFormat("es-DO");

export const moneyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
  maximumFractionDigits: 0,
});
