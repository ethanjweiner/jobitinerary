import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import CompanyTabs from "../views/company/Tabs.vue";
import EmployeeTabs from "../views/employee/Tabs.vue";

// GOAL: Mimic structure of database
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/authentication/Authentication.vue"),
    // Add route guard to redirect based on authentication
  },
  {
    path: "/activation/:email", // Access companyID for sign up purposes
    component: () => import("@/views/authentication/EmployeeActivation.vue"),
    props: true,
    // Add route guard to redirect for invalid company icuds
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
      // Open recent job or create new job
      {
        path: "home/jobs/:jobID",
        component: () => import("@/views/general/Job.vue"),
      },

      // CUSTOMERS
      {
        path: "customers",
        component: () => import("@/views/company/Customers.vue"),
      },
      {
        path: "customers/:username",
        name: "Customer",
        props: true,
        component: () => import("@/views/company/Customers.vue"),
      },
      {
        path: "customers/:username/customer-day/:date",
        name: "Customer Day",
        props: true,
        component: () => import("@/views/general/CustomerDay.vue"),
      },
      {
        path: "customers/:username/jobs/:jobID",
        name: "Customer Job",
        props: true,
        component: () => import("@/views/general/Job.vue"),
      },

      // EMPLOYEES
      {
        path: "employees",
        component: () => import("@/views/company/Employees.vue"),
      },
      {
        path: "employees/:username",
        name: "Employee",
        props: true,
        component: () => import("@/views/company/Employees.vue"),
      },
      {
        path: "employees/:username/days/:date",
        name: "Employee Day",
        props: true,
        component: () => import("@/views/general/EmployeeDay.vue"),
      },
      // VISITS
      {
        path: "visits/:visitID",
        name: "Company Visit",
        props: true,
        component: () => import("@/views/general/Visit.vue"),
      },
      // NEW DAYS
      {
        path: "new-day/:employeeName",
        name: "New Day",
        props: true,
        component: () => import("@/views/general/NewDay.vue"),
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
        component: () => import("@/views/general/Visit.vue"),
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

// Problem: The router is trying to access the authentication state before it has been updated
// Solution: Somehow wait until the user's data is fetched, and THEN supply the route guards?
// POSSIBILITY: Define route guards INSIDE AUTH STATE CHANGED FUNCTION, but AFTER THE USER DATA IS FETCHED (so that the router guard can use this data...)

export default router;
