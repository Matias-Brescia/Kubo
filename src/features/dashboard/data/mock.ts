import type { Transaction, TrendPoint } from "../types";

export const initialTransactions: Transaction[] = [
  {
    id: "t1",
    description: "Planilla — Estudio Nova",
    amount: 4200,
    kind: "income",
    category: "Sueldo",
    date: "2026-06-28",
  },
  {
    id: "t2",
    description: "Alquiler departamento",
    amount: 1350,
    kind: "expense",
    category: "Vivienda",
    date: "2026-06-27",
  },
  {
    id: "t3",
    description: "Supermercado Wong",
    amount: 186.4,
    kind: "expense",
    category: "Alimentación",
    date: "2026-06-26",
  },
  {
    id: "t4",
    description: "Proyecto freelance — Cobbleverse",
    amount: 950,
    kind: "income",
    category: "Freelance",
    date: "2026-06-24",
  },
  {
    id: "t5",
    description: "Netflix + Spotify",
    amount: 54.9,
    kind: "expense",
    category: "Suscripciones",
    date: "2026-06-22",
  },
  {
    id: "t6",
    description: "Gasolina",
    amount: 120,
    kind: "expense",
    category: "Transporte",
    date: "2026-06-20",
  },
];

export const trendData: TrendPoint[] = [
  { label: "Ene", income: 4800, expense: 3200 },
  { label: "Feb", income: 4650, expense: 3450 },
  { label: "Mar", income: 5100, expense: 3100 },
  { label: "Abr", income: 4900, expense: 3600 },
  { label: "May", income: 5300, expense: 3050 },
  { label: "Jun", income: 5150, expense: 2870 },
];

export const categories = [
  "Alimentación",
  "Vivienda",
  "Transporte",
  "Suscripciones",
  "Entretenimiento",
  "Salud",
  "Sueldo",
  "Freelance",
  "Otros",
];
