"use client";

import { motion } from "framer-motion";
import classNames from "classnames";
import PriceCurveChart from "@/components/charts/PriceCurveChart";
import PriceLadder from "@/components/charts/PriceLadder";
import NumberField from "@/components/inputs/NumberField";
import { useScenario } from "@/components/ScenarioProvider";
import Card from "@/components/ui/Card";
import Money from "@/components/ui/Money";
import StatTile from "@/components/ui/StatTile";
import { Split } from "@/components/views/shared";
import { formatMoney, formatNumber, formatShare } from "@/lib/format";
import {
  breakEvenOrders,
  DEFAULTS,
  orderEconomics,
  priceForMargin,
  priceSweep,
  withPatch,
} from "@/lib/model";
import { snappy } from "@/lib/motion";

const TARGETS = [0, 0.1, 0.2, 0.3, 0.4];
const PRESETS = [DEFAULTS.price, 2500, 3000, 3500, 4850];

export default function PricingView() {
  const { scenario: s, update } = useScenario();
  const order = orderEconomics(s);
  const evenPrice = priceForMargin(s, 0);
  const hi = Math.max(
    5000,
    Math.ceil(((evenPrice ?? 0) * 1.3) / 500) * 500,
    s.price + 1000,
  );
  const points = priceSweep(s, 1000, hi);
  const be = breakEvenOrders(s);

  return (
    <Split
      inputs={
        <>
          <Card title="Pack price" icon="pricing">
            <NumberField
              label="Price of one 3-Kit Pack"
              value={s.price}
              onChange={(price) => update({ price })}
              slider={{ min: 1000, max: hi, step: 50 }}
              hint={`Default ${formatMoney(DEFAULTS.price)}, from the brand tokens`}
            />
            <p className="mb-2 mt-5 text-[13px] font-medium text-ink-muted">
              Try a price
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <motion.button
                  key={p}
                  type="button"
                  onClick={() => update({ price: p })}
                  whileTap={{ scale: 0.94 }}
                  transition={snappy}
                  className={classNames(
                    "min-h-9 rounded-full border px-3 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary",
                    p === s.price
                      ? "border-primary/30 bg-primary-soft text-primary-strong"
                      : "border-line text-ink-muted hover:border-primary/30 hover:text-ink",
                  )}
                >
                  {formatMoney(p)}
                  {p === 4850 && " · old plan"}
                </motion.button>
              ))}
            </div>
          </Card>
          <Card
            title="The price each margin needs"
            icon="pricing"
            iconTone="pink"
            subtitle="Deeper indigo for a higher margin; the pink line is today's price"
          >
            <PriceLadder
              current={s.price}
              rungs={TARGETS.map((t) => ({
                key: String(t),
                label: t === 0 ? "Break-even" : formatShare(t, 0),
                price: priceForMargin(s, t),
                margin: t,
              }))}
            />
          </Card>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4 2xl:grid-cols-4">
        <StatTile
          label="Price per piece"
          icon="baby"
          value={<Money value={s.price / 3} />}
          detail="3 pieces in a pack"
        />
        <StatTile
          label="Left per order"
          icon="coins"
          tone={order.contribution >= 0 ? "sky" : "loss"}
          value={<Money value={order.contribution} />}
          detail={`${formatShare(order.margin)} margin`}
        />
        <StatTile
          label="Break-even price"
          icon="breakeven"
          tone="pink"
          value={evenPrice === null ? "—" : <Money value={evenPrice} />}
          detail="per pack, zero loss"
        />
        <StatTile
          label="Orders to break even"
          icon="balance"
          tone="violet"
          value={be === null ? "—" : formatNumber(be)}
          detail={
            be === null ? "every order loses money" : "a month, at this price"
          }
        />
      </div>

      <Card
        title="What each price leaves per order"
        icon="growth"
        iconTone="violet"
        subtitle="After product cost, ads, courier, COD and failed deliveries. The dot is your price."
      >
        <PriceCurveChart
          points={points}
          current={{
            price: s.price,
            contribution: order.contribution,
            margin: order.margin,
          }}
          breakEvenPrice={evenPrice}
        />
      </Card>

      <Card
        title="Price for a target margin"
        icon="percent"
        subtitle="Contribution per order as a share of pack revenue"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs font-medium text-ink-faint">
                <th className="py-2 pr-4 font-medium">Target margin</th>
                <th className="py-2 pr-4 text-right font-medium">Pack price</th>
                <th className="py-2 pr-4 text-right font-medium">Per piece</th>
                <th className="py-2 pr-4 text-right font-medium">
                  Left per order
                </th>
                <th className="py-2 text-right font-medium">vs today</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {TARGETS.map((t) => {
                const p = priceForMargin(s, t);
                const o =
                  p === null
                    ? null
                    : orderEconomics(withPatch(s, { price: p }));
                return (
                  <tr key={t} className="tabular">
                    <td className="py-3 pr-4 font-medium text-ink">
                      {t === 0 ? "Break-even" : formatShare(t, 0)}
                    </td>
                    <td className="py-3 pr-4 text-right font-semibold text-ink">
                      {p === null ? "—" : formatMoney(p)}
                    </td>
                    <td className="py-3 pr-4 text-right text-ink-muted">
                      {p === null ? "—" : formatMoney(p / 3)}
                    </td>
                    <td className="py-3 pr-4 text-right text-ink">
                      {o === null ? "—" : formatMoney(o.contribution)}
                    </td>
                    <td className="py-3 text-right text-ink-muted">
                      {p === null
                        ? "—"
                        : `${p >= s.price ? "+" : "−"}${formatMoney(Math.abs(p - s.price))}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </Split>
  );
}
