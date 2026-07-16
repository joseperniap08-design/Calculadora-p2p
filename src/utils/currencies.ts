import type { CommissionRate, Currency } from '@/types';

export interface CurrencyConfig {
  commissionRate: CommissionRate;
  defaultBuyRate: number;
  defaultSellRate: number;
}

export const CURRENCY_CONFIG: Record<Currency, CurrencyConfig> = {
  VES: { commissionRate: 0.0025, defaultBuyRate: 817, defaultSellRate: 825 },
  USD: { commissionRate: 0.0035, defaultBuyRate: 1.025, defaultSellRate: 1.035 },
  COP: { commissionRate: 0.0035, defaultBuyRate: 4200, defaultSellRate: 4250 },
  ARS: { commissionRate: 0.0035, defaultBuyRate: 1050, defaultSellRate: 1060 },
  BRL: { commissionRate: 0.0035, defaultBuyRate: 5.45, defaultSellRate: 5.5 },
  PEN: { commissionRate: 0.0035, defaultBuyRate: 3.75, defaultSellRate: 3.8 },
  CLP: { commissionRate: 0.0035, defaultBuyRate: 950, defaultSellRate: 960 },
};

export const CURRENCY_OPTIONS: Currency[] = ['VES', 'USD', 'COP', 'ARS', 'BRL', 'PEN', 'CLP'];
