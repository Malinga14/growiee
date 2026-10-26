"use client";

import classNames from "classnames";
import BreakEvenChart from "@/components/charts/BreakEvenChart";
import Meter from "@/components/charts/Meter";
import NumberField from "@/components/inputs/NumberField";
import { useScenario } from "@/components/ScenarioProvider";
import Card from "@/components/ui/Card";
import Money from "@/components/ui/Money";
import StatTile from "@/components/ui/StatTile";
import { Callout, Split } from "@/components/views/shared";
import { chart } from "@/config/theme";
import { formatMoney, formatNumber } from "@/lib/format";
import {
  breakEvenOrders,
  orderEconomics,
  priceForMargin,
  withPatch,
} from "@/lib/model";

const CAC_STEPS = [400, 600, 800, 1000, 1200];

export default function BreakEvenView() {
  const { scenario: s, update } = useScenario();
  const order = orderEconomics(s);
  const be = breakEvenOrders(s);
  const evenPrice = priceForMargin(s, 0) ?? s.price;
  // Price columns from today's price up past the per-order break-even.
  const top = Math.max(
    s.price + 2000,
    Math.ceil((evenPrice + 1000) / 500) * 500,
  );
  const prices = Array.from(
    { length: 5 },
    (_, i) => Math.round((s.price + ((top - s.price) * i) / 4) / 50) * 50,
  );

  return (
    <Split
      inputs={
        <Card title="Fixed costs" icon="wallet">
          <NumberField
            label="Fixed costs per month"
            value={s.fixedMonthly}
            onChange={(fixedMonthly) => update({ fixedMonthly })}
            slider={{ min: 0, max: 500000, step: 5000 }}
            hint="People, rent, tools, website and photography (an assumption)"
          />
        </Card>
      }
    >
      {be === null && (
        <Callout
          tone="warn"
          title="No number of orders breaks even at these costs"
        >
          Each order leaves {formatMoney(order.contribution)}, so more orders
          mean bigger losses. Raise the price to at least{" "}
          {formatMoney(evenPrice)} a pack or lower the costs per order first.
        </Callout>
      )}

      <div className="grid grid-cols-2 gap-4 2xl:grid-cols-4">
        <StatTile
          label="Orders a month"
          icon="breakeven"
          value={be === null ? "—" : formatNumber(be)}
          detail={
            be === null
              ? "not reachable"
              : `about ${formatNumber(be / 30, 1)} a day`
          }
        />
        <StatTile
          label="Packs a month"
          icon="production"
          tone="violet"
          value={
            be === null ? "—" : formatNumber(Math.ceil(be * s.packsPerOrder))
          }
          detail={`${s.packsPerOrder} packs an order`}
        />
        <StatTile
          label="Sales a month"
          icon="bag"
          tone="sky"
          value={
            be === null ? (
              "—"
            ) : (
              <Money value={be * (order.revenue + order.deliveryCollected)} />
            )
          }
          detail="including delivery fees"
        />
        <StatTile
          label="Left per order"
          icon="coins"
          tone={order.contribution >= 0 ? "pink" : "loss"}
          value={<Money value={order.contribution} />}
          detail="towards fixed costs"
        />
      </div>

      <Card title="How close is month 1?" icon="growth" iconTone="sky">
        <Meter
          value={be ? s.startOrders / be : 0}
          label={`${formatNumber(s.startOrders)} orders forecast for month 1`}
          detail={
            be
              ? `${formatNumber(be)} orders a month break even`
              : "Not reachable while every order loses money"
          }
          color={chart.sky}
        />
      </Card>

      <Card
        title="Contribution against fixed costs"
        icon="balance"
        subtitle="Profit starts where the indigo line crosses the pink one"
      >
        <BreakEvenChart
          perOrder={order.contribution}
          fixed={s.fixedMonthly}
          breakEven={be}
        />
      </Card>

      <Card
        title="Break-even orders by price and ad cost"
        icon="ads"
        iconTone="pink"
        subtitle="Orders a month needed to cover fixed costs. Deeper indigo is easier; hatched means every order loses money. Pink ring: today."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-xs text-ink-faint">
                <th className="py-2 pr-3 text-left font-medium">
                  CAC \ Pack price
                </th>
                {prices.map((p) => (
                  <th
                    key={p}
                    className="tabular px-1 py-2 text-center font-medium"
                  >
                    {formatMoney(p)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CAC_STEPS.map((cac) => (
                <tr key={cac}>
                  <th className="tabular py-1 pr-3 text-left text-xs font-medium text-ink-muted">
                    {formatMoney(cac)}
                  </th>
                  {prices.map((price) => {
                    const n = breakEvenOrders(withPatch(s, { price, cac }));
                    const current = price === s.price && cac === s.cac;
                    // Sequential indigo: fewer orders needed = deeper colour.
                    const t =
                      n === null
                        ? 0
                        : 1 - Math.min(1, Math.log10(Math.max(n, 1)) / 3.3);
                    const step = Math.round(t * (chart.ramp.length - 1));
                    const darkCell = n !== null && step >= 4;
                    return (
                      <td key={price} className="p-[3px]">
                        <div
                          className={classNames(
                            "tabular grid h-11 animate-cell-in place-items-center rounded-[10px] text-sm font-medium",
                            n === null
                              ? "bg-[repeating-linear-gradient(135deg,#FFF1F3_0_6px,#FFE3E8_6px_12px)] text-loss-strong"
                              : darkCell
                                ? "text-white"
                                : "text-ink",
                            current &&
                              "ring-2 ring-pink ring-offset-2 ring-offset-white",
                          )}
                          style={{
                            backgroundColor:
                              n === null ? undefined : chart.ramp[step],
                            animationDelay: `${(CAC_STEPS.indexOf(cac) * prices.length + prices.indexOf(price)) * 25}ms`,
                          }}
                          title={
                            n === null
                              ? "Every order loses money"
                              : `${formatNumber(n)} orders a month`
                          }
                        >
                          {n === null ? "—" : formatNumber(n)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Split>
  );
}
