import firebase from "firebase/app";
import router from "./router";
import { auth } from "./main";
import { companiesCollection } from "@/main";
import date from "date-and-time";
import store from "./store";

const { state } = store;

export function dateToStrings(inputDate: Date): Array<string> {
  return [
    inputDate.toString(),
    inputDate.toDateString(),
    inputDate.toISOString(),
    inputDate.toLocaleDateString(),
    inputDate.toLocaleString(),
    inputDate.toUTCString(),
    date.format(inputDate, "MMMM"),
    date.format(inputDate, "dddd"),
  ];
}

let routeGuardsInitialized = false;

const initRouteGuards = () => {
  if (!routeGuardsInitialized) {
    // This route guard does not actually secure the user out of the route
    router.beforeEach((to, from, next) => {
      if (to.meta.requiresAuth && to.fullPath.includes("company/")) {
        if (state.companyState.company) next();
        else router.push("/");
      } else if (to.meta.requiresAuth && to.fullPath.includes("employee/")) {
        if (state.employeeState.employee) next();
        else router.push("/");
      } else next();
    });
  }

  routeGuardsInitialized = true;
};

// Authentication helpers

export function initializeUserRouting(userKind: "employee" | "company") {
  initRouteGuards();
  if (!router.currentRoute.value.fullPath.startsWith(`/${userKind}`))
    router.push(`/${userKind}`);
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

export async function loadUser(user: firebase.User) {
  if (!(await store.fetchEmployee(user))) {
    if (!(await store.fetchCompany(user))) {
      signOut();
      throw Error("No data could be found for the signed in user.");
    }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { user } = await auth.signInWithEmailAndPassword(email, password);
    if (user) loadUser(user);
    else throw Error("User could not be found.");
  } catch (error) {
    console.log(error);
  }
}

function toWords(input: string): Array<string> {
  const regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;

  return input.trim().match(regex) as Array<string>;
}

export function nameToID(name: string): string {
  const words = toWords(name);
  return words.map((word) => word.toLowerCase()).join("_");
}

export function idToName(id: string): string {
  return id
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

function stringsOverlap(str1: string, str2: string): boolean {
  return str1.includes(str2) || str2.includes(str1);
}

export function includeItemInSearch(
  item: any,
  searchText: string,
  parameters: Array<string>
): boolean {
  searchText = searchText.trim();
  for (const param of parameters) {
    const itemProperty = item[param];
    if (itemProperty) {
      if (typeof itemProperty == "string") {
        if (stringsOverlap(searchText, itemProperty)) return true;
      } else if (itemProperty instanceof Date) {
        if (
          dateToStrings(itemProperty).find((dateString: string) =>
            dateString.includes(searchText)
          )
        )
          return true;
      }
    }
  }
  return false;
}

// Turn into a cloud function
export async function companyExists(companyID: string) {
  try {
    const doc = await companiesCollection.doc(companyID).get();
    if (doc.exists) return true;
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
