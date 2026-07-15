import type { Currency, SellResults } from '@/types';
import { ceilCurrency, ceilUsdt, isVesCurrency, roundCurrency } from '@/utils/formatters';

export interface DisplayAmounts {
  capital: number;
  grossTotal: number;
  sellCommission: number;
  netTotal: number;
  netProfit: number;
  newCapital: number;
}

export function getDisplayAmounts(
  capitalUsdt: number,
  sell: SellResults,
  buyRate: number,
  sellRate: number,
  currency: Currency,
): DisplayAmounts {
  const capitalBs = capitalUsdt * buyRate;
  const netProfitRaw = sell.netTotal - capitalBs;
  const netProfitBs = ceilCurrency(netProfitRaw);
  const netProfitUsdt = buyRate > 0 ? ceilUsdt(netProfitRaw / buyRate) : 0;

  if (currency === 'USD') {
    return {
      capital: capitalUsdt,
      grossTotal: sell.grossTotal,
      sellCommission: sell.sellCommission,
      netTotal: sell.netTotal,
      netProfit: netProfitUsdt,
      newCapital: roundCurrency(capitalUsdt + netProfitUsdt),
    };
  }

  if (!isVesCurrency(currency)) {
    return {
      capital: capitalUsdt,
      grossTotal: sellRate > 0 ? roundCurrency(sell.grossTotal / sellRate) : 0,
      sellCommission: sellRate > 0 ? roundCurrency(sell.sellCommission / sellRate) : 0,
      netTotal: sellRate > 0 ? roundCurrency(sell.netTotal / sellRate) : 0,
      netProfit: netProfitUsdt,
      newCapital: roundCurrency(capitalUsdt + netProfitUsdt),
    };
  }

  return {
    capital: roundCurrency(capitalBs),
    grossTotal: sell.grossTotal,
    sellCommission: sell.sellCommission,
    netTotal: sell.netTotal,
    netProfit: netProfitBs,
    newCapital: roundCurrency(capitalBs + netProfitBs),
  };
}
