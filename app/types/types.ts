import { ObjectId } from "mongodb";

export type Equipment = {
  keys: boolean;
  radio: boolean;
  patrolCar: boolean;
  accessCards: boolean;
  phone: boolean;
  tablet: boolean;
  other?: string;
};

export type Incident = {
  type:
    | "fire"
    | "employeeTermination"
    | "falseAlarm"
    | "propertyDamage"
    | "other";
  description: string;
  actionTaken: string;
  timeReported: string;
};

export type ActivityReport = {
  _id?: string | ObjectId;
  officerId: string;
  officerName: string;
  date: string;
  shiftStart: string;
  shiftEnd?: string;
  equipment: Equipment;
  incidents: Incident[];
  responsibilities: string;
  status: "active" | "completed";
};
