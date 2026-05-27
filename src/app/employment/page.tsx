import { db } from "@/lib/db";

async function getData() {
  const [gap, funnel] = await Promise.all([
    db.execute("SELECT * FROM employment_gap ORDER BY year"),
    db.execute("SELECT * FROM integration_funnel ORDER BY id"),
  ]);
  return { gap: gap.rows, funnel: funnel.rows };
}

export default async function EmploymentPage() {
  const { gap, funnel } = await getData();
  const latest = gap[gap.length - 1];
  const empGap = (
    Number(latest.finnish_born_rate) - Number(latest.immigrant_rate)
  ).toFixed(1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-emerald-900">
          Employment & Integration Gap
        </h1>
        <p className="text-slate-500 mt-1">
          Employment rates by origin and integration funnel · Source: Statistics
          Finland
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Finnish-born rate (2024)</p>
          <p className="text-2xl font-bold text-emerald-700">
            {Number(latest.finnish_born_rate).toFixed(1)}%
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Immigrant rate (2024)</p>
          <p className="text-2xl font-bold text-orange-700">
            {Number(latest.immigrant_rate).toFixed(1)}%
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Employment gap</p>
          <p className="text-2xl font-bold text-red-700">{empGap} pp</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-semibold text-slate-800 mb-4">
          Employment Rate Comparison (2019–2024)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-slate-600 font-medium">Year</th>
                <th className="text-right py-2 text-slate-600 font-medium">
                  Finnish-born
                </th>
                <th className="text-right py-2 text-slate-600 font-medium">
                  Immigrant
                </th>
                <th className="text-right py-2 text-slate-600 font-medium">Gap</th>
                <th className="py-2 pl-4 text-slate-600 font-medium text-left">
                  Visual gap
                </th>
              </tr>
            </thead>
            <tbody>
              {gap.map((row) => {
                const g = Number(row.finnish_born_rate) - Number(row.immigrant_rate);
                return (
                  <tr
                    key={String(row.year)}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-2 font-medium">{String(row.year)}</td>
                    <td className="py-2 text-right text-emerald-700 font-medium">
                      {Number(row.finnish_born_rate).toFixed(1)}%
                    </td>
                    <td className="py-2 text-right text-orange-600 font-medium">
                      {Number(row.immigrant_rate).toFixed(1)}%
                    </td>
                    <td className="py-2 text-right text-red-600 font-medium">
                      {g.toFixed(1)} pp
                    </td>
                    <td className="py-2 pl-4">
                      <div className="flex items-center gap-1">
                        <div
                          className="h-2 bg-emerald-400 rounded-sm"
                          style={{ width: `${Number(row.finnish_born_rate) * 0.8}px` }}
                        />
                        <div
                          className="h-2 bg-orange-400 rounded-sm"
                          style={{ width: `${Number(row.immigrant_rate) * 0.8}px` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-semibold text-slate-800 mb-1">
          Integration Funnel (Annual cohort)
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          From arrival in Vaasa to 3-year retention
        </p>
        <div className="space-y-3">
          {funnel.map((stage, i) => {
            const pct = Number(stage.percentage);
            const colors = [
              "bg-blue-600",
              "bg-blue-500",
              "bg-emerald-500",
              "bg-emerald-400",
              "bg-amber-500",
              "bg-red-500",
            ];
            return (
              <div key={String(stage.stage)}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{String(stage.stage)}</span>
                  <span className="text-slate-500">
                    {Number(stage.count).toLocaleString()} ({pct.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-5 bg-slate-100 rounded overflow-hidden">
                  <div
                    className={`h-full ${colors[i] ?? "bg-slate-400"} rounded transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-3">
          * Only 24.7% of annual arrivals remain employed in Vaasa after 3
          years — a key argument for Project Vaasa Hub services.
        </p>
      </div>
    </div>
  );
}
