import { auth } from "./main";
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

// Handle auth state changes here
export async function handleAuthStateChanged(user: firebase.User | null) {
  console.log("Auth state changed...");
  // User has not been activated
  if (user) {
    // Try to find an employee
    const employeeData = await fetchEmployeeData(user);

    if (employeeData) {
      updateUser(employeeData);
      initRouteGuards();
      if (!router.currentRoute.value.fullPath.startsWith("/employee"))
        router.push("/employee");
      return;
    }

    // Try to find a company
    const companyData = await fetchCompanyData(user);

    if (companyData) {
      updateUser(companyData);
      initRouteGuards();
      if (!router.currentRoute.value.fullPath.startsWith("/company"))
        router.push("/company");
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
    if (
      router.currentRoute.value.fullPath.startsWith("/employee") ||
      router.currentRoute.value.fullPath.startsWith("/company")
    )
      router.push("/");

    initRouteGuards();
  }
}
