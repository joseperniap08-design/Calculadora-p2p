import type { CommissionRate, Currency } from '@/types';

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

export function formatLocalCurrency(value: number, currency: Currency): string {
  const suffix = getRateSuffix(currency);
  return `${currencyFormatter.format(value)} ${suffix}`;
}

export function getRateSuffix(currency: Currency): string {
  return currency === 'VES' ? 'Bs' : currency;
}

export function getProfitFromOperation(ganancia: number, buyRate: number): number {
  return buyRate > 0 ? ceilUsdt(ganancia / buyRate) : 0;
}

export function formatMoney(value: number): string {
  return formatCurrency(value);
}

export function formatProfitUsdt(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatUsdt(value)}`;
}

export function formatProfitLocal(value: number, currency: Currency): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatLocalCurrency(value, currency)}`;
}

export function formatUsdt(value: number): string {
  return `${usdtFormatter.format(value)} USDT`;
}

export function formatPercent(value: number): string {
  return percentFormatter.format(value / 100);
}

export function formatCommissionPercent(rate: CommissionRate): string {
  if (rate === 0) return '0%';
  return `${(rate * 100).toFixed(2).replace(/\.?0+$/, '')}%`;
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