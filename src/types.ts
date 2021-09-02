export interface UserData {
  id: string;
  readonly email: string;
  name: string;
  phone: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
}

export interface Company extends UserData {
  kind: "company";
}

export interface Employee extends UserData {
  kind: "employee";
}

export interface Customer extends UserData {
  kind: "customer";
  property: Address;
  notes: string;
}

export interface TimeLog {
  start: string;
  end: string;
  total: number;
}

export interface Task {
  name: string;
  notes: string;
  imageRefs: Array<string>;
  complete: boolean;
}

export interface Tool {
  name: string;
  outToJob: boolean;
  backToShop: boolean;
}

export interface Visit {
  id: string;
  employeeID: string;
  customerID: string;
  jobID: string;
  date: Date;
  time: TimeLog;
  notes: string;
  tasks: Array<Task>;
  tools: Array<Tool>;
  imageRefs: Array<string>;
}

export interface Day {
  date: Date;
  startLocation: string;
  plannedStartTime: string;
  plannedEndTime: string;
  visitIDs: Array<string>;
  time: TimeLog;
  notes: string;
  paid: boolean;
}

export interface Job {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  tasks: Array<Task>;
}

export interface Expense {
  id: string;
  name: string;
  cost: number;
  paid: boolean;
}

export interface SectionType {
  name: string;
  icon: any;
  id: string;
}

export type User = Company | Employee | null;

export enum AuthenticationTitleText {
  LogIn = "Log in to JobItinerary",
  CompanySignUp = "Sign up your company for JobItinerary",
  EmployeeSignUp = "Join your company in JobItinerary",
}
