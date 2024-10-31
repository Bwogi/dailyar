// components/NewReportForm.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ActivityReport,
  Equipment,
  Incident,
  SecurityLocation,
} from "@/app/types/types";

type ReportState = Omit<ActivityReport, "_id"> & {
  savedId?: string;
};

const SECURITY_LOCATIONS: SecurityLocation[] = [
  "Security Account Manager",
  "CAL1-Badge Check",
  "CAL1-Bag Check",
  "CAL1-Rear Entrance",
  "CAL1-Receiving(East Gate)",
  "CAL1-Shipping(West Gate)",
  "CAL1-Supervisor",
  "CAL2-Badge Check",
  "CAL2-Bag Check",
  "CAL1-Receiving(North Gate)",
  "CAL1-Shipping(South Gate)",
  "CAL2-Supervisor",
];

export default function NewReportForm() {
  const [report, setReport] = useState<ReportState>({
    officerId: "",
    officerName: "",
    location: "" as SecurityLocation,
    date: new Date().toISOString().split("T")[0],
    equipment: {
      keys: false,
      radio: false,
      patrolCar: false,
      accessCards: false,
      phone: false,
      tablet: false,
    },
    incidents: [],
    responsibilities: "",
    status: "active",
    shiftStart: "",
  });

  const [newIncident, setNewIncident] = useState<Partial<Incident>>({
    type: "fire",
    description: "",
    actionTaken: "",
    timeReported: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateStartDuty = () => {
    if (!report.officerId.trim()) return "Officer ID is required";
    if (!report.officerName.trim()) return "Officer Name is required";
    if (!report.location) return "Security Post Location is required";

    const hasEquipment = Object.values(report.equipment).some(
      (value) => value === true
    );
    if (!hasEquipment) return "At least one equipment item must be checked";

    return null;
  };

  const startDuty = async () => {
    const validationError = validateStartDuty();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const updatedReport = {
      ...report,
      shiftStart: new Date().toISOString(),
      status: "active" as const,
    };

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report: updatedReport }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to start duty");
      }

      setReport((prev) => ({
        ...prev,
        ...updatedReport,
        savedId: data.id,
      }));

      setSuccessMessage("Duty started successfully");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to start duty");
      console.error("Error starting duty:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEndDuty = () => {
    if (!report.responsibilities.trim()) {
      return "Shift responsibilities are required before ending duty";
    }

    if (report.incidents.length > 0) {
      const incompleteIncidents = report.incidents.some(
        (incident) =>
          !incident.description ||
          !incident.actionTaken ||
          !incident.timeReported
      );
      if (incompleteIncidents) {
        return "All incidents must have complete information";
      }
    }

    return null;
  };

  const endDuty = async () => {
    const validationError = validateEndDuty();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!report.savedId) {
      setError("No active duty found");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const updatedReport = {
      ...report,
      shiftEnd: new Date().toISOString(),
      status: "completed" as const,
    };

    try {
      const response = await fetch("/api/reports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: report.savedId,
          updates: {
            shiftEnd: updatedReport.shiftEnd,
            status: "completed",
            incidents: report.incidents,
            responsibilities: report.responsibilities,
          },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to end duty");
      }

      setReport((prev) => ({
        ...prev,
        ...updatedReport,
      }));

      setSuccessMessage(
        "Duty ended successfully. All records have been saved."
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to end duty");
      console.error("Error ending duty:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addIncident = () => {
    if (
      newIncident.description &&
      newIncident.actionTaken &&
      newIncident.timeReported
    ) {
      setReport((prev) => ({
        ...prev,
        incidents: [...(prev.incidents || []), newIncident as Incident],
      }));
      setNewIncident({
        type: "fire",
        description: "",
        actionTaken: "",
        timeReported: "",
      });
    }
  };

  const updateEquipment = (key: keyof Equipment, value: boolean | string) => {
    setReport((prev) => ({
      ...prev,
      equipment: {
        ...(prev.equipment || {}),
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-4">
          {successMessage}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Officer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Officer ID - Your Badge Number"
              value={report.officerId}
              onChange={(e) =>
                setReport({ ...report, officerId: e.target.value })
              }
              disabled={!!report.savedId || isSubmitting}
              required
            />
            <Input
              placeholder="Officer Name"
              value={report.officerName}
              onChange={(e) =>
                setReport({ ...report, officerName: e.target.value })
              }
              disabled={!!report.savedId || isSubmitting}
              required
            />
            <div className="col-span-2">
              <Select
                value={report.location}
                onValueChange={(value: SecurityLocation) =>
                  setReport({ ...report, location: value })
                }
                disabled={!!report.savedId || isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Security Post Location" />
                </SelectTrigger>
                <SelectContent>
                  {SECURITY_LOCATIONS.map((location) => (
                    <SelectItem
                      key={location}
                      value={location}
                      className="cursor-pointer"
                    >
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(report.equipment || {}).map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={item}
                  checked={
                    report.equipment?.[item as keyof Equipment] as boolean
                  }
                  onCheckedChange={(checked) =>
                    updateEquipment(item as keyof Equipment, checked as boolean)
                  }
                  disabled={!!report.savedId || isSubmitting}
                />
                <label
                  htmlFor={item}
                  className={`capitalize ${
                    !!report.savedId || isSubmitting ? "opacity-50" : ""
                  }`}
                >
                  {item.replace(/([A-Z])/g, " $1").trim()}
                </label>
              </div>
            ))}
          </div>
          <Input
            placeholder="Other equipment (specify)"
            value={report.equipment?.other || ""}
            onChange={(e) => updateEquipment("other", e.target.value)}
            disabled={!!report.savedId || isSubmitting}
          />
          <div className="flex gap-4">
            {!report.savedId ? (
              <Button
                onClick={startDuty}
                disabled={isSubmitting || !!report.shiftStart}
                className="mt-4"
              >
                {isSubmitting ? "Starting Duty..." : "Start Duty"}
              </Button>
            ) : (
              <Button
                onClick={endDuty}
                disabled={report.status === "completed" || isSubmitting}
                className="mt-4"
              >
                {isSubmitting ? "Ending Duty..." : "End Duty"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Incident Reports
            {!report.savedId && (
              <span className="text-sm text-muted-foreground font-normal">
                Start duty to report incidents
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!report.savedId ? (
            <div className="text-center py-6 text-muted-foreground bg-muted/50 rounded-lg">
              You must start your duty before reporting incidents
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <Select
                  onValueChange={(value) =>
                    setNewIncident({
                      ...newIncident,
                      type: value as Incident["type"],
                    })
                  }
                  disabled={report.status === "completed" || isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="employeeTermination">
                      Employee Termination
                    </SelectItem>
                    <SelectItem value="falseAlarm">False Alarm</SelectItem>
                    <SelectItem value="propertyDamage">
                      Property Damage
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Time reported"
                  type="datetime-local"
                  value={newIncident.timeReported}
                  onChange={(e) =>
                    setNewIncident({
                      ...newIncident,
                      timeReported: e.target.value,
                    })
                  }
                  disabled={report.status === "completed" || isSubmitting}
                  required
                />
                <Textarea
                  placeholder="Incident description"
                  value={newIncident.description}
                  onChange={(e) =>
                    setNewIncident({
                      ...newIncident,
                      description: e.target.value,
                    })
                  }
                  disabled={report.status === "completed" || isSubmitting}
                  required
                />
                <Textarea
                  placeholder="Action taken"
                  value={newIncident.actionTaken}
                  onChange={(e) =>
                    setNewIncident({
                      ...newIncident,
                      actionTaken: e.target.value,
                    })
                  }
                  disabled={report.status === "completed" || isSubmitting}
                  required
                />
                <Button
                  onClick={addIncident}
                  disabled={
                    report.status === "completed" ||
                    isSubmitting ||
                    !newIncident.description ||
                    !newIncident.actionTaken ||
                    !newIncident.timeReported
                  }
                >
                  Add Incident
                </Button>
              </div>

              {report.incidents.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {report.incidents.map((incident, index) => (
                    <div
                      key={index}
                      className="border p-4 rounded-lg bg-background"
                    >
                      <p className="font-bold capitalize">{incident.type}</p>
                      <p>
                        Time: {new Date(incident.timeReported).toLocaleString()}
                      </p>
                      <p className="mt-2">
                        <span className="font-medium">Description:</span>
                        <br />
                        {incident.description}
                      </p>
                      <p className="mt-2">
                        <span className="font-medium">Action Taken:</span>
                        <br />
                        {incident.actionTaken}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No incidents reported
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Shift Responsibilities
            {!report.savedId && (
              <span className="text-sm text-muted-foreground font-normal">
                Start duty to log responsibilities
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!report.savedId ? (
            <div className="text-center py-6 text-muted-foreground bg-muted/50 rounded-lg">
              You must start your duty before logging responsibilities
            </div>
          ) : (
            <Textarea
              placeholder="Enter your responsibilities and activities during the shift"
              value={report.responsibilities}
              onChange={(e) =>
                setReport({ ...report, responsibilities: e.target.value })
              }
              className="min-h-[200px]"
              disabled={report.status === "completed" || isSubmitting}
              required
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
