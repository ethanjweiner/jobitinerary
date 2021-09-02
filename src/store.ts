// Store
// Purpose: Manage user data in one place throughout the application
// Reduces number of gets for user data

import { readonly } from "vue";
import { auth, db, companiesCollection, employeesCollection } from "./main";
import * as Types from "./types";
import firebase from "firebase/app";

interface State {
  user: Types.User;
  errorMessage: string | null;
}

const state: State = {
  user: null,
  errorMessage: null,
};

export const store = readonly(state);

export function updateUser(user: Types.User) {
  console.log("Current user data: ", user);
  state.user = user;
}

export async function fetchCompanyData(
  user: firebase.User
): Promise<Types.Company | undefined> {
  try {
    return (
      await companiesCollection.doc(user.uid).get()
    ).data() as Types.Company;
  } catch {
    // If the user doesn't have access to this document, just return
    return;
  }
}

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

export async function signIn(email: string, password: string) {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.log(error);
    state.errorMessage = error.message;
  }
}

export async function createCompany(credentials: any) {
  let user;
  try {
    const cred = await auth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
    user = cred.user;
  } catch (error) {
    console.log(error);
    state.errorMessage = error.message;
  }

  if (user) {
    const companyData: Types.Company = {
      id: user.uid,
      name: credentials.name,
      email: credentials.email,
      phone: credentials.phone,
      kind: "company",
    };
    await db
      .collection("companies")
      .doc(user.uid)
      .set(companyData);
  } else {
    throw Error("Could not create company.");
  }
}

// TEMPORARY
// Does the company exist? (requires read priveleges of companies)
function companyExistsCloudFunction(companyID: string) {
  if (companyID) return true;
  return false;
}

export async function createEmployee(
  credentials: any,
  employeeID: string,
  companyID: string
) {
  try {
    const employeeData: Types.Employee = {
      id: employeeID,
      name: credentials.name,
      email: credentials.email,
      phone: credentials.phone,
      kind: "employee",
    };
    companiesCollection
      .doc(companyID)
      .collection("employees")
      .doc(employeeID)
      .set(employeeData);
  } catch (error) {
    console.log(error);
    state.errorMessage = error.message;
  }
}

export async function activateEmployee(credentials: any, companyID: string) {
  // Check that the employee exists
  if (companyExistsCloudFunction(companyID)) {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      if (user) await createEmployee(credentials, user.uid, companyID);
      else throw Error("Could not activate employee.");
    } catch (error) {
      console.log(error);
      state.errorMessage = error.message;
    }
  } else {
    state.errorMessage = "The activation token is invalid.";
    throw Error(state.errorMessage);
  }
}
