// Store
// Purpose: Manage user data in one place throughout the application
// Reduces number of gets for user data

import { auth, companiesCollection } from "../main";
import * as Types from "../types";
import firebase from "firebase/app";
import { loadCompany } from "../helpers";
import { state } from "./store";

export interface CompanyState {
  company: Types.Company | null;
  customers: Array<Types.Customer> | null;
  employees: Array<Types.Employee> | null;
  selectedCustomer: Types.Customer | null;
  selectedEmployee: Types.Employee | null;
}

export function initializeCompanyState(): CompanyState {
  return {
    company: null,
    customers: null,
    employees: null,
    selectedCustomer: null,
    selectedEmployee: null,
  };
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
  state.companyState.customers = customers;
}

export async function fetchCustomers() {
  if (state.companyState.company) {
    console.log("Fetching customers for ", state.companyState.company.id);
    // Temporary
    const customers = [Types.sampleCustomer, Types.sampleCustomer];
    setCustomers(customers);
  } else {
    throw Error("No company is signed in to perform the requested action.");
  }
}

export function setEmployees(employees: Array<Types.Employee> | null) {
  state.companyState.employees = employees;
}

export async function fetchEmployees() {
  if (state.companyState.company) {
    console.log("Fetching employees for ", state.companyState.company.id);
    // Temporary
    const employees = [Types.sampleEmployee, Types.sampleEmployee];
    setEmployees(employees);
  } else {
    throw Error("No company is signed in to perform the requested action.");
  }
}

export function setSelectedCustomer(customer: Types.Customer | null) {
  state.companyState.selectedCustomer = customer;
}

export async function fetchSelectedCustomer(customerID: string) {
  console.log("Fetching customer ", customerID);
  // Retrieve customer
  setSelectedCustomer(Types.sampleCustomer);
}

export function setSelectedEmployee(employee: Types.Employee | null) {
  state.companyState.selectedEmployee = employee;
}

export async function fetchSelectedEmployee(employeeID: string) {
  console.log("Fetching employee ", employeeID);
  // Retrieve customer
  setSelectedEmployee(Types.sampleEmployee);
}
