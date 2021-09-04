export interface UserData {
  id: string;
  readonly email: string;
  name: string;
  phone: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const sampleAddress: Address = {
  street: "210 Old Mill Road",
  city: "Marstons Mills",
  state: "MA",
  postalCode: "02648",
  country: "US",
};

export interface Company extends UserData {
  kind: "company";
}

export interface Employee extends UserData {
  kind: "employee";
}

export interface Customer extends UserData {
  kind: "customer";
  address: Address;
  notes: string;
}

export const sampleCustomer: Customer = {
  id: "customer_id",
  kind: "customer",
  email: "customerEmail@email.com",
  name: "Customer Name",
  phone: "Customer phone",
  address: sampleAddress,
  notes: "Notes about the customer go here...",
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
  employeeName: string;
  customerID: string;
  customerName: string;
  jobID: string;
  date: Date;
  time: TimeLog;
  notes: string;
  tasks: Array<Task>;
  tools: Array<Tool>;
  imageRefs: Array<string>;
  readByCompany: boolean;
}

export const sampleVisit: Visit = {
  id: "visit_id",
  employeeID: "employee",
  employeeName: "employee name",
  customerID: "customer",
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
      imageRefs: ["image"],
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
  imageRefs: ["image"],
  readByCompany: false,
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
      imageRefs: ["image"],
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
  imageRefs: Array<string>;
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
  imageRefs: ["image_1"],
  readByRecipient: false,
};

export enum AuthenticationTitleText {
  LogIn = "Log in to JobItinerary",
  CompanySignUp = "Sign up your company for JobItinerary",
  EmployeeSignUp = "Join your company in JobItinerary",
}
