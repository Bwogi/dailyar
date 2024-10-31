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
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/reports?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      console.log("Loaded reports:", data); // Debug log
      setReports(data);
    } catch (err) {
      console.error("Error loading reports:", err);
      setError(err instanceof Error ? err.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, searchTerm]); // Add dependencies for the callback

  useEffect(() => {
    loadReports();
  }, [loadReports]); // Run once when component mounts

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        {/* Date Range Filter */}
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[160px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PP") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
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
              <Button variant="outline" className="w-[160px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PP") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
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
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by officer name, ID, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={loadReports} disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Officer Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Incidents</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  {loading ? "Loading reports..." : "No reports found"}
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report._id?.toString()}>
                  <TableCell>{format(new Date(report.date), "PP")}</TableCell>
                  <TableCell>{report.officerName}</TableCell>
                  <TableCell>{report.location}</TableCell>
                  <TableCell>
                    {format(new Date(report.shiftStart), "pp")}
                  </TableCell>
                  <TableCell>
                    {report.shiftEnd
                      ? format(new Date(report.shiftEnd), "pp")
                      : "-"}
                  </TableCell>
                  <TableCell>{report.incidents.length}</TableCell>
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
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Activity Report Details</DialogTitle>
                            <DialogDescription>
                              Report for {selectedReport.officerName} on{" "}
                              {format(new Date(selectedReport.date), "PP")}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            {/* Basic Information */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium">Officer ID</h4>
                                <p>{selectedReport.officerId}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Location</h4>
                                <p>{selectedReport.location}</p>
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
                              <div className="grid grid-cols-2 gap-2">
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
                                        {key.replace(/([A-Z])/g, " $1").trim()}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>

                            {/* Incidents */}
                            {selectedReport.incidents.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Incidents</h4>
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
                                        <p className="mt-2">
                                          {incident.description}
                                        </p>
                                        <p className="mt-1">
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
                              <p className="whitespace-pre-wrap">
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
  );
}
