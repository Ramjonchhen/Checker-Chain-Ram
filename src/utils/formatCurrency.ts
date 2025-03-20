export const formatCurrency = (amount: number, before = "", fix = 2) => {
  return (
    before +
    amount
      .toFixed(fix + 1)
      .substring(0, amount.toFixed(fix + 1).length - 1)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
  )
}
