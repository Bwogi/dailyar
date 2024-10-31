import ActivityReportsTable from "@/components/ActivityReportsTable";

export default function ReportsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Activity Reports</h1>
      <ActivityReportsTable />
    </div>
  );
}
