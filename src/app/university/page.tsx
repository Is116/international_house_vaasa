import { db } from "@/lib/db";

async function getData() {
  const [students, retention] = await Promise.all([
    db.execute("SELECT * FROM university_students ORDER BY year, university"),
    db.execute("SELECT * FROM graduation_retention ORDER BY year"),
  ]);
  return { students: students.rows, retention: retention.rows };
}

export default async function UniversityPage() {
  const { students, retention } = await getData();

  const years = [...new Set(students.map((s) => Number(s.year)))].sort();
  const universities = [...new Set(students.map((s) => String(s.university)))];

  const byYearUni: Record<string, Record<string, number>> = {};
  for (const row of students) {
    const y = String(row.year);
    const u = String(row.university);
    if (!byYearUni[y]) byYearUni[y] = {};
    byYearUni[y][u] = Number(row.international_students);
  }

  const latestRetention = retention[retention.length - 1];
  const totalStudents2024 = Object.values(byYearUni["2024"] ?? {}).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-violet-900">
          University & Talent Pipeline
        </h1>
        <p className="text-slate-500 mt-1">
          International students at Vaasa universities 2019–2024 · Source:
          Vipunen.fi
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Total intl. students (2024)</p>
          <p className="text-2xl font-bold text-violet-700">
            {totalStudents2024.toLocaleString()}
          </p>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Retention rate (2024)</p>
          <p className="text-2xl font-bold text-violet-700">
            {Number(latestRetention.retention_rate).toFixed(0)}%
          </p>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Retained graduates (2024)</p>
          <p className="text-2xl font-bold text-violet-700">
            {Number(latestRetention.retained).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-semibold text-slate-800 mb-4">
          International Students by University
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-slate-600 font-medium">Year</th>
                {universities.map((u) => (
                  <th
                    key={u}
                    className="text-right py-2 text-slate-600 font-medium"
                  >
                    {u}
                  </th>
                ))}
                <th className="text-right py-2 text-slate-600 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {years.map((year) => {
                const row = byYearUni[String(year)] ?? {};
                const total = Object.values(row).reduce((a, b) => a + b, 0);
                return (
                  <tr
                    key={year}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-2 font-medium">{year}</td>
                    {universities.map((u) => (
                      <td key={u} className="py-2 text-right">
                        {(row[u] ?? 0).toLocaleString()}
                      </td>
                    ))}
                    <td className="py-2 text-right font-semibold text-violet-700">
                      {total.toLocaleString()}
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
          Post-graduation Retention
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          International graduates who remained in Vaasa after graduation
        </p>
        <div className="space-y-3">
          {retention.map((row) => {
            const rate = Number(row.retention_rate);
            return (
              <div key={String(row.year)}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{String(row.year)}</span>
                  <span className="text-slate-500">
                    {Number(row.retained)}/{Number(row.graduates)} graduates
                    retained ({rate.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-3">
          * Retention rate has improved from 40% (2019) to 52% (2024), showing
          growing attachment to the Vaasa labour market.
        </p>
      </div>
    </div>
  );
}
