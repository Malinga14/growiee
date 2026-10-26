"use client";

import Waffle from "@/components/charts/Waffle";
import NumberField from "@/components/inputs/NumberField";
import { useScenario } from "@/components/ScenarioProvider";
import { chart } from "@/config/theme";
import Card from "@/components/ui/Card";
import Money from "@/components/ui/Money";
import StatTile from "@/components/ui/StatTile";
import { Split } from "@/components/views/shared";
import { formatMoney, formatNumber } from "@/lib/format";
import {
  cogs,
  productionRun,
  SIZE_KEYS,
  SIZE_LABELS,
  SOURCES,
} from "@/lib/model";

export default function ProductionView() {
  const { scenario: s, update } = useScenario();
  const run = productionRun(s);
  const cost = s.runSize * cogs(s);
  const sales = s.runSize * s.price;

  return (
    <Split
      inputs={
        <>
          <Card title="Run size" icon="production">
            <NumberField
              label="Packs in this run"
              kind="count"
              step={10}
              value={s.runSize}
              onChange={(runSize) => update({ runSize: Math.round(runSize) })}
              slider={{ min: 90, max: 5000, step: 90 }}
            />
          </Card>
          <Card
            title="Size mix"
            icon="baby"
            iconTone="pink"
            subtitle={SOURCES.shares}
          >
            <div className="grid grid-cols-2 gap-4">
              {SIZE_KEYS.map((k) => (
                <NumberField
                  key={k}
                  label={`${SIZE_LABELS[k]} shares`}
                  kind="count"
                  value={s.shares[k]}
                  onChange={(v) => update({ shares: { ...s.shares, [k]: v } })}
                />
              ))}
            </div>
          </Card>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4 2xl:grid-cols-4">
        <StatTile
          label="Packs"
          icon="production"
          value={formatNumber(s.runSize)}
          detail={`${formatNumber(s.runSize * 3)} pieces`}
        />
        <StatTile
          label="Run cost"
          icon="wallet"
          tone="violet"
          value={<Money value={cost} />}
          detail={`${formatMoney(cogs(s))} a pack`}
        />
        <StatTile
          label="Sells for"
          icon="bag"
          tone="sky"
          value={<Money value={sales} />}
          detail="if every pack sells at list price"
        />
        <StatTile
          label="Gross profit"
          icon="coins"
          tone={sales - cost >= 0 ? "pink" : "loss"}
          value={<Money value={sales - cost} />}
          detail="before ads and delivery"
        />
      </div>

      <Card
        title="Cutting plan"
        icon="list"
        subtitle="Each square is 1% of the run; packs are rounded so the run adds up exactly"
      >
        <Waffle
          groups={run.map((r, i) => ({
            key: r.key,
            label: r.label,
            value: r.packs,
            color: chart.series[i],
          }))}
        />

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[440px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-faint">
                <th className="py-2 pr-4 font-medium">Size</th>
                <th className="py-2 pr-4 text-right font-medium">Packs</th>
                <th className="py-2 pr-4 text-right font-medium">Pieces</th>
                <th className="py-2 pr-4 text-right font-medium">Cost</th>
                <th className="py-2 text-right font-medium">Sells for</th>
              </tr>
            </thead>
            <tbody className="tabular divide-y divide-line-soft">
              {run.map((r) => (
                <tr key={r.key}>
                  <td className="py-2.5 pr-4 font-medium text-ink">
                    {r.label}
                  </td>
                  <td className="py-2.5 pr-4 text-right">
                    {formatNumber(r.packs)}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-ink-muted">
                    {formatNumber(r.packs * 3)}
                  </td>
                  <td className="py-2.5 pr-4 text-right">
                    {formatMoney(r.cost)}
                  </td>
                  <td className="py-2.5 text-right">
                    {formatMoney(r.packs * s.price)}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold text-ink">
                <td className="py-2.5 pr-4">Total</td>
                <td className="py-2.5 pr-4 text-right">
                  {formatNumber(s.runSize)}
                </td>
                <td className="py-2.5 pr-4 text-right">
                  {formatNumber(s.runSize * 3)}
                </td>
                <td className="py-2.5 pr-4 text-right">{formatMoney(cost)}</td>
                <td className="py-2.5 text-right">{formatMoney(sales)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </Split>
  );
}
