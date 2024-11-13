import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import vuetify from './plugins/vuetify';
import store from "./store";

import axios from "axios";
import NProgress from 'nprogress'

import { i18n } from 'vue-lang-router';


const config = require('./config/' + process.env.NODE_ENV)

Vue.config.productionTip = false

let baseUrl = `${config.root_node.url}:${config.root_node.port}`
axios.defaults.baseURL = baseUrl
axios.defaults.timeout = 10000

axios.defaults.validateStatus = function() { return true }
axios.defaults.withCredentials = true

//avant chaque requete post/get envoyé par axios
axios.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("access_token")
    //S'il y a un token dans le localStorage
    if (token) { //on le met dans le header de la requete (permet d'identifier le user)
      config.headers["x-auth-token"] = token;
    }
    NProgress.start() //start la barre de chargement sous le menu principal
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// before a response is returned stop nprogress
axios.interceptors.response.use(response => {
  NProgress.done() //arrête la barre de chargement
  return response
}, 
function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  NProgress.done() //arrête la barre de chargement
  console.dir("error axios", error.message)

  let txt = error.message
  if(error.message == "Network Error") 
    txt = "Il semble que le serveur est actuellement injoignable.<br>Désolé pour ce problème, merci de réessayer plus tard"

  store.dispatch('app/openSnackbar', 
                          { show: true, color:'red', 
                            title: "Une erreur est survenue.",
                            text: txt })

  return Promise.reject(error);
}
)


store.dispatch('auth/checkAuth', null, { root: true })
store.dispatch("admin/fetchEntityTypesAvailables")

new Vue({
  router,
  i18n,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')