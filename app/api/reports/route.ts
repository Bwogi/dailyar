import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import { ActivityReport } from "@/app/types/types";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("security");
    const { report } = (await request.json()) as {
      report: Omit<ActivityReport, "_id">;
    };

    const result = await db.collection("reports").insertOne({
      ...report,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!result.acknowledged) {
      throw new Error("Failed to insert report");
    }

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      message: "Report created successfully",
    });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create report",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("security");
    const { id, updates } = (await request.json()) as {
      id: string;
      updates: Partial<Omit<ActivityReport, "_id">>;
    };

    const result = await db.collection("reports").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );

    if (!result.acknowledged) {
      throw new Error("Failed to update report");
    }

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Report not found",
        },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No changes made to the report",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Report updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update report",
      },
      { status: 500 }
    );
  }
}
