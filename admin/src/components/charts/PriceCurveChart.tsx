"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { axisProps, gridProps } from "@/components/charts/axis";
import { colors } from "@/config/theme";
import { formatCompactMoney, formatMoney, formatShare } from "@/lib/format";

export type PricePoint = {
  price: number;
  contribution: number;
  margin: number;
};

/** Contribution per order across pack prices, with today's price marked. */
export default function PriceCurveChart({
  points,
  current,
  breakEvenPrice,
}: {
  points: PricePoint[];
  current: PricePoint;
  breakEvenPrice: number | null;
}) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={points}
          margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="price-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.violet} stopOpacity={0.22} />
              <stop offset="100%" stopColor={colors.violet} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="price"
            type="number"
            domain={["dataMin", "dataMax"]}
            {...axisProps}
            tickFormatter={(v: number) => formatCompactMoney(v, false)}
          />
          <YAxis
            {...axisProps}
            width={60}
            tickFormatter={(v: number) => formatCompactMoney(v, false)}
          />
          <ReferenceLine
            y={0}
            stroke={colors["ink-faint"]}
            strokeDasharray="4 4"
          />
          {breakEvenPrice !== null && (
            <ReferenceLine
              x={breakEvenPrice}
              stroke={colors.pink}
              strokeDasharray="4 4"
              label={{
                value: "Break-even",
                fill: colors["pink-strong"],
                fontSize: 11,
                position: "insideTopLeft",
              }}
            />
          )}
          <Tooltip
            cursor={{ stroke: colors.line }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload as PricePoint;
              return (
                <ChartTooltip
                  title={`Pack at ${formatMoney(p.price)}`}
                  rows={[
                    {
                      label: "Per order",
                      value: formatMoney(p.contribution),
                      swatch: colors.violet,
                    },
                    { label: "Margin", value: formatShare(p.margin) },
                  ]}
                />
              );
            }}
          />
          <Area
            dataKey="contribution"
            type="monotone"
            stroke={colors.violet}
            strokeWidth={2.5}
            fill="url(#price-fill)"
            isAnimationActive={false}
          />
          <ReferenceDot
            x={current.price}
            y={current.contribution}
            r={6}
            fill={colors.primary}
            stroke="#fff"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
