"use client";

import AreaLine from "@/components/charts/AreaLine";
import Columns from "@/components/charts/Columns";
import NumberField from "@/components/inputs/NumberField";
import { useScenario } from "@/components/ScenarioProvider";
import Card from "@/components/ui/Card";
import Money from "@/components/ui/Money";
import StatTile from "@/components/ui/StatTile";
import { packsBySize, sizeSeries } from "@/components/views/charts-data";
import { Split } from "@/components/views/shared";
import { chart } from "@/config/theme";
import { formatMoney, formatNumber } from "@/lib/format";
import { cashLow, cogs, forecast } from "@/lib/model";

export default function ForecastView() {
  const { scenario: s, update } = useScenario();
  const rows = forecast(s);
  const { low, runsOut } = cashLow(rows, s.startingCash);
  const total = rows.reduce(
    (t, r) => ({
      orders: t.orders + r.orders,
      revenue: t.revenue + r.revenue,
      profit: t.profit + r.profit,
    }),
    { orders: 0, revenue: 0, profit: 0 },
  );

  return (
    <Split
      inputs={
        <Card title="Growth" icon="growth">
          <div className="space-y-4">
            <NumberField
              label="Orders in month 1"
              kind="count"
              value={s.startOrders}
              onChange={(startOrders) =>
                update({ startOrders: Math.round(startOrders) })
              }
              slider={{ min: 10, max: 1000, step: 10 }}
            />
            <NumberField
              label="Monthly growth"
              kind="pct"
              max={2}
              value={s.growth}
              onChange={(growth) => update({ growth })}
              slider={{ min: 0, max: 0.5, step: 0.01 }}
            />
            <NumberField
              label="Months to forecast"
              kind="count"
              min={1}
              max={36}
              value={s.months}
              onChange={(months) => update({ months: Math.round(months) })}
              slider={{ min: 3, max: 36, step: 1 }}
            />
            <NumberField
              label="Fixed costs per month"
              value={s.fixedMonthly}
              onChange={(fixedMonthly) => update({ fixedMonthly })}
            />
            <NumberField
              label="Cash at launch"
              value={s.startingCash}
              onChange={(startingCash) => update({ startingCash })}
              hint={`The first run (${formatNumber(s.runSize)} packs, ${formatMoney(s.runSize * cogs(s))}) is paid from this`}
            />
          </div>
        </Card>
      }
    >
      <div className="grid grid-cols-2 gap-4 2xl:grid-cols-4">
        <StatTile
          label="Orders"
          icon="bag"
          value={formatNumber(total.orders)}
          detail={`over ${s.months} months`}
        />
        <StatTile
          label="Collected"
          icon="wallet"
          tone="sky"
          value={<Money value={total.revenue} />}
          detail="packs and delivery fees"
        />
        <StatTile
          label="Profit"
          icon="coins"
          tone={total.profit >= 0 ? "violet" : "loss"}
          value={<Money value={total.profit} />}
          detail="after fixed costs"
        />
        <StatTile
          label="Lowest cash"
          icon="alert"
          tone={runsOut === null ? "pink" : "loss"}
          value={<Money value={low.cash} />}
          detail={
            runsOut === null
              ? low.month
                ? `in month ${low.month}`
                : "at launch"
              : `runs out in month ${runsOut}`
          }
        />
      </div>

      <Card
        title="Profit by month"
        icon="forecast"
        iconTone="violet"
        subtitle="After fixed costs. Indigo is profit, rose is loss."
      >
        <Columns
          title="Profit by month"
          rows={rows.map((r) => ({
            key: String(r.month),
            label: r.label,
            values: { profit: r.profit },
          }))}
          series={[{ key: "profit", label: "Profit", color: chart.positive }]}
          colorFor={(v) => (v >= 0 ? chart.positive : chart.negative)}
        />
      </Card>

      <Card
        title="Cash in the bank"
        icon="wallet"
        iconTone="sky"
        subtitle="After the first production run is paid. The wash turns rose below zero."
      >
        <AreaLine
          title="Cash"
          points={rows.map((r) => ({
            key: String(r.month),
            label: r.label,
            value: r.cash,
          }))}
        />
      </Card>

      <Card
        title="Packs sold, by size"
        icon="baby"
        iconTone="pink"
        subtitle="Monthly packs split by the production size mix"
      >
        <Columns
          title="Packs sold by size"
          rows={packsBySize(rows, s)}
          series={sizeSeries()}
          format={(v) => `${formatNumber(v)} packs`}
          tick={(v) => formatNumber(v)}
        />
      </Card>

      <Card title="Monthly P&L" icon="invoice">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-faint">
                <th className="py-2 pr-4 font-medium">Month</th>
                <th className="py-2 pr-4 text-right font-medium">Orders</th>
                <th className="py-2 pr-4 text-right font-medium">Packs</th>
                <th className="py-2 pr-4 text-right font-medium">Collected</th>
                <th className="py-2 pr-4 text-right font-medium">
                  Contribution
                </th>
                <th className="py-2 pr-4 text-right font-medium">Profit</th>
                <th className="py-2 text-right font-medium">Cash</th>
              </tr>
            </thead>
            <tbody className="tabular divide-y divide-line-soft">
              {rows.map((r) => (
                <tr key={r.month}>
                  <td className="py-2.5 pr-4 font-medium text-ink">
                    {r.label}
                  </td>
                  <td className="py-2.5 pr-4 text-right">
                    {formatNumber(r.orders)}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-ink-muted">
                    {formatNumber(r.packs)}
                  </td>
                  <td className="py-2.5 pr-4 text-right">
                    {formatMoney(r.revenue)}
                  </td>
                  <td className="py-2.5 pr-4 text-right">
                    {formatMoney(r.contribution)}
                  </td>
                  <td
                    className={
                      "py-2.5 pr-4 text-right font-medium " +
                      (r.profit < 0 ? "text-loss-strong" : "text-primary")
                    }
                  >
                    {formatMoney(r.profit)}
                  </td>
                  <td
                    className={
                      "py-2.5 text-right " +
                      (r.cash < 0 ? "text-loss-strong" : "text-ink")
                    }
                  >
                    {formatMoney(r.cash)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Split>
  );
}
