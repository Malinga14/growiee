import commerce from "../../../branding/tokens/commerce.tokens.json";
import product from "../../../branding/tokens/product.tokens.json";

/**
 * The Growiee business model. Every number the dashboard shows is derived
 * from one `Scenario` by the pure functions below, so pages never disagree.
 *
 * Defaults come from the brand tokens (price, delivery fee, size mix) and
 * the business plan (costs, CAC); anything the plan doesn't state is marked
 * as an assumption and is editable on the Assumptions page.
 */

export type SizeKey = "nb" | "0-3m" | "3-6m" | "6-9m";

export type Scenario = {
  /** Retail price of one 3-Kit Pack, LKR. */
  price: number;
  /** What one pack costs us, LKR: bought in from the wholesaler, plus our packaging. */
  wholesale: number;
  packaging: number;
  /** Average packs in one order. */
  packsPerOrder: number;
  /** Meta ads spend per order won, LKR. */
  cac: number;
  /** Delivery fee the customer pays at checkout, LKR. */
  deliveryFee: number;
  /** What the courier charges us per delivered order, LKR. */
  courierCost: number;
  /** Packing, mailer and handling per order, LKR. */
  fulfilment: number;
  /** Courier COD handling, share of the order value collected. */
  codFeePct: number;
  /** Share of COD orders refused or undelivered. */
  returnRate: number;
  /** What a failed delivery costs us (return trip + repack), LKR. */
  returnCost: number;
  /** Fixed costs per month (people, tools, website), LKR. */
  fixedMonthly: number;
  /** Production run size, packs. */
  runSize: number;
  /** Size mix shares, e.g. 1 : 3 : 3 : 2. */
  shares: Record<SizeKey, number>;
  /** Forecast: orders in month 1 and monthly growth. */
  startOrders: number;
  growth: number;
  months: number;
  /** Cash available before launch, LKR (for the runway chart). */
  startingCash: number;
};

const mid = (a: number, b: number) => Math.round((a + b) / 2);
const sizes = product.product.size;

export const SIZE_LABELS: Record<SizeKey, string> = {
  nb: sizes.nb["short-label"].$value,
  "0-3m": sizes["0-3m"]["short-label"].$value,
  "3-6m": sizes["3-6m"]["short-label"].$value,
  "6-9m": sizes["6-9m"]["short-label"].$value,
};
export const SIZE_KEYS = Object.keys(SIZE_LABELS) as SizeKey[];

export const DEFAULTS: Scenario = {
  price: commerce.commerce.price.retail.$value,
  wholesale: 970,
  packaging: 100,
  packsPerOrder: 1.2,
  cac: mid(800, 1000),
  deliveryFee: mid(
    commerce.commerce.delivery["fee-min"].$value,
    commerce.commerce.delivery["fee-max"].$value,
  ),
  courierCost: 450,
  fulfilment: 120,
  codFeePct: 0.01,
  returnRate: 0.06,
  returnCost: 500,
  fixedMonthly: 60000,
  runSize: 900,
  shares: {
    nb: sizes.nb["production-share"].$value,
    "0-3m": sizes["0-3m"]["production-share"].$value,
    "3-6m": sizes["3-6m"]["production-share"].$value,
    "6-9m": sizes["6-9m"]["production-share"].$value,
  },
  startOrders: 120,
  growth: 0.12,
  months: 12,
  startingCash: 2_500_000,
};

/** Which defaults are the brand's/plan's own numbers, and which are assumptions. */
export const SOURCES: Partial<Record<keyof Scenario, string>> = {
  price: "Brand tokens",
  wholesale: "Wholesale price (LKR 970 per 3-Kit)",
  packaging: "Own packaging (LKR 100)",
  cac: "Business plan 4.2 (LKR 800–1,000)",
  deliveryFee: "Brand tokens (LKR 450–550)",
  shares: "Business plan 4.3 (1 : 3 : 3 : 2)",
};

// ------------------------------------------------------------------ per pack / per order

export function cogs(s: Scenario): number {
  return s.wholesale + s.packaging;
}

export type OrderEconomics = {
  revenue: number;
  deliveryCollected: number;
  productCost: number;
  ads: number;
  courier: number;
  fulfilment: number;
  codFee: number;
  returns: number;
  contribution: number;
  /** Contribution as a share of product revenue. */
  margin: number;
};

/** One average order, end to end. */
export function orderEconomics(s: Scenario): OrderEconomics {
  const revenue = s.price * s.packsPerOrder;
  const deliveryCollected = s.deliveryFee;
  const productCost = cogs(s) * s.packsPerOrder;
  const codFee = s.codFeePct * (revenue + deliveryCollected);
  const returns = s.returnRate * s.returnCost;
  const contribution =
    revenue +
    deliveryCollected -
    productCost -
    s.cac -
    s.courierCost -
    s.fulfilment -
    codFee -
    returns;
  return {
    revenue,
    deliveryCollected,
    productCost,
    ads: s.cac,
    courier: s.courierCost,
    fulfilment: s.fulfilment,
    codFee,
    returns,
    contribution,
    margin: revenue > 0 ? contribution / revenue : 0,
  };
}

export function grossMargin(s: Scenario): number {
  return s.price > 0 ? (s.price - cogs(s)) / s.price : 0;
}

/** Orders a month needed to cover fixed costs; null when every order loses money. */
export function breakEvenOrders(s: Scenario): number | null {
  const c = orderEconomics(s).contribution;
  return c > 0 ? Math.ceil(s.fixedMonthly / c) : null;
}

/**
 * Pack price that earns a target contribution margin per order. Solves the
 * linear order equation for price: contribution(p) = target · revenue(p).
 */
export function priceForMargin(s: Scenario, target: number): number | null {
  const n = s.packsPerOrder;
  const variable =
    n * cogs(s) +
    s.cac +
    s.courierCost +
    s.fulfilment +
    s.returnRate * s.returnCost -
    s.deliveryFee * (1 - s.codFeePct);
  const denom = n * (1 - s.codFeePct - target);
  return denom > 0 ? variable / denom : null;
}

// ------------------------------------------------------------------ production

export type SizeRun = {
  key: SizeKey;
  label: string;
  share: number;
  packs: number;
  cost: number;
};

/** Split a production run by the size shares (largest remainder, so it adds up exactly). */
export function productionRun(s: Scenario): SizeRun[] {
  const total = SIZE_KEYS.reduce((t, k) => t + s.shares[k], 0) || 1;
  const exact = SIZE_KEYS.map((k) => (s.runSize * s.shares[k]) / total);
  const packs = exact.map(Math.floor);
  let left = s.runSize - packs.reduce((a, b) => a + b, 0);
  exact
    .map((v, i) => ({ i, r: v - Math.floor(v) }))
    .sort((a, b) => b.r - a.r)
    .forEach(({ i }) => {
      if (left-- > 0) packs[i] += 1;
    });
  return SIZE_KEYS.map((k, i) => ({
    key: k,
    label: SIZE_LABELS[k],
    share: s.shares[k] / total,
    packs: packs[i],
    cost: packs[i] * cogs(s),
  }));
}

// ------------------------------------------------------------------ forecast

export type ForecastMonth = {
  month: number;
  label: string;
  orders: number;
  packs: number;
  revenue: number;
  contribution: number;
  fixed: number;
  profit: number;
  cash: number;
};

export function forecast(s: Scenario): ForecastMonth[] {
  const o = orderEconomics(s);
  let cash = s.startingCash - s.runSize * cogs(s); // first run is paid up front
  const rows: ForecastMonth[] = [];
  for (let m = 1; m <= s.months; m++) {
    const orders = Math.round(s.startOrders * Math.pow(1 + s.growth, m - 1));
    const revenue = orders * (o.revenue + o.deliveryCollected);
    const contribution = orders * o.contribution;
    // Restock what was sold: product cost is already inside contribution,
    // so cash only moves by contribution minus fixed costs.
    const profit = contribution - s.fixedMonthly;
    cash += profit;
    rows.push({
      month: m,
      label: `M${m}`,
      orders,
      packs: Math.round(orders * s.packsPerOrder),
      revenue,
      contribution,
      fixed: s.fixedMonthly,
      profit,
      cash,
    });
  }
  return rows;
}

export function isScenario(v: unknown): v is Scenario {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (Object.keys(DEFAULTS) as (keyof Scenario)[]).every((k) =>
    k === "shares"
      ? typeof o.shares === "object" && o.shares !== null
      : typeof o[k] === "number",
  );
}

// ------------------------------------------------------------------ what-ifs

export function withPatch(s: Scenario, patch: Partial<Scenario>): Scenario {
  return { ...s, ...patch };
}

/** Contribution and margin per order across a range of pack prices. */
export function priceSweep(s: Scenario, from: number, to: number, steps = 40) {
  const out: { price: number; contribution: number; margin: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const price = Math.round(from + ((to - from) * i) / steps);
    const o = orderEconomics(withPatch(s, { price }));
    out.push({ price, contribution: o.contribution, margin: o.margin });
  }
  return out;
}

/** Lowest cash point over the forecast, and the first month cash goes negative. */
export function cashLow(rows: ForecastMonth[], startingCash: number) {
  let low = { month: 0, cash: startingCash };
  let runsOut: number | null = null;
  for (const r of rows) {
    if (r.cash < low.cash) low = { month: r.month, cash: r.cash };
    if (runsOut === null && r.cash < 0) runsOut = r.month;
  }
  return { low, runsOut };
}
