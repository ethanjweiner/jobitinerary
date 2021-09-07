import { readonly } from "vue";
import * as Types from "./types";

interface GlobalState {
  user: Types.User | null;
  errorMessage: string | null;
}

const state: GlobalState = {
  user: null,
  errorMessage: null,
};

export const globalState = readonly(state);

export function setUser(user: Types.User | null) {
  state.user = user;
}
