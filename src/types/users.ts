import { loadUser } from '@/authentication';
import { generateUUID, nameToID, sendActivationEmail } from '@/helpers';
import { auth, companiesCollection } from '@/main';
import { DocData, DocRef, ImageWithCaption, Location } from '@/types/auxiliary';

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
  id: '',
  email: '',
  name: '',
  phone: '',
};

const emptyEmployeeData: EmployeeData = {
  id: '',
  email: '',
  name: '',
  phone: '',
  defaultHourlyRate: null,
};

const emptyCustomerData: CustomerData = {
  id: '',
  email: '',
  name: '',
  phone: '',
  location: {
    address: '',
    coordinates: null,
  },
  customerNotes: '',
  propertyNotes: '',
  propertyImages: [],
};

interface UserInterface {
  data: UserData;
  dbRef: DocRef;
  // init: Attempt to retrieve the document associated with the employee. If unable to find, return false.
  init: () => Promise<DocData | false>;
  update: (data: UserData) => Promise<ThisParameterType<UserInterface>>;
  save: () => Promise<ThisParameterType<UserInterface>>;
  create: (
    name: string,
    email: string,
    id: string,
    phone?: string
  ) => Promise<ThisParameterType<UserInterface>>;
  signUp: (password: string) => void;
  addCustomer: (name: string, email: string) => Promise<void>;

  employees: Array<Employee>;
  customers: Array<Customer>;
}

export class User implements UserInterface {
  dbRef: DocRef;
  data: UserData;
  employees: Array<Employee>;
  customers: Array<Customer>;

  constructor(dbRef: DocRef) {
    this.dbRef = dbRef;
    // Temporary empty values
    this.data = { ...emptyUserData };
    this.employees = [];
    this.customers = [];
  }

  async init() {
    const user = (await this.dbRef.get()).data();

    if (user) {
      this.data = user.data;
      return user;
    }
    return false;
  }

  async create(name: string, email: string, id: string, phone?: string) {
    this.data.name = name;
    this.data.email = email;
    this.data.id = id;
    this.data.phone = phone ? phone : '';

    await this.save();

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addCustomer(name: string, email: string) {
    return;
  }

  async save() {
    await this.dbRef.set({
      data: this.data,
    });
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
  parentCompany: UserData;
  activationToken: string | null;
  activated: boolean;

  constructor(dbRef: DocRef, company: MetaData) {
    super(dbRef);
    this.parentCompany = company;
    this.activationToken = null;
    this.activated = false;
  }

  async create(name: string, email: string, id: string, phone?: string) {
    this.data.name = name;
    this.data.email = email;
    this.data.id = id;
    this.data.phone = phone ? phone : '';
    this.activationToken = generateUUID();
    this.activated = false;

    await this.save();

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (this instanceof Employee) {
      await sendActivationEmail(
        email,
        this.parentCompany.id + '_' + this.activationToken
      );
    }

    return this;
  }

  async addCustomer(name: string, email: string) {
    const companyDoc = companiesCollection.doc(this.parentCompany.id);

    const id = nameToID(name);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const newCustomer = new Customer(
      companyDoc.collection('customers').doc(id),
      this.data
    );
    // Update database
    await newCustomer.create(name, email, id);
    // Update local state
    this.customers.push(newCustomer);
  }

  async fetchEmployees() {
    const companyDoc = companiesCollection.doc(this.parentCompany.id);
    const docs = (await companyDoc.collection('employees').get()).docs;
    for (const doc of docs) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const employee = new Employee(
        companyDoc.collection('employees').doc(doc.id),
        this.parentCompany
      );
      await employee.init();
      this.employees.push(employee);
    }
  }

  async fetchCustomers() {
    const companyDoc = companiesCollection.doc(this.parentCompany.id);
    const docs = (await companyDoc.collection('customers').get()).docs;
    for (const doc of docs) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const customer = new Customer(
        companyDoc.collection('customers').doc(doc.id),
        this.parentCompany
      );
      await customer.init();
      this.customers.push(customer);
    }
  }

  async save() {
    await this.dbRef.set({
      data: this.data,
      parentCompany: this.parentCompany,
      activationToken: this.activationToken,
      activated: this.activated,
    });
  }

  async init() {
    const user = await super.init();
    if (user) {
      this.parentCompany = user.parentCompany;
      this.activationToken = user.activationToken;
      this.activated = user.activated;
      return user;
    }
    return false;
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

export class Customer extends ChildUser {
  data: CustomerData;
  constructor(dbRef: DocRef, company: MetaData) {
    super(dbRef, company);
    this.data = { ...emptyCustomerData };
  }
}

export class Employee extends ChildUser {
  data: EmployeeData;

  constructor(dbRef: DocRef, company: MetaData) {
    super(dbRef, company);
    this.data = { ...emptyEmployeeData };
  }
  getVisitsRef() {
    if (this.parentCompany)
      return companiesCollection
        .doc(this.parentCompany.id)
        .collection('visits');
    throw Error(
      'Visits can not be found, since the user does not have a parent company'
    );
  }
}

export class Company extends User {
  constructor(id: string) {
    super(companiesCollection.doc(id));
  }

  // Override
  async fetchEmployees() {
    const docs = (await this.dbRef.collection('employees').get()).docs;
    for (const doc of docs) {
      const employee = new Employee(
        this.dbRef.collection('employees').doc(doc.id),
        this.data
      );
      await employee.init();
      this.employees.push(employee);
    }
  }

  async addEmployee(name: string, email: string) {
    const id = nameToID(name);
    const newEmployee = new Employee(
      this.dbRef.collection('employees').doc(id),
      this.data
    );
    // Update database
    await newEmployee.create(name, email, id);
    // Update local state
    this.employees.push(newEmployee);
  }

  async deleteEmployee(id: string) {
    // Delete from database
    const employee = this.employees.find((employee) => employee.data.id == id);
    if (employee) await employee.delete();
    // Delete locally
    this.employees = this.employees.filter(
      (employee) => employee.data.id != id
    );
  }

  // Override
  async fetchCustomers() {
    const docs = (await this.dbRef.collection('customers').get()).docs;
    for (const doc of docs) {
      const customer = new Customer(
        this.dbRef.collection('customers').doc(doc.id),
        this.data
      );
      await customer.init();
      this.customers.push(customer);
    }
  }

  async addCustomer(name: string, email: string) {
    const id = nameToID(name);
    const newCustomer = new Customer(
      this.dbRef.collection('customers').doc(id),
      this.data
    );
    // Update database
    await newCustomer.create(name, email, id);
    // Update local state
    this.customers.push(newCustomer);
  }

  async deleteCustomer(id: string) {
    // Delete from database
    const customer = this.customers.find((customer) => customer.data.id == id);
    if (customer) await customer.delete();
    // Delete locally
    this.customers = this.customers.filter(
      (customer) => customer.data.id != id
    );
  }
}
