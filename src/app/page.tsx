import { ClipboardList, BriefcaseBusiness, Building2, CircleHelp, Users } from "lucide-react";
import { db } from "@/lib/db";
import {
  ImmigrationLineChart,
  NationalitiesPieChart,
  EmploymentColumnChart,
  FunnelBarChart,
  UniversityStackedChart,
  RetentionLineChart,
  BenchmarkColumnChart,
  EmployerBarChart,
  type ImmigrationRow,
  type EmploymentRow,
  type FunnelRow,
  type UniStudentRow,
  type RetentionRow,
  type NationalityRow,
  type BenchmarkRow,
  type EmployerRow,
} from "./components/Charts";

async function getAllData() {
  const [
    trendsRes, natRes, gapRes, funnelRes,
    studentsRes, retentionRes, employersRes, servicesRes, benchmarkRes,
  ] = await Promise.all([
    db.execute("SELECT * FROM immigration_trend ORDER BY year"),
    db.execute("SELECT * FROM top_nationalities WHERE year = 2024 ORDER BY population DESC"),
    db.execute("SELECT * FROM employment_gap ORDER BY year"),
    db.execute("SELECT * FROM integration_funnel ORDER BY id"),
    db.execute("SELECT * FROM university_students ORDER BY year, university"),
    db.execute("SELECT * FROM graduation_retention ORDER BY year"),
    db.execute("SELECT * FROM employers ORDER BY international_employees DESC"),
    db.execute("SELECT * FROM services ORDER BY id"),
    db.execute("SELECT * FROM ih_benchmark ORDER BY year"),
  ]);

  const trends = trendsRes.rows.map((r) => ({
    year: Number(r.year),
    foreign_born_population: Number(r.foreign_born_population),
    total_population: Number(r.total_population),
    net_immigration: Number(r.net_immigration),
  })) as ImmigrationRow[];

  const nationalities = natRes.rows.map((r) => ({
    country: String(r.country),
    population: Number(r.population),
  })) as NationalityRow[];

  const gap = gapRes.rows.map((r) => ({
    year: Number(r.year),
    finnish_born_rate: Number(r.finnish_born_rate),
    immigrant_rate: Number(r.immigrant_rate),
  })) as EmploymentRow[];

  const funnel = funnelRes.rows.map((r) => ({
    stage: String(r.stage),
    count: Number(r.count),
    percentage: Number(r.percentage),
  })) as FunnelRow[];

  const students = studentsRes.rows.map((r) => ({
    year: Number(r.year),
    university: String(r.university),
    international_students: Number(r.international_students),
  })) as UniStudentRow[];

  const retention = retentionRes.rows.map((r) => ({
    year: Number(r.year),
    graduates: Number(r.graduates),
    retained: Number(r.retained),
    retention_rate: Number(r.retention_rate),
  })) as RetentionRow[];

  const employers = employersRes.rows.map((r) => ({
    company: String(r.company),
    sector: String(r.sector),
    international_employees: Number(r.international_employees),
  })) as EmployerRow[];

  const services = servicesRes.rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    icon: String(r.icon),
    priority: String(r.priority),
    rationale: String(r.rationale),
  }));

  const benchmark = benchmarkRes.rows.map((r) => ({
    year: Number(r.year),
    ihh_clients: Number(r.ihh_clients),
    ihv_projected: Number(r.ihv_projected),
  })) as BenchmarkRow[];

  // Pre-aggregate university data for chart
  const years = [...new Set(students.map((s) => s.year))].sort();
  const universities = [...new Set(students.map((s) => s.university))];
  const byYearUni: Record<string, Record<string, number>> = {};
  for (const row of students) {
    const y = String(row.year);
    if (!byYearUni[y]) byYearUni[y] = {};
    byYearUni[y][row.university] = row.international_students;
  }

  return {
    trends, nationalities, gap, funnel,
    years, universities, byYearUni,
    retention, employers, services, benchmark,
  };
}

const serviceIcons: Record<string, React.ElementType> = {
  "🏛️": ClipboardList,
  "💼": BriefcaseBusiness,
  "🏭": Building2,
  "ℹ️": CircleHelp,
  "👨‍👩‍👧": Users,
};

const iconColor: Record<string, string> = {
  Highest: "text-[#EA4335]",
  High:    "text-[#1A73E8]",
  Medium:  "text-[#34A853]",
};

const priorityStyle: Record<string, string> = {
  Highest: "bg-[#FCE8E6] text-[#C5221F]",
  High:    "bg-[#FEF7E0] text-[#B06000]",
  Medium:  "bg-[#E6F4EA] text-[#188038]",
};

export default async function Page() {
  const data = await getAllData();

  const latestTrend = data.trends[data.trends.length - 1];
  const earliestTrend = data.trends[0];
  const latestGap = data.gap[data.gap.length - 1];
  const latestRetention = data.retention[data.retention.length - 1];

  const immigrantPct = ((latestTrend.foreign_born_population / latestTrend.total_population) * 100).toFixed(1);
  const growthPct = (((latestTrend.foreign_born_population - earliestTrend.foreign_born_population) / earliestTrend.foreign_born_population) * 100).toFixed(0);
  const empGap = (latestGap.finnish_born_rate - latestGap.immigrant_rate).toFixed(1);
  const totalStudents = Object.values(data.byYearUni["2024"] ?? {}).reduce((a, b) => a + b, 0);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-sm font-medium text-[#1A73E8] tracking-wide uppercase mb-3">
            Proposal · 2025
          </p>
          <h1 className="text-4xl sm:text-5xl font-light text-[#202124] leading-tight max-w-3xl">
            Project Vaasa Hub
          </h1>
          <p className="mt-4 text-lg text-[#5F6368] max-w-2xl font-light">
            Vaasa's international community is growing but integration lags behind.
            Here's the data case for a one-stop public service hub.
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <HeroStat
              value={latestTrend.foreign_born_population.toLocaleString()}
              label="Foreign-born residents"
              sub={`${immigrantPct}% of Vaasa`}
              color="blue"
            />
            <HeroStat
              value={`+${growthPct}%`}
              label="Growth since 2019"
              sub={`${earliestTrend.year} → ${latestTrend.year}`}
              color="green"
            />
            <HeroStat
              value={`${empGap} pp`}
              label="Employment gap"
              sub="Finnish vs immigrant"
              color="red"
            />
            <HeroStat
              value={totalStudents.toLocaleString()}
              label="International students"
              sub="Across 3 universities"
              color="yellow"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 1: IMMIGRATION ───────────────────────────────── */}
      <section id="immigration" className="bg-[#F8F9FA] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionTag n="01" color="blue" label="Immigration Growth" />
          <h2 className="mt-3 text-2xl sm:text-3xl font-light text-[#202124]">
            Vaasa's international community has grown{" "}
            <span className="text-[#1A73E8] font-normal">71% since 2019</span>
          </h2>
          <p className="mt-3 text-[#5F6368] max-w-2xl leading-relaxed">
            Over 14,000 foreign-born residents now call Vaasa home driven by the Vaasa Energy
            Cluster's global talent needs and Finland's broader immigration trends. The city's
            immigrant share has risen from 9.7% to 14.4% in just five years.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <ChartCard title="Foreign-born population & net immigration (2019–2024)">
              <ImmigrationLineChart data={data.trends} />
            </ChartCard>
            <ChartCard title="Top nationalities Vaasa 2024">
              <NationalitiesPieChart data={data.nationalities} />
            </ChartCard>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: EMPLOYMENT ────────────────────────────────── */}
      <section id="employment" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionTag n="02" color="red" label="Employment & Integration" />
          <h2 className="mt-3 text-2xl sm:text-3xl font-light text-[#202124]">
            A persistent{" "}
            <span className="text-[#EA4335] font-normal">{empGap} percentage-point</span>{" "}
            employment gap
          </h2>
          <p className="mt-3 text-[#5F6368] max-w-2xl leading-relaxed">
            Finnish-born residents are employed at {latestGap.finnish_born_rate}%, while immigrants
            reach only {latestGap.immigrant_rate}%. The integration funnel shows why: of every 100
            annual arrivals, fewer than 25 remain employed in Vaasa after three years.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <ChartCard title="Employment rates Finnish-born vs immigrant (2019–2024)">
              <EmploymentColumnChart data={data.gap} />
            </ChartCard>
            <ChartCard title="Integration funnel annual arrivals cohort">
              <FunnelBarChart data={data.funnel} />
            </ChartCard>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: UNIVERSITY ────────────────────────────────── */}
      <section id="university" className="bg-[#F8F9FA] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionTag n="03" color="purple" label="University & Talent Pipeline" />
          <h2 className="mt-3 text-2xl sm:text-3xl font-light text-[#202124]">
            {totalStudents.toLocaleString()} international students —{" "}
            <span className="text-[#9334EA] font-normal">only {latestRetention.retention_rate.toFixed(0)}% stay</span>
          </h2>
          <p className="mt-3 text-[#5F6368] max-w-2xl leading-relaxed">
            Three universities University of Vaasa, Vaasa University of Applied Sciences, and
            Novia UAS collectively train a large international talent pool each year. Yet retention
            of graduates in Vaasa remains under 55%, representing lost economic potential.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <ChartCard title="International students by university (2019–2024)">
              <UniversityStackedChart
                students={data.byYearUni}
                years={data.years}
                universities={data.universities}
              />
            </ChartCard>
            <ChartCard title="Post-graduation retention rate & retained count">
              <RetentionLineChart data={data.retention} />
            </ChartCard>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: BUSINESS CASE ─────────────────────────────── */}
      <section id="business" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionTag n="04" color="yellow" label="Business Case" />
          <h2 className="mt-3 text-2xl sm:text-3xl font-light text-[#202124]">
            Modelled on{" "}
            <span className="text-[#B06000] font-normal">International House Helsinki</span>
          </h2>
          <p className="mt-3 text-[#5F6368] max-w-2xl leading-relaxed">
            International House Helsinki has served over 21,000 clients per year since 2017,
            bringing DVV, Tax Administration, Kela, and immigration services under one roof.
            Vaasa's growing international workforce — anchored by major energy-sector employers —
            makes the same model a natural fit.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <ChartCard title="IH Helsinki — client visits per year">
              <BenchmarkColumnChart data={data.benchmark} />
            </ChartCard>
            <ChartCard title="Major employers international workforce in Vaasa">
              <EmployerBarChart data={data.employers} />
            </ChartCard>
          </div>
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────────────────────── */}
      <section className="bg-[#E8F0FE] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionTag n="→" color="blue" label="The Solution" />
          <h2 className="mt-3 text-2xl sm:text-3xl font-light text-[#202124]">
            Proposed launch services for Project Vaasa Hub
          </h2>
          <p className="mt-3 text-[#5F6368] max-w-2xl leading-relaxed">
            Bringing DVV, Finnish Tax Administration, Kela, Finnish Immigration Service, and
            TE-services under one roof the same model that has made International House Helsinki
            a benchmark for integration excellence.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.services.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl p-5 flex gap-3 items-start shadow-sm"
              >
                {(() => {
                  const Icon = serviceIcons[s.icon] ?? CircleHelp;
                  return <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor[s.priority] ?? "text-[#5F6368]"}`} strokeWidth={1.75} />;
                })()}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-[15px] text-[#202124]">{s.name}</p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityStyle[s.priority] ?? "bg-[#F8F9FA] text-[#5F6368]"}`}
                    >
                      {s.priority}
                    </span>
                  </div>
                  <p className="text-sm text-[#5F6368] mt-1 leading-snug">{s.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function HeroStat({
  value,
  label,
  sub,
  color,
}: {
  value: string;
  label: string;
  sub: string;
  color: "blue" | "green" | "red" | "yellow";
}) {
  const accent = {
    blue:   "border-t-[#1A73E8]",
    green:  "border-t-[#34A853]",
    red:    "border-t-[#EA4335]",
    yellow: "border-t-[#FBBC04]",
  }[color];

  const valColor = {
    blue:   "text-[#1A73E8]",
    green:  "text-[#188038]",
    red:    "text-[#EA4335]",
    yellow: "text-[#B06000]",
  }[color];

  return (
    <div
      className={`bg-white rounded-xl p-5 border-t-4 ${accent} shadow-sm`}
    >
      <p className={`text-3xl font-light ${valColor}`}>{value}</p>
      <p className="text-sm font-medium text-[#202124] mt-1">{label}</p>
      <p className="text-xs text-[#5F6368] mt-0.5">{sub}</p>
    </div>
  );
}

function SectionTag({
  n,
  color,
  label,
}: {
  n: string;
  color: "blue" | "red" | "yellow" | "purple";
  label: string;
}) {
  const colors = {
    blue:   "text-[#1A73E8]",
    red:    "text-[#EA4335]",
    yellow: "text-[#B06000]",
    purple: "text-[#9334EA]",
  }[color];

  return (
    <div className={`flex items-center gap-2 text-xs font-medium uppercase tracking-widest ${colors}`}>
      <span>{n}</span>
      <span className="h-px w-6 bg-current opacity-40" />
      <span>{label}</span>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md"
    >
      <div className="px-5 pt-5 pb-1">
        <p className="text-sm font-medium text-[#202124]">{title}</p>
      </div>
      <div className="px-2 pb-3">{children}</div>
    </div>
  );
}
