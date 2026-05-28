import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import * as XLSX from 'xlsx';

// Lazy load Spline for excellent rendering performance
const Spline = lazy(() => import('@splinetool/react-spline'));
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type PillarId = 'energy' | 'compute' | 'structure' | 'finance' | 'operations';
type UseCaseId = 'municipalities' | 'retail' | 'mining' | 'security';
type ScenarioId = 'conservative' | 'base' | 'aggressive';

type Pillar = {
  id: PillarId;
  title: string;
  metric: string;
  detail: string;
  color: string;
};

type MasterStep = {
  id: string;
  pillarId: PillarId;
  kicker: string;
  title: string;
  narrative: string;
  metric: string;
  visual: string;
  before: string;
  after: string;
  color: string;
};

type RevenueStream = {
  id: string;
  label: string;
  annualLow: number;
  annualHigh: number;
  painSolved: string;
  note?: string;
};

type PainPoint = {
  title: string;
  pressure: string;
  solvedBy: PillarId;
};

type UseCase = {
  id: UseCaseId;
  label: string;
  market: string;
  title: string;
  focus: string;
  deployment: string;
  imagery: string;
  payoff: string;
};

type TechModule = {
  title: string;
  metric: string;
  detail: string;
};

type LicenseTier = {
  label: string;
  scope: string;
  strategy: string;
};

type LicenseMarket = {
  market: string;
  corridor: string;
  status: string;
};

type DigitalTwinLayer = {
  layer: string;
  title: string;
  visibility: string;
  decisionValue: string;
};

type PhysicalModule = {
  label: string;
  metric: string;
  description: string;
};

type HardwareAuditItem = {
  category: string;
  item: string;
  costLow: number | string;
  costHigh: number | string;
  notes: string;
};

const pillars: Pillar[] = [
  {
    id: 'energy',
    title: 'Energy Autonomy',
    metric: '400W solar + 10kWh battery',
    detail: '100% autonomous off-grid operation with grid-tie export capability and 3,500-5,200 kWh of renewable generation per year.',
    color: '#36f6a7',
  },
  {
    id: 'compute',
    title: 'Computational Autonomy',
    metric: 'NVIDIA Jetson up to 67 TOPS @ 15W',
    detail: 'Jetson Orin Nano runs computer vision, security, and environmental inference at the edge without cloud dependence.',
    color: '#3dd6ff',
  },
  {
    id: 'structure',
    title: 'Structural Autonomy',
    metric: 'Borosilicate glass tube shield',
    detail: 'A super-durable borosilicate enclosure protects AI and sensors from sand, wind, and harsh environmental exposure.',
    color: '#f7d774',
  },
  {
    id: 'finance',
    title: 'Financial Autonomy',
    metric: '$12.5k-$26.25k annual revenue',
    detail: 'Infrastructure-as-profit economics layer compute, connectivity, advertising, analytics, and security yield onto one asset.',
    color: '#6dffef',
  },
  {
    id: 'operations',
    title: 'Operational Autonomy',
    metric: 'Remote self-management',
    detail: 'Remote monitoring, predictive maintenance, and fleet observability reduce truck rolls and keep deployments manageable at scale.',
    color: '#9f7cff',
  },
];

const revenueStreams: RevenueStream[] = [
  { id: 'gpu', label: 'GPU Edge Computing', annualLow: 4500, annualHigh: 4500, painSolved: 'Unused edge compute capacity' },
  { id: 'wifi', label: 'WiFi 6 Services', annualLow: 500, annualHigh: 1000, painSolved: 'Community connectivity gaps' },
  { id: 'ads', label: 'Digital Advertising', annualLow: 750, annualHigh: 1875, painSolved: 'No street-level media revenue' },
  { id: 'data', label: 'Data & Analytics', annualLow: 2000, annualHigh: 6000, painSolved: 'Traffic and environmental data left unmonetized', note: 'Source lists $2,000-$6,000+; model caps the verified range at $6,000.' },
  { id: 'security', label: 'Security Analytics', annualLow: 1000, annualHigh: 2000, painSolved: 'Safety monitoring without revenue recovery' },
];

const painPoints: PainPoint[] = [
  { title: 'Grid dependency', pressure: 'Outages and utility inflation turn lighting into a fragile liability.', solvedBy: 'energy' },
  { title: 'Cloud-dependent AI', pressure: 'Latency, privacy exposure, and connectivity costs block real-time intelligence.', solvedBy: 'compute' },
  { title: 'Civil works drag', pressure: 'Trenching, permits, and cabling slow rollout and inflate capex.', solvedBy: 'structure' },
  { title: 'Zero direct revenue', pressure: 'Legacy poles consume budget without creating income streams.', solvedBy: 'finance' },
  { title: 'Maintenance blind spots', pressure: 'Reactive truck rolls keep teams guessing and extend downtime.', solvedBy: 'operations' },
];

const masterSteps: MasterStep[] = [
  {
    id: 'cost-center-collapse',
    pillarId: 'structure',
    kicker: 'Master Step 01 / Infrastructure reframing',
    title: 'Reposition the pole from public utility expense to autonomous infrastructure.',
    narrative:
      'The story opens by removing the idea that iLamp is a lighting product. Legacy poles consume capex, expose operators to outages, and generate no direct cash flow. iLamp enters as revenue-bearing infrastructure with a hardened chassis and no trench-first dependency.',
    metric: 'Infrastructure that targets 2-4 year payback',
    visual: 'Amber liability curve, muted city grid, hardened Y-frame emerging from the base',
    before: 'Traditional poles remain a recurring cost center.',
    after: 'iLamp begins as a deployable infrastructure asset with financial purpose.',
    color: '#ffb84d',
  },
  {
    id: 'energy-spine',
    pillarId: 'energy',
    kicker: 'Master Step 02 / Energy autonomy',
    title: 'Switch on the solar sleeve, storage spine, and grid-tie export logic.',
    narrative:
      'A 400W solar sleeve and 10kWh battery let the node operate as a 100% autonomous off-grid asset, while retaining grid-tie capability to sell excess power back to the utility when the site supports export.',
    metric: '400W solar + 10kWh battery',
    visual: 'Green solar sleeve, battery reserve rings, export pulse back to the grid edge',
    before: 'Grid dependency makes the pole brittle and non-earning.',
    after: 'Autonomous generation keeps the node online and enables surplus energy monetization.',
    color: '#36f6a7',
  },
  {
    id: 'edge-ai-core',
    pillarId: 'compute',
    kicker: 'Master Step 03 / Local intelligence',
    title: 'Deploy a Jetson Orin Nano edge core that runs up to 67 TOPS at 15 Watts.',
    narrative:
      'The NVIDIA Jetson Orin Nano processes up to 67 TOPS of AI inference at the edge using only 15 Watts. Vision, safety, and environmental workloads stay local, reducing latency, bandwidth cost, and privacy risk.',
    metric: 'Up to 67 TOPS edge AI @ 15W',
    visual: 'Cyan compute cube, 360-degree 4K camera arcs, low-latency edge signal paths',
    before: 'Cloud-first AI adds cost, lag, and failure points.',
    after: 'Local inference enables real-time autonomous response.',
    color: '#3dd6ff',
  },
  {
    id: 'revenue-stack',
    pillarId: 'finance',
    kicker: 'Master Step 04 / Profit center',
    title: 'Turn one node into a multi-tenant revenue engine.',
    narrative:
      'GPU edge computing, WiFi 6 services, digital advertising, data and analytics, and security analytics convert the asset from a passive fixture into infrastructure that is built to pay for itself in 2-4 years and then compound cash flow.',
    metric: '$12.5k-$26.25k annual revenue / unit',
    visual: 'Revenue bars orbiting the pole, green profit ramp, audited cash-flow overlays',
    before: 'Legacy poles have no direct monetization layer.',
    after: 'Every deployed unit compounds recurring income.',
    color: '#6dffef',
  },
  {
    id: 'fleet-autopilot',
    pillarId: 'operations',
    kicker: 'Master Step 05 / Autonomous fleet ops',
    title: 'Scale into a self-managing infrastructure network.',
    narrative:
      '5G/LTE backhaul, WiFi 6 hotspots, LoRaWAN sensor networking, remote monitoring, and predictive maintenance create an operating system for distributed infrastructure that can be supervised centrally and scaled globally from local pilots.',
    metric: 'Remote self-management + connectivity hub',
    visual: 'Violet command halo, fleet mesh, LoRaWAN sweeps, remote command plane',
    before: 'Reactive maintenance hides risk until assets fail.',
    after: 'Self-managing AI turns operations into a visible control plane.',
    color: '#9f7cff',
  },
];

const useCases: UseCase[] = [
  {
    id: 'municipalities',
    label: 'Municipalities',
    market: 'Smart Cities',
    title: 'Modernize public infrastructure without treating it like a tax burden.',
    focus: 'Smart-city deployments gain renewable power, public connectivity, safety analytics, and auditable operating data in a single pole footprint.',
    deployment: 'Downtown corridors, civic plazas, public housing, transit routes, and climate-vulnerable districts.',
    imagery: 'Y-shaped dual lamp geometry, 360-degree 4K camera arrays, and a solar sleeve that reads like civic infrastructure rather than street furniture.',
    payoff: 'A local pilot becomes the template for broader smart-city rollout: go local to go global.',
  },
  {
    id: 'retail',
    label: 'Retail',
    market: 'Lidl / Supermarkets',
    title: 'Upgrade parking lots into revenue, safety, and customer-connectivity surfaces.',
    focus: 'Retail operators can combine lighting, site analytics, public WiFi 6, digital media, and security monitoring without adding separate hardware silos.',
    deployment: 'Parking lots, logistics yards, curbside pickup lanes, and high-traffic store perimeters.',
    imagery: 'A solar sleeve wrapped around a branded Y-configuration with camera coverage over vehicle rows and customer paths.',
    payoff: 'The node improves site safety while monetizing high-footfall retail surfaces.',
  },
  {
    id: 'mining',
    label: 'Mining / Remote Communities',
    market: 'Rural Africa',
    title: 'Bring autonomy where grid extension is slow, expensive, or unreliable.',
    focus: 'Remote communities and industrial sites gain renewable generation, edge AI, communications, and observability without waiting for full civil utility upgrades.',
    deployment: 'Mining camps, rural trading hubs, community squares, healthcare outposts, and remote logistics corridors.',
    imagery: 'A hardened borosilicate core, sand-resistant sensor enclosure, and long-range LoRaWAN coverage radiating across open terrain.',
    payoff: 'Local resilience creates the case for regional expansion and cross-border infrastructure programs.',
  },
  {
    id: 'security',
    label: 'Security',
    market: 'Border Patrol',
    title: 'Put local perception and autonomous uptime where coverage gaps create risk.',
    focus: 'Security operators gain 360-degree 4K visibility, edge analytics, autonomous power, and resilient comms even when cloud or fixed-line links are weak.',
    deployment: 'Borders, checkpoints, remote campuses, industrial perimeters, and high-value public assets.',
    imagery: 'Elevated dual lamps framing a full-surround camera stack with low-power AI sealed behind a borosilicate shield.',
    payoff: 'The value proposition is operational continuity, faster incident triage, and lower field-maintenance dependency.',
  },
];

const techModules: TechModule[] = [
  {
    title: 'AI Core',
    metric: 'NVIDIA Jetson Orin Nano, up to 67 TOPS @ 15W',
    detail: 'A mini data center inside the pole runs vision, environmental, and security inference directly at the edge so latency stays low and cloud dependency stays optional.',
  },
  {
    title: 'Connectivity Hub',
    metric: '5G/LTE backhaul + WiFi 6 + LoRaWAN',
    detail: 'Combines carrier-grade 5G/LTE backhaul, community WiFi 6 hotspots, and long-range IoT sensor networking in one edge node.',
  },
  {
    title: 'Structural Shield',
    metric: 'Borosilicate super-durable glass tube',
    detail: 'Protects the AI core and sensors from sand, wind, and harsh environmental conditions while preserving optical performance.',
  },
  {
    title: 'Energy Layer',
    metric: '400W solar sleeve + 10kWh battery',
    detail: 'Delivers autonomous operation, grid outage resilience, and renewable generation in the 3,500-5,200 kWh annual range.',
  },
];

const territoryTiers: LicenseTier[] = [
  {
    label: 'Country License',
    scope: 'National territory rights',
    strategy: 'Anchor a sovereign deployment partner, utility sponsor, or concessionaire.',
  },
  {
    label: 'Metro / Corridor License',
    scope: 'City, district, or transport corridor',
    strategy: 'Build repeatable smart-city clusters around civic, retail, or industrial demand.',
  },
  {
    label: 'Zip / Post Code License',
    scope: 'Block-level commercial exclusivity',
    strategy: 'Sell micro-territories to operators who want local control and fast deployment.',
  },
];

const licenseMarkets: LicenseMarket[] = [
  { market: 'Ghana', corridor: 'Public infrastructure and resilience', status: 'Recorded license market' },
  { market: 'Canada', corridor: 'Climate-safe municipal networks', status: 'Recorded license market' },
  { market: 'UAE', corridor: 'Premium smart district programs', status: 'Recorded license market' },
  { market: 'UK', corridor: 'Urban renewal and retail estates', status: 'Recorded license market' },
  { market: 'USA', corridor: 'Campus, city, and private estate pilots', status: 'Recorded license market' },
];

const digitalTwinLayers: DigitalTwinLayer[] = [
  {
    layer: 'Layer 01',
    title: 'Technical & Structural Visibility',
    visibility: 'Y-shaped dual lamp pole, borosilicate shield, 400W solar array, 10kWh battery, and Jetson Orin Nano mini data center.',
    decisionValue: 'Lets operators inspect what is physically deployed and why it survives sand, wind, and harsh atmospheres.',
  },
  {
    layer: 'Layer 02',
    title: 'Revenue & Financial Visibility',
    visibility: '$12.5k-$26.25k annual unit economics, itemized revenue streams, 10-unit pilot capex, and ROI horizon.',
    decisionValue: 'Reframes the pole from sunk infrastructure cost into a measurable profit center.',
  },
  {
    layer: 'Layer 03',
    title: 'Five Pillars of Autonomy',
    visibility: 'Energy, computational, structural, financial, and operational autonomy shown as operating pillars.',
    decisionValue: 'Turns engineering details into an executive operating model.',
  },
  {
    layer: 'Layer 04',
    title: 'Global Expansion Visibility',
    visibility: 'Territory licensing from country level down to zip/post code, backed by recorded GBP license sales.',
    decisionValue: 'Connects local pilot proof to global commercial replication.',
  },
  {
    layer: 'Layer 05',
    title: 'Interactive Reporting & Export',
    visibility: 'Excel profitability audit with BOM, labor, revenue, CO2, licensing, and forecast tabs.',
    decisionValue: 'Creates a board-ready audit trail that can travel with investors, municipalities, and licensees.',
  },
];

const physicalModules: PhysicalModule[] = [
  {
    label: 'Physical Unit',
    metric: 'Modular Y-shaped dual lamp pole',
    description: 'A foundation-only street asset with dual lighting arms, sensor visibility, and modular service access.',
  },
  {
    label: 'Structural Shield',
    metric: 'Borosilicate super-durable glass tube',
    description: 'Protects the core electronics from sand, wind, corrosion, and harsh atmospheric exposure.',
  },
  {
    label: 'Power Grid',
    metric: '400W solar + 10kWh lithium battery',
    description: 'Supports 3-5 days of autonomous operation with grid-tie options where sites can export power.',
  },
  {
    label: 'AI Brain',
    metric: 'Jetson Orin Nano, up to 67 TOPS @ 15W',
    description: 'A pole-mounted mini data center for local vision, safety, traffic, and environmental inference.',
  },
];

const hardwareAuditItems: HardwareAuditItem[] = [
  { category: 'Hardware', item: 'Complete iLamp unit hardware', costLow: 8000, costHigh: 15000, notes: 'Includes pole assembly, solar, battery, AI core, sensors, enclosure, and connectivity stack.' },
  { category: 'Labor', item: 'Installation crew', costLow: '2 technicians', costHigh: '4 technicians', notes: 'Foundation-only install model; no heavy grid trenching assumed.' },
  { category: 'Energy', item: 'Solar generation layer', costLow: '400W', costHigh: '400W', notes: 'High-efficiency solar panel configuration per unit.' },
  { category: 'Storage', item: 'Lithium battery reserve', costLow: '10kWh', costHigh: '10kWh', notes: 'Designed for 3-5 days of autonomous operation.' },
  { category: 'Compute', item: 'NVIDIA Jetson Orin Nano', costLow: '15W', costHigh: '67 TOPS', notes: 'Edge AI mini data center inside the pole.' },
  { category: 'Environment', item: 'Avoided emissions', costLow: '2.8 tons CO2', costHigh: '2.8 tons CO2', notes: 'Annual environmental impact per unit.' },
];

const sourceValidationNotes = [
  'The source revenue headline states $12.5k-$26.25k annual revenue per unit, but the explicitly itemized streams total $8.75k-$15.375k. Additional monetization lines or updated source figures are needed to reconcile the gap.',
  'The 2-4 year payback claim is preserved as a source-backed positioning statement. Hardware-only math can compress faster than 2 years, so installation, utilization ramp, financing, or other project costs should be confirmed in the source workbook.',
  'The 5-year revenue benchmark is available for Years 1-5. Intermediate unit counts are modeled as ramp targets between the supplied 500-unit Year 1 and 15,000-unit Year 5 endpoints.',
];

const benchmarkForecast = [
  { year: 1, benchmarkRevenue: 5_600_000, benchmarkUnits: 500 },
  { year: 2, benchmarkRevenue: 28_400_000, benchmarkUnits: 2500 },
  { year: 3, benchmarkRevenue: 66_200_000, benchmarkUnits: 6000 },
  { year: 4, benchmarkRevenue: 112_500_000, benchmarkUnits: 10000 },
  { year: 5, benchmarkRevenue: 168_800_000, benchmarkUnits: 15_000 },
];

const scenarios: Record<ScenarioId, { label: string; costMultiplier: number; revenueMultiplier: number; opex: number }> = {
  conservative: { label: 'Conservative', costMultiplier: 1.15, revenueMultiplier: 0.72, opex: 1900 },
  base: { label: 'Base', costMultiplier: 1, revenueMultiplier: 1, opex: 1300 },
  aggressive: { label: 'Aggressive', costMultiplier: 0.92, revenueMultiplier: 1.24, opex: 1000 },
};

const hardwareLow = 8000;
const hardwareHigh = 15000;
const revenueFloor = 12500;
const revenueCeiling = 26250;
const recordedLicenseSalesGBP = 400_000_000;
const traditionalAnnualCost = 2870;
const co2ReductionPerUnit = 2.8;
const kwhLowPerUnit = 3500;
const kwhHighPerUnit = 5200;
const pilotDeploymentUnits = 10;
const pilotInvestmentLow = 100000;
const pilotInvestmentHigh = 180000;
const sourcePaybackLow = 2;
const sourcePaybackHigh = 4;
const installationTechniciansLow = 2;
const installationTechniciansHigh = 4;

const partnerLogos = [
  { name: 'NVIDIA', role: 'AI Technology Provider', src: '/logos/Nvidia_logo.png' },
  { name: 'BBC', role: 'Global Media Coverage', src: '/logos/bbc.png' },
  { name: 'AIBase Nig', role: 'Regional Tech Authority', src: '/logos/aibase.png' },
  { name: 'Conflow Power Group', role: 'Global Licensor', src: '/logos/conflow-logo-png.png' },
  { name: 'Katsina State Government', role: '50,000-unit installed base', src: '/logos/katsina.png' },
  { name: 'Republic of Senegal', role: '175,000-unit strategic proposal' },
];

const articleHub = [
  {
    kicker: 'Distributed AI Infrastructure',
    title: 'Nigeria: Scaling to 13.75 PetaOPS of Distributed Compute',
    metric: '50,000 iLamps as sovereign edge nodes',
    summary:
      'Nigeria becomes the proof base for iLamp as distributed AI infrastructure: every installed unit combines 67 TOPS edge computing, renewable autonomy, local sensing, and revenue services inside a street-level sovereign data center.',
  },
  {
    kicker: 'Sovereign Data Centers',
    title: 'Senegal Vision 2050: Implementing 48.1 ExaOPS of Sovereign AI',
    metric: '175,000-node Infrastructure-as-a-Service proposal',
    summary:
      'Senegal is framed as a Green Utility PPP and sovereign data center network, using Infrastructure-as-a-Service economics to scale autonomous smart city infrastructure without converting the rollout into direct sovereign debt.',
  },
];

const pppStages = [
  { stage: '01', title: 'Identification', image: '/images/ppp-lifecycle/stage-01-introduction.png', detail: 'Map the sovereign corridor, demand center, installed-base economics, and local operating partner.' },
  { stage: '02', title: 'Feasibility', image: '/images/ppp-lifecycle/stage-02-feasibility.png', detail: 'Model power autonomy, 67 TOPS edge workloads, municipal data demand, and site-level capex.' },
  { stage: '03', title: 'Term Sheet', image: '/images/ppp-lifecycle/stage-03-term-sheet.png', detail: 'Convert compute, WiFi, advertising, analytics, and safety services into a bankable revenue stack.' },
  { stage: '04', title: 'MOU', image: '/images/ppp-lifecycle/stage-04-mou.png', detail: 'Formalize public-private alignment, sovereign data rights, deployment access, and operating mandate.' },
  { stage: '05', title: 'SPV Setup', image: '/images/ppp-lifecycle/stage-05-spv-setup.png', detail: 'Create the project vehicle connecting government, licensor, EPC, operator, and capital partners.' },
  { stage: '06', title: 'Green Utility', image: '/images/ppp-lifecycle/stage-06-green-utility.png', detail: 'Package the network as Green Utility infrastructure with climate, data, energy, and civic service value.' },
  { stage: '07', title: 'Deployment', image: '/images/ppp-lifecycle/stage-07-deployment.png', detail: 'Install nodes as autonomous smart city infrastructure with local compute and revenue services online.' },
  { stage: '08', title: 'Financial Close', image: '/images/ppp-lifecycle/stage-08-financial-close.png', detail: 'Close long-duration capital around operating infrastructure and Green Bond-style yield mechanics.' },
];

const bootSteps = [
  'Loading iLamp background media...',
  'Calibrating Living Grid geometry...',
  'Activating NVIDIA Jetson data pulse...',
  'Restoring sovereign infrastructure map...',
];

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const gbpCompact = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  notation: 'compact',
  maximumFractionDigits: 1,
});

function formatCurrency(value: number) {
  return currency.format(value);
}

function formatCompact(value: number) {
  return compactCurrency.format(value);
}

function formatGBP(value: number) {
  return gbpCompact.format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

function interpolate(min: number, max: number, mix: number) {
  return min + (max - min) * mix;
}

function formatCurrencyRange(low: number, high: number) {
  if (low === high) return formatCurrency(low);
  return `${formatCurrency(low)}-${formatCurrency(high)}`;
}

function getPillar(id: PillarId) {
  return pillars.find((pillar) => pillar.id === id) ?? pillars[0];
}

function App() {
  const [unitCount, setUnitCount] = useState(250);
  const [scenarioId, setScenarioId] = useState<ScenarioId>('base');
  const [activeStreams, setActiveStreams] = useState<string[]>(['gpu', 'wifi', 'ads', 'data', 'security']);
  const [selectedPillar, setSelectedPillar] = useState<PillarId>('finance');
  const [comparisonMix, setComparisonMix] = useState(72);
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [activeMasterStep, setActiveMasterStep] = useState(0);
  const [viewMode, setViewMode] = useState<'r3f' | 'spline'>('r3f');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max <= 0 ? 0 : Math.min(window.scrollY / max, 1));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const scenario = scenarios[scenarioId];
  const selected = getPillar(selectedPillar);
  const scenarioMix = scenarioId === 'conservative' ? 0 : scenarioId === 'base' ? 0.5 : 1;
  const enabledStreams = revenueStreams.filter((stream) => activeStreams.includes(stream.id));
  const itemizedRevenueLow = enabledStreams.reduce((sum, stream) => sum + stream.annualLow, 0);
  const itemizedRevenueHigh = enabledStreams.reduce((sum, stream) => sum + stream.annualHigh, 0);
  const allItemizedRevenueLow = revenueStreams.reduce((sum, stream) => sum + stream.annualLow, 0);
  const allItemizedRevenueHigh = revenueStreams.reduce((sum, stream) => sum + stream.annualHigh, 0);
  const itemizedRevenueMidpoint = interpolate(itemizedRevenueLow, itemizedRevenueHigh, scenarioMix);
  const fullItemizedRevenueMidpoint = interpolate(allItemizedRevenueLow, allItemizedRevenueHigh, scenarioMix);
  const monetizationCoverage = fullItemizedRevenueMidpoint === 0 ? 0 : itemizedRevenueMidpoint / fullItemizedRevenueMidpoint;
  const activeRevenue = enabledStreams
    .filter((stream) => activeStreams.includes(stream.id))
    .reduce((sum, stream) => sum + interpolate(stream.annualLow, stream.annualHigh, scenarioMix), 0);
  const modeledRevenueLow = revenueFloor * monetizationCoverage;
  const modeledRevenueHigh = revenueCeiling * monetizationCoverage;
  const annualRevenuePerUnit = interpolate(modeledRevenueLow, modeledRevenueHigh, scenarioMix) * scenario.revenueMultiplier;
  const hardwareCost = ((hardwareLow + hardwareHigh) / 2) * scenario.costMultiplier;
  const annualNetPerUnit = annualRevenuePerUnit - scenario.opex;
  const modeledHardwarePaybackYears = hardwareCost / Math.max(annualNetPerUnit, 1);
  const fleetAnnualRevenue = annualRevenuePerUnit * unitCount;
  const fleetCapex = hardwareCost * unitCount;
  const fiveYearProfit = annualNetPerUnit * unitCount * 5 - fleetCapex;
  const co2Reduction = co2ReductionPerUnit * unitCount;
  const kwhLow = kwhLowPerUnit * unitCount;
  const kwhHigh = kwhHighPerUnit * unitCount;
  const itemizedRevenueGapLow = Math.max(0, revenueFloor - itemizedRevenueLow);
  const itemizedRevenueGapHigh = Math.max(0, revenueCeiling - itemizedRevenueHigh);
  const useCase = useCases[activeUseCase] ?? useCases[0];

  const comparisonData = Array.from({ length: 6 }, (_, year) => {
    const traditional = -traditionalAnnualCost * unitCount * year;
    const ilamp = annualNetPerUnit * unitCount * year - fleetCapex;
    return {
      year: `Y${year}`,
      traditional,
      ilamp,
      delta: ilamp - traditional,
    };
  });

  const scalingData = benchmarkForecast.map((item) => {
    const benchmarkScaledRevenue = item.benchmarkRevenue;
    const activeRevenueScaled = annualRevenuePerUnit * unitCount * item.year;
    const revenue = item.year === 1 ? Math.max(benchmarkScaledRevenue, activeRevenueScaled) : benchmarkScaledRevenue;
    const cumulativeCost = fleetCapex + scenario.opex * unitCount * item.year;
    return {
      year: `Year ${item.year}`,
      units: item.benchmarkUnits,
      revenue,
      cumulative: revenue,
      profit: revenue - cumulativeCost,
      status: item.year === 1 || item.year === 5 ? 'Source supplied endpoint' : 'Modeled ramp target',
    };
  });

  const exportAudit = () => {
    const profitabilityAudit = [
      ['Category', 'Item', 'Value', 'Notes'],
      ['Scenario', 'Selected case', scenario.label, 'Coverage-adjusted planning model'],
      ['Deployment', 'Units deployed', unitCount, 'Current slider selection'],
      ['Deployment', 'Starter deployment', `${pilotDeploymentUnits} units`, 'Pilot size for local validation'],
      ['Deployment', 'Pilot investment', formatCurrencyRange(pilotInvestmentLow, pilotInvestmentHigh), 'Starter deployment capital requirement'],
      ['Hardware', 'Low hardware cost', hardwareLow, 'Per-unit estimate'],
      ['Hardware', 'High hardware cost', hardwareHigh, 'Per-unit estimate'],
      ['Hardware', 'Installation labor', `${installationTechniciansLow}-${installationTechniciansHigh} technicians`, 'On-site crew requirement per unit'],
      ['Hardware', 'Scenario hardware cost', hardwareCost, scenario.label],
      ['Revenue', 'Source headline floor', revenueFloor, 'Per unit per year'],
      ['Revenue', 'Source headline ceiling', revenueCeiling, 'Per unit per year'],
      ['Revenue', 'Itemized verified low', itemizedRevenueLow, 'Enabled monetization streams only'],
      ['Revenue', 'Itemized verified high', itemizedRevenueHigh, 'Enabled monetization streams only'],
      ['Revenue', 'Coverage-adjusted modeled revenue', annualRevenuePerUnit, 'Scenario-weighted planning output'],
      ['Expansion', 'Recorded license sales', formatGBP(recordedLicenseSalesGBP), 'License balance sheet total across active markets'],
      ['Expansion', 'Territory ladder', 'Country > metro/corridor > zip/post code', 'Local-to-global licensing structure'],
      ...revenueStreams.map((stream) => [
        'Revenue Stream',
        stream.label,
        activeStreams.includes(stream.id) ? formatCurrencyRange(stream.annualLow, stream.annualHigh) : '$0',
        activeStreams.includes(stream.id)
          ? stream.note ?? 'Enabled in current model'
          : 'Disabled in current model',
      ]),
      ['ROI', 'Source payback claim', `${sourcePaybackLow}-${sourcePaybackHigh} years`, 'Positioning claim from source prompt'],
      ['ROI', 'Modeled hardware payback', modeledHardwarePaybackYears, 'Hardware cost divided by annual net per unit'],
      ['ROI', '5-year fleet profit', fiveYearProfit, 'Net revenue less capex'],
      ['Audit', 'Revenue reconciliation gap low', itemizedRevenueGapLow, 'Gap between source revenue floor and itemized low'],
      ['Audit', 'Revenue reconciliation gap high', itemizedRevenueGapHigh, 'Gap between source revenue ceiling and itemized high'],
    ];

    const socialImpact = [
      ['Metric', 'Per Unit', 'Fleet Total', 'Notes'],
      ['CO2 reduction tons', co2ReductionPerUnit, co2Reduction, 'Annual estimated avoided emissions'],
      ['Energy generation low kWh', kwhLowPerUnit, kwhLow, 'Annual lower-bound generation'],
      ['Energy generation high kWh', kwhHighPerUnit, kwhHigh, 'Annual upper-bound generation'],
      ['Community connectivity', 'WiFi 6 hotspot', unitCount, 'One public access node per unit'],
      ['Sensor network', 'LoRaWAN enabled', unitCount, 'Long-range IoT coverage per unit'],
      ['Operational autonomy', 'Remote self-management', unitCount, 'Fleet observable from a central command layer'],
    ];

    const licenseBalanceSheet = [
      ['Market', 'Corridor', 'Status'],
      ...licenseMarkets.map((license) => [license.market, license.corridor, license.status]),
      ['Recorded license sales', '', formatGBP(recordedLicenseSalesGBP)],
    ];

    const hardwareBillOfMaterials = [
      ['Category', 'Item', 'Low / Spec', 'High / Spec', 'Notes'],
      ...hardwareAuditItems.map((item) => [item.category, item.item, item.costLow, item.costHigh, item.notes]),
    ];

    const physicalUnitAudit = [
      ['Module', 'Metric', 'Description'],
      ...physicalModules.map((module) => [module.label, module.metric, module.description]),
    ];

    const revenueBreakdown = [
      ['Revenue Stream', 'Annual Low', 'Annual High', 'Enabled', 'Notes'],
      ...revenueStreams.map((stream) => [
        stream.label,
        stream.annualLow,
        stream.annualHigh,
        activeStreams.includes(stream.id) ? 'Yes' : 'No',
        stream.note ?? stream.painSolved,
      ]),
      ['Headline revenue range', revenueFloor, revenueCeiling, 'Model baseline', 'Source headline per unit per year'],
      ['Itemized active total', itemizedRevenueLow, itemizedRevenueHigh, 'Current toggles', 'Enabled streams only'],
      ['Reconciliation gap', itemizedRevenueGapLow, itemizedRevenueGapHigh, 'Audit flag', 'Gap between itemized stream total and source headline'],
    ];

    const autonomyPillarAudit = [
      ['Pillar', 'Metric', 'Operational Detail'],
      ...pillars.map((pillar) => [pillar.title, pillar.metric, pillar.detail]),
    ];

    const digitalTwinAudit = [
      ['Layer', 'Title', 'Visibility', 'Decision Value'],
      ...digitalTwinLayers.map((layer) => [layer.layer, layer.title, layer.visibility, layer.decisionValue]),
    ];

    const executiveSummary = [
      ['Metric', 'Value', 'Notes'],
      ['Recorded license sales', formatGBP(recordedLicenseSalesGBP), 'Already booked across active markets'],
      ['Source revenue per unit', formatCurrencyRange(revenueFloor, revenueCeiling), 'Annual headline range'],
      ['Hardware cost per unit', formatCurrencyRange(hardwareLow, hardwareHigh), 'Itemized build cost'],
      ['Installation labor', `${installationTechniciansLow}-${installationTechniciansHigh} technicians`, 'Crew requirement for deployment'],
      ['Annual CO2 impact', `${co2ReductionPerUnit} tons saved per unit`, 'Environmental efficiency metric'],
      ['Starter deployment', `${pilotDeploymentUnits} units`, 'Recommended pilot size'],
      ['Projected pilot investment', formatCurrencyRange(pilotInvestmentLow, pilotInvestmentHigh), '10-unit deployment range'],
    ];

    const scalingForecast = [
      ['Year', 'Units', 'Annual Revenue', 'Cumulative Revenue', 'Profit', 'Status'],
      ...scalingData.map((row, index) => [index + 1, row.units, row.revenue, row.cumulative, row.profit, row.status]),
    ];

    const workbook = XLSX.utils.book_new();
    const executiveSheet = XLSX.utils.aoa_to_sheet(executiveSummary);
    const unitSheet = XLSX.utils.aoa_to_sheet(profitabilityAudit);
    const socialImpactSheet = XLSX.utils.aoa_to_sheet(socialImpact);
    const forecastSheet = XLSX.utils.aoa_to_sheet(scalingForecast);
    const licenseSheet = XLSX.utils.aoa_to_sheet(licenseBalanceSheet);
    const hardwareSheet = XLSX.utils.aoa_to_sheet(hardwareBillOfMaterials);
    const physicalSheet = XLSX.utils.aoa_to_sheet(physicalUnitAudit);
    const revenueSheet = XLSX.utils.aoa_to_sheet(revenueBreakdown);
    const pillarSheet = XLSX.utils.aoa_to_sheet(autonomyPillarAudit);
    const twinSheet = XLSX.utils.aoa_to_sheet(digitalTwinAudit);

    executiveSheet['!cols'] = [{ wch: 26 }, { wch: 22 }, { wch: 42 }];
    unitSheet['!cols'] = [{ wch: 18 }, { wch: 28 }, { wch: 18 }, { wch: 44 }];
    socialImpactSheet['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 18 }, { wch: 48 }];
    forecastSheet['!cols'] = [{ wch: 12 }, { wch: 14 }, { wch: 18 }, { wch: 22 }, { wch: 18 }, { wch: 24 }];
    licenseSheet['!cols'] = [{ wch: 22 }, { wch: 34 }, { wch: 28 }];
    hardwareSheet['!cols'] = [{ wch: 18 }, { wch: 30 }, { wch: 16 }, { wch: 16 }, { wch: 58 }];
    physicalSheet['!cols'] = [{ wch: 22 }, { wch: 38 }, { wch: 64 }];
    revenueSheet['!cols'] = [{ wch: 28 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 58 }];
    pillarSheet['!cols'] = [{ wch: 28 }, { wch: 32 }, { wch: 72 }];
    twinSheet['!cols'] = [{ wch: 12 }, { wch: 34 }, { wch: 76 }, { wch: 76 }];

    XLSX.utils.book_append_sheet(workbook, executiveSheet, 'Executive Summary');
    XLSX.utils.book_append_sheet(workbook, twinSheet, 'Digital Twin Layers');
    XLSX.utils.book_append_sheet(workbook, physicalSheet, 'Physical Unit X-Ray');
    XLSX.utils.book_append_sheet(workbook, hardwareSheet, 'Hardware BOM');
    XLSX.utils.book_append_sheet(workbook, revenueSheet, 'Revenue Breakdown');
    XLSX.utils.book_append_sheet(workbook, pillarSheet, '5 Autonomy Pillars');
    XLSX.utils.book_append_sheet(workbook, unitSheet, 'Profitability Audit');
    XLSX.utils.book_append_sheet(workbook, forecastSheet, '5-Year Scaling');
    XLSX.utils.book_append_sheet(workbook, licenseSheet, 'License Balance Sheet');
    XLSX.utils.book_append_sheet(workbook, socialImpactSheet, 'Social Impact');
    XLSX.writeFile(workbook, `ilamp-profitability-audit-${scenarioId}-${unitCount}-units.xlsx`);
  };

  const toggleStream = (id: string) => {
    setActiveStreams((current) =>
      current.includes(id) ? current.filter((streamId) => streamId !== id) : [...current, id],
    );
  };

  return (
    <main className="app-shell">
      {!bootComplete && <SystemBootOverlay onComplete={() => setBootComplete(true)} />}
      <LivingGridBackdrop scrollProgress={scrollProgress} />
      <div className="ambient-grid" />
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Autonomous Infrastructure Command Center</p>
          <h1>Infrastructure that pays for itself, not another light fixture.</h1>
          <p className="hero-text">
            Built for municipal leaders and infrastructure investors, iLamp combines autonomous energy, edge AI,
            hardened structure, connectivity, and remote operations into a single off-grid platform that can also
            sell excess power back through a grid-tie connection where export is available.
          </p>
          <div className="hero-logic-strip">
            <span>100% autonomous off-grid</span>
            <span>Grid-tie capable for power export</span>
            <span>Go Local to Go Global</span>
          </div>
          <div className="live-signal-row" aria-label="Live technology status">
            <span className="signal-pill">67 TOPS AI pulse</span>
            <span className="signal-pill">5G connectivity pulse</span>
          </div>
          <div className="hero-actions">
            <button className="primary-action" onClick={exportAudit}>Download Profitability Audit</button>
            <a className="secondary-action" href="#starter-deployment">Starter Deployment</a>
            <span className="signal-pill">Jetson Orin Nano up to 67 TOPS @ 15W</span>
          </div>
        </div>
        <div className="hero-metrics" aria-label="Key iLamp metrics">
          <MetricCard label="Fleet Modeled Revenue" value={formatCompact(fleetAnnualRevenue)} tone="green" />
          <MetricCard label="Source Payback Claim" value={`${sourcePaybackLow}-${sourcePaybackHigh} yrs`} tone="cyan" />
          <MetricCard label="Verified Itemized Revenue" value={formatCurrencyRange(itemizedRevenueLow, itemizedRevenueHigh)} tone="amber" />
          <MetricCard label="Recorded License Sales" value={formatGBP(recordedLicenseSalesGBP)} tone="violet" />
          <MetricCard label="5-Year Profit" value={formatCompact(fiveYearProfit)} tone={fiveYearProfit > 0 ? 'green' : 'amber'} />
          <MetricCard label="CO2 Reduced" value={`${formatNumber(co2Reduction)} t`} tone="violet" />
        </div>
      </section>

      <VerifiedPartnerCarousel />

      <section className="control-ribbon" aria-label="Scenario controls">
        <label>
          <span>Units deployed</span>
          <input
            type="range"
            min="10"
            max="500"
            value={unitCount}
            onChange={(event) => setUnitCount(Number(event.target.value))}
          />
          <strong>{unitCount}</strong>
        </label>
        <label>
          <span>Before / after intensity</span>
          <input
            type="range"
            min="0"
            max="100"
            value={comparisonMix}
            onChange={(event) => setComparisonMix(Number(event.target.value))}
          />
          <strong>{comparisonMix}% iLamp</strong>
        </label>
        <div className="segmented-control" role="group" aria-label="Scenario selector">
          {(Object.keys(scenarios) as ScenarioId[]).map((id) => (
            <button key={id} className={scenarioId === id ? 'active' : ''} onClick={() => setScenarioId(id)}>
              {scenarios[id].label}
            </button>
          ))}
        </div>
      </section>

      <section className="twin-command-grid" aria-label="360-degree digital twin layers">
        <div className="glass-card twin-layer-card">
          <div className="section-heading">
            <p>360-Degree Digital Twin</p>
            <h2>Five synchronized visibility layers join the technology, revenue model, autonomy stack, and expansion strategy.</h2>
            <span>Designed as a boardroom command surface for operators, investors, licensees, and municipal decision makers.</span>
          </div>
          <div className="twin-layer-grid">
            {digitalTwinLayers.map((layer) => (
              <article key={layer.layer} className="twin-layer">
                <span>{layer.layer}</span>
                <strong>{layer.title}</strong>
                <small>{layer.visibility}</small>
                <em>{layer.decisionValue}</em>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-card physical-stack-card">
          <div className="section-heading">
            <p>Physical Unit X-Ray</p>
            <h2>Modular Y-frame asset with hardened glass, autonomous power, and edge AI inside the pole.</h2>
          </div>
          <div className="physical-module-list">
            {physicalModules.map((module) => (
              <div key={module.label} className="physical-module">
                <span>{module.label}</span>
                <strong>{module.metric}</strong>
                <small>{module.description}</small>
              </div>
            ))}
          </div>
          <div className="profit-center-banner">
            <span>Sunk cost transition</span>
            <strong>Legacy pole expense to autonomous profit center</strong>
            <small>{formatCurrencyRange(revenueFloor, revenueCeiling)} annual headline revenue per unit with a {sourcePaybackLow}-{sourcePaybackHigh} year source payback horizon.</small>
          </div>
        </div>
      </section>

      <MasterScrollTheatre
        activeStep={activeMasterStep}
        annualNetPerUnit={annualNetPerUnit}
        fleetAnnualRevenue={fleetAnnualRevenue}
        fiveYearProfit={fiveYearProfit}
        onPillarFocus={setSelectedPillar}
        setActiveStep={setActiveMasterStep}
        unitCount={unitCount}
      />

      <section className="main-grid">
        <div className="glass-card model-card">
          <div className="model-card-header">
            <div className="section-heading">
              <p>Autonomous Asset Anatomy</p>
              <h2>{selected.title}</h2>
              <span>{selected.metric}</span>
            </div>
            <div className="view-toggle" role="group" aria-label="Visualizer view mode">
              <button
                className={viewMode === 'r3f' ? 'active' : ''}
                onClick={() => setViewMode('r3f')}
              >
                Native 3D (R3F)
              </button>
              <button
                className={viewMode === 'spline' ? 'active' : ''}
                onClick={() => setViewMode('spline')}
              >
                Interactive 3D (Spline)
              </button>
            </div>
          </div>
          {viewMode === 'r3f' ? (
            <ILampModel selectedPillar={selectedPillar} />
          ) : (
            <ILampSplineModel />
          )}
          <div className="model-notes">
            <div>
              <span>Visual Cue</span>
              <strong>Y-shaped dual lamp configuration</strong>
            </div>
            <div>
              <span>Sensing</span>
              <strong>360-degree 4K camera arrays</strong>
            </div>
            <div>
              <span>Energy Form</span>
              <strong>Integrated solar sleeve design</strong>
            </div>
            <div>
              <span>Shield</span>
              <strong>Borosilicate tube protecting the AI core</strong>
            </div>
          </div>
        </div>

        <div className="glass-card pain-card">
          <div className="section-heading">
            <p>Autonomy Gap Audit</p>
            <h2>Click each failure mode to see which pillar closes the gap.</h2>
          </div>
          <div className="pain-list">
            {painPoints.map((pain) => {
              const pillar = getPillar(pain.solvedBy);
              return (
                <button
                  key={pain.title}
                  className={selectedPillar === pain.solvedBy ? 'pain-item active' : 'pain-item'}
                  onClick={() => setSelectedPillar(pain.solvedBy)}
                >
                  <span className="pain-dot" style={{ background: pillar.color }} />
                  <strong>{pain.title}</strong>
                  <small>{pain.pressure}</small>
                  <em>Resolved by {pillar.title}</em>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-card chart-card comparison-card">
          <div className="section-heading">
            <p>Before vs After</p>
            <h2>Cost-center drag vs infrastructure-as-profit lift.</h2>
            <span>Net swing per unit: {formatCurrency(annualNetPerUnit + traditionalAnnualCost)}</span>
          </div>
          <ResponsiveContainer width="100%" height={290}>
            <AreaChart data={comparisonData} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="traditional" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ff7a45" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#ff7a45" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ilamp" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#36f6a7" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#36f6a7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="year" stroke="#8ea3b6" />
              <YAxis stroke="#8ea3b6" tickFormatter={formatCompact} width={72} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={tooltipStyle} />
              <Area dataKey="traditional" stroke="#ff7a45" fill="url(#traditional)" strokeWidth={3} opacity={(100 - comparisonMix) / 100 + 0.2} />
              <Area dataKey="ilamp" stroke="#36f6a7" fill="url(#ilamp)" strokeWidth={3} opacity={comparisonMix / 100 + 0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card chart-card surface-card">
          <div className="section-heading">
            <p>Modeled Payback Surface</p>
            <h2>Hardware payback by deployment size and time horizon.</h2>
            <span>Current model: {modeledHardwarePaybackYears.toFixed(1)} year hardware payback vs source claim of 2-4 years.</span>
          </div>
          <PaybackSurface annualNetPerUnit={annualNetPerUnit} hardwareCost={hardwareCost} opex={scenario.opex} />
        </div>
      </section>

      <section className="pillar-grid" aria-label="Five pillars of autonomy">
        {pillars.map((pillar) => (
          <button
            key={pillar.id}
            className={selectedPillar === pillar.id ? 'pillar-card active' : 'pillar-card'}
            onClick={() => setSelectedPillar(pillar.id)}
            style={{ '--pillar-color': pillar.color } as React.CSSProperties}
          >
            <span>{pillar.title}</span>
            <strong>{pillar.metric}</strong>
            <small>{pillar.detail}</small>
          </button>
        ))}
      </section>

      <section className="systems-grid global-grid" aria-label="Global expansion visibility">
        <div className="glass-card">
          <div className="section-heading">
            <p>Territorial Licensing</p>
            <h2>Go local first, then sell rights down to city, corridor, zip, and post code layers.</h2>
            <span>One local pilot becomes a licensing map that scales from neighborhoods to national corridors.</span>
          </div>
          <div className="license-tier-grid">
            {territoryTiers.map((tier) => (
              <div key={tier.label} className="license-tier-card">
                <span>{tier.label}</span>
                <strong>{tier.scope}</strong>
                <small>{tier.strategy}</small>
              </div>
            ))}
          </div>
          <div className="license-market-grid">
            {licenseMarkets.map((market) => (
              <div key={market.market} className="license-market-card">
                <span>{market.market}</span>
                <strong>{market.corridor}</strong>
                <small>{market.status}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div className="section-heading">
            <p>License Balance Sheet</p>
            <h2>{formatGBP(recordedLicenseSalesGBP)} already recorded across live markets.</h2>
            <span>Markets visible today: Ghana, Canada, UAE, UK, and the USA.</span>
          </div>
          <div className="audit-summary-grid license-summary-grid">
            <div>
              <span>Recorded sales</span>
              <strong>{formatGBP(recordedLicenseSalesGBP)}</strong>
            </div>
            <div>
              <span>Territory ladder</span>
              <strong>Country to zip/post code</strong>
            </div>
            <div>
              <span>Commercial pattern</span>
              <strong>License first, hardware second</strong>
            </div>
            <div>
              <span>Expansion logic</span>
              <strong>Local proof, global replication</strong>
            </div>
          </div>
        </div>
      </section>

      <ArticleHub />

      <PPPRoadmap />

      <section className="bottom-grid">
        <div className="glass-card">
          <div className="section-heading">
            <p>Revenue Stream Activation</p>
            <h2>Every toggle updates the audit model, export workbook, and revenue coverage.</h2>
            <span>Source headline: {formatCurrencyRange(revenueFloor, revenueCeiling)} per unit annually.</span>
          </div>
          <div className="stream-list">
            {revenueStreams.map((stream) => (
              <button
                key={stream.id}
                className={activeStreams.includes(stream.id) ? 'stream active' : 'stream'}
                onClick={() => toggleStream(stream.id)}
              >
                <span>
                  <strong>{stream.label}</strong>
                  <small>{stream.painSolved}</small>
                </span>
                <em>{formatCurrencyRange(stream.annualLow, stream.annualHigh)}</em>
              </button>
            ))}
          </div>
          <div className="audit-summary-grid">
            <div>
              <span>Verified itemized range</span>
              <strong>{formatCurrencyRange(itemizedRevenueLow, itemizedRevenueHigh)}</strong>
            </div>
            <div>
              <span>Headline reconciliation gap</span>
              <strong>{formatCurrencyRange(itemizedRevenueGapLow, itemizedRevenueGapHigh)}</strong>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="section-heading">
            <p>Use-Case Slider</p>
            <h2>{useCase.label}</h2>
            <span>{useCase.market}</span>
          </div>
          <label className="use-case-slider">
            <span>Target market alignment</span>
            <input
              type="range"
              min="0"
              max={String(useCases.length - 1)}
              step="1"
              value={activeUseCase}
              onChange={(event) => setActiveUseCase(Number(event.target.value))}
            />
          </label>
          <div className="stakeholder-tabs">
            {useCases.map((item, index) => (
              <button key={item.id} className={activeUseCase === index ? 'active' : ''} onClick={() => setActiveUseCase(index)}>
                {item.label}
              </button>
            ))}
          </div>
          <p className="stakeholder-focus">{useCase.title}</p>
          <p className="use-case-copy">{useCase.focus}</p>
          <div className="impact-stack">
            <div><span>Deployment fit</span><strong>{useCase.deployment}</strong></div>
            <div><span>Imagery brief</span><strong>{useCase.imagery}</strong></div>
            <div><span>Expansion logic</span><strong>{useCase.payoff}</strong></div>
          </div>
        </div>

        <div className="glass-card forecast-card">
          <div className="section-heading">
            <p>Scaling Forecast</p>
            <h2>5-year growth forecast anchored to the supplied benchmark revenue curve.</h2>
            <span>Year 1 starts at 500 units and Year 5 reaches 15,000 units, with Years 2-4 shown as ramp targets.</span>
          </div>
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={scalingData} margin={{ top: 18, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="year" stroke="#8ea3b6" />
              <YAxis stroke="#8ea3b6" tickFormatter={formatCompact} width={72} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={tooltipStyle} />
              <Bar dataKey="profit" radius={[10, 10, 0, 0]}>
                {scalingData.map((row) => (
                  <Cell key={row.year} fill={row.profit >= 0 ? '#36f6a7' : '#ffb84d'} />
                ))}
              </Bar>
              <Line type="monotone" dataKey="revenue" stroke="#3dd6ff" strokeWidth={3} dot={false} />
            </BarChart>
          </ResponsiveContainer>
          <div className="forecast-table">
            {scalingData.map((row) => (
              <div key={row.year} className="forecast-row">
                <strong>{row.year}</strong>
                <span>Units: {formatNumber(row.units)}</span>
                <span>Revenue: {formatCompact(row.revenue)}</span>
                <em>{row.status}</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="systems-grid">
        <div className="glass-card">
          <div className="section-heading">
            <p>Technology Stack</p>
            <h2>Complete the platform from AI core to connectivity edge.</h2>
          </div>
          <div className="tech-grid">
            {techModules.map((module) => (
              <div key={module.title} className="tech-card">
                <span>{module.title}</span>
                <strong>{module.metric}</strong>
                <small>{module.detail}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div className="section-heading">
            <p>Sustainability</p>
            <h2>Autonomy produces measurable environmental and civic return.</h2>
          </div>
          <div className="audit-summary-grid sustainability-grid">
            <div>
              <span>CO2 reduction</span>
              <strong>2.8 tons per unit</strong>
            </div>
            <div>
              <span>Renewable generation</span>
              <strong>3,500-5,200 kWh annually</strong>
            </div>
            <div>
              <span>Fleet renewable output</span>
              <strong>{formatNumber(kwhLow)}-{formatNumber(kwhHigh)} kWh</strong>
            </div>
            <div>
              <span>Community access layer</span>
              <strong>WiFi 6 + LoRaWAN + 5G/LTE backhaul</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="systems-grid audit-grid">
        <div className="glass-card">
          <div className="section-heading">
            <p>Source Validation Notes</p>
            <h2>Figures that need review are flagged instead of inferred.</h2>
          </div>
          <div className="validation-list">
            {sourceValidationNotes.map((note) => (
              <div key={note} className="validation-item">
                <span>Audit flag</span>
                <strong>{note}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card deployment-card" id="starter-deployment">
          <div className="section-heading">
            <p>Starter Deployment</p>
            <h2>Launch with 10 units, validate locally, then scale globally.</h2>
            <span>Recommended entry point for institutional pilots and municipal proof programs.</span>
          </div>
          <div className="deployment-band">
            <div>
              <span>Total pilot investment</span>
              <strong>{formatCurrencyRange(pilotInvestmentLow, pilotInvestmentHigh)}</strong>
            </div>
            <div>
              <span>Scope</span>
              <strong>{pilotDeploymentUnits} units including hardware and installation</strong>
            </div>
            <div>
              <span>Deployment logic</span>
              <strong>Prove economics locally, then replicate corridor by corridor.</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const tooltipStyle = {
  background: 'rgba(5, 13, 24, 0.94)',
  border: '1px solid rgba(61, 214, 255, 0.35)',
  borderRadius: '14px',
  color: '#e8fbff',
};

function MetricCard({ label, value, tone }: { label: string; value: string; tone: 'green' | 'cyan' | 'amber' | 'violet' }) {
  return (
    <div className={`metric-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SystemBootOverlay({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= bootSteps.length) {
      const timer = window.setTimeout(onComplete, 320);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => setStep((current) => current + 1), 420);
    return () => window.clearTimeout(timer);
  }, [onComplete, step]);

  return (
    <div className="boot-overlay" aria-live="polite">
      <div className="boot-scanline" />
      <div className="boot-console">
        <span>iLamp boot sequence</span>
        {bootSteps.map((item, index) => (
          <p key={item} className={index === step ? 'active' : index < step ? 'complete' : ''}>
            <b>{index < step ? 'OK' : index === step ? 'RUN' : 'WAIT'}</b>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function LivingGridBackdrop({ scrollProgress }: { scrollProgress: number }) {
  const pulseActive = scrollProgress >= 0.5;

  return (
    <div className="living-grid-backdrop" data-pulse-active={pulseActive ? 'true' : 'false'} aria-hidden="true">
      <video className="background-video-layer" autoPlay muted loop playsInline preload="metadata">
        <source src="/videos/background.webm" type="video/webm" />
      </video>
      <Canvas className="living-grid-canvas" camera={{ position: [0, 2.2, 8], fov: 48 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <pointLight color="#3dd6ff" intensity={pulseActive ? 64 : 28} position={[0, 2.2, 1.2]} />
        <LivingGridScene pulseActive={pulseActive} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}

function LivingGridScene({ pulseActive, scrollProgress }: { pulseActive: boolean; scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ camera, clock }) => {
    const fly = THREE.MathUtils.clamp(scrollProgress, 0, 1);
    camera.position.x = Math.sin(fly * Math.PI * 1.5) * 2.2;
    camera.position.y = 2.2 + fly * 3.2;
    camera.position.z = 8 - fly * 9.8;
    camera.lookAt(0, 1.75, -1.8);

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.12;
    }

    if (pulseRef.current) {
      const material = pulseRef.current.material as THREE.MeshBasicMaterial;
      const pulse = pulseActive ? 1.4 + Math.sin(clock.elapsedTime * 2.4) * 0.35 : 0.18;
      pulseRef.current.scale.setScalar(pulse);
      material.opacity = pulseActive ? 0.22 + Math.sin(clock.elapsedTime * 2.4) * 0.08 : 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <gridHelper args={[44, 44, '#3dd6ff', '#123847']} position={[0, -1.2, -3]} />
      <gridHelper args={[44, 22, '#36f6a7', '#102a28']} position={[0, -1.2, -3]} rotation={[0, 0, Math.PI / 2]} />
      <group position={[0, -0.65, -1.2]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.74, 0.96, 0.18, 48]} />
          <meshStandardMaterial color="#263342" metalness={0.88} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.48, 0]}>
          <cylinderGeometry args={[0.08, 0.13, 2.9, 40]} />
          <meshStandardMaterial color="#223447" metalness={0.78} roughness={0.18} />
        </mesh>
        <mesh position={[0, 2.74, 0]}>
          <cylinderGeometry args={[0.46, 0.4, 1.18, 64, 1, true]} />
          <meshPhysicalMaterial color="#9deeff" transparent opacity={0.2} roughness={0.02} transmission={0.42} thickness={0.7} />
        </mesh>
        <mesh position={[0, 2.18, 0]}>
          <boxGeometry args={[0.58, 0.42, 0.58]} />
          <meshStandardMaterial color="#092436" emissive="#3dd6ff" emissiveIntensity={pulseActive ? 1.8 : 0.55} metalness={0.5} roughness={0.12} />
        </mesh>
        <mesh ref={pulseRef} position={[0, 2.18, 0]}>
          <sphereGeometry args={[1.15, 48, 48]} />
          <meshBasicMaterial color="#3dd6ff" transparent opacity={0.04} side={THREE.DoubleSide} />
        </mesh>
        {Array.from({ length: 6 }).map((_, index) => {
          const angle = (index / 6) * Math.PI * 2;
          return (
            <mesh key={index} position={[Math.cos(angle) * 0.5, 2.48, Math.sin(angle) * 0.5]}>
              <sphereGeometry args={[0.055, 18, 18]} />
              <meshStandardMaterial color="#e8fbff" emissive="#3dd6ff" emissiveIntensity={pulseActive ? 1.2 : 0.35} />
            </mesh>
          );
        })}
        {[-1, 1].map((direction) => (
          <group key={direction} position={[0, 3.8, 0]} rotation={[0, 0, direction * 0.6]}>
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.04, 0.058, 0.92, 24]} />
              <meshStandardMaterial color="#2a4658" metalness={0.7} roughness={0.18} />
            </mesh>
            <mesh position={[0, 0.86, 0]}>
              <boxGeometry args={[0.38, 0.12, 0.2]} />
              <meshStandardMaterial color="#e8fbff" emissive="#3dd6ff" emissiveIntensity={0.5} />
            </mesh>
          </group>
        ))}
        {[0.78, 1.05, 1.36].map((radius, index) => (
          <mesh key={radius} position={[0, 2.18, 0]} rotation={[Math.PI / 2, 0, index * 0.56]}>
            <torusGeometry args={[radius, 0.006, 8, 120]} />
            <meshBasicMaterial color={index === 1 ? '#36f6a7' : '#3dd6ff'} transparent opacity={pulseActive ? 0.28 : 0.12} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function VerifiedPartnerCarousel() {
  const loop = [...partnerLogos, ...partnerLogos];

  return (
    <section className="verified-carousel glass-card" aria-labelledby="partner-title">
      <div className="section-heading">
        <p>Verified Partner Signal</p>
        <h2 id="partner-title">Source-integrated recognition, infrastructure, and sovereign deployment partners.</h2>
      </div>
      <div className="partner-marquee" aria-hidden="true">
        {loop.map((partner, index) => (
          <div className="partner-card" key={`${partner.name}-${index}`}>
            {partner.src ? <img src={partner.src} alt="" loading="lazy" /> : <span className="partner-seal">SN</span>}
            <strong>{partner.name}</strong>
            <small>{partner.role}</small>
          </div>
        ))}
      </div>
      <ul className="sr-only">
        {partnerLogos.map((partner) => (
          <li key={partner.name}>{partner.name}: {partner.role}</li>
        ))}
      </ul>
    </section>
  );
}

function ArticleHub() {
  return (
    <section className="article-hub" aria-labelledby="article-hub-title">
      <div className="section-heading">
        <p>SEO & Article Hub</p>
        <h2 id="article-hub-title">Big-tech search targets for distributed AI infrastructure and sovereign data centers.</h2>
        <span>Keywords: Distributed AI Infrastructure, 67 TOPS Edge Computing, Sovereign Data Centers.</span>
      </div>
      <div className="article-grid">
        {articleHub.map((article) => (
          <article key={article.title} className="glass-card article-card">
            <span>{article.kicker}</span>
            <h3>{article.title}</h3>
            <strong>{article.metric}</strong>
            <p>{article.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PPPRoadmap() {
  return (
    <section className="ppp-roadmap" aria-labelledby="ppp-roadmap-title">
      <div className="section-heading">
        <p>PPP Step-by-Step</p>
        <h2 id="ppp-roadmap-title">Eight-stage graphical roadmap from identification to financial close.</h2>
        <span>Existing generated isometric graphics are preserved and framed with cyan data-flow overlays.</span>
      </div>
      <div className="ppp-stage-grid">
        {pppStages.map((stage) => (
          <article key={stage.stage} className="ppp-stage-card">
            <div className="ppp-stage-visual">
              <img src={stage.image} alt={`${stage.title} stage technical icon`} loading="lazy" />
              <span>{stage.stage}</span>
            </div>
            <h3>{stage.title}</h3>
            <p>{stage.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function MasterScrollTheatre({
  activeStep,
  annualNetPerUnit,
  fleetAnnualRevenue,
  fiveYearProfit,
  onPillarFocus,
  setActiveStep,
  unitCount,
}: {
  activeStep: number;
  annualNetPerUnit: number;
  fleetAnnualRevenue: number;
  fiveYearProfit: number;
  onPillarFocus: (pillarId: PillarId) => void;
  setActiveStep: (step: number) => void;
  unitCount: number;
}) {
  const step = masterSteps[activeStep] ?? masterSteps[0];
  const activePillar = getPillar(step.pillarId);
  const theatreStats = [
    { label: 'Active layer', value: activePillar.title },
    { label: 'Per-unit net', value: formatCurrency(annualNetPerUnit) },
    { label: 'Fleet revenue', value: formatCompact(fleetAnnualRevenue) },
    { label: '5-year profit', value: formatCompact(fiveYearProfit) },
  ];

  return (
    <section className="scroll-theatre" aria-label="Five master scrolling visual features">
      <div className="theatre-sticky glass-card">
        <div className="theatre-copy">
          <p className="eyebrow">Advanced Scroll 3D Narrative</p>
          <h2>Five master steps convert a pole into autonomous infrastructure with audited upside.</h2>
          <p>
            Scroll the sequence to move the node through liability reframing, solar autonomy, edge AI,
            revenue stacking, and remote self-management.
          </p>
        </div>
        <div className="theatre-stage">
          <MasterScrollScene
            annualNetPerUnit={annualNetPerUnit}
            step={step}
            stepIndex={activeStep}
            unitCount={unitCount}
          />
        </div>
        <div className="theatre-telemetry" aria-label="Scroll theatre telemetry">
          {theatreStats.map((stat) => (
            <div key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="step-rail">
        {masterSteps.map((item, index) => (
          <MasterStepPanel
            active={activeStep === index}
            index={index}
            key={item.id}
            onPillarFocus={onPillarFocus}
            setActiveStep={setActiveStep}
            step={item}
          />
        ))}
      </div>
    </section>
  );
}

function MasterStepPanel({
  active,
  index,
  onPillarFocus,
  setActiveStep,
  step,
}: {
  active: boolean;
  index: number;
  onPillarFocus: (pillarId: PillarId) => void;
  setActiveStep: (step: number) => void;
  step: MasterStep;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          setActiveStep(index);
          onPillarFocus(step.pillarId);
        }
      },
      { root: null, rootMargin: '-18% 0px -24% 0px', threshold: [0.35, 0.5, 0.7] },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [index, onPillarFocus, setActiveStep, step.pillarId]);

  return (
    <article
      className={active ? 'master-step active' : 'master-step'}
      ref={cardRef}
      style={{ '--step-color': step.color } as React.CSSProperties}
    >
      <span>{step.kicker}</span>
      <h3>{step.title}</h3>
      <p>{step.narrative}</p>
      <div className="step-proof">
        <strong>{step.metric}</strong>
        <small>{step.visual}</small>
      </div>
      <div className="before-after-strip">
        <div>
          <em>Before</em>
          <b>{step.before}</b>
        </div>
        <div>
          <em>After</em>
          <b>{step.after}</b>
        </div>
      </div>
    </article>
  );
}

function MasterScrollScene({
  annualNetPerUnit,
  step,
  stepIndex,
  unitCount,
}: {
  annualNetPerUnit: number;
  step: MasterStep;
  stepIndex: number;
  unitCount: number;
}) {
  return (
    <Canvas camera={{ position: [4.8, 3.6, 6.2], fov: 42 }}>
      <color attach="background" args={['#03070d']} />
      <ambientLight intensity={0.5} />
      <pointLight color={step.color} intensity={42} position={[2.4, 5.6, 3.5]} />
      <pointLight color="#3dd6ff" intensity={18} position={[-4, 2.4, -2]} />
      <Float floatIntensity={0.18} rotationIntensity={0.18} speed={1.2}>
        <MasterStepRig activeColor={step.color} stepIndex={stepIndex} />
      </Float>
      <MasterSignalField activeColor={step.color} stepIndex={stepIndex} />
      <MasterProfitRamp annualNetPerUnit={annualNetPerUnit} stepIndex={stepIndex} unitCount={unitCount} />
      <CityFloor />
      <Text position={[0, 4.65, 0]} fontSize={0.17} color={step.color} anchorX="center" anchorY="middle">
        {step.metric}
      </Text>
      <OrbitControls enablePan={false} minDistance={4.3} maxDistance={8.8} />
    </Canvas>
  );
}

function MasterStepRig({ activeColor, stepIndex }: { activeColor: string; stepIndex: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const energyActive = stepIndex >= 1;
  const computeActive = stepIndex >= 2;
  const financeActive = stepIndex >= 3;
  const opsActive = stepIndex >= 4;

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (0.18 + stepIndex * 0.035);
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3.2) * 0.045;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.45, 0]}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.92, 1.16, 0.24, 64]} />
        <meshStandardMaterial color="#121f2e" metalness={0.84} roughness={0.24} emissive={stepIndex === 0 ? '#3f2412' : '#06111b'} />
      </mesh>
      <mesh position={[0, 1.66, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 3.25, 64]} />
        <meshStandardMaterial color="#172b3d" metalness={0.76} roughness={0.18} emissive="#071521" />
      </mesh>
      <mesh position={[0, 3.15, 0]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.56, 0.46, 1.08, 72, 1, true]} />
        <meshStandardMaterial
          color={energyActive ? '#163f36' : '#102434'}
          emissive={energyActive ? '#1aa36f' : '#061521'}
          emissiveIntensity={energyActive ? 0.9 : 0.18}
          opacity={0.86}
          transparent
        />
      </mesh>
      {[-1, 1].map((direction) => (
        <group key={`master-y-arm-${direction}`} position={[0, 3.98, 0]} rotation={[0, 0, direction * 0.62]}>
          <mesh position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.05, 0.07, 1.02, 32]} />
            <meshStandardMaterial color="#1f3446" emissive="#0a1a26" metalness={0.74} roughness={0.18} />
          </mesh>
          <mesh position={[0, 0.9, 0]} rotation={[0, 0, direction * 0.12]}>
            <boxGeometry args={[0.42, 0.13, 0.22]} />
            <meshStandardMaterial color="#d8f5ff" emissive={energyActive ? '#5be8ff' : '#16384a'} emissiveIntensity={energyActive ? 0.82 : 0.22} />
          </mesh>
        </group>
      ))}
      <mesh ref={coreRef} position={[0, 2.13, 0]}>
        <boxGeometry args={[0.72, 0.58, 0.72]} />
        <meshStandardMaterial
          color={computeActive ? '#0a2738' : '#0d1c2c'}
          emissive={computeActive ? '#1285b8' : '#071527'}
          emissiveIntensity={computeActive ? 1.1 : 0.24}
          metalness={0.58}
          roughness={0.16}
        />
      </mesh>
      <mesh position={[0, 2.13, 0.42]}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={1.7 + stepIndex * 0.18} />
      </mesh>
      {Array.from({ length: 4 }).map((_, index) => {
        const angle = (index / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh key={`master-camera-${index}`} position={[Math.cos(angle) * 0.36, 2.38, Math.sin(angle) * 0.36]}>
            <sphereGeometry args={[0.07, 18, 18]} />
            <meshStandardMaterial color="#ccefff" emissive={computeActive ? '#56d7ff' : '#173349'} emissiveIntensity={computeActive ? 0.92 : 0.2} />
          </mesh>
        );
      })}
      <mesh position={[0, 1.1, 0.34]}>
        <boxGeometry args={[0.58, 0.98, 0.09]} />
        <meshStandardMaterial color="#061a1d" emissive={financeActive ? '#1b6c62' : '#09282d'} emissiveIntensity={financeActive ? 1 : 0.22} />
      </mesh>
      {Array.from({ length: 6 }).map((_, index) => (
        <mesh key={`ring-${index}`} position={[0, 2.18 + index * 0.26, 0]} rotation={[Math.PI / 2, 0, index * 0.42]}>
          <torusGeometry args={[0.67 + index * 0.08, 0.007 + stepIndex * 0.001, 10, 96]} />
          <meshBasicMaterial color={activeColor} opacity={0.16 + index * 0.045} transparent />
        </mesh>
      ))}
      {Array.from({ length: 5 }).map((_, index) => {
        const angle = (index / 5) * Math.PI * 2;
        const height = 0.34 + index * 0.18 + stepIndex * 0.08;
        return (
          <mesh key={`revenue-${index}`} position={[Math.cos(angle) * 1.18, 0.55 + height / 2, Math.sin(angle) * 1.18]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.16, financeActive ? height : 0.08, 0.16]} />
            <meshStandardMaterial color={financeActive ? '#36f6a7' : '#273646'} emissive={financeActive ? '#16895d' : '#06111b'} emissiveIntensity={financeActive ? 0.9 : 0.1} />
          </mesh>
        );
      })}
      {opsActive && (
        <group>
          <mesh position={[0, 4.02, 0]}>
            <torusGeometry args={[0.82, 0.014, 12, 120]} />
            <meshBasicMaterial color="#9f7cff" opacity={0.72} transparent />
          </mesh>
          <mesh position={[0, 4.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.08, 0.008, 12, 120]} />
            <meshBasicMaterial color="#3dd6ff" opacity={0.32} transparent />
          </mesh>
        </group>
      )}
    </group>
  );
}

function MasterSignalField({ activeColor, stepIndex }: { activeColor: string; stepIndex: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => {
        const angle = index * 1.34;
        const radius = 1.15 + (index % 7) * 0.23;
        return {
          key: index,
          position: [Math.cos(angle) * radius, 0.2 + (index % 11) * 0.32, Math.sin(angle) * radius] as [number, number, number],
          scale: 0.018 + (index % 4) * 0.008,
        };
      }),
    [],
  );

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * (0.12 + stepIndex * 0.04);
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.6) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.12, 0]}>
      {particles.map((particle) => (
        <mesh key={particle.key} position={particle.position}>
          <sphereGeometry args={[particle.scale, 12, 12]} />
          <meshBasicMaterial color={activeColor} opacity={0.16 + stepIndex * 0.12} transparent />
        </mesh>
      ))}
      {[1.15, 1.55, 1.95].map((radius, index) => (
        <mesh key={radius} position={[0, 2.75 + index * 0.18, 0]} rotation={[Math.PI / 2.45, 0, 0]}>
          <torusGeometry args={[radius, 0.006, 8, 96, Math.PI * 1.18]} />
          <meshBasicMaterial color={index === 2 ? '#36f6a7' : activeColor} opacity={0.2 + stepIndex * 0.07} transparent />
        </mesh>
      ))}
    </group>
  );
}

function MasterProfitRamp({ annualNetPerUnit, stepIndex, unitCount }: { annualNetPerUnit: number; stepIndex: number; unitCount: number }) {
  const bars = useMemo(
    () =>
      Array.from({ length: 5 }, (_, year) => {
        const value = Math.max(0.12, (annualNetPerUnit * unitCount * (year + 1)) / 18_000_000);
        return { year: year + 1, height: THREE.MathUtils.clamp(value, 0.12, 1.6) };
      }),
    [annualNetPerUnit, unitCount],
  );

  return (
    <group position={[-2.45, -1.34, 1.8]}>
      {bars.map((bar, index) => (
        <group key={bar.year} position={[index * 0.32, bar.height / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.2, stepIndex >= 3 ? bar.height : 0.08, 0.2]} />
            <meshStandardMaterial
              color={stepIndex >= 3 ? '#36f6a7' : '#233341'}
              emissive={stepIndex >= 3 ? '#178a5f' : '#06111b'}
              emissiveIntensity={stepIndex >= 3 ? 0.85 : 0.1}
            />
          </mesh>
          <Text position={[0, -0.16, 0.16]} fontSize={0.09} color="#8ea3b6" anchorX="center" anchorY="middle">
            Y{bar.year}
          </Text>
        </group>
      ))}
      <Text position={[0.68, 1.86, 0]} fontSize={0.1} color="#36f6a7" anchorX="center" anchorY="middle">
        Profit Ramp
      </Text>
    </group>
  );
}

function ILampModel({ selectedPillar }: { selectedPillar: PillarId }) {
  return (
    <div className="canvas-wrap">
      <Canvas camera={{ position: [4.4, 3.8, 5.4], fov: 44 }}>
        <color attach="background" args={['#050911']} />
        <ambientLight intensity={0.7} />
        <pointLight position={[2, 6, 3]} intensity={34} color="#3dd6ff" />
        <pointLight position={[-4, 3, -2]} intensity={18} color="#36f6a7" />
        <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.22}>
          <ILampMesh selectedPillar={selectedPillar} />
        </Float>
        <CityFloor />
        <OrbitControls enablePan={false} minDistance={4} maxDistance={9} />
      </Canvas>
    </div>
  );
}

function ILampMesh({ selectedPillar }: { selectedPillar: PillarId }) {
  const groupRef = useRef<THREE.Group>(null);
  const color = getPillar(selectedPillar).color;

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={groupRef} position={[0, -1.55, 0]}>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.82, 1.05, 0.18, 48]} />
        <meshStandardMaterial color="#101b27" metalness={0.85} roughness={0.26} />
      </mesh>
      <mesh position={[0, 1.62, 0]}>
        <cylinderGeometry args={[0.11, 0.16, 3.1, 48]} />
        <meshStandardMaterial color="#172838" metalness={0.72} roughness={0.18} emissive="#071521" />
      </mesh>
      <mesh position={[0, 3.1, 0]} rotation={[0.18, 0, 0]}>
        <cylinderGeometry args={[0.52, 0.47, 1.05, 64, 1, true]} />
        <meshStandardMaterial color="#123548" emissive={selectedPillar === 'energy' ? '#1ba96e' : '#08354a'} transparent opacity={0.82} />
      </mesh>
      {[-1, 1].map((direction) => (
        <group key={`ilamp-y-arm-${direction}`} position={[0, 3.95, 0]} rotation={[0, 0, direction * 0.62]}>
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.045, 0.065, 1, 32]} />
            <meshStandardMaterial color="#20384a" metalness={0.74} roughness={0.18} emissive="#0a1a26" />
          </mesh>
          <mesh position={[0, 0.88, 0]}>
            <boxGeometry args={[0.42, 0.13, 0.22]} />
            <meshStandardMaterial color="#d8f5ff" emissive={selectedPillar === 'energy' ? '#5be8ff' : '#173347'} emissiveIntensity={selectedPillar === 'energy' ? 0.88 : 0.22} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 2.15, 0]}>
        <boxGeometry args={[0.68, 0.56, 0.68]} />
        <meshStandardMaterial color="#0d1c2c" emissive={selectedPillar === 'compute' ? '#126c91' : '#08172a'} metalness={0.58} roughness={0.18} />
      </mesh>
      <mesh position={[0, 2.15, 0.37]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
      {Array.from({ length: 4 }).map((_, index) => {
        const angle = (index / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh key={`ilamp-camera-${index}`} position={[Math.cos(angle) * 0.34, 2.38, Math.sin(angle) * 0.34]}>
            <sphereGeometry args={[0.065, 18, 18]} />
            <meshStandardMaterial color="#d5f4ff" emissive={selectedPillar === 'compute' ? '#56d7ff' : '#173349'} emissiveIntensity={selectedPillar === 'compute' ? 0.96 : 0.18} />
          </mesh>
        );
      })}
      <mesh position={[0, 3.86, 0]}>
        <cylinderGeometry args={[0.34, 0.4, 0.22, 48]} />
        <meshStandardMaterial color="#22394b" emissive={selectedPillar === 'operations' ? '#4b32a6' : '#071827'} />
      </mesh>
      <mesh position={[0, 4.05, 0]}>
        <torusGeometry args={[0.62, 0.012, 12, 96]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 1.12, 0.32]}>
        <boxGeometry args={[0.54, 0.92, 0.08]} />
        <meshStandardMaterial color="#061a1d" emissive={selectedPillar === 'finance' ? '#1b6c62' : '#09282d'} />
      </mesh>
      {Array.from({ length: 5 }).map((_, index) => (
        <mesh key={index} rotation={[Math.PI / 2, 0, index * 1.256]} position={[0, 2.5 + index * 0.12, 0]}>
          <torusGeometry args={[0.72 + index * 0.05, 0.006, 8, 80]} />
          <meshBasicMaterial color={color} transparent opacity={0.18 + index * 0.05} />
        </mesh>
      ))}
      <Text position={[0, 4.52, 0]} fontSize={0.18} color="#e8fbff" anchorX="center" anchorY="middle">
        iLamp Infrastructure Node
      </Text>
    </group>
  );
}

function CityFloor() {
  return (
    <group position={[0, -1.52, 0]}>
      <gridHelper args={[9, 28, '#134052', '#0d2633']} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial color="#06111b" metalness={0.3} roughness={0.8} transparent opacity={0.72} />
      </mesh>
      {[-3.6, -2.4, 2.7, 3.5].map((x, index) => (
        <mesh key={x} position={[x, 0.3 + index * 0.08, -2.8 + index * 0.55]}>
          <boxGeometry args={[0.52, 0.8 + index * 0.22, 0.52]} />
          <meshStandardMaterial color="#0b1a27" emissive="#062333" />
        </mesh>
      ))}
    </group>
  );
}

function PaybackSurface({ annualNetPerUnit, hardwareCost, opex }: { annualNetPerUnit: number; hardwareCost: number; opex: number }) {
  const geometry = useMemo(() => {
    const xSteps = 20;
    const ySteps = 20;
    const vertices: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const color = new THREE.Color();

    for (let y = 0; y <= ySteps; y += 1) {
      const units = 10 + (490 * y) / ySteps;
      for (let x = 0; x <= xSteps; x += 1) {
        const years = (5 * x) / xSteps;
        const profit = annualNetPerUnit * units * years - hardwareCost * units - opex * units * years * 0.15;
        const normalizedProfit = THREE.MathUtils.clamp(profit / 4_500_000, -1, 1);
        vertices.push((years - 2.5) * 1.05, normalizedProfit * 1.7, (units - 255) / 82);
        color.set(normalizedProfit >= 0 ? '#36f6a7' : normalizedProfit > -0.45 ? '#ffb84d' : '#ff5c7a');
        colors.push(color.r, color.g, color.b);
      }
    }

    for (let y = 0; y < ySteps; y += 1) {
      for (let x = 0; x < xSteps; x += 1) {
        const a = y * (xSteps + 1) + x;
        const b = a + 1;
        const c = a + (xSteps + 1);
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const surface = new THREE.BufferGeometry();
    surface.setIndex(indices);
    surface.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    surface.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    surface.computeVertexNormals();
    return surface;
  }, [annualNetPerUnit, hardwareCost, opex]);

  return (
    <div className="surface-wrap">
      <Canvas camera={{ position: [4.2, 3.4, 5.8], fov: 48 }}>
        <color attach="background" args={['#050911']} />
        <ambientLight intensity={0.55} />
        <pointLight position={[2, 5, 2]} intensity={32} color="#3dd6ff" />
        <mesh geometry={geometry} rotation={[0, -0.2, 0]}>
          <meshStandardMaterial vertexColors side={THREE.DoubleSide} metalness={0.1} roughness={0.32} transparent opacity={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.72, 0]}>
          <planeGeometry args={[6.2, 6.2]} />
          <meshBasicMaterial color="#07151e" transparent opacity={0.72} />
        </mesh>
        <gridHelper args={[6.2, 16, '#174c62', '#0d2633']} position={[0, -1.7, 0]} />
        <Text position={[-2.55, -1.35, 3.15]} fontSize={0.14} color="#8ea3b6">0 yrs</Text>
        <Text position={[2.65, -1.35, 3.15]} fontSize={0.14} color="#8ea3b6">5 yrs</Text>
        <Text position={[-3.15, -1.35, -2.9]} fontSize={0.14} color="#8ea3b6">10 units</Text>
        <Text position={[2.9, -1.35, -2.9]} fontSize={0.14} color="#8ea3b6">500 units</Text>
        <Text position={[0, 2.1, 0]} fontSize={0.16} color="#36f6a7">Cumulative Profit</Text>
        <OrbitControls enablePan={false} minDistance={4.2} maxDistance={8} />
      </Canvas>
    </div>
  );
}

function ILampSplineModel() {
  return (
    <div className="canvas-wrap spline-wrap">
      <Suspense
        fallback={
          <div className="spline-loading">
            <div className="spinner" />
            <span>Initializing 3D Spline Scene...</span>
          </div>
        }
      >
        <Spline scene="https://prod.spline.design/KFonZGtsoUXP-qx7/scene.splinecode" renderOnDemand={true} />
      </Suspense>
    </div>
  );
}

export default App;
