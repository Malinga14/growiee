/** Rupee amounts are large enough that cents are noise. */
const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const CURRENCY = "LKR";

/** "LKR 2,000", or "2,000" without the code. A real minus sign for losses. */
export function formatMoney(value: number, withCurrency = true): string {
  const text = `${value < 0 ? "−" : ""}${whole.format(Math.abs(Math.round(value)))}`;
  return withCurrency ? `${CURRENCY} ${text}` : text;
}

/** "LKR 1.2M" for axes and tight tiles. */
export function formatCompactMoney(value: number, withCurrency = true): string {
  const text = `${value < 0 ? "−" : ""}${compact.format(Math.abs(value))}`;
  return withCurrency ? `${CURRENCY} ${text}` : text;
}

export function formatCompact(value: number): string {
  return compact.format(value);
}

export function formatNumber(value: number, digits = 0): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatSignedMoney(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatMoney(Math.abs(value))}`;
}

/** Plain share, e.g. "42.5%". */
export function formatShare(value: number, digits = 1): string {
  return `${value < 0 ? "−" : ""}${Math.abs(value * 100).toFixed(digits)}%`;
}

/** Signed change, e.g. "+4.2%". */
export function formatPct(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value * 100).toFixed(digits)}%`;
}
