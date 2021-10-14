// Units

import {
  dateToString,
  dateToStrings,
  explode,
  hasKey,
  nameToID,
} from "@/helpers";
import { companiesCollection } from "@/main";

import { DocRef, ImageWithCaption, Task, TimeLog, Tool } from "./auxiliary";

export interface ExpenseInterface {
  id: string;
  companyID: string;
  employeeName: string;
  name: string;
  date: string;
  cost: number;
  paid: boolean;
}

export function newExpenseInterface(
  id: string,
  companyID: string,
  employeeName: string,
  options: any
): ExpenseInterface {
  return {
    id,
    companyID,
    employeeName,
    date: options.date ? options.date : "",
    name: "",
    cost: 0,
    paid: false,
  };
}

export interface VisitInterface {
  id: string;
  companyID: string;
  employeeName: string;
  customerName: string;
  workType: string;
  plannedStart: string;
  plannedEnd: string;
  jobID: string;
  date: string;
  time: TimeLog;
  notes: string;
  tasks: Array<Task>;
  tools: Array<Tool>;
  images: Array<ImageWithCaption>;
  readByCompany: boolean;
}

export function newVisitInterface(
  id: string,
  companyID: string,
  options: any
): VisitInterface {
  return {
    id,
    companyID,
    employeeName: options.employeeName ? options.employeeName : "",
    customerName: options.customerName ? options.customerName : "",
    workType: "",
    plannedStart: "",
    plannedEnd: "",
    jobID: options.jobID ? options.jobID : "",
    date: options.date ? options.date : dateToString(new Date()),
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

export interface EmployeeDayInterface {
  date: string;
  companyID: string;
  employeeName: string;
  startLocation: string;
  plannedStart: string;
  plannedEnd: string;
  time: TimeLog;
  notes: string;
  paid: boolean;
  readByEmployee: boolean;
  readByCompany: boolean;
  hourlyRate: number;
}

export function newEmployeeDayInterface(
  date: string,
  companyID: string,
  options: any
): EmployeeDayInterface {
  return {
    date,
    companyID,
    employeeName: options.employeeName ? options.employeeName : null,
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
    hourlyRate: options.hourlyRate ? options.hourlyRate : null,
    readByEmployee: false,
    readByCompany: false,
  };
}

export interface JobInterface {
  id: string;
  companyID: string;
  name: string;
  customerName: string;
  description: string;
  startDate: string;
  endDate: string;
  tasks: Array<Task>;
}

export function newJobInterface(
  id: string,
  companyID: string,
  name: string,
  customerName: string
): JobInterface {
  return {
    id,
    name,
    companyID,
    customerName,
    description: "",
    startDate: "", // Must manually select start date
    endDate: "",
    tasks: [],
  };
}

export interface CustomerDayInterface {
  customerName: string;
  date: string;
  companyID: string;
  hours: number;
}

// CLASSES

export class DBUnit<T> {
  id: string;
  dbRef: DocRef;
  data: T;
  searchKeys: Array<string>;
  keywords: Array<string>;
  exists: boolean;

  constructor(id: string, dbRef: DocRef, searchKeys: Array<string>) {
    this.id = id;
    this.exists = true;
    this.dbRef = dbRef;
    this.data = {} as T;
    this.searchKeys = searchKeys;
    this.keywords = [""];
  }

  async init(data?: T) {
    // Initialize with data
    if (data) {
      this.data = data;
      return this;
    }

    // Initialize without data
    const docData = (await this.dbRef.get()).data();
    if (docData) {
      this.data = docData.data;
      this.keywords = docData.keywords;
    } else throw Error("The document for the work unit could not be found.");
    return this;
  }

  async create(docData: T) {
    this.data = docData;
    const alreadyExists = (await this.dbRef.get()).exists;
    // Redirect to existing data
    if (alreadyExists) return this;

    await this.save();
    return this;
  }

  async delete() {
    this.exists = false;
    await this.dbRef.delete();
  }

  // generateKeywords : Generate keywords for the provided _keys_ on _docData_
  // Useful for
  updateKeywords() {
    const generateKeywordsForDate = (date: any) => {
      if (date) {
        return dateToStrings(new Date(date))
          .map((date) => explode(date))
          .reduce((keywords, list) => keywords.concat(list));
      } else return [];
    };

    const generateKeywordsForKey = (key: string): Array<string> => {
      if (hasKey(this.data, key)) {
        if (key.toLowerCase().includes("date"))
          return generateKeywordsForDate(this.data[key]);
        else return explode(this.data[key]);
      }
      return [];
    };

    this.keywords = this.searchKeys
      .map((key) => generateKeywordsForKey(key))
      .reduce((keywords, list) => keywords.concat(list))
      .map((keyword) => keyword.toLowerCase().trim());
    this.keywords.unshift("");
  }

  async save() {
    // Change to only update keywords on saves in which a search_param is changed
    console.log("saving");
    if (this.exists) {
      this.updateKeywords();
      await this.dbRef.set({ data: this.data, keywords: this.keywords });
    }
  }
}

export class Visit extends DBUnit<VisitInterface> {
  constructor(visitID: string, companyID: string) {
    super(visitID, companiesCollection.doc(`${companyID}/visits/${visitID}`), [
      "date",
      "customerName",
      "employeeName",
      "notes",
    ]);
  }

  async changeDate(date: string) {
    this.data.date = date;
    await this.save();
    return this;
  }
}

export class Job extends DBUnit<JobInterface> {
  constructor(jobID: string, companyID: string, customerID: string) {
    super(
      jobID,
      companiesCollection.doc(
        `${companyID}/customers/${customerID}/jobs/${jobID}`
      ),
      ["name", "customerName", "employeeName", "startDate"]
    );
  }
}

export class EmployeeDay extends DBUnit<EmployeeDayInterface> {
  constructor(date: string, companyID: string, employeeID: string) {
    super(
      date,
      companiesCollection.doc(
        `${companyID}/employees/${employeeID}/days/${date}`
      ),
      ["date", "employeeName"]
    );
  }

  async changeDate(date: string) {
    await this.delete();
    this.dbRef = companiesCollection.doc(
      `${this.data.companyID}/employees/${nameToID(
        this.data.employeeName
      )}/days/${date}`
    );
    // Initialize with existing data
    this.data.date = date;
    this.exists = true;

    await this.create(this.data);

    return this;
  }
}

export class CustomerDay extends DBUnit<CustomerDayInterface> {
  visits: Array<Visit>;
  constructor(date: string, companyID: string, customerID: string) {
    super(
      date,
      companiesCollection.doc(
        `${companyID}/customers/${customerID}/days/${date}`
      ),
      ["date", "customerName", "hours"]
    );
    this.visits = [];
  }
  async init(data?: CustomerDayInterface) {
    super.init(data);
    // Fetch visits

    return this;
  }
  async fetchVisits() {
    const docs = (
      await companiesCollection
        .doc(`${this.data.companyID}`)
        .collection("visits")
        .where("data.date", "==", this.data.date)
        .get()
    ).docs;
    // Initialize visits here
    for (const doc of docs) {
      const visit = new Visit(doc.id, this.data.companyID);
      await visit.init(doc.data().data);
      this.visits.push(visit);
    }
  }
  // Peform all actions based on visit updates
  addVisit(visit: Visit) {
    this.visits.push(visit);
    this.computeHours();
    // Update total hours
  }
  deleteVisit(visitID: string) {
    this.visits = this.visits.filter((visit) => visit.id != visitID);
  }
  computeHours() {
    this.data.hours = this.visits.reduce(
      (hoursAcc: number, visit: Visit) => hoursAcc + visit.data.time.hours,
      0
    );
  }
}

export class Expense extends DBUnit<ExpenseInterface> {
  constructor(id: string, companyID: string, employeeID: string) {
    super(
      id,
      companiesCollection.doc(
        `${companyID}/employees/${employeeID}/expenses/${id}`
      ),
      ["name", "date", "employeeName"]
    );
  }
  async changeDate(date: string) {
    this.data.date = date;
    await this.save();
    return this;
  }
}
