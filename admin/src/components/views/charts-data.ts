import type { Slice } from "@/components/charts/Donut";
import type { Step } from "@/components/charts/Waterfall";
import { chart } from "@/config/theme";
import {
  type ForecastMonth,
  type OrderEconomics,
  productionRun,
  type Scenario,
  SIZE_KEYS,
  SIZE_LABELS,
} from "@/lib/model";

/** One order's money in four groups (the categorical cap), brand order. */
export function orderSlices(o: OrderEconomics): Slice[] {
  return [
    {
      key: "product",
      label: "Product cost",
      value: o.productCost,
      color: chart.indigo,
    },
    { key: "ads", label: "Meta ads", value: o.ads, color: chart.sky },
    {
      key: "delivery",
      label: "Delivery, COD & returns",
      value: o.courier + o.fulfilment + o.codFee + o.returns,
      color: chart.violet,
    },
    {
      key: "left",
      label: "Left over",
      value: Math.max(0, o.contribution),
      color: chart.pink,
    },
  ];
}

export function orderSteps(o: OrderEconomics): Step[] {
  return [
    {
      key: "in",
      label: "Collected",
      value: o.revenue + o.deliveryCollected,
      total: true,
    },
    { key: "product", label: "Product", value: -o.productCost },
    { key: "ads", label: "Ads", value: -o.ads },
    { key: "courier", label: "Courier", value: -o.courier },
    { key: "pack", label: "Packing", value: -o.fulfilment },
    { key: "cod", label: "COD fee", value: -o.codFee },
    { key: "returns", label: "Returns", value: -o.returns },
    { key: "left", label: "Left", value: o.contribution, total: true },
  ];
}

export function sizeSeries() {
  return SIZE_KEYS.map((k, i) => ({
    key: k,
    label: SIZE_LABELS[k],
    color: chart.series[i],
  }));
}

/** Packs sold per month, split by the size mix. */
export function packsBySize(rows: ForecastMonth[], s: Scenario) {
  const mix = productionRun({ ...s, runSize: 1000 });
  return rows.map((r) => ({
    key: String(r.month),
    label: r.label,
    values: Object.fromEntries(
      mix.map((m) => [m.key, Math.round(r.packs * m.share)]),
    ),
  }));
}
