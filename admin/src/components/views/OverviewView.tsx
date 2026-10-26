"use client";

import { useRef } from "react";
import { useFillHeight } from "@/hooks/useFillHeight";

import Link from "next/link";
import classNames from "classnames";
import ArcGauge from "@/components/charts/ArcGauge";
import DialGauge from "@/components/charts/DialGauge";
import ThinWave from "@/components/charts/ThinWave";
import TickMeter from "@/components/charts/TickMeter";
import { glyphs, Icon } from "@/components/icons";
import Hero from "@/components/overview/Hero";
import { overview, weeklyFlow } from "@/components/overview/data";
import { useScenario } from "@/components/ScenarioProvider";
import { chart } from "@/config/theme";
import { useWidth } from "@/hooks/useSize";
import {
  formatCompact,
  formatMoney,
  formatNumber,
  formatShare,
} from "@/lib/format";

export default function OverviewView() {
  const fill = useRef<HTMLDivElement>(null);
  const height = useFillHeight(fill, {
    query: "(min-width: 1280px)",
    min: 600,
  });
  const { scenario: s, edited } = useScenario();
  const d = overview(s);
  const weeks = weeklyFlow(s);
  const dialMax = Math.max(
    5000,
    Math.ceil(((d.evenPrice ?? 0) * 1.15) / 1000) * 1000,
    Math.ceil((s.price * 1.15) / 1000) * 1000,
  );

  return (
    <div
      ref={fill}
      className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
      style={height ? { minHeight: height } : undefined}
    >
      <Hero
        price={s.price}
        cost={d.cost}
        left={d.order.contribution}
        breakEven={d.be}
        evenPrice={d.evenPrice}
        months={s.months}
        edited={edited}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Left column */}
        <div className="flex min-w-0 flex-col gap-5">
          <Tile title="Money flow" hint={`${weeks.length} weeks`}>
            <ThinWave
              title="Money collected and spent each week"
              points={weeks.map((w) => ({
                key: w.key,
                label: `${w.label} · ${formatNumber(w.orders, 0)} orders`,
                up: w.collected,
                down: w.costs,
              }))}
              upLabel="collected"
              downLabel="costs"
            />
          </Tile>

          <div className="grid grid-cols-2 gap-5">
            <Figure
              title="Cost per pack"
              value={formatNumber(d.cost)}
              unit="LKR"
              note={`${formatNumber(Math.round(d.cost / 3))}/piece`}
            />
            <Figure
              title="Orders / year"
              value={formatCompact(d.yearOrders)}
              unit="orders"
              note={`+${formatShare(s.growth, 0)}/mo`}
            />
          </div>

          <Tile title="Margin" hint="per order">
            <GaugeFit value={d.order.margin} />
            <div className="mt-1 flex justify-center">
              <Link
                href="/pricing"
                className="pressable inline-flex min-h-9 items-center gap-1.5 rounded-full bg-pink px-4 text-xs font-semibold text-ink shadow-[0_6px_16px_-6px_rgba(247,143,179,0.9)] outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Adjust price
                <glyphs.arrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </Tile>
        </div>

        {/* Right column */}
        <div className="flex min-w-0 flex-col gap-5">
          <Tile title="Pack price" hint="LKR, 0 – {max}" max={dialMax}>
            <DialFit value={s.price} target={d.evenPrice} max={dialMax} />
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-ink/[0.06] pt-4 text-center">
              <Mini label="Gross margin" value={formatShare(d.gm)} />
              <Mini label="Per piece" value={formatNumber(s.price / 3)} />
              <Mini
                label="Break-even"
                value={d.evenPrice === null ? "—" : formatNumber(d.evenPrice)}
                swatch={chart.pink}
              />
            </div>
          </Tile>

          <Tile title="Cost pressure" hint="share of collected">
            <ul className="space-y-5">
              {d.pressure.map((p, i) => (
                <li key={p.key}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-[13px]">
                    <span className="flex items-center gap-1.5 text-ink-muted">
                      {p.label}
                      {p.share > 0.5 && (
                        <span
                          className="grid h-5 w-5 place-items-center rounded-md bg-pink text-ink"
                          title="Over half of what an order collects"
                        >
                          <Icon
                            icon="alert"
                            active
                            className="h-3.5 w-3.5"
                            aria-label="High"
                          />
                        </span>
                      )}
                    </span>
                    <span className="tabular font-medium text-ink">
                      {formatShare(p.share, 0)}
                      <span className="ml-1.5 text-xs font-normal text-ink-faint">
                        {formatMoney(p.value)}
                      </span>
                    </span>
                  </div>
                  <TickMeter
                    share={p.share}
                    color={p.share > 0.5 ? chart.pink : chart.indigo}
                    delay={0.1 + i * 0.1}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ink-faint">
              Of {formatMoney(d.collected)} collected on an average order.
            </p>
          </Tile>
        </div>
      </div>
    </div>
  );
}

/** Frosted bento tile: a small quiet title, the content does the talking. */
function Tile({
  title,
  hint,
  max,
  children,
  className,
}: {
  title: string;
  hint?: string;
  max?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={classNames(
        "glass-card flex min-w-0 flex-1 flex-col rounded-[28px] p-5",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-[13px] font-medium text-ink-muted">{title}</h2>
        <div className="flex items-center gap-1">
          {hint && (
            <span className="text-[11px] text-ink-faint">
              {max ? hint.replace("{max}", formatCompact(max)) : hint}
            </span>
          )}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        {children}
      </div>
    </section>
  );
}

/** A big light numeral with a small unit, like an instrument readout. */
function Figure({
  title,
  value,
  unit,
  note,
}: {
  title: string;
  value: string;
  unit: string;
  note: string;
}) {
  return (
    <section className="glass-card min-w-0 rounded-[28px] p-5 [container-type:inline-size]">
      <h2 className="text-[13px] font-medium text-ink-muted">{title}</h2>
      {/* The numeral scales with the card, so it never runs past the edge;
          the unit sits on its own line under it. */}
      <p
        className="mt-4 whitespace-nowrap font-display font-light leading-none tracking-display text-ink"
        style={{ fontSize: "clamp(26px, 26cqi, 44px)" }}
      >
        {value}
      </p>
      <p className="mt-2 truncate text-xs text-ink-faint">
        <span className="font-medium text-ink-muted">{unit}</span> · {note}
      </p>
    </section>
  );
}

function Mini({
  label,
  value,
  swatch,
}: {
  label: string;
  value: string;
  swatch?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center justify-center gap-1 truncate text-[11px] text-ink-faint">
        {swatch && (
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: swatch }}
          />
        )}
        {label}
      </p>
      <p className="tabular mt-0.5 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

/** Dial sized to its tile. */
function DialFit(props: { value: number; target: number | null; max: number }) {
  const [ref, width] = useWidth<HTMLDivElement>(260);
  return (
    <div ref={ref}>
      <DialGauge
        {...props}
        size={Math.max(180, Math.min(width, 250))}
        label="Price"
        targetLabel="Break-even price"
      />
    </div>
  );
}

/** Gauge sized to its tile. */
function GaugeFit({ value }: { value: number }) {
  const [ref, width] = useWidth<HTMLDivElement>(260);
  return (
    <div ref={ref}>
      <ArcGauge
        value={value}
        width={Math.max(200, Math.min(width, 280))}
        label="Contribution"
      />
    </div>
  );
}
