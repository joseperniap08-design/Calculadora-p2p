import { formatMoney } from '@/utils/formatters';

interface CapitalCardProps {
  capital: number;
}

export function CapitalCard({ capital }: CapitalCardProps) {
  return (
    <div className="glass-card relative overflow-hidden p-5 glow-blue">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Capital Inicial
          </p>
          <p className="text-3xl font-extrabold text-white sm:text-4xl">
            {formatMoney(capital)}
          </p>
          <p className="text-sm font-medium text-blue-400">Disponible para operar</p>
        </div>

        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
          <div className="absolute inset-0 scale-125 rounded-full bg-gradient-to-br from-blue-500/35 via-blue-500/10 to-green-500/25 blur-3xl" />
          <div className="absolute inset-2 scale-110 rounded-2xl bg-gradient-to-br from-blue-400/20 to-green-400/15 blur-xl" />
          <div
            className="logo-fade relative flex h-28 w-28 items-center justify-center rounded-2xl"
            style={{ backgroundColor: '#00040e' }}
          >
            <img
              src="/logo.png"
              alt="CalculatorP2P"
              className="logo-fade-image h-[88%] w-[88%] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
