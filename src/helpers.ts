import { auth, employeesCollection } from "./main";
import {
  store,
  fetchCompanyData,
  fetchEmployeeData,
  updateUser,
} from "./store";
import firebase from "firebase/app";
import router from "./router";

let routeGuardsInitialized = false;

const initRouteGuards = () => {
  if (!routeGuardsInitialized) {
    // This route guard does not actually secure the user out of the route
    router.beforeEach((to, from, next) => {
      if (to.meta.requiresAuth && to.fullPath.includes("company/")) {
        if (store.user && store.user.kind == "company") next();
        else router.push("/");
      } else if (to.meta.requiresAuth && to.fullPath.includes("employee/")) {
        if (store.user && store.user.kind == "employee") next();
        else router.push("/");
      } else next();
    });
  }

  routeGuardsInitialized = true;
};

// Does the _email_ match the _activationToken_ for the employee?
export async function verifyEmployee(
  email: string,
  activationToken: string
): Promise<boolean> {
  const snapshot = await employeesCollection
    .where("activationToken", "==", activationToken)
    .limit(1)
    .get();
  let verified = false;
  snapshot.docs.forEach((doc) => {
    if (doc.data().email == email) {
      verified = true;
    }
  });
  return verified;
}

// Handle auth state changes here
export async function handleAuthStateChanged(user: firebase.User | null) {
  console.log("Auth state changed...");
  // User has not been activated
  if (user) {
    // Try to find a company
    const companyData = await fetchCompanyData(user);

    if (companyData) {
      updateUser(companyData);
      initRouteGuards();
      if (!router.currentRoute.value.fullPath.startsWith("/company"))
        router.push("/company");
      return;
    }
    // Try to find an employee
    const employeeData = await fetchEmployeeData(user);

    if (employeeData) {
      updateUser(employeeData);
      initRouteGuards();
      if (!router.currentRoute.value.fullPath.startsWith("/employee"))
        router.push("/employee");
      return;
    }

    console.log(companyData, employeeData);

    // Couldn't find either
    auth.signOut();
    throw Error(
      "No company or employee data could be found for the provided user."
    );
    // The user is not logged in
  } else {
    updateUser(null);
    initRouteGuards();
  }
}
