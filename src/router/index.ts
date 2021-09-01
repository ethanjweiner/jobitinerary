import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import CompanyTabs from "../views/company/Tabs.vue";
import EmployeeTabs from "../views/employee/Tabs.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/authentication/Authentication.vue"),
    // Add route guard to redirect based on authentication
  },
  {
    path: "/activation/:email", // Access company_id for sign up purposes
    component: () => import("@/views/authentication/EmployeeActivation.vue"),
    props: true,
    // Add route guard to redirect for invalid company ids
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
        component: () => import("@/views/company/Home.vue"),
      },
      // Open recent visit or create new visit
      {
        path: "home/visits/:visit_id", // Link to go to the job too
        component: () => import("@/views/general/VisitView.vue"),
      },
      // Open recent job or create new job
      {
        path: "home/jobs/:job_id",
        component: () => import("@/views/general/Job.vue"),
      },
      {
        path: "home/jobs/:job_id/visits/:visit_id",
        component: () => import("@/views/general/VisitView.vue"),
      },
      // Plan a new day for an employee (select date afterward)
      {
        path: "home/days/new",
        component: () => import("@/views/employee/EmployeeDay.vue"),
      },

      // CUSTOMERS
      {
        path: "customers",
        component: () => import("@/views/company/Customers.vue"),
      },
      {
        path: "customers/:customer_id",
        component: () => import("@/views/company/Customers.vue"),
      },
      {
        path: "customers/:customer_id/customer-day/:date",
        component: () => import("@/views/general/CustomerDay.vue"),
      },
      {
        path: "customers/:customer_id/jobs/:job_id",
        component: () => import("@/views/general/Job.vue"),
      },

      // EMPLOYEES
      {
        path: "employees",
        component: () => import("@/views/company/Employees.vue"),
      },
      {
        path: "employees/:employee_id",
        component: () => import("@/views/general/Employee.vue"),
      },
      {
        path: "employees/:employee_id/days/:date",
        component: () => import("@/views/employee/EmployeeDay.vue"),
      },
      {
        path: "employees/:employee_id/days/:date/visits/:visit_id",
        component: () => import("@/views/general/VisitView.vue"),
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
      {
        path: "today/visits/:visit_id",
        component: () => import("@/views/general/VisitView.vue"),
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
      {
        path: "days/:date/visits/:visit_id",
        component: () => import("@/views/general/VisitView.vue"),
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
