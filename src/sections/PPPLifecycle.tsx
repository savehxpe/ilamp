import { useState } from 'react';
import { ThemeColors } from '../data/copy';

interface PPPLifecycleProps {
  theme: ThemeColors;
}

interface Stage {
  number: string;
  title: string;
  label: string;
  image: string;
  signal: string;
  detail: string;
}

const stages: Stage[] = [
  {
    number: '01',
    title: 'Introduction',
    label: 'Nigeria map activation',
    image: '/images/ppp-lifecycle/stage-01-introduction.png',
    signal: 'Mandate signal',
    detail: 'A glowing iLamp node appears on the Nigeria infrastructure map as the first distributed AI data center anchor.',
  },
  {
    number: '02',
    title: 'Feasibility',
    label: 'Compute demand model',
    image: '/images/ppp-lifecycle/stage-02-feasibility.png',
    signal: 'Edge yield model',
    detail: 'Edge AI, public connectivity, energy autonomy, and municipal data demand are modeled before contract formation.',
  },
  {
    number: '03',
    title: 'Term Sheet',
    label: 'Revenue stack design',
    image: '/images/ppp-lifecycle/stage-03-term-sheet.png',
    signal: 'Bankable streams',
    detail: 'Compute, ads, WiFi, analytics, and data licensing streams are structured into a bankable concession package.',
  },
  {
    number: '04',
    title: 'MOU',
    label: 'Blueprint handshake',
    image: '/images/ppp-lifecycle/stage-04-mou.png',
    signal: 'Sovereign data rights',
    detail: 'The public-private mandate is formalized around a deployable iLamp blueprint and sovereign data rights.',
  },
  {
    number: '05',
    title: 'SPV Setup',
    label: 'Governance vehicle',
    image: '/images/ppp-lifecycle/stage-05-spv-setup.png',
    signal: 'PPP control layer',
    detail: 'A project vehicle connects government, operators, investors, and infrastructure revenue into one accountable system.',
  },
  {
    number: '06',
    title: 'Green Utility',
    label: 'Debt-light framework',
    image: '/images/ppp-lifecycle/stage-06-green-utility.png',
    signal: 'Senegal IaaS frame',
    detail: 'Senegal Green Utility financing converts the network into Infrastructure as a Service instead of sovereign debt.',
  },
  {
    number: '07',
    title: 'Deployment',
    label: 'Autonomous rollout',
    image: '/images/ppp-lifecycle/stage-07-deployment.png',
    signal: 'Revenue from day one',
    detail: 'Nodes are deployed as smart city infrastructure with compute, energy, sensors, and communications online from day one.',
  },
  {
    number: '08',
    title: 'Financial Close',
    label: 'Green Bond pulse',
    image: '/images/ppp-lifecycle/stage-08-financial-close.png',
    signal: 'Yield grid close',
    detail: 'A Green Bond pulse moves through the operating grid, converting deployed infrastructure into long-duration yield.',
  },
];

function TechnicalFallback({ number, title }: Pick<Stage, 'number' | 'title'>) {
  return (
    <div className="stage-fallback" aria-hidden="true">
      <svg viewBox="0 0 640 420" role="img" className="stage-fallback-svg">
        <defs>
          <linearGradient id={`stage-line-${number}`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#00d4ff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#8ff6ff" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <path d="M70 300 L190 230 L310 300 L430 230 L570 300" fill="none" stroke={`url(#stage-line-${number})`} strokeWidth="2" />
        <path d="M190 230 L190 128 L310 198 L310 300" fill="none" stroke="rgba(255,255,255,0.36)" strokeWidth="1" />
        <path d="M310 198 L430 128 L430 230" fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth="1" />
        <circle cx="190" cy="128" r="28" fill="rgba(0,212,255,0.12)" stroke="#00d4ff" strokeWidth="2" />
        <circle cx="430" cy="128" r="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.5)" />
        <rect x="260" y="178" width="100" height="58" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.28)" />
        <text x="42" y="62" fill="#ffffff" fontSize="42" fontFamily="Georgia, serif">{number}</text>
        <text x="42" y="94" fill="#d7dde4" fontSize="16" fontFamily="system-ui, sans-serif">{title}</text>
      </svg>
    </div>
  );
}

function StageVisual({ stage }: { stage: Stage }) {
  const [failed, setFailed] = useState(false);

  return (
      <div className="stage-visual">
        <TechnicalFallback number={stage.number} title={stage.title} />
      {!failed && (
        <img
          src={stage.image}
          alt={`${stage.title}: ${stage.detail}`}
          className="stage-image"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      <div className="stage-visual-caption">
        <span>{stage.signal}</span>
      </div>
      <div className="stage-scanline" aria-hidden="true" />
      <div className="stage-node-overlay" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export function PPPLifecycle({ theme: { accentColor, mutedColor, borderColor, textColor } }: PPPLifecycleProps) {
  return (
    <section className="py-[clamp(100px,15vh,200px)] relative overflow-hidden">
      <div className="greedy-grid-plane" aria-hidden="true" />
      <div className="mx-auto max-w-[1180px] px-6 relative">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
          <div className="max-w-[760px]">
            <p className="font-body text-xs tracking-[0.22em] uppercase mb-5" style={{ color: accentColor }}>
              8-stage PPP lifecycle
            </p>
            <h2 className="font-heading text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.08] font-bold mb-5 text-balance" style={{ color: textColor }}>
              From sovereign mandate to green-bond financial close.
            </h2>
            <p className="font-body text-lg leading-relaxed" style={{ color: mutedColor }}>
              Each stage pairs GPT Image 2 generated concept art with procedural code-rendered engineering overlays, keeping the lifecycle visible even if image assets are unavailable.
            </p>
          </div>
          <div className="ppp-summary-panel" style={{ borderColor }}>
            <span className="font-body text-[10px] uppercase tracking-[0.22em]" style={{ color: mutedColor }}>
              Strategic alignment
            </span>
            <p className="font-heading text-2xl font-bold mt-2" style={{ color: textColor }}>
              Nigeria revenue base + Senegal IaaS expansion
            </p>
            <p className="ppp-summary-copy">
              Current assets remain as the visual proof layer; the surrounding interface now clarifies the PPP mechanics for investors, governments, and answer engines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {stages.map((stage) => (
            <article key={stage.number} className="ppp-stage-shell" style={{ borderColor }}>
              <div className="ppp-stage-core">
                <StageVisual stage={stage} />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="stage-number">{stage.number}</span>
                    <span className="stage-label">{stage.label}</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold mb-3" style={{ color: textColor }}>
                    {stage.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: mutedColor }}>
                    {stage.detail}
                  </p>
                  <div className="stage-signal-row">
                    <span>Technical graphic</span>
                    <strong>{stage.signal}</strong>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
