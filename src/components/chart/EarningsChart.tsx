import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { EarningsHistoryPoint } from '@/types';
import { formatProfitUsdt } from '@/utils/formatters';

interface EarningsChartProps {
  data: EarningsHistoryPoint[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-blue-500/30 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-bold text-blue-400">
        {formatProfitUsdt(payload[0].value)}
      </p>
    </div>
  );
}

export function EarningsChart({ data }: EarningsChartProps) {
  const profits = data.map((d) => d.profit);
  const minProfit = Math.min(...profits, -3);
  const maxProfit = Math.max(...profits, 3);
  const padding = 0.5;

  return (
    <div className="glass-card relative p-4 pb-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Historial de Ganancias</h3>
        <select className="rounded-lg border border-slate-700/60 bg-slate-800/60 px-2 py-1 text-xs text-slate-300 outline-none">
          <option>7 días</option>
          <option>30 días</option>
          <option>90 días</option>
        </select>
      </div>

      <div className="h-48 w-full sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
              tickLine={false}
            />
            <YAxis
              domain={[minProfit - padding, maxProfit + padding]}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
              tickLine={false}
              tickFormatter={(v: number) => `${v.toFixed(3)} USDT`}
            />
            <ReferenceLine y={0} stroke="rgba(148, 163, 184, 0.3)" strokeDasharray="3 3" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#1e40af' }}
              activeDot={{ r: 6, fill: '#60a5fa', stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <button
        type="button"
        className="absolute -bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95"
        aria-label="Calculadora rápida"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </button>
    </div>
  );
}
