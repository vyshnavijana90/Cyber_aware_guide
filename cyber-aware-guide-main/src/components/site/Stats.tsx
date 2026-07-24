import { useEffect, useRef, useState } from "react";
import { Activity, AlertOctagon, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";

function useCountUp(target: number, duration = 1500, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return val;
}

const STATS = [
  {
    icon: TrendingUp,
    label: "Increase in cyber crimes (YoY)",
    value: 113,
    suffix: "%",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: AlertOctagon,
    label: "Most common: UPI / OTP scams",
    value: 47,
    suffix: "%",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    label: "Indians affected (millions)",
    value: 92,
    suffix: "M+",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: Activity,
    label: "Banking fraud cases reported",
    value: 29,
    suffix: "K+",
    color: "from-emerald-500 to-teal-500",
  },
];

const BREAKDOWN = [
  { name: "UPI / Payment Scams", pct: 38 },
  { name: "Phishing & Identity Theft", pct: 24 },
  { name: "Job & Loan Frauds", pct: 17 },
  { name: "Social Media Scams", pct: 13 },
  { name: "Other", pct: 8 },
];

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), {
      threshold: 0.2,
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="stats" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="The Reality"
          title="Cyber Crime Awareness Statistics"
          description="Numbers tell the story — and why awareness matters more than ever."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} visible={visible} />
          ))}
        </div>

        <Card className="p-8 max-w-3xl mx-auto border-border shadow-card">
          <h3 className="font-semibold mb-1">Most reported scam categories</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Share of total cyber-fraud complaints (India)
          </p>
          <div className="space-y-4">
            {BREAKDOWN.map((b) => (
              <div key={b.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{b.name}</span>
                  <span className="text-muted-foreground">{b.pct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-gradient-cyber rounded-full transition-all duration-[1500ms] ease-out"
                    style={{ width: visible ? `${b.pct}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  visible,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: number;
  suffix: string;
  color: string;
  visible: boolean;
}) {
  const n = useCountUp(value, 1500, visible);
  return (
    <Card className="p-6 relative overflow-hidden border-border hover:shadow-glow transition-shadow">
      <div
        className={`absolute -top-10 -right-10 size-28 rounded-full bg-gradient-to-br ${color} opacity-20`}
      />
      <div className={`size-11 rounded-lg bg-gradient-to-br ${color} grid place-items-center mb-4`}>
        <Icon className="size-5 text-white" />
      </div>
      <div className="text-4xl font-bold tracking-tight">
        {n}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </Card>
  );
}
