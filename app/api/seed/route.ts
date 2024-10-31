// app/api/seed/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import { ActivityReport } from "@/app/types/types";

const testData: Partial<ActivityReport>[] = [
  {
    officerId: "OFF001",
    officerName: "John Doe",
    location: "CAL1-Badge Check",
    date: new Date().toISOString(),
    shiftStart: new Date().toISOString(),
    shiftEnd: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
    equipment: {
      keys: true,
      radio: true,
      patrolCar: false,
      accessCards: true,
      phone: true,
      tablet: false,
      other: "Flashlight",
    },
    incidents: [
      {
        type: "falseAlarm",
        description: "Fire alarm triggered accidentally",
        actionTaken: "Investigated and reset alarm",
        timeReported: new Date().toISOString(),
      },
    ],
    responsibilities:
      "Conducted regular patrols\nChecked IDs\nMonitored security cameras",
    status: "completed",
  },
  {
    officerId: "OFF002",
    officerName: "Jane Smith",
    location: "CAL2-Supervisor",
    date: new Date().toISOString(),
    shiftStart: new Date().toISOString(),
    equipment: {
      keys: true,
      radio: true,
      patrolCar: true,
      accessCards: true,
      phone: true,
      tablet: true,
      other: "",
    },
    incidents: [],
    responsibilities:
      "Supervising entrance security\nCoordinating shift changes",
    status: "active",
  },
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("security");

    // Clear existing data
    await db.collection("reports").deleteMany({});

    // Insert test data
    const result = await db.collection("reports").insertMany(testData);

    return NextResponse.json({
      success: true,
      message: `Inserted ${result.insertedCount} test reports`,
      insertedIds: result.insertedIds,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
