export interface UserData {
  email: string;
  readonly name: string;
  phone: string;
}

export interface Location {
  address: string;
  coordinates: { lat: number; lng: number } | null;
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

const sampleImage: ImageWithCaption = {
  id: Date.now(),
  ref: "../images/splash.png",
  caption: "This is an image",
};

export interface Company extends UserData {
  id: string;
  kind: "company";
}

export interface Employee extends UserData {
  kind: "employee";
  companyID: string;
  defaultHourlyRate: number | null;
}

export const sampleEmployee1: Employee = {
  name: "Employee 1",
  companyID: "company ID",
  kind: "employee",
  email: "employeeEmail@email.com",
  phone: "Employee phone",
  defaultHourlyRate: 20,
};

export const sampleEmployee2: Employee = {
  name: "Employee 2",
  companyID: "company ID",
  kind: "employee",
  email: "employeeEmail@email.com",
  phone: "Employee phone",
  defaultHourlyRate: 20,
};

export interface Customer extends UserData {
  kind: "customer";
  companyID: string;
  location: Location;
  customerNotes: string;
  propertyNotes: string;
  propertyImages: Array<ImageWithCaption>;
}

export const sampleCustomer1: Customer = {
  name: "Customer 1",
  companyID: "company ID",
  kind: "customer",
  email: "customerEmail@email.com",
  phone: "Customer phone",
  location: sampleLocation,
  customerNotes: "Notes about the customer go here...",
  propertyNotes: "Notes about the property go here...",
  propertyImages: [sampleImage, sampleImage],
};

export const sampleCustomer2: Customer = {
  name: "Customer 2",
  companyID: "company ID",
  kind: "customer",
  email: "customerEmail@email.com",
  phone: "Customer phone",
  location: sampleLocation,
  customerNotes: "Notes about the customer go here...",
  propertyNotes: "Notes about the property go here...",
  propertyImages: [sampleImage, sampleImage],
};

export type User = Company | Employee | null;

export interface TimeLog {
  start: string;
  end: string;
  hours: number;
}

export interface Task {
  text: string;
  image: ImageWithCaption | null;
  complete: boolean;
  id: number;
}

export interface Tool {
  name: string;
  returned: boolean;
  id: number;
}

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
  };
  date: string;
  time: TimeLog;
  notes: string;
  tasks: Array<Task>;
  tools: Array<Tool>;
  images: Array<ImageWithCaption>;
  readByCompany: boolean;
}

export function emptyVisit(date = ""): Visit {
  return {
    id: "new_visit_id",
    employeeName: "",
    customerName: "",
    workType: "",
    plannedStart: "",
    plannedEnd: "",
    job: {
      name: "",
      id: "",
    },
    date: date,
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

export const sampleVisit: Visit = {
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
  time: {
    start: "08:00",
    end: "18:00",
    hours: 8,
  },
  notes: "notes",
  tasks: [
    {
      text: "task",
      image: null,
      complete: false,
      id: Date.now(),
    },
  ],
  tools: [
    {
      name: "tool",
      returned: false,
      id: Date.now(),
    },
  ],
  images: [sampleImage, sampleImage],
  readByCompany: true,
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
  time: {
    start: "08:02",
    end: "16:20",
    hours: 7,
  },
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

export interface Job {
  id: string;
  name: string;
  customerName: string;
  description: string;
  startDate: Date;
  tasks: Array<Task>;
}

export const sampleJob: Job = {
  id: "job_id",
  name: "job name",
  customerName: "Customer Name",
  description: "job description",
  startDate: new Date(),
  tasks: [
    {
      text: "task",
      image: null,
      complete: false,
      id: Date.now(),
    },
  ],
};

export interface Expense {
  id: string;
  name: string;
  cost: number;
  paid: boolean;
}

export const sampleExpense: Expense = {
  id: "expense id",
  name: "Expense",
  cost: 1,
  paid: true,
};

export function emptyExpense(id: string): Expense {
  return {
    id,
    name: "",
    cost: 0,
    paid: false,
  };
}

export interface SectionType {
  name: string;
  icon: any;
  id: string;
}

// A ONE-WAY message (can't be used as a thread...)
export interface Message {
  to: {
    userKind: "employee" | "company";
    name?: string;
    email: string;
  };
  from: {
    userKind: "employee" | "company";
    name?: string;
    email: string;
  };
  text: string;
  image: ImageWithCaption;
  readByRecipient: boolean;
}

export const sampleMessage: Message = {
  to: {
    userKind: "company",
    email: "company@email.com",
  },
  from: {
    userKind: "employee",
    name: "Employee Name",
    email: "employee@email.com",
  },
  text:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  image: sampleImage,
  readByRecipient: false,
};

export enum AuthenticationTitleText {
  LogIn = "Log in to JobItinerary",
  CompanySignUp = "Sign up your company for JobItinerary",
  EmployeeSignUp = "Join your company in JobItinerary",
}
