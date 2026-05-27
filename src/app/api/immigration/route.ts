import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [trends, nationalities] = await Promise.all([
    db.execute("SELECT * FROM immigration_trend ORDER BY year"),
    db.execute("SELECT * FROM top_nationalities WHERE year = 2024 ORDER BY population DESC"),
  ]);

  return NextResponse.json({
    trends: trends.rows,
    nationalities: nationalities.rows,
  });
}
