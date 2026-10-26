import type { Scenario } from "@/lib/model";

/**
 * Every assumption the model runs on, with its label and unit, grouped as
 * on the Assumptions page.
 */
export type NumberKey = Exclude<keyof Scenario, "shares">;
export type Kind = "lkr" | "pct" | "count";
export type Field = { key: NumberKey; label: string; kind?: Kind };
export type GroupIcon =
  "pricing" | "production" | "delivery" | "ads" | "forecast";

export const GROUPS: { title: string; icon: GroupIcon; fields: Field[] }[] = [
  {
    title: "Price",
    icon: "pricing",
    fields: [
      { key: "price", label: "3-Kit Pack price" },
      { key: "packsPerOrder", label: "Packs per order", kind: "count" },
    ],
  },
  {
    title: "Product cost per pack",
    icon: "production",
    fields: [
      { key: "wholesale", label: "Wholesale 3-Kit" },
      { key: "packaging", label: "Packaging & branding" },
      { key: "runSize", label: "Production run (packs)", kind: "count" },
    ],
  },
  {
    title: "Delivery & COD",
    icon: "delivery",
    fields: [
      { key: "deliveryFee", label: "Delivery fee charged" },
      { key: "courierCost", label: "Courier charge to us" },
      { key: "fulfilment", label: "Packing & handling" },
      { key: "codFeePct", label: "COD handling fee", kind: "pct" },
      { key: "returnRate", label: "Failed COD deliveries", kind: "pct" },
      { key: "returnCost", label: "Cost of a failed delivery" },
    ],
  },
  {
    title: "Marketing & overheads",
    icon: "ads",
    fields: [
      { key: "cac", label: "Meta ads per order (CAC)" },
      { key: "fixedMonthly", label: "Fixed costs per month" },
    ],
  },
  {
    title: "Forecast",
    icon: "forecast",
    fields: [
      { key: "startOrders", label: "Orders in month 1", kind: "count" },
      { key: "growth", label: "Monthly growth", kind: "pct" },
      { key: "months", label: "Months", kind: "count" },
      { key: "startingCash", label: "Cash at launch" },
    ],
  },
];
