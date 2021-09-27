// Units

import {
  ImageWithCaption,
  sampleImage,
  sampleTask1,
  sampleTask2,
  sampleTimeLog,
  sampleTool1,
  sampleTool2,
  Task,
  TimeLog,
  Tool,
} from "./auxiliary";

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
