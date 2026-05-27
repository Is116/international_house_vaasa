import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seed() {
  console.log("Creating tables...");

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS immigration_trend (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      foreign_born_population INTEGER NOT NULL,
      total_population INTEGER NOT NULL,
      net_immigration INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS top_nationalities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country TEXT NOT NULL,
      population INTEGER NOT NULL,
      year INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS employment_gap (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      finnish_born_rate REAL NOT NULL,
      immigrant_rate REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS integration_funnel (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stage TEXT NOT NULL,
      count INTEGER NOT NULL,
      percentage REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS university_students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      university TEXT NOT NULL,
      international_students INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS graduation_retention (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      graduates INTEGER NOT NULL,
      retained INTEGER NOT NULL,
      retention_rate REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS employers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      sector TEXT NOT NULL,
      international_employees INTEGER NOT NULL,
      founded INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      priority TEXT NOT NULL,
      rationale TEXT NOT NULL,
      icon TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ih_benchmark (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      ihh_clients INTEGER NOT NULL,
      ihv_projected INTEGER NOT NULL
    );
  `);

  console.log("Seeding immigration trends...");
  await db.executeMultiple(`
    DELETE FROM immigration_trend;
    INSERT INTO immigration_trend (year, foreign_born_population, total_population, net_immigration) VALUES
      (2019, 8240, 67418, 420),
      (2020, 8690, 67580, 450),
      (2021, 9180, 67820, 490),
      (2022, 9850, 68240, 670),
      (2023, 10640, 68910, 790),
      (2024, 11320, 69450, 680);
  `);

  console.log("Seeding top nationalities...");
  await db.executeMultiple(`
    DELETE FROM top_nationalities;
    INSERT INTO top_nationalities (country, population, year) VALUES
      ('India', 1820, 2024),
      ('Philippines', 1240, 2024),
      ('Russia', 980, 2024),
      ('Estonia', 870, 2024),
      ('Germany', 760, 2024),
      ('Vietnam', 640, 2024),
      ('China', 580, 2024),
      ('Ukraine', 520, 2024),
      ('Other', 2910, 2024);
  `);

  console.log("Seeding employment gap...");
  await db.executeMultiple(`
    DELETE FROM employment_gap;
    INSERT INTO employment_gap (year, finnish_born_rate, immigrant_rate) VALUES
      (2019, 73.4, 58.2),
      (2020, 71.8, 55.6),
      (2021, 72.9, 57.1),
      (2022, 74.2, 59.8),
      (2023, 75.1, 62.3),
      (2024, 75.8, 63.7);
  `);

  console.log("Seeding integration funnel...");
  await db.executeMultiple(`
    DELETE FROM integration_funnel;
    INSERT INTO integration_funnel (stage, count, percentage) VALUES
      ('Arrived in Vaasa', 790, 100),
      ('Registered (DVV/Tax)', 680, 86),
      ('Language course enrolled', 510, 64.6),
      ('TE-services registered', 390, 49.4),
      ('Employed within 12 months', 260, 32.9),
      ('Retained after 3 years', 195, 24.7);
  `);

  console.log("Seeding university students...");
  await db.executeMultiple(`
    DELETE FROM university_students;
    INSERT INTO university_students (year, university, international_students) VALUES
      (2019, 'University of Vaasa', 580),
      (2019, 'VAMK', 420),
      (2019, 'Novia', 210),
      (2020, 'University of Vaasa', 560),
      (2020, 'VAMK', 400),
      (2020, 'Novia', 195),
      (2021, 'University of Vaasa', 610),
      (2021, 'VAMK', 440),
      (2021, 'Novia', 220),
      (2022, 'University of Vaasa', 680),
      (2022, 'VAMK', 490),
      (2022, 'Novia', 245),
      (2023, 'University of Vaasa', 740),
      (2023, 'VAMK', 530),
      (2023, 'Novia', 268),
      (2024, 'University of Vaasa', 810),
      (2024, 'VAMK', 575),
      (2024, 'Novia', 290);
  `);

  console.log("Seeding graduation retention...");
  await db.executeMultiple(`
    DELETE FROM graduation_retention;
    INSERT INTO graduation_retention (year, graduates, retained, retention_rate) VALUES
      (2019, 380, 152, 40.0),
      (2020, 360, 151, 41.9),
      (2021, 410, 176, 42.9),
      (2022, 450, 207, 46.0),
      (2023, 490, 240, 49.0),
      (2024, 540, 281, 52.0);
  `);

  console.log("Seeding employers...");
  await db.executeMultiple(`
    DELETE FROM employers;
    INSERT INTO employers (company, sector, international_employees, founded) VALUES
      ('Wärtsilä', 'Energy Technology', 1200, 1834),
      ('ABB', 'Power & Automation', 980, 1988),
      ('Danfoss', 'Industrial Automation', 420, 1997),
      ('ANDRITZ', 'Industrial Machinery', 310, 2005),
      ('Vacon / Danfoss Drives', 'Power Electronics', 280, 1993),
      ('University of Vaasa', 'Higher Education', 340, 1968),
      ('VAMK', 'Higher Education', 180, 1990),
      ('Vaasa Hospital District', 'Healthcare', 260, 1960);
  `);

  console.log("Seeding services...");
  await db.executeMultiple(`
    DELETE FROM services;
    INSERT INTO services (name, priority, rationale, icon) VALUES
      ('Registration & Formalities', 'Highest', 'DVV, Tax, Kela — immediate need on arrival', '🏛️'),
      ('Employment Coaching', 'High', 'Addresses immigrant employment gap', '💼'),
      ('Pre-arrival Support (Employers)', 'High', 'Energy cluster B2B angle, easiest to fund', '🏭'),
      ('General Information & Guidance', 'Medium', 'Day-to-day settling-in support', 'ℹ️'),
      ('Spouse Program', 'Medium', 'Critical for talent retention', '👨‍👩‍👧');
  `);

  console.log("Seeding IH benchmark...");
  await db.executeMultiple(`
    DELETE FROM ih_benchmark;
    INSERT INTO ih_benchmark (year, ihh_clients, ihv_projected) VALUES
      (2017, 4200, 0),
      (2018, 8900, 0),
      (2019, 12400, 0),
      (2020, 10800, 0),
      (2021, 13600, 0),
      (2022, 16200, 0),
      (2023, 18500, 0),
      (2024, 21000, 0),
      (2025, 0, 1800),
      (2026, 0, 3200),
      (2027, 0, 5100);
  `);

  console.log("✅ Database seeded successfully!");
  await db.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
