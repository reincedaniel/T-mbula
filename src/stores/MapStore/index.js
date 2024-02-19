import { defineStore } from "pinia";
import state from "./states";
import getters from "./getters";
import actions from "./actions";

export default defineStore("map", {
  state,
  getters,
  actions,
});
