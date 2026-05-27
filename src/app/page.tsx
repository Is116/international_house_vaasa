import Link from "next/link";
import { db } from "@/lib/db";

async function getSummary() {
  const [latestImmigration, latestEmployment, latestStudents, services] =
    await Promise.all([
      db.execute(
        "SELECT foreign_born_population, total_population FROM immigration_trend ORDER BY year DESC LIMIT 1"
      ),
      db.execute(
        "SELECT finnish_born_rate, immigrant_rate FROM employment_gap ORDER BY year DESC LIMIT 1"
      ),
      db.execute(
        "SELECT SUM(international_students) as total FROM university_students WHERE year = 2024"
      ),
      db.execute("SELECT COUNT(*) as count FROM services"),
    ]);

  return {
    foreignBorn: Number(latestImmigration.rows[0]?.foreign_born_population ?? 0),
    totalPop: Number(latestImmigration.rows[0]?.total_population ?? 0),
    finnishRate: Number(latestEmployment.rows[0]?.finnish_born_rate ?? 0),
    immigrantRate: Number(latestEmployment.rows[0]?.immigrant_rate ?? 0),
    totalStudents: Number(latestStudents.rows[0]?.total ?? 0),
    serviceCount: Number(services.rows[0]?.count ?? 0),
  };
}

const pages = [
  {
    href: "/immigration",
    title: "Immigration Growth",
    desc: "Foreign-born population trends, top nationalities, and city-level comparisons",
    color: "bg-blue-600",
    num: "01",
  },
  {
    href: "/employment",
    title: "Employment & Integration Gap",
    desc: "Immigrant vs Finnish-born employment rates and the integration funnel",
    color: "bg-emerald-600",
    num: "02",
  },
  {
    href: "/university",
    title: "University & Talent Pipeline",
    desc: "International student volumes across Vaasa universities and post-graduation retention",
    color: "bg-violet-600",
    num: "03",
  },
  {
    href: "/business",
    title: "Business Case & ROI",
    desc: "Employer landscape, projected IH Vaasa client volumes benchmarked against IHH Helsinki",
    color: "bg-amber-600",
    num: "04",
  },
];

export default async function HomePage() {
  const s = await getSummary();
  const immigrantPct = ((s.foreignBorn / s.totalPop) * 100).toFixed(1);
  const gap = (s.finnishRate - s.immigrantRate).toFixed(1);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">
          International House Vaasa
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Data-driven proposal for establishing a one-stop public service hub
          for international newcomers in Vaasa, modelled on International House
          Helsinki.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Foreign-born residents"
          value={s.foreignBorn.toLocaleString()}
          sub={`${immigrantPct}% of Vaasa population`}
          color="blue"
        />
        <StatCard
          label="Employment gap"
          value={`${gap} pp`}
          sub={`Finnish ${s.finnishRate}% vs Immigrant ${s.immigrantRate}%`}
          color="emerald"
        />
        <StatCard
          label="Intl. students (2024)"
          value={s.totalStudents.toLocaleString()}
          sub="Across three universities"
          color="violet"
        />
        <StatCard
          label="Proposed services"
          value={s.serviceCount.toString()}
          sub="For initial launch phase"
          color="amber"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Dashboard Pages
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {pages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all flex gap-4"
            >
              <span
                className={`${p.color} text-white text-xs font-bold rounded-lg w-10 h-10 flex items-center justify-center shrink-0`}
              >
                {p.num}
              </span>
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{p.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="font-semibold text-blue-900 mb-2">About this proposal</h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          International House Vaasa (IH Vaasa) is proposed as a centralised
          service hub for international newcomers, bringing together DVV,
          Finnish Tax Administration, Kela, Finnish Immigration Service, and
          TE-services under one roof — modelled on{" "}
          <span className="font-medium">International House Helsinki</span>,
          which has served over 21,000 clients annually since 2017. Vaasa is
          home to the{" "}
          <span className="font-medium">Vaasa Energy Cluster</span>, one of the
          world&apos;s largest energy technology hubs, with major employers
          including Wärtsilä, ABB, Danfoss, and ANDRITZ.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: "blue" | "emerald" | "violet" | "amber";
}) {
  const ring = {
    blue: "border-blue-200 bg-blue-50",
    emerald: "border-emerald-200 bg-emerald-50",
    violet: "border-violet-200 bg-violet-50",
    amber: "border-amber-200 bg-amber-50",
  }[color];

  const text = {
    blue: "text-blue-700",
    emerald: "text-emerald-700",
    violet: "text-violet-700",
    amber: "text-amber-700",
  }[color];

  return (
    <div className={`${ring} border rounded-xl p-4`}>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className={`${text} text-2xl font-bold mt-1`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );
}
