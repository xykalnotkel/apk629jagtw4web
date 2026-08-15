"use client";

type Props = {
  labels: string[];
  values: number[]; // 0..100
  size?: number;
};

export default function RadarChart({ labels, values, size = 260 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 30;
  const n = labels.length;

  const pointFor = (i: number, v: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const radius = (v / 100) * r;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  };
  const axisPoint = (i: number, radius: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  };

  const gridLevels = [25, 50, 75, 100];
  const polygon = values.map((v, i) => pointFor(i, v).join(",")).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.3" />
        </radialGradient>
      </defs>

      {/* Grid polygons */}
      {gridLevels.map((lvl) => {
        const pts = labels
          .map((_, i) => axisPoint(i, (lvl / 100) * r).join(","))
          .join(" ");
        return (
          <polygon
            key={lvl}
            points={pts}
            fill="none"
            stroke="rgba(191,219,254,0.12)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {labels.map((_, i) => {
        const [x, y] = axisPoint(i, r);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="rgba(191,219,254,0.12)"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={polygon}
        fill="url(#radarFill)"
        stroke="#bfdbfe"
        strokeWidth="2"
        style={{ filter: "drop-shadow(0 0 8px rgba(191,219,254,0.4))" }}
      />

      {/* Data points */}
      {values.map((v, i) => {
        const [x, y] = pointFor(i, v);
        return <circle key={i} cx={x} cy={y} r={3.5} fill="#ffffff" stroke="#1e3a8a" strokeWidth="1.5" />;
      })}

      {/* Labels */}
      {labels.map((lbl, i) => {
        const [x, y] = axisPoint(i, r + 18);
        return (
          <text
            key={lbl}
            x={x}
            y={y}
            fontSize="10"
            fill="#dbeafe"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="ui-monospace, monospace"
          >
            {lbl}
          </text>
        );
      })}
    </svg>
  );
}
