// import { db } from "@/main";
import * as Types from "@/types";
import store from "@/store";

export async function fetchVisits(options?: {
  employeeName?: string;
  customerName?: string;
  limit?: { offset: number; quantity: number };
}): Promise<Array<Types.Visit>> {
  if (options) {
    if (options.employeeName) return [Types.sampleVisit1, Types.sampleVisit1];
    else if (options.customerName)
      return [Types.sampleVisit1, Types.sampleVisit1];
    else if (options.limit) {
      // Fetch the limit
      const arr = [];
      for (let i = 0; i < options.limit.quantity; i++) {
        arr.push(Types.sampleVisit1);
      }
      return arr;
    }
  }
  // Fetch all visits for the company
  return [Types.sampleVisit1, Types.sampleVisit1];
}

export async function fetchJobs(
  customerName?: string
): Promise<Array<Types.Job>> {
  if (customerName) {
    // Retrieve jobs specific to customer
    return [Types.sampleJob, Types.sampleJob];
  }
  // Retrieve all jobs
  return [Types.sampleJob, Types.sampleJob];
}

export async function fetchThreads(
  recipientType: "company" | "employee" | "customer",
  name?: "string"
) {
  console.log(name);
  switch (recipientType) {
    case "company":
      // Retrieve all threads where company is a user
      return [Types.sampleThread, Types.sampleThread];
    case "employee":
      // Retrieve threads with the given employee _name_
      return [Types.sampleThread, Types.sampleThread];
    case "customer":
      // Retrieve threads with the given customer _name_
      return [Types.sampleThread, Types.sampleThread];
    default:
      break;
  }
}
