import type { Currency } from '@/types';

const currencyFormatter = new Intl.NumberFormat('es-VE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const usdtFormatter = new Intl.NumberFormat('es-VE', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

const percentFormatter = new Intl.NumberFormat('es-VE', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  return `${currencyFormatter.format(value)} USDT`;
}

export function formatVes(value: number): string {
  return `${currencyFormatter.format(value)} Bs`;
}

export function formatUsd(value: number): string {
  return `${currencyFormatter.format(value)} USD`;
}

export function isVesCurrency(currency: Currency): boolean {
  return currency === 'VES';
}

export function isUsdCurrency(currency: Currency): boolean {
  return currency === 'USD';
}

/** Solo VES convierte capital entre Bs y USDT. USD opera con capital en USDT y tasas en USD. */
export function isFiatCurrency(currency: Currency): boolean {
  return currency === 'VES';
}

export function getRateSuffix(currency: Currency): string {
  return currency === 'USD' ? 'USD' : 'Bs';
}

export function getChartUnit(currency: Currency): string {
  if (currency === 'VES') return 'Bs';
  return 'USDT';
}

export function getProfitFromOperation(
  ganancia: number,
  buyRate: number,
  currency: Currency,
): number {
  if (currency === 'VES') return ganancia;
  return buyRate > 0 ? ceilUsdt(ganancia / buyRate) : 0;
}

export function formatMoney(value: number, currency: Currency): string {
  if (currency === 'VES') return formatVes(value);
  if (currency === 'USD') return formatUsd(value);
  return formatCurrency(value);
}

export function formatProfitBs(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatVes(value)}`;
}

export function formatProfit(value: number, currency: Currency): string {
  const sign = value >= 0 ? '+' : '';
  if (currency === 'USD' || currency === 'USDT') {
    return `${sign}${formatUsdt(value)}`;
  }
  return `${sign}${formatMoney(value, currency)}`;
}

export function formatUsdt(value: number): string {
  return `${usdtFormatter.format(value)} USDT`;
}

export function formatPercent(value: number): string {
  return percentFormatter.format(value / 100);
}

export function formatRate(value: number): string {
  return usdtFormatter.format(value);
}

export function parseNumberInput(value: string): number {
  const parsed = parseFloat(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function ceilCurrency(value: number): number {
  return Math.ceil(value * 100) / 100;
}

export function ceilUsdt(value: number): number {
  return Math.ceil(value * 1000) / 1000;
}

export function formatDate(date: Date = new Date()): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
