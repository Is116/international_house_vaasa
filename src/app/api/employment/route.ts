import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [gap, funnel] = await Promise.all([
    db.execute("SELECT * FROM employment_gap ORDER BY year"),
    db.execute("SELECT * FROM integration_funnel ORDER BY id"),
  ]);

  return NextResponse.json({
    gap: gap.rows,
    funnel: funnel.rows,
  });
}
