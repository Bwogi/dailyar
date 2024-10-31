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
import { ActivityReport, Equipment, Incident } from "@/app/types/types";

type ReportState = Omit<ActivityReport, "_id"> & {
  savedId?: string;
};

export default function NewReportForm() {
  const [report, setReport] = useState<ReportState>({
    officerId: "",
    officerName: "",
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

  const startDuty = async () => {
    const updatedReport = {
      ...report,
      shiftStart: new Date().toISOString(),
    };
    setReport(updatedReport);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report: updatedReport }),
      });
      const data = await response.json();
      if (!data.success) throw new Error("Failed to start duty");

      // Save the ID returned from the server
      setReport((prev) => ({
        ...prev,
        savedId: data.id,
      }));
    } catch (error) {
      console.error("Error starting duty:", error);
    }
  };

  const endDuty = async () => {
    if (!report.savedId) {
      console.error("No report ID found");
      return;
    }

    const updatedReport = {
      ...report,
      shiftEnd: new Date().toISOString(),
      status: "completed" as const,
    };
    setReport(updatedReport);

    try {
      const response = await fetch("/api/reports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: report.savedId,
          updates: {
            shiftEnd: updatedReport.shiftEnd,
            status: "completed",
          },
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error("Failed to end duty");
    } catch (error) {
      console.error("Error ending duty:", error);
    }
  };

  const addIncident = () => {
    if (newIncident.description && newIncident.actionTaken) {
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
      <Card>
        <CardHeader>
          <CardTitle>Officer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Officer ID - Your Badge ID"
              value={report.officerId}
              onChange={(e) =>
                setReport({ ...report, officerId: e.target.value })
              }
            />
            <Input
              placeholder="Officer Name"
              value={report.officerName}
              onChange={(e) =>
                setReport({ ...report, officerName: e.target.value })
              }
            />
          </div>
          <div className="flex gap-4">
            {!report.savedId ? (
              <Button onClick={startDuty} disabled={!!report.shiftStart}>
                Start Duty
              </Button>
            ) : (
              <Button
                onClick={endDuty}
                disabled={report.status === "completed"}
              >
                End Duty
              </Button>
            )}
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
                />
                <label htmlFor={item} className="capitalize">
                  {item.replace(/([A-Z])/g, " $1").trim()}
                </label>
              </div>
            ))}
          </div>
          <Input
            placeholder="Other equipment (specify)"
            value={report.equipment?.other || ""}
            onChange={(e) => updateEquipment("other", e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Incident Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Select
              onValueChange={(value) =>
                setNewIncident({
                  ...newIncident,
                  type: value as Incident["type"],
                })
              }
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
                <SelectItem value="propertyDamage">Property Damage</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Time reported"
              type="datetime-local"
              value={newIncident.timeReported}
              onChange={(e) =>
                setNewIncident({ ...newIncident, timeReported: e.target.value })
              }
            />
            <Textarea
              placeholder="Incident description"
              value={newIncident.description}
              onChange={(e) =>
                setNewIncident({ ...newIncident, description: e.target.value })
              }
            />
            <Textarea
              placeholder="Action taken"
              value={newIncident.actionTaken}
              onChange={(e) =>
                setNewIncident({ ...newIncident, actionTaken: e.target.value })
              }
            />
            <Button onClick={addIncident}>Add Incident</Button>
          </div>

          <div className="mt-4">
            {report.incidents?.map((incident, index) => (
              <div key={index} className="border p-4 rounded-lg mb-2">
                <p className="font-bold capitalize">{incident.type}</p>
                <p>Time: {new Date(incident.timeReported).toLocaleString()}</p>
                <p>Description: {incident.description}</p>
                <p>Action Taken: {incident.actionTaken}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shift Responsibilities</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter your responsibilities and activities during the shift"
            value={report.responsibilities}
            onChange={(e) =>
              setReport({ ...report, responsibilities: e.target.value })
            }
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
