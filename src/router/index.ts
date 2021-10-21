import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import CompanyTabs from "../views/company/Tabs.vue";
import EmployeeTabs from "../views/employee/Tabs.vue";

// GOAL: Mimic structure of database
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/authentication/Authentication.vue"),
  },
  {
    path: "/activation/:email",
    component: () => import("@/views/authentication/EmployeeActivation.vue"),
    props: true,
  },
  {
    path: "/company/",
    component: CompanyTabs,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        redirect: "/company/home",
      },
      // HOME
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/company/Home.vue"),
      },

      // CUSTOMERS
      {
        path: "customers",
        name: "Customers",
        props: { type: "customer" },
        component: () => import("@/views/company/Users.vue"),
      },
      {
        path: "customers/:userID",
        name: "Customer",
        props: (route) => ({
          type: "customer",
          userID: route.params.userID,
        }),
        component: () => import("@/views/company/Users.vue"),
      },
      {
        path: "customers/:userID/customer-day/:date",
        name: "Customer Day",
        props: true,
        component: () => import("@/views/general/CustomerDay.vue"),
      },
      {
        path: "customers/:userID/jobs/:jobID",
        name: "Job",
        props: true,
        component: () => import("@/views/general/Job.vue"),
      },

      // EMPLOYEES
      {
        name: "Employees",
        path: "employees",
        props: { type: "employee" },
        component: () => import("@/views/company/Users.vue"),
      },
      {
        path: "employees/:userID",
        name: "Employee",
        props: (route) => ({
          type: "employee",
          userID: route.params.userID,
        }),
        component: () => import("@/views/company/Users.vue"),
      },
      {
        path: "employees/:userID/days/:date",
        name: "Employee Day",
        props: true,
        component: () => import("@/views/general/EmployeeDay.vue"),
      },
      // VISITS
      {
        path: "visits/:visitID",
        name: "Company Visit",
        props: true,
        component: () => import("@/views/general/VisitView.vue"),
      },
      // NEW DAYS
      {
        path: "new-employee-day/:employeeID",
        name: "New Employee Day",
        props: true,
        component: () => import("@/views/general/NewEmployeeDay.vue"),
      },
      {
        path: "new-customer-day/:customerID",
        name: "New Customer Day",
        props: true,
        component: () => import("@/views/general/NewCustomerDay.vue"),
      },
      // NEW JOBS
      {
        path: "new-job/:customerID",
        name: "New Job",
        props: true,
        component: () => import("@/views/general/NewJob.vue"),
      },
      // SETTINGS
      {
        path: "settings",
        component: () => import("@/views/general/Settings.vue"),
      },
    ],
  },
  {
    path: "/employee/",
    component: EmployeeTabs,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        redirect: "/employee/today",
      },
      // TODAY
      {
        path: "today",
        component: () => import("@/views/employee/EmployeeDay.vue"),
      },
      // DAYS
      {
        path: "days",
        component: () => import("@/views/employee/Days.vue"),
      },
      {
        path: "days/:date",
        component: () => import("@/views/employee/EmployeeDay.vue"),
      },
      // PAY
      {
        path: "pay",
        component: () => import("@/views/employee/Pay.vue"),
      },
      {
        path: "pay/days/:date",
        component: () => import("@/views/employee/EmployeeDay.vue"),
      },
      // MESSAGES
      {
        path: "messages",
        component: () => import("@/views/employee/Messages.vue"),
      },
      // VISITS
      {
        path: "visits/:visitID",
        name: "Visit",
        props: true,
        component: () => import("@/views/general/VisitView.vue"),
      },

      // SETTINGS
      {
        path: "settings",
        component: () => import("@/views/general/Settings.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
