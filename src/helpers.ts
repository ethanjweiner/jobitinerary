import router from "./router";
import { storage } from "./main";
import date from "date-and-time";
import store from "@/store";
import { Loader } from "./types/auxiliary";
import { Company, Customer, Employee } from "./types/users";
import { CustomerDay, sampleVisit1, Visit } from "./types/work_units";

// ROUTING HELPERS

let routeGuardsInitialized = false;

const initRouteGuards = () => {
  if (!routeGuardsInitialized) {
    // This route guard does not actually secure the user out of the route
    router.beforeEach((to, from, next) => {
      if (to.meta.requiresAuth && to.fullPath.includes("company/")) {
        if (store.state.user instanceof Company) next();
        else router.push("/");
      } else if (to.meta.requiresAuth && to.fullPath.includes("employee/")) {
        if (store.state.user instanceof Employee) next();
        else router.push("/");
      } else if (to.meta.requiresAuth && to.fullPath.includes("customer/")) {
        if (store.state.user instanceof Customer) next();
        else router.push("/");
      } else next();
    });
  }

  routeGuardsInitialized = true;
};

export function initializeUserRouting(
  userKind: "employee" | "company" | "customer"
) {
  initRouteGuards();
  if (!router.currentRoute.value.fullPath.startsWith(`/${userKind}`))
    router.push(`/${userKind}`);
}

// DATE HELPERS

export function dateToString(date: Date) {
  return date.toLocaleDateString().replaceAll("/", "-");
}

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

export function formatTime(fourDigitTime: string): string {
  const hours24 = parseInt(fourDigitTime.substring(0, 2));
  const hours = ((hours24 + 11) % 12) + 1;
  const amPm = hours24 > 11 ? "pm" : "am";
  const minutes = fourDigitTime.substring(2);

  return hours + ":" + minutes + amPm;
}

// STRING MANIPULATION HELPERS

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
  searchText = searchText.trim().toLowerCase();
  for (const param of parameters) {
    const itemProperty = item[param];
    if (itemProperty) {
      if (param.toLowerCase().includes("date")) {
        if (
          dateToStrings(new Date(itemProperty)).find((dateString: string) =>
            dateString.toLowerCase().includes(searchText)
          )
        )
          return true;
      } else if (typeof itemProperty == "string") {
        if (stringsOverlap(searchText, itemProperty.toLowerCase())) return true;
      } else if (typeof itemProperty == "number") {
        if (stringsOverlap(searchText, itemProperty.toString())) return true;
      } else return false;
    }
  }
  return false;
}

// INFINITE SCROLL HELPERS

export async function loadData(ev: any, loader: Loader, searchFilter?: string) {
  // Attempt to load data
  const status = await loader(searchFilter);
  // Continue using Infinite Scroll depending on status
  if (status == 0) ev.target.complete();
  else ev.target.disabled = true;
}

// OTHER

export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getImageURL(ref: string) {
  return await storage
    .ref()
    .child(ref)
    .getDownloadURL();
}

export async function retrieveVisitsOnDay(
  day: CustomerDay
): Promise<Array<Visit>> {
  day;
  // RETRIEVE VISITS ASSOCIATED WITH THE PROVIDED DAY
  return [sampleVisit1, sampleVisit1];
}
