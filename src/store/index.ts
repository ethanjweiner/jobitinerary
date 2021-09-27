import { reactive } from "vue";
import { Company, Employee, MetaData, Customer } from "../types/users";
import { companiesCollection, employeesCollection } from "../main";
import { initializeUserRouting } from "@/helpers";

// GLOBAL STATE

interface State {
  // Currently signed-in user object, containing user-specific state and actions
  user: Company | Employee | Customer | null;
  userType: "company" | "employee" | "customer" | null;
  // Company associated with the signed-in user
  company: MetaData | null;
  errorMessage: string;
}

const store = {
  state: reactive<State>({
    user: null,
    userType: null,
    errorMessage: "",
    company: null,
  }),

  DEBOUNCE_AMOUNT: 300,

  async setUser(user: Company | Employee | Customer | null) {
    this.state.user = user;
    if (user instanceof Company) {
      this.state.userType = "company";
    } else if (user instanceof Employee) {
      this.state.userType = "employee";
    } else if (user instanceof Customer) {
      this.state.userType == "customer";
    } else {
      this.state.userType = null;
    }

    console.log(this.state.user);
  },

  async setCompany(companyData: MetaData | null) {
    this.state.company = companyData;
  },

  async loadCompany(email: string): Promise<boolean> {
    console.log("loading company");
    const snapshot = await companiesCollection
      .where("data.email", "==", email)
      .limit(1)
      .get();

    if (snapshot.docs.length) {
      const doc = snapshot.docs[0].data();
      console.log();
      const company = new Company(companiesCollection.doc(doc.data.id));

      if (await company.init()) {
        this.setUser(company);
        this.setCompany(company.data);
        initializeUserRouting("company");
        return true;
      }
    }
    return false;
  },

  async loadEmployee(email: string): Promise<boolean> {
    const snapshot = await employeesCollection
      .where("data.email", "==", email)
      .limit(1)
      .get();
    if (snapshot.docs.length) {
      const doc = snapshot.docs[0].data();
      const employee = new Employee(
        companiesCollection
          .doc(doc.parentCompany.id)
          .collection("employees")
          .doc(doc.data.id)
      );
      if (await employee.init()) {
        this.setUser(employee);
        this.setCompany(doc.parentCompany);
        initializeUserRouting("employee");
        return true;
      }
    }
    return false;
  },
};

export default store;
