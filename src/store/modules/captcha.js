
//import axios from "axios"
import axios from "axios"
import crypto from "crypto"

const config = require('../../config/' + process.env.NODE_ENV)

const state = () => ({
  
  showDialog: false,
  nbSuccess: 0,
  nbEchec: 0,
  locked: false,

  session: null
});

const actions = {
  setShowDialog({ commit }, open) {
    commit("setShowDialog", open);
  },
  setNbSuccess({ commit }, nb) {
    commit("setNbSuccess", nb);
  },
  setNbEchec({ commit }, nb) {
    commit("setNbEchec", nb);
  },
  setLocked({ commit }, lock) {
    commit("setLocked", lock);
  },

  async initSession({ commit }){
    console.log("CAPTCHA initSession")
    const { data } = await axios.get('/data/new-captcha-session')

    if (data.error === false) {
      commit("setSession", data.session)
      return data.session
    }
  },

  
};

const mutations = {
  setShowDialog(state, open) {
    state.showDialog = open;
  },
  setNbSuccess(state, nb) {
    state.nbSuccess = nb;
  },
  setNbEchec(state, nb) {
    console.log("setNbEchec", nb)
    state.nbEchec = nb;
  },
  setLocked(state, lock) {
    state.locked = lock;
  },
  setSession(state, session) {
    //console.log("save session", session)
    // On définit notre algorithme de cryptage
    var algorithm = config.captcha.algorithm
    // // Notre clé de chiffrement, elle est souvent générée aléatoirement mais elle doit être la même pour le décryptage
    var cryptokey = config.captcha.cryptokey
    // Defining iv
    const iv = Buffer.alloc(16, 0);

    
    var decipher = crypto.createDecipheriv(algorithm, cryptokey, iv)
    var dec = decipher.update(session,'hex','utf8')
    dec += decipher.final('utf8')
    //console.log("dec", dec)

    let sessionDescryptedJson = JSON.parse(dec)
    //console.log("sessionDescryptedJson", sessionDescryptedJson)
    state.session = sessionDescryptedJson
  },
};

const getters = {
  
}

export default {
  namespaced: true,
  getters,
  state,
  actions,
  mutations
};
