import { ThemeColors } from '../data/copy';

interface HeroProps {
  theme: ThemeColors;
  loaded: boolean;
}

const proofLogos = [
  { name: 'NVIDIA', role: 'Processing Power', src: '/logos/Nvidia_logo.png' },
  { name: 'BBC', role: 'Global Recognition', src: '/logos/bbc.png' },
  { name: 'AIBase Nig', role: 'Regional Tech Authority', src: '/logos/aibase.png' },
  { name: 'Conflow Power Group', role: 'Power Infrastructure', src: '/logos/conflow-logo-png.png' },
  { name: 'Katsina State Government', role: '50,000-unit Nigeria signing', src: '/logos/katsina.png' },
];

export function Hero({ theme: { accentColor, mutedColor }, loaded }: HeroProps) {
  const carouselItems = [...proofLogos, ...proofLogos];

  return (
    <section className="py-[clamp(120px,18vh,220px)] text-center relative overflow-hidden">
      <div className="mx-auto max-w-[800px] px-6">
        <p
          className="font-body text-sm tracking-[0.2em] uppercase mb-8 animate-fade-in opacity-0"
          style={{ color: accentColor, animationDelay: '0.2s' }}
        >
          Autonomous AI Data Center Network
        </p>
        <h1
          className={`font-heading text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.05] font-bold mb-6 animate-fade-in opacity-0 text-balance ${loaded ? '' : 'animate-flicker'}`}
          style={{ animationDelay: '0.4s' }}
        >
          Building the World's First<br />Distributed Autonomous AI<br />Data Center Network.
        </h1>
        <p
          className="font-body text-[clamp(1.05rem,1.6vw,1.3rem)] leading-relaxed mb-10 animate-fade-in opacity-0"
          style={{ color: mutedColor, animationDelay: '0.6s' }}
        >
          Transforming 350 million cost-centers into revenue-generating AI nodes. No grid. No debt. Total data sovereignty.
        </p>
        <div
          className="flex flex-wrap gap-4 justify-center items-center animate-fade-in opacity-0"
          style={{ animationDelay: '0.8s' }}
        >
          <span className="font-heading text-[clamp(2rem,4vw,3.2rem)] font-bold" style={{ color: accentColor }}>
            67 TOPS
          </span>
          <span className="font-body text-sm tracking-wider uppercase" style={{ color: mutedColor }}>
            edge AI per node
          </span>
          <span className="w-px h-8" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <span className="font-heading text-[clamp(1.5rem,3vw,2.2rem)] font-bold" style={{ color: accentColor }}>
            10kWh
          </span>
          <span className="font-body text-sm tracking-wider uppercase" style={{ color: mutedColor }}>
            solar storage
          </span>
        </div>
      </div>

      <div
        className="proof-carousel-shell mx-auto mt-20 w-[min(1120px,calc(100%-32px))] animate-fade-in opacity-0"
        style={{ animationDelay: '1s' }}
        aria-label="Proof of concept partner and recognition carousel"
      >
        <div className="proof-carousel-core">
          <div className="proof-carousel-header">
            <p className="proof-carousel-kicker" style={{ color: mutedColor }}>
              Proof of concept signal
            </p>
            <p className="proof-carousel-claim">
              Recognition, compute, regional authority, power infrastructure, and the 50,000-unit Katsina signing in one operating loop.
            </p>
          </div>
          <div className="proof-carousel-track" aria-hidden="true">
            {carouselItems.map((logo, index) => (
              <div className="proof-logo-card" key={`${logo.name}-${index}`}>
                <img src={logo.src} alt="" className="proof-logo-img" loading="lazy" />
                <span className="proof-logo-name">{logo.name}</span>
                <span className="proof-logo-role">{logo.role}</span>
              </div>
            ))}
          </div>
          <ul className="sr-only">
            {proofLogos.map((logo) => (
              <li key={logo.name}>{logo.name}: {logo.role}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
