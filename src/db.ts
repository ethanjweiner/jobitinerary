import { generateUUID, nameToID } from "./helpers";
import store from "./store";
import {
  CollectionRef,
  DocSnapshot,
  QuerySnapshot,
  Query,
} from "./types/auxiliary";
import { Company, Employee } from "./types/users";
import {
  newVisitInterface,
  Job,
  newJobInterface,
  Visit,
  EmployeeDay,
  newEmployeeDayInterface,
  Expense,
  newExpenseInterface,
  CustomerDay,
  newCustomerDayInterface,
} from "./types/units";

import { reactive } from "@vue/reactivity";

export class InfiniteList {
  query: Query;
  list: { items: Array<any> };
  listeners: Array<Function>;
  bufferEnd: DocSnapshot | null;
  bufferSize: number;
  initialized: boolean;

  constructor(
    dbRef: CollectionRef,
    bufferSize: number,
    orderByParam: string,
    searchFilter: string
  ) {
    this.query = dbRef
      .limit(bufferSize)
      .orderBy("data." + orderByParam, "desc")
      .where("keywords", "array-contains", searchFilter.toLowerCase().trim());
    this.list = reactive<{ items: Array<any> }>({ items: [] }); // Make reactive for computed purposes
    this.listeners = [];
    this.bufferEnd = null;
    this.bufferSize = bufferSize;
    this.initialized = false;
  }

  async init() {
    await this.loadNewBatch();
  }

  async loadNewBatch(): Promise<0 | 1> {
    return new Promise((resolve) => {
      let query = this.query;
      if (this.bufferEnd) query = query.startAfter(this.bufferEnd);

      const listener = query.onSnapshot((snapshot: QuerySnapshot) => {
        // Update the list upon any snapshot (make reactive)

        snapshot.docChanges().forEach((change) => {
          switch (change.type) {
            case "added":
              if (!this.initialized)
                this.list.items.push(change.doc.data().data);
              else this.list.items.unshift(change.doc.data().data);
              break;
            case "removed":
              this.list.items = this.list.items.filter(
                (item) => item.id != change.doc.id
              );
              break;
            case "modified":
              this.list.items[
                this.list.items.findIndex((item) => item.id == change.doc.id)
              ] = change.doc.data().data;
              break;
            default:
              break;
          }
        });
        if (snapshot.empty) resolve(1);
        this.bufferEnd = snapshot.docs[snapshot.docs.length - 1];
      });

      this.listeners.push(listener);
      this.initialized = true;
      resolve(0);
    });
  }

  async destroy() {
    // Unsubscribe from each listener
    if (this.listeners) this.listeners.forEach((listener) => listener());
    this.list.items = [];
  }
}

// search: Retrieve a maximum of _limit_ docs from _dbRef_, ordered by _orderByParam_,
// and starting after _startAfterDoc_ and filtered by _searchFilter_
export async function search(
  dbRef: CollectionRef,
  limit: number,
  orderByParam: string,
  searchFilter: string,
  startAfterDoc?: any
): Promise<Array<DocSnapshot>> {
  let query: Query = dbRef
    .limit(limit)
    .orderBy("data." + orderByParam, "desc")
    .where("keywords", "array-contains", searchFilter.toLowerCase().trim());

  // Update the query depending on search param
  if (startAfterDoc) query = query.startAfter(startAfterDoc);

  const docs = (await query.get()).docs;
  return docs;
}

export async function createVisit(options?: any) {
  const visitID = generateUUID();
  const visit = new Visit(visitID, store.state.companyID);
  // Input empty data
  await visit.create(
    newVisitInterface(visitID, store.state.companyID, options ? options : {})
  );

  return visit;
}

export async function createExpense(employeeID: string, options?: any) {
  const expenseID = generateUUID();
  const expense = new Expense(expenseID, store.state.companyID, employeeID);
  await expense.create(
    newExpenseInterface(
      expenseID,
      store.state.companyID,
      employeeID,
      options ? options : {}
    )
  );
  return expense;
}

export async function createJob(jobName: string, customerID: string) {
  const jobID = nameToID(jobName);

  const job = new Job(jobID, store.state.companyID, customerID);
  await job.create(
    newJobInterface(jobID, store.state.companyID, jobName, customerID)
  );
  return job;
}

export async function createEmployeeDay(date: string, employeeID: string) {
  // Determine hourly rate
  let hourlyRate;
  if (store.state.user instanceof Employee) {
    hourlyRate = store.state.user.data.defaultHourlyRate;
  } else if (store.state.user instanceof Company) {
    const employee = store.state.user.employees.find(
      (employee) => employee.data.id == employeeID
    );
    if (employee) hourlyRate = employee.data.defaultHourlyRate;
  }

  const day = new EmployeeDay(date, store.state.companyID, employeeID);
  await day.create(
    newEmployeeDayInterface(date, store.state.companyID, {
      hourlyRate,
      employeeID,
    })
  );
  return day;
}

export async function createCustomerDay(date: string, customerID: string) {
  const day = new CustomerDay(date, store.state.companyID, customerID);
  await day.create(
    newCustomerDayInterface(date, store.state.companyID, { customerID })
  );
  return day;
}

export async function copyVisit(visit: Visit, employeeID: string) {
  const id = generateUUID();
  const copiedVisit = new Visit(id, visit.data.companyID);

  const copiedData = { ...visit.data };
  copiedData.id = id;
  copiedData.employeeID = employeeID;
  copiedData.readByCompany = false;

  await copiedVisit.create(copiedData);
}

// Testing

// const visitsList = new InfiniteList(
//   companiesCollection
//     .doc("b4d8b6c4-afe9-4a6b-b0f9-136df2f4680a")
//     .collection("visits"),
//   10,
//   20,
//   "date",
//   ""
// );

// setTimeout(() => {
//   for (let i = 0; i < 60; i++) {
//     createVisit({ employeeID: i.toString() });
//   }
// }, 1000);

// visitsList.init().then(() => {
//   visitsList.loadMore().then(() => {
//     visitsList.loadMore().then(() => {
//       console.log(visitsList.buffer);
//       console.log(visitsList.list);
//     });
//   });
// });

/* BACKLOG

export async function fetchThreads(
  recipientType: "company" | "employee" | "customer",
  name?: "string"
) {
  console.log(name);
  switch (recipientType) {
    case "company":
      // Retrieve all threads where company is a user
      return [sampleThread, sampleThread];
    case "employee":
      // Retrieve threads with the given employee _name_
      return [sampleThread, sampleThread];
    case "customer":
      // Retrieve threads with the given customer _name_
      return [sampleThread, sampleThread];
    default:
      break;
  }
}

*/
