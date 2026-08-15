"use client";

export type Check = {
  id: string;
  name: string;
  status: "pass" | "warning" | "fail";
  message: string;
  suggestion?: string;
  scoreDelta: number;
};

function statusInfo(s: Check["status"]) {
  switch (s) {
    case "pass":
      return {
        chip: "chip chip-pass",
        dot: "status-dot status-pass",
        icon: "OK",
        label: "AMAN",
      };
    case "warning":
      return {
        chip: "chip chip-warn",
        dot: "status-dot status-warn",
        icon: "!",
        label: "PERINGATAN",
      };
    case "fail":
      return {
        chip: "chip chip-fail",
        dot: "status-dot status-fail",
        icon: "X",
        label: "KRITIS",
      };
  }
}

export default function CheckList({ checks }: { checks: Check[] }) {
  if (checks.length === 0) {
    return (
      <div className="text-sm text-ice-200/60 italic">Belum ada data. Mulai scan untuk melihat hasil.</div>
    );
  }
  return (
    <div className="space-y-2.5">
      {checks.map((c) => {
        const st = statusInfo(c.status);
        return (
          <div
            key={c.id}
            className="rounded-lg border border-ice-300/10 bg-metal-800/40 px-3 py-2.5 hover:border-ice-300/25 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className={`${st.dot} mt-1.5 shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-sm font-medium text-ice-50">{c.name}</span>
                  <span className={st.chip}>
                    <span className="font-bold">{st.icon}</span>&nbsp;{st.label}
                  </span>
                </div>
                <p className="text-xs text-ice-200/70 mt-1 leading-relaxed">{c.message}</p>
                {c.suggestion && (
                  <p className="text-xs text-ice-300/90 mt-1.5 leading-relaxed border-l-2 border-ice-300/40 pl-2">
                    <span className="font-semibold text-ice-200">Saran:</span> {c.suggestion}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
