// Store
// Purpose: Manage user data in one place throughout the application
// Reduces number of gets for user data

import { readonly } from "vue";
import { auth, db, companiesCollection, employeesCollection } from "./main";
import * as Types from "./types";
import { verifyEmployee } from "./helpers";
import firebase from "firebase/app";
import router from "./router";

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
  } catch {
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

export async function activateEmployee(
  credentials: any,
  activationToken: string
) {
  // Verify that the activation token matches with the correct email
  if (await verifyEmployee(credentials.email, activationToken)) {
    try {
      await auth.createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
    } catch (error) {
      console.log(error);
      state.errorMessage = error.message;
    }
  } else {
    state.errorMessage =
      "The email and activation token do not match. Please ask your company to resend the link.";
    throw Error(state.errorMessage);
  }
}

export async function createEmployee(credentials: any) {
  console.log(credentials);
}
