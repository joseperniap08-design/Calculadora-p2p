export type CommissionRate = 0 | 0.0025 | 0.0035;

export type Currency = 'VES' | 'USD' | 'COP' | 'ARS' | 'BRL' | 'PEN' | 'CLP' | 'MXN' | 'BOB' | 'EUR';

export interface CalculatorInputs {
  capital: number;
  buyRate: number;
  sellRate: number;
  commissionRate: CommissionRate;
}

export interface BuyResults {
  usdtBought: number;
  buyCommission: number;
  usdtAfterCommission: number;
}

export interface SellResults {
  grossTotal: number;
  sellCommission: number;
  netTotal: number;
}

export interface CalculationResults {
  buy: BuyResults;
  sell: SellResults;
  netProfit: number;
  netProfitUsdt: number;
  profitSpread: number;
  newCapital: number;
  isProfitable: boolean;
}

export interface CurrencyRates {
  buyRate: number;
  sellRate: number;
  commissionRate: CommissionRate;
}

export interface EarningsHistoryPoint {
  date: string;
  label: string;
  profit: number;
}

export interface Operacion {
  id: number;
  fecha: string;
  tasa: number;
  tasaCompra?: number;
  ganancia: number;
  currency: Currency;
}

export type NavTab = 'calculadora' | 'historial' | 'meta';

export interface CycleProjection {
  gananciaPorCiclo: number;
  ciclosNecesarios: number;
  isValid: boolean;
}
