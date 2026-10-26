"use client";

import classNames from "classnames";
import { LogoMark } from "@/components/layout/Logo";
import HeroBackground from "@/components/overview/HeroBackground";
import SpotlightCard from "@/components/reactbits/SpotlightCard/SpotlightCard";
import { formatMoney, formatNumber, formatShare } from "@/lib/format";

type Props = {
  price: number;
  cost: number;
  left: number;
  breakEven: number | null;
  evenPrice: number | null;
  months: number;
  edited: boolean;
};

/**
 * The left half of the Overview, read top to bottom: brand, what this is,
 * the one number that matters (what each order leaves), how far the price
 * is from break-even, then four supporting figures. The brand
 * gradient sits behind it. Static: no animation.
 */
export default function Hero(props: Props) {
  const profitable = props.left >= 0;
  const p = props.evenPrice
    ? Math.max(0, Math.min(props.price / props.evenPrice, 1))
    : 1;
  const gm = props.price > 0 ? (props.price - props.cost) / props.price : 0;

  return (
    <section
      aria-label="Business summary"
      className="relative isolate flex h-full min-h-[560px] xl:min-h-0 flex-col overflow-hidden rounded-[32px] p-6 text-white shadow-[0_30px_60px_-30px_rgba(45,52,141,0.55)] [contain:paint] sm:p-8"
    >
      <HeroBackground />

      {/* Brand */}
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-7 [color:#fff]" />
          <span className="font-wordmark text-[24px] leading-none">
            Growiee
          </span>
        </div>
      </header>

      {/* What this is */}
      <div className="mt-10">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/65">
          3-Kit Pack · {props.months}-month view
        </p>
        <h2 className="mt-2 font-display text-[40px] font-light leading-[1.05] tracking-display sm:text-[48px]">
          Pack economics
        </h2>
      </div>

      {/* The one number */}
      <div className="mt-auto pt-10">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-sm text-white/75">Left from every order</span>
          <span
            className={classNames(
              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-ink",
              profitable ? "bg-sky" : "bg-pink",
            )}
          >
            {profitable ? "Profitable" : "Loss-making"}
          </span>
        </div>
        <p className="mt-2 flex items-baseline gap-3 font-display font-light leading-none tracking-display">
          <span className="text-[64px] sm:text-[80px]">
            {formatMoney(props.left, false)}
          </span>
          <span className="text-lg text-white/70">LKR</span>
        </p>

        {/* Price towards break-even */}
        <div className="mt-7">
          <div className="mb-2 flex items-baseline justify-between gap-3 text-xs text-white/70">
            <span>
              Price{" "}
              <span className="font-semibold text-white">
                {formatMoney(props.price)}
              </span>
            </span>
            <span>
              {props.evenPrice ? (
                <>
                  Break-even{" "}
                  <span className="font-semibold text-white">
                    {formatMoney(props.evenPrice)}
                  </span>
                </>
              ) : (
                "Clears break-even"
              )}
            </span>
          </div>
          <div
            className="relative h-2 rounded-full bg-white/15"
            role="meter"
            aria-label="Price as a share of the break-even price"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(p * 100)}
          >
            <div
              className="absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r from-white/60 to-white"
              style={{ width: `${p * 100}%` }}
            />
            <span
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-pink shadow-[0_0_0_6px_rgba(247,143,179,0.3)]"
              style={{ left: `${p * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/65">
            {props.evenPrice
              ? `Price is ${formatShare(p, 0)} of the way to breaking even on each order`
              : "Every order covers its costs"}
          </p>
        </div>
      </div>

      {/* Supporting figures */}
      <SpotlightCard
        theme="dark"
        spotlightColor="rgba(15, 188, 249, 0.2)"
        intensity={0.12}
        spotlightSize={260}
        borderGlow={0.3}
        flare={false}
        className="mt-8 !p-0"
        style={
          {
            "--spotlight-card-surface": "rgba(25, 30, 80, 0.45)",
            "--spotlight-card-border": "rgba(255, 255, 255, 0.14)",
            "--spotlight-card-shadow":
              "0 20px 40px -24px rgba(10, 12, 40, 0.6)",
            WebkitBackdropFilter: "blur(18px) saturate(160%)",
            backdropFilter: "blur(18px) saturate(160%)",
            borderRadius: 22,
          } as React.CSSProperties
        }
      >
        <dl className="grid grid-cols-2 divide-white/10 sm:grid-cols-4 sm:divide-x">
          <Stat
            label="Price"
            value={formatMoney(props.price, false)}
            unit="LKR"
          />
          <Stat
            label="Cost per pack"
            value={formatMoney(props.cost, false)}
            unit="LKR"
          />
          <Stat label="Gross margin" value={formatShare(gm)} />
          <Stat
            label="Break-even"
            value={
              props.breakEven === null ? "None" : formatNumber(props.breakEven)
            }
            unit={props.breakEven === null ? undefined : "orders/mo"}
          />
        </dl>
      </SpotlightCard>
    </section>
  );
}

function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
}) {
  return (
    <div className="min-w-0 px-4 py-4">
      <dt className="truncate text-[11px] text-white/60">{label}</dt>
      <dd className="mt-1 truncate text-lg font-semibold leading-tight">
        {value}
        {unit && (
          <span className="ml-1 text-[11px] font-medium text-white/60">
            {unit}
          </span>
        )}
      </dd>
    </div>
  );
}
