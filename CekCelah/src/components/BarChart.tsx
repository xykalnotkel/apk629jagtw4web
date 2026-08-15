"use client";

type Props = {
  labels: string[];
  values: number[];
  colors?: string[];
};

export default function BarChart({ labels, values, colors }: Props) {
  const width = 380;
  const height = 240;
  const padL = 50;
  const padB = 40;
  const padT = 20;
  const padR = 20;
  const chartW = width - padL - padR;
  const chartH = height - padB - padT;
  const maxVal = 100;
  const barGap = 20;
  const barW = (chartW - barGap * (labels.length - 1)) / labels.length;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        {values.map((_, i) => {
          const c = colors?.[i] || "#bfdbfe";
          return (
            <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="40%" stopColor={c} stopOpacity="1" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="1" />
            </linearGradient>
          );
        })}
      </defs>

      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((v) => {
        const y = padT + chartH - (v / maxVal) * chartH;
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="rgba(191,219,254,0.1)" strokeWidth="1" />
            <text x={padL - 8} y={y + 3} fontSize="10" fill="#bfdbfe" textAnchor="end" fontFamily="ui-monospace,monospace">
              {v}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {values.map((v, i) => {
        const h = (v / maxVal) * chartH;
        const x = padL + i * (barW + barGap);
        const y = padT + chartH - h;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={4}
              fill={`url(#barGrad${i})`}
              style={{ filter: "drop-shadow(0 0 8px rgba(30,58,138,0.5))" }}
            >
              <animate attributeName="height" from="0" to={h} dur="0.9s" fill="freeze" />
              <animate attributeName="y" from={padT + chartH} to={y} dur="0.9s" fill="freeze" />
            </rect>
            <text
              x={x + barW / 2}
              y={y - 8}
              fontSize="16"
              fontWeight="700"
              fill="#ffffff"
              textAnchor="middle"
              fontFamily="ui-monospace,monospace"
            >
              {v}
            </text>
            <text
              x={x + barW / 2}
              y={height - padB + 18}
              fontSize="11"
              fill="#dbeafe"
              textAnchor="middle"
              fontFamily="ui-monospace,monospace"
            >
              {labels[i]}
            </text>
          </g>
        );
      })}

      {/* Axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="rgba(191,219,254,0.3)" />
      <line x1={padL} y1={padT + chartH} x2={width - padR} y2={padT + chartH} stroke="rgba(191,219,254,0.3)" />
    </svg>
  );
}
