import { db } from "@/lib/db";

async function getData() {
  const [trends, nationalities] = await Promise.all([
    db.execute("SELECT * FROM immigration_trend ORDER BY year"),
    db.execute(
      "SELECT * FROM top_nationalities WHERE year = 2024 ORDER BY population DESC"
    ),
  ]);
  return { trends: trends.rows, nationalities: nationalities.rows };
}

export default async function ImmigrationPage() {
  const { trends, nationalities } = await getData();

  const latest = trends[trends.length - 1];
  const earliest = trends[0];
  const growth = (
    ((Number(latest.foreign_born_population) -
      Number(earliest.foreign_born_population)) /
      Number(earliest.foreign_born_population)) *
    100
  ).toFixed(1);

  const totalNationalities = nationalities.reduce(
    (sum, n) => sum + Number(n.population),
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-blue-900">Immigration Growth</h1>
        <p className="text-slate-500 mt-1">
          Foreign-born population in Vaasa 2019–2024 · Source: Statistics
          Finland (stat.fi)
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Foreign-born (2024)</p>
          <p className="text-2xl font-bold text-blue-700">
            {Number(latest.foreign_born_population).toLocaleString()}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Share of population</p>
          <p className="text-2xl font-bold text-blue-700">
            {(
              (Number(latest.foreign_born_population) /
                Number(latest.total_population)) *
              100
            ).toFixed(1)}
            %
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Growth since 2019</p>
          <p className="text-2xl font-bold text-blue-700">+{growth}%</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-semibold text-slate-800 mb-4">
          Foreign-born Population Trend
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-slate-600 font-medium">Year</th>
                <th className="text-right py-2 text-slate-600 font-medium">
                  Foreign-born
                </th>
                <th className="text-right py-2 text-slate-600 font-medium">
                  Total population
                </th>
                <th className="text-right py-2 text-slate-600 font-medium">Share</th>
                <th className="text-right py-2 text-slate-600 font-medium">
                  Net immigration
                </th>
              </tr>
            </thead>
            <tbody>
              {trends.map((row) => (
                <tr
                  key={String(row.year)}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="py-2 font-medium">{String(row.year)}</td>
                  <td className="py-2 text-right">
                    {Number(row.foreign_born_population).toLocaleString()}
                  </td>
                  <td className="py-2 text-right">
                    {Number(row.total_population).toLocaleString()}
                  </td>
                  <td className="py-2 text-right">
                    {(
                      (Number(row.foreign_born_population) /
                        Number(row.total_population)) *
                      100
                    ).toFixed(1)}
                    %
                  </td>
                  <td className="py-2 text-right text-emerald-600 font-medium">
                    +{Number(row.net_immigration).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-semibold text-slate-800 mb-4">
          Top Nationalities (2024)
        </h2>
        <div className="space-y-3">
          {nationalities.map((n) => {
            const pct = (Number(n.population) / totalNationalities) * 100;
            return (
              <div key={String(n.country)}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{String(n.country)}</span>
                  <span className="text-slate-500">
                    {Number(n.population).toLocaleString()} ({pct.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
