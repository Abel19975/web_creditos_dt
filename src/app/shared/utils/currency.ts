export const formatCurrency = (value: string | number) => {
  if (typeof value === "string") {
    value = parseFloat(value)
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}
