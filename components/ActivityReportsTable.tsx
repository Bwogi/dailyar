// components/ActivityReportsTable.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Eye } from "lucide-react";
import { ActivityReport } from "@/app/types/types";

export default function ActivityReportsTable() {
  const [reports, setReports] = useState<ActivityReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<ActivityReport | null>(
    null
  );

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());
      if (searchTerm.trim()) params.append("search", searchTerm.trim());

      const response = await fetch(`/api/reports?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      console.log("Loaded reports:", data);
      setReports(data);
    } catch (err) {
      console.error("Error loading reports:", err);
      setError(err instanceof Error ? err.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, searchTerm]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return (
    <div className="space-y-4 p-4">
      {/* Filters Section */}
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-end lg:space-x-4">
        {/* Date Filters */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[160px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PP") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[160px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PP") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by officer name, ID, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  loadReports();
                }
              }}
              className="pl-8"
            />
          </div>
          <Button onClick={loadReports} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
      )}

      {/* Responsive Table */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50 transition-colors">
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead className="whitespace-nowrap">
                  Officer Name
                </TableHead>
                <TableHead className="whitespace-nowrap">Location</TableHead>
                <TableHead className="whitespace-nowrap">Start Time</TableHead>
                <TableHead className="whitespace-nowrap hidden md:table-cell">
                  End Time
                </TableHead>
                <TableHead className="whitespace-nowrap hidden sm:table-cell">
                  Incidents
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow className="hover:bg-muted/50 transition-colors">
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {loading ? "Loading reports..." : "No reports found"}
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow
                    className="hover:bg-muted/50 transition-colors"
                    key={report._id?.toString()}
                  >
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(report.date), "PP")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {report.officerName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {report.location}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(report.shiftStart), "pp")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap hidden md:table-cell">
                      {report.shiftEnd
                        ? format(new Date(report.shiftEnd), "pp")
                        : "-"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {report.incidents.length}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        {selectedReport && (
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-[85vh]">
                            <DialogHeader>
                              <DialogTitle>Activity Report Details</DialogTitle>
                              <DialogDescription>
                                Report for {selectedReport.officerName} on{" "}
                                {format(new Date(selectedReport.date), "PP")}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              {/* Basic Information */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium">Officer ID</h4>
                                  <p>{selectedReport.officerId}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Location</h4>
                                  <p className="break-words">
                                    {selectedReport.location}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Start Time</h4>
                                  <p>
                                    {format(
                                      new Date(selectedReport.shiftStart),
                                      "pp"
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium">End Time</h4>
                                  <p>
                                    {selectedReport.shiftEnd
                                      ? format(
                                          new Date(selectedReport.shiftEnd),
                                          "pp"
                                        )
                                      : "-"}
                                  </p>
                                </div>
                              </div>

                              {/* Equipment */}
                              <div>
                                <h4 className="font-medium mb-2">Equipment</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {Object.entries(selectedReport.equipment).map(
                                    ([key, value]) => (
                                      <div
                                        key={key}
                                        className="flex items-center gap-2"
                                      >
                                        <span
                                          className={
                                            value
                                              ? "text-green-600"
                                              : "text-red-600"
                                          }
                                        >
                                          {value ? "✓" : "✗"}
                                        </span>
                                        <span className="capitalize">
                                          {key
                                            .replace(/([A-Z])/g, " $1")
                                            .trim()}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>

                              {/* Incidents */}
                              {selectedReport.incidents.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Incidents
                                  </h4>
                                  <div className="space-y-3">
                                    {selectedReport.incidents.map(
                                      (incident, index) => (
                                        <div
                                          key={index}
                                          className="border rounded-md p-3"
                                        >
                                          <p className="font-medium capitalize">
                                            {incident.type}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            {format(
                                              new Date(incident.timeReported),
                                              "PPp"
                                            )}
                                          </p>
                                          <p className="mt-2 break-words">
                                            {incident.description}
                                          </p>
                                          <p className="mt-1 break-words">
                                            <span className="font-medium">
                                              Action taken:{" "}
                                            </span>
                                            {incident.actionTaken}
                                          </p>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Responsibilities */}
                              <div>
                                <h4 className="font-medium mb-2">
                                  Shift Responsibilities
                                </h4>
                                <p className="whitespace-pre-wrap break-words">
                                  {selectedReport.responsibilities}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
