// Store
// Purpose: Manage user data in one place throughout the application
// Reduces number of gets for user data

import { readonly } from "vue";
import { auth, companiesCollection } from "./main";
import * as Types from "./types";
import firebase from "firebase/app";
import { loadCompany } from "./helpers";

interface CompanyState {
  customers: Array<Types.Customer> | null;
  employees: Array<Types.Employee> | null;
  selectedCustomer: Types.Customer | null;
  selectedEmployee: Types.Employee | null;
}

const state: CompanyState = {
  customers: null,
  employees: null,
  selectedCustomer: null,
  selectedEmployee: null,
};

export const companyState = readonly(state);

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

export async function createCompany(credentials: any) {
  try {
    const { user } = await auth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
    if (user) {
      const companyData: Types.Company = {
        id: user.uid,
        name: credentials.name,
        email: credentials.email,
        phone: credentials.phone,
        kind: "company",
      };
      await companiesCollection.doc(user.uid).set(companyData);
      loadCompany(user);
    } else {
      throw Error("Could not create company.");
    }
  } catch (error) {
    console.log(error);
  }
}

export function setCustomers(customers: Array<Types.Customer> | null) {
  state.customers = customers;
}

export async function fetchCustomers(company: Types.Company) {
  console.log("Fetching customers for ", company.id);
  const customers = [Types.sampleCustomer, Types.sampleCustomer];
  setCustomers(customers);
}

export function setEmployees(employees: Array<Types.Employee> | null) {
  state.employees = employees;
}

export async function fetchEmployees(userID: string) {
  console.log("Fetching employees for ", userID);
  const employees = [Types.sampleEmployee, Types.sampleEmployee];
  setEmployees(employees);
}

export function setSelectedCustomer(customer: Types.Customer | null) {
  state.selectedCustomer = customer;
}

export async function fetchSelectedCustomer(customerID: string) {
  console.log("Fetching customer ", customerID);
  // Retrieve customer
  setSelectedCustomer(Types.sampleCustomer);
}

export function setSelectedEmployee(employee: Types.Employee | null) {
  state.selectedEmployee = employee;
}

export async function fetchSelectedEmployee(employeeID: string) {
  console.log("Fetching employee ", employeeID);
  // Retrieve customer
  setSelectedEmployee(Types.sampleEmployee);
}
