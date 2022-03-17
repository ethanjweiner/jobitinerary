// AUTHENTICATION HELPERS

import firebase from "firebase/app";

import { generateUUID } from "./helpers";
import { auth, companiesCollection } from "./main";
import router from "./router";
import store from "./store";
import { DocRef } from "./types/auxiliary";
import { Company } from "./types/users";

function validatePassword(password: string) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!password.match(regex)) {
    throw new Error(
      "Your password must contain a minimum eight characters, at least one letter, one number and one special character."
    );
  }
}

function validatePhone(phone: string) {
  const regex = /^\d{3}-\d{3}-\d{4}$/;
  if (!phone.match(regex)) {
    throw new Error("Phone number must be in the form 123-123-1234");
  }
}

export async function signUpCompany(credentials: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  // Validation
  validatePassword(credentials.password);
  if (credentials.phone) validatePhone(credentials.phone);

  const companyID = generateUUID();
  const company = new Company(companyID);
  await company.create(
    credentials.name,
    credentials.email,
    companyID,
    credentials.phone
  );
  await company.signUp(credentials.password);
}

// verifyEmployee: Verify the _activationToken_, and provide a reference to the new employee
export async function verifyEmployee(activationToken: string): Promise<DocRef> {
  // SEPARATE ACTIVATION TOKEN
  const tokenParts = activationToken.split("_");
  const companyID = tokenParts[0];
  const employeeToken = tokenParts[1];

  // Check that the employee exists in the company specified by the activation token
  const snapshot = await companiesCollection
    .doc(companyID)
    .collection("employees")
    .where("activated", "==", false)
    .where("activationToken", "==", employeeToken)
    .get();

  // Activation token matched an employee
  if (snapshot.docs.length) {
    const employeeDoc = snapshot.docs[0].data();

    // Only allow activation of unactivated employees
    if (employeeDoc.activated)
      throw Error("This employee has already been activated.");

    // If the activation is valid, return the id of the employee
    return companiesCollection
      .doc(employeeDoc.parentCompany.id)
      .collection("employees")
      .doc(snapshot.docs[0].id);
  } else {
    throw Error("The activation token provided is not valid.");
  }
}

export async function signOut() {
  auth.signOut();
  store.setUser(null);
  if (
    router.currentRoute.value.fullPath.startsWith("/employee") ||
    router.currentRoute.value.fullPath.startsWith("/company")
  )
    router.push("/");
}

// loadUser: Load the signed-in user into the store, based on the user's type
export async function loadUser(user: firebase.User) {
  if (user.email) {
    if (!(await store.loadEmployee(user.email))) {
      if (!(await store.loadCompany(user.email))) {
        signOut();
        throw Error("No data could be found for the signed in user.");
      }
    }
  } else throw Error("The user is not properly signed in. Could not load.");
}

export async function signIn(email: string, password: string) {
  const { user } = await auth.signInWithEmailAndPassword(email, password);
  if (user) loadUser(user);
  else throw Error("User could not be found.");
}
