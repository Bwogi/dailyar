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
  location: SecurityLocation; // Add this line
  date: string;
  shiftStart: string;
  shiftEnd?: string;
  equipment: Equipment;
  incidents: Incident[];
  responsibilities: string;
  status: "active" | "completed";
};

export type SecurityLocation =
  | "Security Account Manager"
  | "CAL1-Badge Check"
  | "CAL1-Bag Check"
  | "CAL1-Rear Entrance"
  | "CAL1-Receiving(East Gate)"
  | "CAL1-Shipping(West Gate)"
  | "CAL1-Supervisor"
  | "CAL2-Badge Check"
  | "CAL2-Bag Check"
  | "CAL1-Receiving(North Gate)"
  | "CAL1-Shipping(South Gate)"
  | "CAL2-Supervisor";
