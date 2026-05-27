import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function exportAll() {
  const [
    immigrationTrend,
    topNationalities,
    employmentGap,
    integrationFunnel,
    universityStudents,
    graduationRetention,
    employers,
    services,
    ihBenchmark,
  ] = await Promise.all([
    db.execute("SELECT * FROM immigration_trend ORDER BY year"),
    db.execute("SELECT * FROM top_nationalities ORDER BY year, population DESC"),
    db.execute("SELECT * FROM employment_gap ORDER BY year"),
    db.execute("SELECT * FROM integration_funnel ORDER BY id"),
    db.execute("SELECT * FROM university_students ORDER BY year, university"),
    db.execute("SELECT * FROM graduation_retention ORDER BY year"),
    db.execute("SELECT * FROM employers ORDER BY international_employees DESC"),
    db.execute("SELECT * FROM services ORDER BY id"),
    db.execute("SELECT * FROM ih_benchmark ORDER BY year"),
  ]);

  const data = {
    exportedAt: new Date().toISOString(),
    immigration: {
      trends: immigrationTrend.rows,
      topNationalities: topNationalities.rows,
    },
    employment: {
      gap: employmentGap.rows,
      integrationFunnel: integrationFunnel.rows,
    },
    university: {
      students: universityStudents.rows,
      graduationRetention: graduationRetention.rows,
    },
    business: {
      employers: employers.rows,
      services: services.rows,
      ihBenchmark: ihBenchmark.rows,
    },
  };

  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync("report-data.json", json, "utf-8");
  console.log("✅ Exported to report-data.json");
  await db.close();
}

exportAll().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
