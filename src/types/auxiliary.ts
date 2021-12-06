import firebase from "firebase/app";

import { generateUUID } from "@/helpers";

// Auxiliary
export interface SectionType {
  name: string;
  icon: any;
  id: string;
}

export type SectionsType = Array<SectionType>;

export interface Location {
  address: string;
  coordinates: { lat: number; lng: number } | null;
}

export const sampleLocation: Location = {
  address: "210 Old Mill",
  coordinates: {
    lat: 1.35,
    lng: 2.45,
  },
};

export interface ImageWithCaption {
  id: string;
  ref: string;
  caption: string;
}

export const newImage = (): ImageWithCaption => {
  return {
    id: generateUUID(),
    ref: "",
    caption: "",
  };
};

export const sampleImage: ImageWithCaption = {
  id: Date.now().toString(),
  ref: "",
  caption: "Image caption",
};

export interface Task {
  header: string;
  notes: string;
  image: ImageWithCaption | null;
  complete: boolean;
  id: number;
}

export const sampleTask1: Task = {
  header: "Task 1",
  notes: "Notes for task 1, specific to employees",
  image: sampleImage,
  complete: false,
  id: 1234689071,
};

export const sampleTask2: Task = {
  header: "Task 2",
  notes: "Notes for task 2, specific to employees",
  image: sampleImage,
  complete: true,
  id: 1235689071,
};

export interface Tool {
  name: string;
  returned: boolean;
  id: number;
}

export const sampleTool1: Tool = {
  name: "Tool 1",
  returned: false,
  id: 230598735,
};

export const sampleTool2: Tool = {
  name: "Tool 2",
  returned: true,
  id: 230598765,
};

export interface TimeLog {
  start: string;
  end: string;
  hours: number;
}

export const sampleTimeLog: TimeLog = {
  start: "08:00",
  end: "16:00",
  hours: 8,
};

export interface Alert {
  message: string;
  color: "success" | "danger" | "dark";
}

export enum AuthenticationTitleText {
  LogIn = "Log in to JobItinerary",
  CompanySignUp = "Sign up your company for JobItinerary",
  EmployeeSignUp = "Join your company in JobItinerary",
}

// A Loader loads _data_ at a particular _searchFilter_
export type Loader = (searchFilter?: string) => Promise<0 | 1>;

// A Splitter splits a larger list into smaller lists, based on a filter
type Filter = (item: any) => boolean;

export type Splitter = { name: string; filter: Filter };

// Database References

export type DocRef = firebase.firestore.DocumentReference;
export type CollectionRef = firebase.firestore.CollectionReference;
export type DocSnapshot = firebase.firestore.DocumentSnapshot;
export type DocData = firebase.firestore.DocumentData;
export type Query = firebase.firestore.Query;
export type QuerySnapshot = firebase.firestore.QuerySnapshot;

/* BACKLOG

// Messages

export interface Message {
  text: string;
  image: ImageWithCaption | null;
  readByRecipient: boolean;
  timestamp: number;
  threadID: string;
  to?: User;
  from?: User;
}

export function emptyMessage(): Message {
  return {
    text: "",
    image: emptyImage(Date.now()),
    readByRecipient: false,
    timestamp: Date.now(),
    threadID: "",
  };
}


const sampleMessage1: Message = {
  text: "Message 1",
  image: sampleImage,
  readByRecipient: true,
  timestamp: 1000,
  threadID: "thread_id",
  to: sampleEmployee1,
  from: sampleCompany,
};

const sampleMessage2: Message = {
  text: "Message 2",
  image: sampleImage,
  readByRecipient: false,
  timestamp: 2000,
  threadID: "thread_id",
  to: sampleCompany,
  from: sampleEmployee1,
};

export interface Thread {
  id: number;
  timestamp: number;
  messages: Array<Message>; // Must be sorted by timestamp (newest first)
  sender: User;
  receiver: User;
}

export const sampleThread: Thread = {
  id: Date.now(),
  timestamp: 1000,
  messages: [sampleMessage1, sampleMessage2],
  sender: sampleCompany,
  receiver: sampleEmployee1,
};

*/
