import { reactive } from "vue";
import * as Types from "../types";
import firebase from "firebase/app";
import { auth, companiesCollection, employeesCollection } from "../main";
import { initializeUserRouting, nameToID } from "@/helpers";

interface CompanyState {
  customers: Array<Types.Customer>;
  employees: Array<Types.Employee>;
}

interface EmployeeState {
  employee: Types.Employee | null;
}

interface State {
  userType: "company" | "employee" | null;
  // All users need to access to basic company information
  // Only store non-sensitive information in the company
  company: Types.Company | null;
  errorMessage: string | null;
  companyState: CompanyState;
  employeeState: EmployeeState;
}

const store = {
  // Don't replace the state: It is uses as the source of truth
  state: reactive<State>({
    userType: null,
    errorMessage: null,
    company: null,
    companyState: {
      customers: [],
      employees: [],
    },
    employeeState: {
      employee: null,
    },
  }),
  setUser(user: Types.User | null) {
    if (!user) {
      this.state.userType = null;
      this.state.company = null;
      this.clearCompanyState();
      this.clearEmployeeState();
    } else
      switch (user.kind) {
        case "company":
          // Initialize the company store
          this.state.userType = "company";
          this.state.company = user;
          this.fetchCustomers();
          this.fetchEmployees();
          break;
        case "employee":
          this.state.userType = "employee";
          this.state.employeeState.employee = user;
          this.state.company = user.company;
          break;
        default:
          throw new Error("Could't update the user properly");
      }
  },
  // COMPANY
  async fetchCompany(user: firebase.User): Promise<boolean> {
    try {
      const company = (
        await companiesCollection.doc(user.uid).get()
      ).data() as Types.Company;
      this.setUser(company);
      initializeUserRouting("company");
      return true;
    } catch {
      return false;
    }
  },
  async createCompany(credentials: any) {
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
        this.fetchCompany(user);
      } else {
        throw Error("Could not create company.");
      }
    } catch (error) {
      console.log(error);
    }
  },
  // COMPANY STATE
  clearCompanyState() {
    this.state.companyState = {
      customers: [],
      employees: [],
    };
  },
  setCustomers(customers: Array<Types.Customer>) {
    this.state.companyState.customers = customers;
  },
  async fetchCustomers() {
    console.log("Fetching customers for company");
    this.setCustomers([Types.sampleCustomer1, Types.sampleCustomer2]);
  },
  async addCustomer(name: string, email: string) {
    if (this.state.company) {
      // ADD CUSTOMER TO DATABASE

      // Add customer locally
      const customer = Types.newCustomer(name, email, this.state.company);
      this.state.companyState.customers.push(customer);
    } else throw Error("To add a customer, a company must be signed in.");
  },
  async deleteCustomer(name: string) {
    // DELETE CUSTOMER FROM DATABASE

    // Delete customer locally
    const deleteIndex = this.state.companyState.customers.findIndex(
      (customer) => customer.name == name
    );
    this.state.companyState.customers.splice(deleteIndex, 1);
  },
  setEmployees(employees: Array<Types.Employee>) {
    this.state.companyState.employees = employees;
  },
  async fetchEmployees() {
    console.log("Fetching employees for company");
    this.setEmployees([Types.sampleEmployee1, Types.sampleEmployee2]);
  },
  async addEmployee(name: string, email: string) {
    if (this.state.company) {
      // ADD CUSTOMER TO DATABASE

      // Add customer locally
      const employee = Types.newEmployee(name, email, this.state.company);
      this.state.companyState.employees.push(employee);
    } else throw Error("To add an employee, a company must be signed in.");
  },
  async deleteEmployee(name: string) {
    // DELETE EMPLOYEE FROM DATABASE

    // Delete customer locally
    const deleteIndex = this.state.companyState.employees.findIndex(
      (employee) => employee.name == name
    );
    this.state.companyState.employees.splice(deleteIndex, 1);
  },
  // EMPLOYEE
  async fetchEmployee(user: firebase.User): Promise<boolean> {
    try {
      const snapshot = await employeesCollection
        .where("email", "==", user.email)
        .limit(1)
        .get();
      let employee;
      snapshot.docs.forEach((doc) => {
        employee = doc.data() as Types.Employee;
      });
      if (employee) {
        this.setUser(employee);
        initializeUserRouting("employee");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  async createEmployee(credentials: any, company: Types.Company) {
    try {
      const employeeData: Types.Employee = {
        name: credentials.name,
        company,
        email: credentials.email,
        phone: credentials.phone,
        defaultHourlyRate: null,
        kind: "employee",
      };
      companiesCollection
        .doc(company.id)
        .collection("employees")
        .doc(nameToID(credentials.name))
        .set(employeeData);
    } catch {
      console.log(
        "Missing permissions: Could not alter the companies collection."
      );
    }
  },
  async activateEmployee(credentials: any, companyID: string) {
    // Check that the employee exists

    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      if (user) {
        const activationCompany = (
          await companiesCollection.doc(companyID).get()
        ).data() as Types.Company;
        if (!activationCompany)
          throw Error("The activation token provided is not valid.");
        await this.createEmployee(credentials, activationCompany);
        await this.fetchEmployee(user);
      } else throw Error("Could not activate employee.");
    } catch (error) {
      console.log(error);
    }
  },
  clearEmployeeState() {
    this.state.employeeState = {
      employee: null,
    };
  },
};

export default store;
