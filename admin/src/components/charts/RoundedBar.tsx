/**
 * Bar shape rounded only at the data end, so negative bars round at the
 * bottom and every bar stays flush with the zero baseline.
 */
export default function RoundedBar(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  value?: number | [number, number];
}) {
  const { x = 0, y = 0, width = 0, height = 0, fill } = props;
  const value = Array.isArray(props.value)
    ? props.value[1] - props.value[0]
    : (props.value ?? 0);
  const top = Math.min(y, y + height);
  const h = Math.abs(height);
  const r = Math.min(4, width / 2, h);
  if (h === 0) return null;

  const d =
    value >= 0
      ? `M${x},${top + h} V${top + r} Q${x},${top} ${x + r},${top} H${x + width - r} Q${x + width},${top} ${x + width},${top + r} V${top + h} Z`
      : `M${x},${top} V${top + h - r} Q${x},${top + h} ${x + r},${top + h} H${x + width - r} Q${x + width},${top + h} ${x + width},${top + h - r} V${top} Z`;
  return <path d={d} fill={fill} />;
}
