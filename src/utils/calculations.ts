import type {
  BuyResults,
  CalculationResults,
  CalculatorInputs,
  CommissionRate,
  CycleProjection,
  SellResults,
} from '@/types';
import { ceilCurrency, ceilUsdt, roundCurrency } from '@/utils/formatters';

export const COMMISSION_OPTIONS: { label: string; value: CommissionRate }[] = [
  { label: '0%', value: 0 },
  { label: '0.25%', value: 0.0025 },
  { label: '0.35%', value: 0.0035 },
];

/**
 * Capital = USDT disponibles para operar.
 */
export function calculateUsdtBought(capital: number, _buyRate: number): number {
  if (capital <= 0) return 0;
  return capital;
}

export function calculateBuyResults(
  capital: number,
  buyRate: number,
  commissionRate: CommissionRate,
): BuyResults {
  const usdtBought = calculateUsdtBought(capital, buyRate);
  const buyCommission = usdtBought * commissionRate;
  const usdtAfterCommission = usdtBought - buyCommission;

  return {
    usdtBought,
    buyCommission,
    usdtAfterCommission,
  };
}

/**
 * Total Venta = (USDT Tras Comisión × Tasa Venta) × (1 - Comisión Venta)
 * Resultados en bolívares (Bs).
 */
export function calculateSellResults(
  usdtAfterCommission: number,
  sellRate: number,
  commissionRate: CommissionRate,
): SellResults {
  const grossTotal = usdtAfterCommission * sellRate;
  const sellCommission = grossTotal * commissionRate;
  const netTotal = grossTotal - sellCommission;

  return {
    grossTotal,
    sellCommission,
    netTotal,
  };
}

/**
 * Ganancia en Bs = Total Obtenido - (Capital USDT × Tasa Compra)
 */
export function calculateP2PResults(inputs: CalculatorInputs): CalculationResults {
  const { capital, buyRate, sellRate, commissionRate } = inputs;

  const buy = calculateBuyResults(capital, buyRate, commissionRate);
  const sell = calculateSellResults(buy.usdtAfterCommission, sellRate, commissionRate);

  const capitalBs = capital * buyRate;
  const netProfitRaw = sell.netTotal - capitalBs;
  const netProfit = ceilCurrency(netProfitRaw);
  const netProfitUsdt = buyRate > 0 ? ceilUsdt(netProfitRaw / buyRate) : 0;
  const profitSpread = buyRate > 0 ? ((sellRate - buyRate) / buyRate) * 100 : 0;
  const newCapital = buyRate > 0 ? roundCurrency(sell.netTotal / buyRate) : roundCurrency(capital);

  return {
    buy,
    sell,
    netProfit,
    netProfitUsdt,
    profitSpread,
    newCapital,
    isProfitable: netProfit > 0,
  };
}

export function calculateCycleProjection(
  metaTotal: number,
  gananciaPorCiclo: number,
): CycleProjection {
  if (metaTotal <= 0 || gananciaPorCiclo <= 0) {
    return { gananciaPorCiclo, ciclosNecesarios: 0, isValid: false };
  }

  return {
    gananciaPorCiclo,
    ciclosNecesarios: Math.ceil(metaTotal / gananciaPorCiclo),
    isValid: true,
  };
}
