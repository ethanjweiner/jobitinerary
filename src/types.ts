import { dateToString } from "./helpers";

// Auxiliary
export interface SectionType {
  name: string;
  icon: any;
  id: string;
}

export type SectionsType = Array<SectionType>;

export interface Location {
  address: string;
  coordinates: { lat: number; lng: number } | null;
}

function newLocation(): Location {
  return {
    address: "",
    coordinates: null,
  };
}

export const sampleLocation: Location = {
  address: "210 Old Mill",
  coordinates: {
    lat: 1.35,
    lng: 2.45,
  },
};

export interface ImageWithCaption {
  id: number;
  ref: string;
  caption: string;
}

export const emptyImage = (id: number): ImageWithCaption => {
  return {
    id,
    ref: "",
    caption: "",
  };
};

export const sampleImage: ImageWithCaption = {
  id: Date.now(),
  ref: "",
  caption: "Image caption",
};

export interface Task {
  header: string;
  notes: string;
  image: ImageWithCaption | null;
  complete: boolean;
  id: number;
}

export const sampleTask1: Task = {
  header: "Task 1",
  notes: "Notes for task 1, specific to employees",
  image: sampleImage,
  complete: false,
  id: 1234689071,
};

export const sampleTask2: Task = {
  header: "Task 2",
  notes: "Notes for task 2, specific to employees",
  image: sampleImage,
  complete: true,
  id: 1235689071,
};

export interface Tool {
  name: string;
  returned: boolean;
  id: number;
}

export const sampleTool1: Tool = {
  name: "Tool 1",
  returned: false,
  id: 230598735,
};

export const sampleTool2: Tool = {
  name: "Tool 2",
  returned: true,
  id: 230598765,
};

export interface TimeLog {
  start: string;
  end: string;
  hours: number;
}

export const sampleTimeLog: TimeLog = {
  start: "08:00",
  end: "16:00",
  hours: 8,
};

export interface Expense {
  id: string;
  name: string;
  date: string;
  cost: number;
  paid: boolean;
}

export const sampleExpense: Expense = {
  id: "expense id",
  name: "Expense",
  date: "2020-01-01",
  cost: 1,
  paid: true,
};

export function emptyExpense(id: string): Expense {
  return {
    id,
    name: "",
    date: dateToString(new Date()),
    cost: 0,
    paid: false,
  };
}

export enum AuthenticationTitleText {
  LogIn = "Log in to JobItinerary",
  CompanySignUp = "Sign up your company for JobItinerary",
  EmployeeSignUp = "Join your company in JobItinerary",
}

// Users

export interface UserData {
  email: string;
  readonly name: string;
  phone: string;
}

export interface Company extends UserData {
  id: string;
  kind: "company";
}

export const sampleCompany: Company = {
  id: "company_id",
  kind: "company",
  email: "company@email.com",
  name: "Jesse",
  phone: "Company phone",
};

export interface Employee extends UserData {
  kind: "employee";
  defaultHourlyRate: number | null;
  company: Company;
}

export function newEmployee(
  name: string,
  email: string,
  company: Company
): Employee {
  return {
    name,
    email,
    company,
    kind: "employee",
    phone: "",
    defaultHourlyRate: null,
  };
}

export const sampleEmployee1: Employee = {
  name: "Employee 1",
  kind: "employee",
  email: "employeeEmail1@email.com",
  phone: "Employee phone",
  defaultHourlyRate: 20,
  company: sampleCompany,
};

export const sampleEmployee2: Employee = {
  name: "Employee 2",
  kind: "employee",
  email: "employeeEmail2@email.com",
  phone: "Employee phone",
  defaultHourlyRate: 20,
  company: sampleCompany,
};

export interface Customer extends UserData {
  kind: "customer";
  company: Company;
  location: Location;
  customerNotes: string;
  propertyNotes: string;
  propertyImages: Array<ImageWithCaption>;
}

export function newCustomer(
  name: string,
  email: string,
  company: Company
): Customer {
  return {
    name,
    email,
    company,
    kind: "customer",
    phone: "",
    location: newLocation(),
    customerNotes: "",
    propertyNotes: "",
    propertyImages: [],
  };
}

export const sampleCustomer1: Customer = {
  name: "Customer 1",
  company: sampleCompany,
  kind: "customer",
  email: "customer1Email@email.com",
  phone: "Customer phone",
  location: sampleLocation,
  customerNotes: "Notes about the customer go here...",
  propertyNotes: "Notes about the property go here...",
  propertyImages: [sampleImage, sampleImage],
};

export const sampleCustomer2: Customer = {
  name: "Customer 2",
  company: sampleCompany,
  kind: "customer",
  email: "customer2Email@email.com",
  phone: "Customer phone",
  location: sampleLocation,
  customerNotes: "Notes about the customer go here...",
  propertyNotes: "Notes about the property go here...",
  propertyImages: [sampleImage, sampleImage],
};

export type User = Company | Employee | null;

// Messages

export interface Message {
  text: string;
  image: ImageWithCaption | null;
  readByRecipient: boolean;
  timestamp: number;
  threadID: string;
  to?: User;
  from?: User;
}

export function emptyMessage(): Message {
  return {
    text: "",
    image: emptyImage(Date.now()),
    readByRecipient: false,
    timestamp: Date.now(),
    threadID: "",
  };
}

const sampleMessage1: Message = {
  text: "Message 1",
  image: sampleImage,
  readByRecipient: true,
  timestamp: 1000,
  threadID: "thread_id",
  to: sampleEmployee1,
  from: sampleCompany,
};

const sampleMessage2: Message = {
  text: "Message 2",
  image: sampleImage,
  readByRecipient: false,
  timestamp: 2000,
  threadID: "thread_id",
  to: sampleCompany,
  from: sampleEmployee1,
};

export interface Thread {
  id: number;
  timestamp: number;
  messages: Array<Message>; // Must be sorted by timestamp (newest first)
  sender: User;
  receiver: User;
}

export const sampleThread: Thread = {
  id: Date.now(),
  timestamp: 1000,
  messages: [sampleMessage1, sampleMessage2],
  sender: sampleCompany,
  receiver: sampleEmployee1,
};

// Units

export interface Visit {
  id: string;
  employeeName: string;
  customerName: string;
  workType: string;
  plannedStart: string;
  plannedEnd: string;
  job: {
    name: string;
    id: string;
  } | null;
  date: string;
  time: TimeLog;
  notes: string;
  tasks: Array<Task>;
  tools: Array<Tool>;
  images: Array<ImageWithCaption>;
  readByCompany: boolean;
}

export function emptyVisit(options: any): Visit {
  return {
    id: "",
    employeeName: options.employeeName ? options.employeeName : "",
    customerName: options.customerName ? options.customerName : "",
    workType: "",
    plannedStart: "",
    plannedEnd: "",
    job: null,
    date: options.date ? options.date : "",
    time: {
      start: "",
      end: "",
      hours: 0,
    },
    notes: "",
    tasks: [],
    tools: [],
    images: [],
    readByCompany: false,
  };
}

export const sampleVisit1: Visit = {
  id: "visit_id",
  employeeName: "Employee 1",
  customerName: "Customer 1",
  workType: "Cleanup",
  plannedStart: "08:00",
  plannedEnd: "16:00",
  job: {
    name: "Some Job",
    id: "Job ID",
  },
  date: "2021-01-01",
  time: sampleTimeLog,
  notes: "notes",
  tasks: [sampleTask1, sampleTask2],
  tools: [sampleTool1, sampleTool2],
  images: [sampleImage, sampleImage],
  readByCompany: false,
};

export interface Day {
  date: string;
  employeeName: string;
  startLocation: string;
  plannedStart: string;
  plannedEnd: string;
  time: TimeLog;
  notes: string;
  paid: boolean;
  readByEmployee: boolean;
  readByCompany: boolean;
  hourlyRate: number | null;
}

export const sampleDay: Day = {
  date: "01-01-2020",
  employeeName: "Employee Name",
  startLocation: "Start Location",
  plannedStart: "08:00",
  plannedEnd: "17:00",
  time: sampleTimeLog,
  notes: "Some notes",
  paid: false,
  readByEmployee: false,
  readByCompany: false,
  hourlyRate: 20,
};

export function emptyDay(date: string, hourlyRate = null): Day {
  return {
    date: date,
    employeeName: "",
    startLocation: "",
    plannedStart: "",
    plannedEnd: "",
    time: {
      start: "",
      end: "",
      hours: 0,
    },
    notes: "",
    paid: false,
    hourlyRate,
    readByEmployee: false,
    readByCompany: false,
  };
}

export interface CustomerDay {
  date: string;
  customerName: string;
  visits: Array<Visit>;
}

export const sampleCustomerDay: CustomerDay = {
  date: "2021-09-12",
  customerName: "Customer 1",
  visits: [],
};

export interface Job {
  id: string;
  name: string;
  customerName: string;
  description: string;
  startDate: string;
  endDate: string;
  tasks: Array<Task>;
}

export const sampleJob: Job = {
  id: "job_id",
  name: "job name",
  customerName: "Customer Name",
  description: "job description",
  startDate: "2021-09-10",
  endDate: "2021-09-25",
  tasks: [sampleTask1, sampleTask2],
};

// Complex types

// A Loader loads _data_ at a particular _searchFilter_
export type Loader = (searchFilter?: string) => Promise<0 | 1>;

// A Splitter splits a larger list into smaller lists, based on a filter
type Filter = (item: any) => boolean;

export type Splitter = { name: string; filter: Filter };
