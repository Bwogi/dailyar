import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import { ActivityReport } from "@/app/types/types";
import { Filter, Document, WithId, ObjectId } from "mongodb";

type ActivityReportDocument = WithId<Document> & Omit<ActivityReport, "_id">;

// interface DateQuery {
//   $gte?: Date;
//   $lte?: Date;
// }

// interface ReportQuery {
//   date?: DateQuery;
//   $or?: Array<{
//     [key in "officerName" | "officerId" | "location"]?: {
//       $regex: string;
//       $options: string;
//     };
//   }>;
// }

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");

    const client = await clientPromise;
    const db = client.db("security");
    const collection = db.collection<ActivityReportDocument>("reports");

    const query: Filter<ActivityReportDocument> = {};

    // Add date range filter
    if (startDate || endDate) {
      query.shiftStart = {};
      if (startDate) {
        query.shiftStart = {
          ...query.shiftStart,
          $gte: startDate,
        };
      }
      if (endDate) {
        query.shiftStart = {
          ...query.shiftStart,
          $lte: endDate,
        };
      }
    }

    // Add search filter
    if (search) {
      query.$or = [
        { officerName: { $regex: search, $options: "i" } },
        { officerId: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    console.log("MongoDB Query:", JSON.stringify(query, null, 2));

    const reports = await collection
      .find(query)
      .sort({ shiftStart: -1 })
      .toArray();

    console.log(`Found ${reports.length} reports`);

    const serializedReports = reports.map((report) => ({
      ...report,
      _id: report._id.toString(),
    }));

    return NextResponse.json(serializedReports);
  } catch (error) {
    console.error("Error in /api/reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
