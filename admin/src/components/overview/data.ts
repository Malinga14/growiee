import {
  breakEvenOrders,
  cogs,
  forecast,
  grossMargin,
  orderEconomics,
  priceForMargin,
  type Scenario,
} from "@/lib/model";

export type WeekPoint = {
  key: string;
  label: string;
  /** Money collected that week (packs + delivery fees), LKR. */
  collected: number;
  /** Every variable cost of that week's orders, LKR. */
  costs: number;
  orders: number;
};

/**
 * The monthly forecast spread into weeks: orders are interpolated between
 * months (52 weeks a year), then priced with the per-order economics.
 */
export function weeklyFlow(s: Scenario): WeekPoint[] {
  const rows = forecast(s);
  const o = orderEconomics(s);
  const perOrderIn = o.revenue + o.deliveryCollected;
  const perOrderCost = perOrderIn - o.contribution;
  const weeks = Math.max(4, Math.round((s.months * 52) / 12));
  const out: WeekPoint[] = [];
  for (let w = 0; w < weeks; w++) {
    const m = (w * 12) / 52; // fractional month index
    const i = Math.min(rows.length - 1, Math.floor(m));
    const j = Math.min(rows.length - 1, i + 1);
    const t = m - Math.floor(m);
    const monthOrders = rows[i].orders * (1 - t) + rows[j].orders * t;
    const orders = (monthOrders * 12) / 52;
    out.push({
      key: String(w),
      label: `Week ${w + 1}`,
      collected: orders * perOrderIn,
      costs: orders * perOrderCost,
      orders,
    });
  }
  return out;
}

/** Everything the Overview shows, computed once per render. */
export function overview(s: Scenario) {
  const order = orderEconomics(s);
  const collected = order.revenue + order.deliveryCollected;
  const rows = forecast(s);
  return {
    order,
    collected,
    cost: cogs(s),
    gm: grossMargin(s),
    be: breakEvenOrders(s),
    evenPrice: priceForMargin(s, 0),
    yearOrders: rows.slice(0, 12).reduce((t, r) => t + r.orders, 0),
    pressure: [
      { key: "product", label: "Product", value: order.productCost },
      { key: "ads", label: "Meta ads", value: order.ads },
      { key: "courier", label: "Courier", value: order.courier },
      {
        key: "packing",
        label: "Packing & COD",
        value: order.fulfilment + order.codFee + order.returns,
      },
    ].map((p) => ({ ...p, share: collected > 0 ? p.value / collected : 0 })),
  };
}
