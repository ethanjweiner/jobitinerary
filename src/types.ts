export interface UserData {
  readonly email: string;
  name: string;
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
  ref: string;
  caption: string;
}

const sampleImage: ImageWithCaption = {
  ref: "../resources/splash.png",
  caption: "This is an image",
};

export interface Company extends UserData {
  id: string;
  kind: "company";
}

export interface Employee extends UserData {
  kind: "employee";
  companyID: string;
  hourlyRate: number | null;
}

export const sampleEmployee: Employee = {
  name: "Employee Name",
  companyID: "company ID",
  kind: "employee",
  email: "employeeEmail@email.com",
  phone: "Employee phone",
  hourlyRate: 20,
};

export interface Customer extends UserData {
  kind: "customer";
  companyID: string;
  location: Location;
  customerNotes: string;
  propertyNotes: string;
  propertyImages: Array<ImageWithCaption>;
}

export const sampleCustomer: Customer = {
  name: "Customer Name",
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
  total: number;
}

export interface Task {
  name: string;
  notes: string;
  imageRefs: Array<ImageWithCaption>;
  complete: boolean;
}

export interface Tool {
  name: string;
  outToJob: boolean;
  backToShop: boolean;
}

export interface Visit {
  id: string;
  employeeName: string;
  customerName: string;
  jobID: string;
  date: Date;
  time: TimeLog;
  notes: string;
  tasks: Array<Task>;
  tools: Array<Tool>;
  imageRefs: Array<ImageWithCaption>;
  readByCompany: boolean;
}

export const sampleVisit: Visit = {
  id: "visit_id",
  employeeName: "employee name",
  customerName: "customer name",
  jobID: "job",
  date: new Date(),
  time: {
    start: "9:00",
    end: "5:00",
    total: 8,
  },
  notes: "notes",
  tasks: [
    {
      name: "task",
      notes: "task notes",
      imageRefs: [sampleImage, sampleImage],
      complete: false,
    },
  ],
  tools: [
    {
      name: "tool",
      outToJob: true,
      backToShop: false,
    },
  ],
  imageRefs: [sampleImage, sampleImage],
  readByCompany: true,
};

export interface Day {
  date: Date;
  startLocation: string;
  plannedStartTime: string;
  plannedEndTime: string;
  visitIDs: Array<string>;
  time: TimeLog;
  notes: string;
  paid: boolean;
  readByEmployee: boolean;
  readByCompany: boolean;
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
  customerName: "customer name",
  description: "job description",
  startDate: new Date(),
  tasks: [
    {
      name: "task",
      notes: "task notes",
      imageRefs: [sampleImage, sampleImage],
      complete: false,
    },
  ],
};

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

// A ONE-WAY message (can't be used as a thread...)
export interface Message {
  id: string;
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
  imageRef: ImageWithCaption;
  readByRecipient: boolean;
}

export const sampleMessage: Message = {
  id: "message_id",
  to: {
    userKind: "company",
    email: "company@email.com",
  },
  from: {
    userKind: "employee",
    name: "employee name",
    email: "employee@email.com",
  },
  text:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  imageRef: sampleImage,
  readByRecipient: false,
};

export enum AuthenticationTitleText {
  LogIn = "Log in to JobItinerary",
  CompanySignUp = "Sign up your company for JobItinerary",
  EmployeeSignUp = "Join your company in JobItinerary",
}
