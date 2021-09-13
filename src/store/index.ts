import { reactive } from "vue";
import * as Types from "../types";
import firebase from "firebase/app";
import { auth, companiesCollection, employeesCollection } from "../main";
import { initializeUserRouting, nameToID, companyExists } from "@/helpers";

interface CompanyState {
  company: Types.Company | null;
  customers: Array<Types.Customer>;
  employees: Array<Types.Employee>;
  selectedCustomer: Types.Customer | null;
  selectedEmployee: Types.Employee | null;
}

interface EmployeeState {
  employee: Types.Employee | null;
}

interface State {
  userType: "company" | "employee" | null;
  errorMessage: string | null;
  companyState: CompanyState;
  employeeState: EmployeeState;
}

const store = {
  // Don't replace the state: It is uses as the source of truth
  state: reactive<State>({
    userType: null,
    errorMessage: null,
    companyState: {
      company: null,
      customers: [],
      employees: [],
      selectedCustomer: null,
      selectedEmployee: null,
    },
    employeeState: {
      employee: null,
    },
  }),
  setUser(user: Types.User | null) {
    if (!user) {
      this.state.userType = null;
      this.clearCompanyState();
      this.clearEmployeeState();
    } else
      switch (user.kind) {
        case "company":
          // Initialize the company store
          this.state.userType = "company";
          this.state.companyState.company = user;
          this.fetchCustomers();
          this.fetchEmployees();
          break;
        case "employee":
          this.state.userType = "employee";
          this.state.employeeState.employee = user;
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
      company: null,
      customers: [],
      employees: [],
      selectedCustomer: null,
      selectedEmployee: null,
    };
  },
  setCustomers(customers: Array<Types.Customer>) {
    this.state.companyState.customers = customers;
  },
  async fetchCustomers() {
    console.log("Fetching customers for company");
    this.setCustomers([Types.sampleCustomer1, Types.sampleCustomer2]);
  },
  setEmployees(employees: Array<Types.Employee>) {
    this.state.companyState.employees = employees;
  },
  async fetchEmployees() {
    console.log("Fetching employees for company");
    this.setEmployees([Types.sampleEmployee1, Types.sampleEmployee2]);
  },
  setSelectedCustomer(customer: Types.Customer) {
    this.state.companyState.selectedCustomer = customer;
  },
  async fetchSelectedCustomer(name: string) {
    const id = nameToID(name);
    console.log("Fetching customer ", id);
    this.setSelectedCustomer(Types.sampleCustomer1);
  },
  setSelectedEmployee(employee: Types.Employee) {
    this.state.companyState.selectedEmployee = employee;
  },
  async fetchSelectedEmployee(name: string) {
    const id = nameToID(name);
    console.log("Fetching employee ", id);
    this.setSelectedEmployee(Types.sampleEmployee1);
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
  async createEmployee(credentials: any, companyID: string) {
    try {
      const employeeData: Types.Employee = {
        name: credentials.name,
        companyID,
        email: credentials.email,
        phone: credentials.phone,
        defaultHourlyRate: null,
        kind: "employee",
      };
      companiesCollection
        .doc(companyID)
        .collection("employees")
        .doc(nameToID(credentials.name))
        .set(employeeData);
    } catch (error) {
      console.log(error);
    }
  },
  async activateEmployee(credentials: any, companyID: string) {
    // Check that the employee exists
    if (await companyExists(companyID)) {
      try {
        const { user } = await auth.createUserWithEmailAndPassword(
          credentials.email,
          credentials.password
        );
        if (user) {
          await this.createEmployee(credentials, companyID);
          await this.fetchEmployee(user);
        } else throw Error("Could not activate employee.");
      } catch (error) {
        console.log(error);
      }
    } else {
      throw Error("The provided activation token is invalid.");
    }
  },
  clearEmployeeState() {
    this.state.employeeState = {
      employee: null,
    };
  },
};

export default store;
