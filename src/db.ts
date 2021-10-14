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
  if (store.state.company) {
    const visit = new Visit(visitID, store.state.company.id);
    // Input empty data
    await visit.create(
      newVisitInterface(visitID, store.state.company.id, options ? options : {})
    );

    return visit;
  } else throw Error("Could not create a database reference for visits.");
}

export async function createExpense(employeeName: string, options?: any) {
  const expenseID = generateUUID();
  if (store.state.company) {
    const expense = new Expense(
      expenseID,
      store.state.company.id,
      nameToID(employeeName)
    );
    await expense.create(
      newExpenseInterface(
        expenseID,
        store.state.company.id,
        nameToID(employeeName),
        options ? options : {}
      )
    );
    return expense;
  } else throw Error("Could not create a database reference for expenses.");
}

export async function createJob(jobName: string, customerName: string) {
  const jobID = nameToID(jobName);

  if (store.state.company) {
    const job = new Job(jobID, store.state.company.id, nameToID(customerName));
    await job.create(
      newJobInterface(jobID, store.state.company.id, jobName, customerName)
    );
    return job;
  } else
    throw Error(
      "Missing company: Could not create a database reference for jobs."
    );
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

  if (store.state.company) {
    const day = new EmployeeDay(
      date,
      store.state.company.id,
      nameToID(employeeName)
    );
    await day.create(
      newEmployeeDayInterface(date, store.state.company.id, {
        hourlyRate,
        employeeName,
      })
    );
    return day;
  } else
    throw Error(
      "Missing company: Could not create a database reference for days."
    );
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
