"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { axisProps, gridProps } from "@/components/charts/axis";
import { colors } from "@/config/theme";
import { formatCompactMoney, formatMoney } from "@/lib/format";

type Point = { orders: number; contribution: number; fixed: number };

/** Monthly contribution climbing with orders until it crosses fixed costs. */
export default function BreakEvenChart({
  perOrder,
  fixed,
  breakEven,
}: {
  perOrder: number;
  fixed: number;
  breakEven: number | null;
}) {
  const maxOrders = Math.max(50, Math.ceil(((breakEven ?? 200) * 2) / 10) * 10);
  const step = Math.max(1, Math.round(maxOrders / 40));
  const points: Point[] = [];
  for (let n = 0; n <= maxOrders; n += step) {
    points.push({ orders: n, contribution: n * perOrder, fixed });
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={points}
          margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
        >
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="orders"
            type="number"
            domain={[0, maxOrders]}
            {...axisProps}
          />
          <YAxis
            {...axisProps}
            width={60}
            tickFormatter={(v: number) => formatCompactMoney(v, false)}
          />
          {breakEven !== null && (
            <ReferenceLine
              x={breakEven}
              stroke={colors.pink}
              strokeDasharray="4 4"
              label={{
                value: `${breakEven} orders`,
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
              const p = payload[0].payload as Point;
              return (
                <ChartTooltip
                  title={`${p.orders} orders a month`}
                  rows={[
                    {
                      label: "Contribution",
                      value: formatMoney(p.contribution),
                      swatch: colors.primary,
                    },
                    {
                      label: "Fixed costs",
                      value: formatMoney(p.fixed),
                      swatch: colors.pink,
                    },
                    {
                      label: "Profit",
                      value: formatMoney(p.contribution - p.fixed),
                    },
                  ]}
                />
              );
            }}
          />
          <Line
            dataKey="fixed"
            stroke={colors.pink}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            dataKey="contribution"
            stroke={colors.primary}
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
