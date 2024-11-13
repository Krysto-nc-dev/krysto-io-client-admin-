import Vue from "vue";
import Vuex from "vuex";

import app from "./modules/app";
import auth from "./modules/auth";
import admin from "./modules/admin";
import market from "./modules/market";
import captcha from "./modules/captcha";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    auth,
    admin,
    market,
    captcha
  },
});
