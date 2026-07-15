# Calculadora de Ganancias P2P

PWA altamente responsiva para calcular ganancias en operaciones P2P con USDT.

## Stack

- **React 19** + **TypeScript**
- **Tailwind CSS v4** (dark mode premium)
- **Zustand** (estado global)
- **Recharts** (historial de ganancias)
- **Vite** + **vite-plugin-pwa**

## Requisitos

- Node.js 20+
- npm, pnpm o yarn

## Instalación

```bash
cd ~/p2p-earnings-calculator
npm install
npm run dev
```

## Estructura

```
src/
├── components/
│   ├── calculator/     # Secciones de la calculadora
│   ├── chart/          # Gráfico de historial
│   ├── layout/         # Header y navegación
│   └── ui/             # Componentes reutilizables
├── hooks/              # useCalculator
├── store/              # Zustand store
├── types/              # Tipos TypeScript
└── utils/              # Fórmulas y formateo
```

## Fórmulas

- `USDT Comprados = Capital / Tasa de Compra`
- `Total Venta = (USDT Tras Comisión × Tasa Venta) × (1 - Comisión Venta)`

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción + PWA |
| `npm run preview` | Vista previa del build |
