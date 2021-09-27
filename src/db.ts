import { sampleVisit1, sampleJob, Visit, Job } from "@/types/work_units";

export async function fetchVisits(options?: {
  employeeName?: string;
  customerName?: string;
  limit?: { offset: number; quantity: number };
}): Promise<Array<Visit>> {
  if (options) {
    if (options.employeeName) return [sampleVisit1, sampleVisit1];
    else if (options.customerName) return [sampleVisit1, sampleVisit1];
    else if (options.limit) {
      // Fetch the limit
      const arr = [];
      for (let i = 0; i < options.limit.quantity; i++) {
        arr.push(sampleVisit1);
      }
      return arr;
    }
  }
  // Fetch all visits for the company
  return [sampleVisit1, sampleVisit1];
}

export async function fetchJobs(customerName?: string): Promise<Array<Job>> {
  if (customerName) {
    // Retrieve jobs specific to customer
    return [sampleJob, sampleJob];
  }
  // Retrieve all jobs
  return [sampleJob, sampleJob];
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
