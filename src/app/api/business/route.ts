import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [employers, services, benchmark] = await Promise.all([
    db.execute("SELECT * FROM employers ORDER BY international_employees DESC"),
    db.execute("SELECT * FROM services ORDER BY id"),
    db.execute("SELECT * FROM ih_benchmark ORDER BY year"),
  ]);

  return NextResponse.json({
    employers: employers.rows,
    services: services.rows,
    benchmark: benchmark.rows,
  });
}
