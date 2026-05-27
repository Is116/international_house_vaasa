import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [students, retention] = await Promise.all([
    db.execute("SELECT * FROM university_students ORDER BY year, university"),
    db.execute("SELECT * FROM graduation_retention ORDER BY year"),
  ]);

  return NextResponse.json({
    students: students.rows,
    retention: retention.rows,
  });
}
