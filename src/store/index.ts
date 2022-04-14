import { reactive, ref } from "vue";

import { initializeUserRouting } from "@/helpers";
import { Alert } from "@/types/auxiliary";

import { companiesCollection, employeesCollection } from "../main";
import { Company, Customer, Employee } from "../types/users";

// GLOBAL STATE

interface State {
  user: Company | Employee | Customer | null;
  userType: "company" | "employee" | "customer" | null;
  companyID: string;
}

const store = {
  state: reactive<State>({
    user: null,
    userType: null,
    companyID: "",
  }),
  alert: reactive<Alert>({
    message: "Unidentified error",
    color: "danger",
  }),
  loadingCounter: ref<number>(0),
  incrementLoadingCounter() {
    this.loadingCounter.value += 1;
  },
  decrementLoadingCounter() {
    this.loadingCounter.value -= 1;
  },
  resetLoadingCounter() {
    this.loadingCounter.value = 0;
  },

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
  },

  async setCompanyID(id: string) {
    this.state.companyID = id;
  },

  async loadCompany(email: string): Promise<boolean> {
    const snapshot = await companiesCollection
      .where("data.email", "==", email)
      .limit(1)
      .get();

    if (snapshot.docs.length) {
      const doc = snapshot.docs[0].data();
      const company = new Company(doc.data.id);

      if (await company.init()) {
        this.setUser(company);
        this.setCompanyID(company.data.id);
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
          .doc(doc.data.id),
        doc.parentCompany
      );
      if (await employee.init()) {
        this.setUser(employee);
        this.setCompanyID(doc.parentCompany.id);
        initializeUserRouting("employee");
        return true;
      }
    }
    return false;
  },

  async setAlert(alert: Alert) {
    this.alert.message = alert.message;
    this.alert.color = alert.color;
  },
};

export default store;
