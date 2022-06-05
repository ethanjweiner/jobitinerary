import date from 'date-and-time';

import { companiesCollection, emailsCollection, storage } from './main';
import router from './router';
import store from './store';
import { Loader } from './types/auxiliary';
import { Visit } from './types/units';

// ROUTING HELPERS

let routeGuardsInitialized = false;

const initRouteGuards = (userKind: 'employee' | 'company' | 'customer') => {
  if (!routeGuardsInitialized) {
    // This route guard does not actually secure the user out of the route
    router.beforeEach((to, from, next) => {
      if (to.meta.requiresAuth) {
        if (to.fullPath.includes('company/') && userKind == 'company') next();
        else if (to.fullPath.includes('employee/') && userKind == 'employee')
          next();
        else if (to.fullPath.includes('customer/') && userKind == 'customer')
          next();
        else router.push('/');
      } else next();
    });
  }

  routeGuardsInitialized = true;
};

export function initializeUserRouting(
  userKind: 'employee' | 'company' | 'customer'
) {
  initRouteGuards(userKind);
  if (!router.currentRoute.value.fullPath.startsWith(`/${userKind}`))
    router.push(`/${userKind}`);
}

// DATE HELPERS

export function dateToString(inputDate: Date) {
  return date.format(inputDate, 'YYYY-MM-DD');
}

export function formatDate(inputDate: string) {
  return inputDate.substring(0, 10);
}

export function dateToStrings(inputDate: Date): Array<string> {
  const strs = [
    inputDate.toString(),
    inputDate.toDateString(),
    inputDate.toISOString(),
    inputDate.toLocaleDateString(),
    inputDate.toLocaleString(),
    inputDate.toUTCString(),
    date.format(inputDate, 'MMMM'),
    date.format(inputDate, 'dddd'),
  ];

  return strs;
}

export function formatTime(inputDate: string): string {
  return date.format(new Date(inputDate), 'hh:mm A');
}

// STRING MANIPULATION HELPERS

function toWords(input: string): Array<string> {
  const regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;

  return input.trim().match(regex) as Array<string>;
}

export function nameToID(name: string): string {
  const words = toWords(name);
  if (words.length) return words.map((word) => word.toLowerCase()).join('_');
  return name.toLowerCase();
}

export function idToName(id: string): string {
  return id
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function explode(str: any): Array<string> {
  const explosion: Array<string> = [];
  const strs = str.split(' ');
  strs.push(str);
  strs.forEach((str: string) => {
    for (let i = 1; i < str.length + 1; i++) {
      explosion.push(str.substring(0, i));
    }
  });
  return explosion;
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
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getImageURL(ref: string) {
  return await storage
    .ref()
    .child(ref)
    .getDownloadURL();
}

export async function retrieveCustomerAddress(customerID: string) {
  const query = companiesCollection.doc(
    `${store.state.companyID}/customers/${customerID}`
  );
  const customerDocData = (await query.get()).data();

  if (customerDocData && customerDocData.data.location)
    return customerDocData.data.location;
}

export async function retrieveVisitsOnDate(
  date: string,
  options: { customerID?: string; employeeID?: string }
): Promise<Array<Visit>> {
  const visits: Array<Visit> = [];
  // RETRIEVE VISITS ASSOCIATED WITH THE PROVIDED DAY
  let query = companiesCollection
    .doc(store.state.companyID)
    .collection('visits')
    .where('data.date', '==', date);
  if (options.customerID)
    query = query.where('data.customerID', '==', options.customerID);
  if (options.employeeID)
    query = query.where('data.employeeID', '==', options.employeeID);

  const visitDocs = (await query.get()).docs;
  for (const doc of visitDocs) {
    const visit = new Visit(doc.id, store.state.companyID);
    await visit.init(doc.data().data);
    visits.push(visit);
  }

  visits.sort(
    (a: Visit, b: Visit) =>
      new Date(a.data.plannedStart).getTime() -
      new Date(b.data.plannedStart).getTime()
  );
  return visits;
}

// `PropertyKey` is short for "string | number | symbol"
// since an object key can be any of those types, our key can too
// in TS 3.0+, putting just "string" raises an error
export function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
  return key in obj;
}

export function showTextAreas(state: any) {
  setTimeout(() => (state.showTextAreas = true), 250);
}

// Emails

export async function sendEmail(recipient: string, date: string) {
  await emailsCollection.add({
    to: recipient,
    template: {
      name: 'handlebars',
      data: {
        date,
      },
    },
  });
}
