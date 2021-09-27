import firebase from "firebase/app";
import { auth } from "@/main";
import { ImageWithCaption, Location } from "@/types/auxiliary";
import { generateUUID, nameToID } from "@/helpers";
import { loadUser } from "@/authentication";

// USERS

export interface MetaData {
  id: string;
  email: string;
  name: string;
  phone: string;
}

export interface EmployeeData extends MetaData {
  defaultHourlyRate: number | null;
}

export interface CustomerData extends MetaData {
  location: Location;
  customerNotes: string;
  propertyNotes: string;
  propertyImages: Array<ImageWithCaption>;
}

export type UserData = MetaData | EmployeeData | CustomerData;

const emptyUserData: MetaData = {
  id: "",
  email: "",
  name: "",
  phone: "",
};

const emptyEmployeeData: EmployeeData = {
  id: "",
  email: "",
  name: "",
  phone: "",
  defaultHourlyRate: null,
};

const emptyCustomerData: CustomerData = {
  id: "",
  email: "",
  name: "",
  phone: "",
  location: {
    address: "",
    coordinates: null,
  },
  customerNotes: "",
  propertyNotes: "",
  propertyImages: [],
};

interface UserInterface {
  data: UserData;
  dbRef: firebase.firestore.DocumentReference;
  // init: Attempt to retrieve the document associated with the employee. If unable to find, return false.
  init: () => Promise<firebase.firestore.DocumentData | false>;
  update: (data: UserData) => Promise<ThisParameterType<UserInterface>>;
  save: () => Promise<ThisParameterType<UserInterface>>;
  create: (
    name: string,
    email: string,
    id: string,
    phone?: string
  ) => Promise<ThisParameterType<UserInterface>>;
  signUp: (password: string) => void;
  employees: Array<Employee>;
  customers: Array<Customer>;
}

export class User implements UserInterface {
  dbRef: firebase.firestore.DocumentReference;
  data: UserData;
  employees: Array<Employee>;
  customers: Array<Customer>;

  constructor(dbRef: firebase.firestore.DocumentReference) {
    this.dbRef = dbRef;
    // Temporary empty values
    this.data = { ...emptyUserData };
    this.employees = [];
    this.customers = [];
  }

  async init() {
    const doc = (await this.dbRef.get()).data();
    if (doc) {
      this.data = doc.data;
      return doc;
    }
    return false;
  }

  async create(name: string, email: string, id: string, phone?: string) {
    try {
      this.data.name = name;
      this.data.email = email;
      this.data.id = id;
      this.data.phone = phone ? phone : "";

      await this.save();

      return this;
    } catch (error) {
      console.log(error);
    }
  }

  async save() {
    setTimeout(async () => {
      await this.dbRef.set({
        data: this.data,
      });
      return this;
    }, 500);
  }

  async signUp(password: string) {
    const { user } = await auth.createUserWithEmailAndPassword(
      this.data.email,
      password
    );
    if (user) loadUser(user);
  }

  async update(data: UserData) {
    this.data = data;
    await this.save();
    return this;
  }
}

class ChildUser extends User {
  parentCompany: UserData | null;
  activationToken: string | null;
  activated: boolean;

  constructor(dbRef: firebase.firestore.DocumentReference) {
    super(dbRef);
    this.parentCompany = null;
    this.activationToken = null;
    this.activated = false;
  }

  async create(name: string, email: string, id: string, phone?: string) {
    try {
      this.data.name = name;
      this.data.email = email;
      this.data.id = id;
      this.data.phone = phone ? phone : "";
      this.parentCompany = null;
      this.activationToken = generateUUID();
      this.activated = false;

      await this.save();

      return this;
    } catch (error) {
      console.log(error);
    }
  }

  async save() {
    setTimeout(async () => {
      await this.dbRef.set({
        data: this.data,
        parentCompany: this.parentCompany,
        activationToken: this.activationToken, // Placeholder activation token
        activated: this.activated,
      });
      return this;
    }, 500);
  }

  async init() {
    const doc = await super.init();
    if (doc) {
      this.parentCompany = doc.parentCompany;
      this.activationToken = doc.activationToken;
      this.activated = doc.activated;
      return doc;
    }
    return false;
  }

  async assignCompany(company: MetaData) {
    try {
      this.parentCompany = company;
      await this.dbRef.update({
        parentCompany: company,
      });
    } catch (error) {
      console.log(error);
    }
    return this;
  }

  // For child user's only call this AFTER verification process is complete
  async signUp(password: string) {
    await super.signUp(password);
    await this.dbRef.update({ activated: true });
  }

  async delete() {
    await this.dbRef.delete();
  }
}

export class Employee extends ChildUser {
  data: EmployeeData;
  constructor(dbRef: firebase.firestore.DocumentReference) {
    super(dbRef);
    this.data = { ...emptyEmployeeData };
  }
}

export class Customer extends ChildUser {
  data: CustomerData;
  constructor(dbRef: firebase.firestore.DocumentReference) {
    super(dbRef);
    this.data = { ...emptyCustomerData };
  }
}

export class Company extends User {
  // Q: Why store employees & customers globally?
  // A: We access them in disconnected components (e.g. in the "user select" component)
  employees: Array<Employee>;
  customers: Array<Customer>;

  constructor(dbRef: firebase.firestore.DocumentReference) {
    super(dbRef);
    this.employees = [];
    this.customers = [];
  }

  async init() {
    const doc = await super.init();
    // Retrieve child employees and customers
    if (doc) {
      await this.fetchEmployees();
      await this.fetchCustomers();
      return doc;
    }
    return false;
  }

  // Override
  async fetchEmployees() {
    const docs = (await this.dbRef.collection("employees").get()).docs;
    for (const doc of docs) {
      const employee = new Employee(
        this.dbRef.collection("employees").doc(doc.id)
      );
      await employee.init();
      this.employees.push(employee);
    }
  }

  async addEmployee(name: string, email: string) {
    const id = nameToID(name);
    const newEmployee = new Employee(
      this.dbRef.collection("employees").doc(id)
    );
    // Update database
    await newEmployee.create(name, email, id);
    await newEmployee.assignCompany(this.data);
    // Update local state
    this.employees.push(newEmployee);
  }

  async deleteEmployee(name: string) {
    // Delete from database
    const employee = this.employees.find(
      (employee) => employee.data.name == name
    );
    if (employee) await employee.delete();
    // Delete locally
    this.employees = this.employees.filter(
      (employee) => employee.data.name != name
    );
  }

  // Override
  async fetchCustomers() {
    const docs = (await this.dbRef.collection("customers").get()).docs;
    for (const doc of docs) {
      const customer = new Customer(
        this.dbRef.collection("customers").doc(doc.id)
      );
      await customer.init();
      this.customers.push(customer);
    }
  }

  async addCustomer(name: string, email: string) {
    const id = nameToID(name);
    const newCustomer = new Customer(
      this.dbRef.collection("customers").doc(id)
    );
    // Update database
    await newCustomer.create(name, email, id);
    await newCustomer.assignCompany(this.data);
    // Update local state
    console.log(newCustomer);
    this.customers.push(newCustomer);
  }

  async deleteCustomer(name: string) {
    // Delete from database
    const customer = this.customers.find(
      (customer) => customer.data.name == name
    );
    if (customer) await customer.delete();
    // Delete locally
    this.customers = this.customers.filter(
      (customer) => customer.data.name != name
    );
  }
}
