import type { CSSProperties } from "react";

const BIG = { x: 245, y: 180, radius: 150, teeth: 12, duration: 12 };
const SMALL = { x: 630, y: 390, radius: 80, teeth: 8, duration: 6.4 };

type Gear = typeof BIG;
type Point = [number, number];

function point(cx: number, cy: number, radius: number, angle: number): Point {
  return [
    cx + Math.cos(angle) * radius,
    cy + Math.sin(angle) * radius,
  ];
}

function pointsAttribute(points: Point[]) {
  return points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

function gearTeeth(gear: Gear) {
  const step = (Math.PI * 2) / gear.teeth;
  const innerRadius = gear.radius - 4;
  const outerRadius = gear.radius + Math.max(9, gear.radius * 0.075);

  return Array.from({ length: gear.teeth }, (_, index) => {
    const center = index * step - Math.PI / 2;
    return pointsAttribute([
      point(gear.x, gear.y, innerRadius, center - step * 0.2),
      point(gear.x, gear.y, outerRadius, center - step * 0.105),
      point(gear.x, gear.y, outerRadius, center + step * 0.105),
      point(gear.x, gear.y, innerRadius, center + step * 0.2),
    ]);
  });
}

function externalTangents(first: Gear, second: Gear) {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  const distance = Math.hypot(dx, dy);
  const radiusDelta = first.radius - second.radius;
  const c = radiusDelta / distance;
  const h = Math.sqrt(Math.max(0, 1 - c * c));

  return [-1, 1].map((sign) => {
    const nx = (dx * c - sign * dy * h) / distance;
    const ny = (dy * c + sign * dx * h) / distance;
    return {
      first: {
        x: first.x + first.radius * nx,
        y: first.y + first.radius * ny,
      },
      second: {
        x: second.x + second.radius * nx,
        y: second.y + second.radius * ny,
      },
    };
  });
}

function beltRuns() {
  return externalTangents(BIG, SMALL).map((run, index) => {
    const start = index === 0 ? run.first : run.second;
    const end = index === 0 ? run.second : run.first;
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} L ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  });
}

function GearRing({ gear, id }: { gear: Gear; id: string }) {
  return (
    <g
      id={id}
      className="qtm-drive-gear-ring"
      style={{
        "--gear-x": `${gear.x}px`,
        "--gear-y": `${gear.y}px`,
        "--gear-duration": `${gear.duration}s`,
      } as CSSProperties}
      aria-hidden="true"
    >
      {gearTeeth(gear).map((points) => (
        <polygon className="qtm-drive-gear-tooth" points={points} key={points} />
      ))}
      <circle className="qtm-drive-gear-outer" cx={gear.x} cy={gear.y} r={gear.radius - 3} />
      <circle className="qtm-drive-gear-detail" cx={gear.x} cy={gear.y} r={gear.radius * 0.78} />
      <circle className="qtm-drive-gear-inner" cx={gear.x} cy={gear.y} r={gear.radius * 0.72} />
    </g>
  );
}

export default function MegaPartnerDrivePage() {
  const runs = beltRuns();

  return (
    <main className="qtm-drive-page">
      <style>{`
        html,
        body {
          width: 100%;
          height: 100%;
          margin: 0;
          overflow: hidden;
          background: #f7f7f5;
        }

        .qtm-drive-page {
          width: 100vw;
          height: 100vh;
          display: grid;
          place-items: center;
          background: #f7f7f5;
        }

        .qtm-drive-page svg {
          display: block;
          width: min(100%, 920px);
          height: auto;
          max-height: 100%;
        }

        .qtm-drive-belt-base {
          fill: none;
          stroke: #343432;
          stroke-width: 7;
          stroke-linecap: round;
        }

        .qtm-drive-belt-motion {
          fill: none;
          stroke: #E81E23;
          stroke-width: 2;
          stroke-linecap: butt;
          stroke-dasharray: 12 12;
          animation: qtm-drive-belt-travel 1.1s linear infinite;
        }

        .qtm-drive-gear-ring {
          transform-box: view-box;
          transform-origin: var(--gear-x) var(--gear-y);
          animation: qtm-drive-gear-turn var(--gear-duration) linear infinite;
          will-change: transform;
        }

        .qtm-drive-gear-tooth {
          fill: #E81E23;
          stroke: none;
        }

        .qtm-drive-gear-outer {
          fill: #f7f7f5;
          stroke: #181818;
          stroke-width: 4;
        }

        .qtm-drive-gear-detail {
          fill: none;
          stroke: rgba(24, 24, 24, .32);
          stroke-width: 1.5;
        }

        .qtm-drive-gear-inner {
          fill: #f7f7f5;
          stroke: #E81E23;
          stroke-width: 2;
        }

        .qtm-drive-static-image {
          pointer-events: none;
          transform: none !important;
          animation: none !important;
        }

        .qtm-drive-mega-image {
          mix-blend-mode: multiply;
        }

        @keyframes qtm-drive-gear-turn {
          to { transform: rotate(360deg); }
        }

        @keyframes qtm-drive-belt-travel {
          to { stroke-dashoffset: -48; }
        }

        @media (max-width: 600px) {
          .qtm-drive-belt-base { stroke-width: 6; }
          .qtm-drive-belt-motion { stroke-width: 2; stroke-dasharray: 10 10; }
          .qtm-drive-gear-outer { stroke-width: 3; }
          .qtm-drive-gear-detail { stroke-width: 1.25; }
        }

        @media (prefers-reduced-motion: reduce) {
          .qtm-drive-gear-ring,
          .qtm-drive-belt-motion {
            animation-play-state: paused;
          }
        }
      `}</style>
      <svg id="drive" viewBox="0 0 820 520" role="img" aria-labelledby="drive-title drive-desc">
        <title id="drive-title">MegaPartner and QTM belt drive</title>
        <desc id="drive-desc">A large MegaPartner gear at the top left and a smaller QTM gear at the bottom right, connected by two moving tangent belt runs. Both center images remain upright while their gear rings rotate clockwise.</desc>

        <defs>
          <clipPath id="mega-image-clip">
            <circle cx="245" cy="180" r="116" />
          </clipPath>
          <clipPath id="q-image-clip">
            <circle cx="630" cy="390" r="55" />
          </clipPath>
        </defs>

        <g id="belt" aria-hidden="true">
          {runs.map((d) => (
            <g key={d}>
              <path className="qtm-drive-belt-base" d={d} />
              <path className="qtm-drive-belt-motion" d={d} />
            </g>
          ))}
        </g>
        <GearRing id="big-gear" gear={BIG} />
        <GearRing id="small-gear" gear={SMALL} />

        <image
          className="qtm-drive-static-image qtm-drive-mega-image"
          href="/assets/megapartner-badge.webp"
          x="129"
          y="64"
          width="232"
          height="232"
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#mega-image-clip)"
        />
        <image
          className="qtm-drive-static-image"
          href="/assets/qtm-q-logo.png"
          x="575"
          y="335"
          width="110"
          height="110"
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#q-image-clip)"
        />
      </svg>
    </main>
  );
}
