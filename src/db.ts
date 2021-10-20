import { generateUUID, nameToID } from "./helpers";
import store from "./store";
import { CollectionRef, DocSnapshot, Query } from "./types/auxiliary";
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
} from "./types/work_units";

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

export async function createExpense(employeeName: string, options?: any) {
  const expenseID = generateUUID();
  const expense = new Expense(
    expenseID,
    store.state.companyID,
    nameToID(employeeName)
  );
  await expense.create(
    newExpenseInterface(
      expenseID,
      store.state.companyID,
      nameToID(employeeName),
      options ? options : {}
    )
  );
  return expense;
}

export async function createJob(jobName: string, customerName: string) {
  const jobID = nameToID(jobName);

  const job = new Job(jobID, store.state.companyID, nameToID(customerName));
  await job.create(
    newJobInterface(jobID, store.state.companyID, jobName, customerName)
  );
  return job;
}

export async function createEmployeeDay(date: string, employeeName: string) {
  // Determine hourly rate
  let hourlyRate;
  if (store.state.user instanceof Employee) {
    hourlyRate = store.state.user.data.defaultHourlyRate;
  } else if (store.state.user instanceof Company) {
    const employee = store.state.user.employees.find(
      (employee) => employee.data.id == nameToID(employeeName)
    );
    if (employee) hourlyRate = employee.data.defaultHourlyRate;
  }

  const day = new EmployeeDay(
    date,
    store.state.companyID,
    nameToID(employeeName)
  );
  await day.create(
    newEmployeeDayInterface(date, store.state.companyID, {
      hourlyRate,
      employeeName,
    })
  );
  return day;
}

export async function createCustomerDay(date: string, customerName: string) {
  const day = new CustomerDay(
    date,
    store.state.companyID,
    nameToID(customerName)
  );
  await day.create(
    newCustomerDayInterface(date, store.state.companyID, { customerName })
  );
  return day;
}

export async function copyVisit(visit: Visit, employeeName: string) {
  const id = generateUUID();
  const copiedVisit = new Visit(id, visit.data.companyID);

  const copiedData = { ...visit.data };
  copiedData.id = id;
  copiedData.employeeName = employeeName;
  copiedData.readByCompany = false;

  await copiedVisit.create(copiedData);
}

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
