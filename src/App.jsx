import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import axios from "axios";
const data = {
  totalPlayers: 2,
  totalCompleted: 0,
  totalAbandoned: 2,
  totalWin: 0,
  totalLoss: 2,
  scenarioStats: [
    { winCount: 0, lossCount: 1, scenario: "Easy Money", totalUsers: 1 },
    { winCount: 0, lossCount: 1, scenario: "Now or Never", totalUsers: 1 },
  ],
};

const COLORS = {
  win: "#00e5a0",
  loss: "#ff3b5c",
  abandoned: "#ff3b5c",
  completed: "#00e5a0",
  accent: "#00c8ff",
  gold: "#ffcf40",
  bg: "#0a0d14",
  surface: "#10141f",
  border: "#1e2535",
  muted: "#5a6275",
  text: "#e8eaf0",
};

function AnimatedNumber({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{display}</span>;
}

function KpiCard({ label, value, color, sub, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        padding: "24px 20px",
        position: "relative",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: color,
        }}
      />
      <div
        style={{
          fontFamily: "DM Mono, monospace",
          fontSize: 10,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: COLORS.muted,
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: 52,
          lineHeight: 1,
          color,
        }}
      >
        <AnimatedNumber value={value} />
      </div>
      <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 6 }}>
        {sub}
      </div>
    </div>
  );
}

function CBar({ label, value, max, color }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
      }}
    >
      <span
        style={{
          fontFamily: "DM Mono, monospace",
          fontSize: 10,
          letterSpacing: 1,
          color: COLORS.muted,
          minWidth: 90,
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 4,
          background: COLORS.border,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 2,
            transition: "width 1s ease",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "DM Mono, monospace",
          fontSize: 11,
          color: COLORS.text,
          minWidth: 28,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          padding: "8px 14px",
          fontFamily: "DM Mono, monospace",
          fontSize: 12,
          color: COLORS.text,
        }}
      >
        <div>
          {payload[0].name}:{" "}
          <span style={{ color: payload[0].fill }}>{payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function App() {
  const [analyticsData, setAnalyticsData] = useState({
    totalPlayers: 0,
    totalCompleted: 0,
    totalAbandoned: 0,
    totalWin: 0,
    totalLoss: 0,
    scenarioStats: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "https://hdfc-bot-backend.vtour.tech/analytics/overview",
        );

        setAnalyticsData(data?.data);
      } catch (error) {
        console.error(error, "error");
      }
    };

    fetchData();
  }, []);
  const {
    totalPlayers,
    totalCompleted,
    totalAbandoned,
    totalWin,
    totalLoss,
    scenarioStats = [],
  } = analyticsData;

  const winLossData = [
    { name: "Wins", value: totalWin },
    { name: "Losses", value: totalLoss },
  ];

  const sessionData = [
    { name: "Completed", value: totalCompleted },
    { name: "Abandoned", value: totalAbandoned },
  ];

  const scenarioBarData = (scenarioStats || []).map((s) => ({
    name: s.scenario,
    Wins: s.winCount,
    Losses: s.lossCount,
  }));

  return (
    <div
      style={{
        background: COLORS.bg,
        minHeight: "100vh",
        color: COLORS.text,
        fontFamily: "DM Sans, sans-serif",
        padding: "48px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid bg */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 48,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "clamp(36px, 6vw, 64px)",
                letterSpacing: 2,
                lineHeight: 1,
              }}
            >
              HDFC <span style={{ color: COLORS.accent }}>BOT</span> GAME
              ANALYTICS
            </h1>
            <p
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 11,
                color: COLORS.muted,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginTop: 6,
              }}
            >
              Analytics Dashboard
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,200,255,0.06)",
              border: "1px solid rgba(0,200,255,0.2)",
              padding: "8px 16px",
              borderRadius: 4,
              fontFamily: "DM Mono, monospace",
              fontSize: 11,
              letterSpacing: 2,
              color: COLORS.accent,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: COLORS.accent,
                animation: "pulse 1.8s ease-in-out infinite",
              }}
            />
            LIVE DATA
          </div>
        </div>

        {/* KPI Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <KpiCard
            label="Total Players"
            value={totalPlayers}
            color={COLORS.accent}
            sub="Registered users"
            delay={50}
          />
          <KpiCard
            label="Completed"
            value={totalCompleted}
            color={COLORS.gold}
            sub="Finished sessions"
            delay={100}
          />
          <KpiCard
            label="Abandoned"
            value={totalAbandoned}
            color={COLORS.loss}
            sub="Dropped out"
            delay={150}
          />
          <KpiCard
            label="Total Wins"
            value={totalWin}
            color={COLORS.win}
            sub="Victories"
            delay={200}
          />
          <KpiCard
            label="Total Losses"
            value={totalLoss}
            color={COLORS.loss}
            sub="Defeats"
            delay={250}
          />
        </div>

        {/* Bottom Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 14,
          }}
        >
          {/* Win / Loss Panel */}
          <div
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              padding: "28px 24px",
            }}
          >
            <div
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 10,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: COLORS.muted,
                marginBottom: 20,
              }}
            >
              Win / Loss Split
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={winLossData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={3}
                >
                  <Cell fill={COLORS.win} />
                  <Cell fill={COLORS.loss} />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 24,
                marginTop: 8,
              }}
            >
              {winLossData.map((d, i) => (
                <div
                  key={d.name}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: i === 0 ? COLORS.win : COLORS.loss,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "DM Mono, monospace",
                      fontSize: 11,
                      color: COLORS.muted,
                    }}
                  >
                    {d.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "Bebas Neue, sans-serif",
                      fontSize: 20,
                      color: COLORS.text,
                    }}
                  >
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Session Status Panel */}
          <div
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              padding: "28px 24px",
            }}
          >
            <div
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 10,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: COLORS.muted,
                marginBottom: 20,
              }}
            >
              Session Status
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sessionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={3}
                >
                  <Cell fill={COLORS.win} />
                  <Cell fill={COLORS.loss} />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16 }}>
              <CBar
                label="COMPLETED"
                value={totalCompleted}
                max={totalPlayers}
                color={COLORS.win}
              />
              <CBar
                label="ABANDONED"
                value={totalAbandoned}
                max={totalPlayers}
                color={COLORS.loss}
              />
            </div>
          </div>

          {/* Scenario Breakdown */}
          <div
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              padding: "28px 24px",
              gridColumn: "1 / -1",
            }}
          >
            <div
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 10,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: COLORS.muted,
                marginBottom: 24,
              }}
            >
              Scenario Breakdown
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 28,
                marginBottom: 32,
              }}
            >
              {scenarioStats.map((s) => (
                <div key={s.scenario}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 500 }}>
                      {s.scenario}
                    </span>
                    <span
                      style={{
                        fontFamily: "DM Mono, monospace",
                        fontSize: 11,
                        color: COLORS.muted,
                      }}
                    >
                      {s.totalUsers} player{s.totalUsers !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <CBar
                    label="WINS"
                    value={s.winCount}
                    max={s.totalUsers}
                    color={COLORS.win}
                  />
                  <CBar
                    label="LOSSES"
                    value={s.lossCount}
                    max={s.totalUsers}
                    color={COLORS.loss}
                  />
                  <div
                    style={{
                      fontFamily: "DM Mono, monospace",
                      fontSize: 10,
                      color: COLORS.muted,
                      marginTop: 6,
                    }}
                  >
                    Win Rate:{" "}
                    <span style={{ color: COLORS.win }}>
                      {s.totalUsers === 0
                        ? 0
                        : Math.round((s.winCount / s.totalUsers) * 100)}
                      %
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={scenarioBarData} barCategoryGap="35%">
                <CartesianGrid stroke={COLORS.border} vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{
                    fill: COLORS.muted,
                    fontFamily: "DM Mono, monospace",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fill: COLORS.muted,
                    fontFamily: "DM Mono, monospace",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="Wins" fill={COLORS.win} radius={[3, 3, 0, 0]} />
                <Bar
                  dataKey="Losses"
                  fill={COLORS.loss}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
}
