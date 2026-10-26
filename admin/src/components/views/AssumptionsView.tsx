"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/icons";
import NumberField from "@/components/inputs/NumberField";
import { useScenario } from "@/components/ScenarioProvider";
import Card from "@/components/ui/Card";
import { Callout } from "@/components/views/shared";
import { type Field, GROUPS } from "@/lib/assumptions";
import {
  DEFAULTS,
  type Scenario,
  SIZE_KEYS,
  SIZE_LABELS,
  SOURCES,
} from "@/lib/model";
import { formatMoney } from "@/lib/format";
import { snappy } from "@/lib/motion";

function defaultHint(f: Field) {
  const v = DEFAULTS[f.key];
  const shown =
    f.kind === "pct"
      ? `${(v * 100).toFixed(1).replace(/\.0$/, "")}%`
      : f.kind === "count"
        ? String(v)
        : formatMoney(v);
  return `Default ${shown} · ${SOURCES[f.key] ?? "Assumption"}`;
}

export default function AssumptionsView() {
  const { scenario: s, update, reset, edited } = useScenario();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-sm text-ink-muted">
          Defaults come from the brand tokens (
          <code className="text-ink">branding/tokens</code>) and the business
          plan. Anything marked “Assumption” is a starting guess: replace it
          with your real quotes. Edits are saved in this browser and update
          every page.
        </p>
        <motion.button
          type="button"
          onClick={reset}
          disabled={!edited}
          whileTap={{ scale: 0.96 }}
          transition={snappy}
          className="flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink outline-none transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
        >
          <Icon icon="reset" className="h-4 w-4" />
          Reset to defaults
        </motion.button>
      </div>

      {edited && (
        <Callout title="You're viewing edited numbers">
          Reset any time to go back to the brand and plan defaults.
        </Callout>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {GROUPS.map((g) => (
          <Card key={g.title} title={g.title} icon={g.icon}>
            <div className="grid gap-4 sm:grid-cols-2">
              {g.fields.map((f) => (
                <NumberField
                  key={f.key}
                  label={f.label}
                  kind={f.kind ?? "lkr"}
                  value={s[f.key]}
                  onChange={(v) => update({ [f.key]: v } as Partial<Scenario>)}
                  hint={defaultHint(f)}
                />
              ))}
            </div>
          </Card>
        ))}
        <Card
          title="Size mix"
          icon="baby"
          iconTone="pink"
          subtitle={SOURCES.shares}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {SIZE_KEYS.map((k) => (
              <NumberField
                key={k}
                label={`${SIZE_LABELS[k]} shares`}
                kind="count"
                value={s.shares[k]}
                onChange={(v) => update({ shares: { ...s.shares, [k]: v } })}
                hint={`Default ${DEFAULTS.shares[k]}`}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
