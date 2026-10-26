/** Clean, round tick values covering [min, max] (0 / 1K / 2K …). */
export function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) max = min + 1;
  const raw = (max - min) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const err = raw / mag;
  const step = (err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1) * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) {
    ticks.push(Math.round(v * 1e6) / 1e6);
  }
  return ticks;
}

/** Linear map from a domain to a pixel range. */
export function linear(d0: number, d1: number, r0: number, r1: number) {
  const k = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0);
  return (v: number) => r0 + (v - d0) * k;
}

/**
 * Bar path rounded only at the data end (4px), square at the baseline, so
 * negative bars round at the bottom and every bar sits flush on zero.
 */
export function barPath(x: number, y0: number, y1: number, w: number, r = 4) {
  const top = Math.min(y0, y1);
  const h = Math.abs(y1 - y0);
  if (h < 0.5) return "";
  const rr = Math.min(r, w / 2, h);
  const up = y1 <= y0; // value end is above the baseline
  return up
    ? `M${x},${top + h}V${top + rr}Q${x},${top} ${x + rr},${top}H${x + w - rr}Q${x + w},${top} ${x + w},${top + rr}V${top + h}Z`
    : `M${x},${top}V${top + h - rr}Q${x},${top + h} ${x + rr},${top + h}H${x + w - rr}Q${x + w},${top + h} ${x + w},${top + h - rr}V${top}Z`;
}

/** SVG arc path on a circle, angles in radians from 12 o'clock, clockwise. */
export function arcPath(
  cx: number,
  cy: number,
  r: number,
  a0: number,
  a1: number,
) {
  const p = (a: number) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x0},${y0}A${r},${r} 0 ${large} 1 ${x1},${y1}`;
}
