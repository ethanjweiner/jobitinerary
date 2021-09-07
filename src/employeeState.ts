// Store
// Purpose: Manage user data in one place throughout the application
// Reduces number of gets for user data

import { readonly } from "vue";
import { auth, companiesCollection, employeesCollection } from "./main";
import * as Types from "./types";
import firebase from "firebase/app";
import { loadEmployee, nameToID } from "./helpers";

interface EmployeeState {
  temp: null;
}

const state: EmployeeState = {
  temp: null,
};

export const employeeState = readonly(state);

// Purpose: Is the user an employee? If so, update the user's data.
export async function fetchEmployeeData(
  user: firebase.User
): Promise<Types.Employee | undefined> {
  try {
    const snapshot = await employeesCollection
      .where("email", "==", user.email)
      .limit(1)
      .get();
    let data;
    snapshot.docs.forEach((doc) => {
      data = doc.data() as Types.Employee;
    });
    return data;
  } catch (error) {
    // If the user doesn't have access to this document, just return
    return;
  }
}

export async function createEmployee(credentials: any, companyID: string) {
  try {
    const employeeData: Types.Employee = {
      name: credentials.name,
      companyID,
      email: credentials.email,
      phone: credentials.phone,
      hourlyRate: null,
      kind: "employee",
    };
    companiesCollection
      .doc(companyID)
      .collection("employees")
      .doc(nameToID(credentials.name))
      .set(employeeData);
  } catch (error) {
    console.log(error);
  }
}

// Turn into a cloud function
async function companyExists(companyID: string) {
  try {
    const doc = await companiesCollection.doc(companyID).get();
    if (doc.exists) return true;
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function activateEmployee(credentials: any, companyID: string) {
  // Check that the employee exists
  if (await companyExists(companyID)) {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      if (user) {
        await createEmployee(credentials, companyID);
        await loadEmployee(user);
      } else throw Error("Could not activate employee.");
    } catch (error) {
      console.log(error);
    }
  } else {
    throw Error("The provided activation token is invalid.");
  }
}
