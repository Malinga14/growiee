"use client";

import Donut from "@/components/charts/Donut";
import Waterfall from "@/components/charts/Waterfall";
import NumberField from "@/components/inputs/NumberField";
import { useScenario } from "@/components/ScenarioProvider";
import Card from "@/components/ui/Card";
import Money from "@/components/ui/Money";
import StatTile from "@/components/ui/StatTile";
import { orderSteps } from "@/components/views/charts-data";
import { KV, Signed, Split } from "@/components/views/shared";
import { chart } from "@/config/theme";
import { formatMoney, formatShare } from "@/lib/format";
import { cogs, grossMargin, orderEconomics, SOURCES } from "@/lib/model";

export default function UnitEconomicsView() {
  const { scenario: s, update } = useScenario();
  const order = orderEconomics(s);
  const cost = cogs(s);

  return (
    <Split
      inputs={
        <>
          <Card title="Pack" icon="pricing">
            <div className="space-y-4">
              <NumberField
                label="Pack price"
                value={s.price}
                onChange={(price) => update({ price })}
                hint={SOURCES.price}
              />
              <NumberField
                label="Wholesale 3-Kit"
                value={s.wholesale}
                onChange={(wholesale) => update({ wholesale })}
                hint={SOURCES.wholesale}
              />
              <NumberField
                label="Packaging & branding"
                value={s.packaging}
                onChange={(packaging) => update({ packaging })}
                hint={SOURCES.packaging}
              />
            </div>
          </Card>
          <Card title="Order" icon="delivery" iconTone="sky">
            <div className="space-y-4">
              <NumberField
                label="Packs per order"
                kind="count"
                step={0.1}
                min={1}
                value={s.packsPerOrder}
                onChange={(packsPerOrder) => update({ packsPerOrder })}
                slider={{ min: 1, max: 3, step: 0.1 }}
              />
              <NumberField
                label="Meta ads per order (CAC)"
                value={s.cac}
                onChange={(cac) => update({ cac })}
                hint={SOURCES.cac}
              />
              <NumberField
                label="Delivery fee the customer pays"
                value={s.deliveryFee}
                onChange={(deliveryFee) => update({ deliveryFee })}
                hint={SOURCES.deliveryFee}
              />
              <NumberField
                label="Courier charge to us"
                value={s.courierCost}
                onChange={(courierCost) => update({ courierCost })}
              />
              <NumberField
                label="Packing & handling"
                value={s.fulfilment}
                onChange={(fulfilment) => update({ fulfilment })}
              />
              <NumberField
                label="COD handling fee"
                kind="pct"
                step={0.005}
                max={1}
                value={s.codFeePct}
                onChange={(codFeePct) => update({ codFeePct })}
              />
              <NumberField
                label="Failed COD deliveries"
                kind="pct"
                max={1}
                value={s.returnRate}
                onChange={(returnRate) => update({ returnRate })}
                slider={{ min: 0, max: 0.3, step: 0.01 }}
              />
              <NumberField
                label="Cost of a failed delivery"
                value={s.returnCost}
                onChange={(returnCost) => update({ returnCost })}
              />
            </div>
          </Card>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4 2xl:grid-cols-4">
        <StatTile
          label="Pack price"
          icon="pricing"
          value={<Money value={s.price} />}
          detail={`${formatMoney(s.price / 3)} a piece`}
        />
        <StatTile
          label="Cost per pack"
          icon="production"
          tone="violet"
          value={<Money value={cost} />}
          detail={`${formatMoney(cost / 3)} a piece`}
        />
        <StatTile
          label="Gross margin"
          icon="percent"
          tone={s.price - cost >= 0 ? "sky" : "loss"}
          value={formatShare(grossMargin(s))}
          detail={`${formatMoney(s.price - cost)} a pack`}
        />
        <StatTile
          label="Left per order"
          icon="coins"
          tone={order.contribution >= 0 ? "pink" : "loss"}
          value={<Money value={order.contribution} />}
          detail={`${formatShare(order.margin)} of pack revenue`}
        />
      </div>

      <Card
        title="One order, end to end"
        icon="invoice"
        subtitle="Collected, every variable cost stepping down, and what's left. Hover a step for its value."
      >
        <Waterfall title="One order, end to end" steps={orderSteps(order)} />
      </Card>

      <Card
        title="What one pack costs us"
        icon="production"
        iconTone="violet"
        subtitle="Before ads and delivery"
      >
        <Donut
          slices={[
            {
              key: "wholesale",
              label: "Wholesale 3-Kit",
              value: s.wholesale,
              color: chart.indigo,
            },
            {
              key: "packaging",
              label: "Packaging & branding",
              value: s.packaging,
              color: chart.violet,
            },
            {
              key: "profit",
              label: "Gross profit",
              value: Math.max(0, s.price - cost),
              color: chart.pink,
            },
          ]}
          centerLabel="Cost per pack"
          centerValue={formatMoney(cost)}
          size={200}
        />
        <div className="mt-4 border-t border-ink/[0.06]">
          <KV label="Selling price" value={formatMoney(s.price)} />
          <KV
            label="Gross profit per pack"
            value={<Signed value={s.price - cost} />}
            strong
          />
        </div>
      </Card>
    </Split>
  );
}
