export interface CivilizationBalance {
  treasury: number;
  marketCap: number;
  districtLiquidity: Record<string, number>;
}
export function calculateEquilibrium(balance: CivilizationBalance): number {
  // Item 120: Economic equilibrium stabilizer
  // Returns a stability factor (0-1) where 1 is perfect balance
  const totalDistrictWealth = Object.values(balance.districtLiquidity).reduce((a, b) => a + b, 0);
  const variance = Object.values(balance.districtLiquidity).reduce((acc, val) => {
    const mean = totalDistrictWealth / Object.keys(balance.districtLiquidity).length;
    return acc + Math.pow(val - mean, 2);
  }, 0);
  const stdDev = Math.sqrt(variance / Object.keys(balance.districtLiquidity).length);
  const coefficientOfVariation = totalDistrictWealth > 0 ? stdDev / (totalDistrictWealth / Object.keys(balance.districtLiquidity).length) : 0;
  return Math.max(0, 1 - coefficientOfVariation);
}
