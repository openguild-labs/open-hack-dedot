/**
 * Format on=chain balance
 *
 * @param balance
 * @param decimal
 */
export const formatBalance = (balance: bigint, decimal: number = 10): string => {
  return (parseFloat(balance.toString()) / Math.pow(10, decimal)).toString();
}
