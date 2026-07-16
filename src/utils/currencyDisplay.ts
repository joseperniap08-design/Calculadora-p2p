import type { SellResults } from '@/types';
import { roundCurrency } from '@/utils/formatters';

export interface DisplayAmounts {
  capital: number;
  grossTotal: number;
  sellCommission: number;
  netTotal: number;
  netProfit: number;
  netProfitLocal: number;
  newCapital: number;
}

export function getDisplayAmounts(
  capitalUsdt: number,
  sell: SellResults,
  sellRate: number,
  netProfitUsdt: number,
  netProfitLocal: number,
): DisplayAmounts {
  return {
    capital: capitalUsdt,
    grossTotal: sellRate > 0 ? roundCurrency(sell.grossTotal / sellRate) : 0,
    sellCommission: sellRate > 0 ? roundCurrency(sell.sellCommission / sellRate) : 0,
    netTotal: sellRate > 0 ? roundCurrency(sell.netTotal / sellRate) : 0,
    netProfit: netProfitUsdt,
    netProfitLocal,
    newCapital: roundCurrency(capitalUsdt + netProfitUsdt),
  };
}
