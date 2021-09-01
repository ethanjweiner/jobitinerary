export interface UserData {
  readonly email: string;
  name: string;
  phone: string;
}

export interface Company extends UserData {
  kind: "company";
}

export interface Employee extends UserData {
  kind: "employee";
  activationToken: string;
}

export interface SectionType {
  name: string;
  icon: any;
  id: string;
}

export type User = Company | Employee | null;

export enum AuthenticationTitleText {
  LogIn = "Log in to JobItinerary",
  CompanySignUp = "Sign up your company for JobItinerary",
  EmployeeSignUp = "Join your company in JobItinerary",
}
