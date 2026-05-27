import { db } from "@/lib/db";

async function getData() {
  const [employers, services, benchmark] = await Promise.all([
    db.execute(
      "SELECT * FROM employers ORDER BY international_employees DESC"
    ),
    db.execute("SELECT * FROM services ORDER BY id"),
    db.execute("SELECT * FROM ih_benchmark ORDER BY year"),
  ]);
  return { employers: employers.rows, services: services.rows, benchmark: benchmark.rows };
}

const priorityColor: Record<string, string> = {
  Highest: "bg-red-100 text-red-700 border border-red-200",
  High: "bg-orange-100 text-orange-700 border border-orange-200",
  Medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
};

export default async function BusinessPage() {
  const { employers, services, benchmark } = await getData();

  const totalIntlEmployees = employers.reduce(
    (s, e) => s + Number(e.international_employees),
    0
  );

  const maxIHH = Math.max(...benchmark.map((b) => Number(b.ihh_clients)));
  const projectedMax = Math.max(...benchmark.map((b) => Number(b.ihv_projected)));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-amber-900">
          Business Case & ROI
        </h1>
        <p className="text-slate-500 mt-1">
          Employer landscape, proposed services, and client volume projection vs
          IHH Helsinki
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Major employers tracked</p>
          <p className="text-2xl font-bold text-amber-700">{employers.length}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Intl. employees (est.)</p>
          <p className="text-2xl font-bold text-amber-700">
            {totalIntlEmployees.toLocaleString()}+
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Project Vaasa Hub projected 2027</p>
          <p className="text-2xl font-bold text-amber-700">5,100</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-semibold text-slate-800 mb-4">
          Proposed Launch Services
        </h2>
        <div className="space-y-3">
          {services.map((s) => (
            <div
              key={String(s.name)}
              className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100"
            >
              <span className="text-2xl">{String(s.icon)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-900">{String(s.name)}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[String(s.priority)] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {String(s.priority)}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{String(s.rationale)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-semibold text-slate-800 mb-4">
          Major Employers in Vaasa International Workforce
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-slate-600 font-medium">Company</th>
                <th className="text-left py-2 text-slate-600 font-medium">Sector</th>
                <th className="text-right py-2 text-slate-600 font-medium">
                  Intl. staff (est.)
                </th>
                <th className="py-2 pl-4 text-slate-600 font-medium text-left">
                  Share
                </th>
              </tr>
            </thead>
            <tbody>
              {employers.map((e) => {
                const pct =
                  (Number(e.international_employees) / totalIntlEmployees) * 100;
                return (
                  <tr
                    key={String(e.company)}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-2 font-medium">{String(e.company)}</td>
                    <td className="py-2 text-slate-500">{String(e.sector)}</td>
                    <td className="py-2 text-right font-semibold">
                      {Number(e.international_employees).toLocaleString()}
                    </td>
                    <td className="py-2 pl-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">
                          {pct.toFixed(0)}%
                        </span>
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
          Client Volume: IHH Helsinki (actual) vs Project Vaasa Hub (projected)
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          IHH historical data from annual reports; Project Vaasa Hub projections based on
          population ratio
        </p>
        <div className="space-y-2">
          {benchmark.map((row) => {
            const isIHH = Number(row.ihh_clients) > 0;
            const val = isIHH
              ? Number(row.ihh_clients)
              : Number(row.ihv_projected);
            const max = isIHH ? maxIHH : projectedMax;
            const pct = (val / max) * 80;
            return (
              <div key={String(row.year)} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-10 text-right">
                  {String(row.year)}
                </span>
                {isIHH ? (
                  <div
                    className="h-5 bg-blue-500 rounded text-xs text-white flex items-center px-2 min-w-0"
                    style={{ width: `${pct}%` }}
                  >
                    {val >= 5000 ? val.toLocaleString() : ""}
                  </div>
                ) : (
                  <div
                    className="h-5 bg-amber-400 rounded text-xs text-white flex items-center px-2 min-w-0 border border-amber-300"
                    style={{ width: `${pct}%` }}
                  >
                    {val.toLocaleString()}
                  </div>
                )}
                <span className="text-xs text-slate-500">{val.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            IHH Helsinki (actual)
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-400 rounded" />
            Project Vaasa Hub (projected)
          </div>
        </div>
      </div>
    </div>
  );
}
