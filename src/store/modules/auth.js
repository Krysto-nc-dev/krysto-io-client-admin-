
import axios from "axios"
import router from "../../router/router"
import core from "../../plugins/core"

const config = require('../../config/' + process.env.NODE_ENV)

const state = () => ({
  userInit: {
    id: null,
    name: null,
    isAdmin: null,
    walletMain: { amount: 0, transactions: [] },
    coordinates: [46.95026224218562, 2.5913274703850764],
    access_token: null
  },
  user: {
    id: null,
    name: null,
    isAdmin: null,
    walletMain: { amount: 0, transactions: [] },
    coordinates: [46.95026224218562, 2.5913274703850764],
    access_token: null
  },

  login: {
    success: false,
    error: null,
    loading: false,
  },

  register: {
    success: false,
    error: null,
    loading: false,
  },

  isLogin: false,

  monyConvertValue: 0,

  walletFocusUid: null,
  walletFocus: null,

  conversations: []
})

// actions
const actions = {
  async checkAuth({ commit, state }) {
    try {
      if (state.isLogin) { return }

      const res = await axios.get("/auth/whoami")
      if (res.data.error) {
        console.log("Cannot check login state. Err:", res.data.msg)
        console.log("ROUTE", router.currentRoute.meta)
        commit('logout')
        return
      }
      commit('login', res.data)
    } catch (err) {
      commit('logout');
      console.log("Error checking login state. Err:", err)
      //router.push('/')
    } finally {
      //console.log("checkAuth finally")
    }
  },
    
  async refreshUserData({ commit, state }) {
    try {
      const res = await axios.get("/auth/whoami")
      if (res.data.error) {
        console.log("Cannot check login state. Err:", res.data.msg)
        console.log("ROUTE", router.currentRoute.meta)
        commit('logout')
        return
      }
      commit('login', res.data)
      commit('setFocusWalletUid', state.walletFocusUid)

    } catch (err) {
      commit('logout');
      console.log("Error checking login state. Err:", err)
      //router.push('/')
    } finally {
      //console.log("checkAuth finally")
    }
  },
    
  async login({ commit }, credentials) {
    try {
      commit('fetchLoginLoading', true)
      const { data } = await axios.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (data.error === true) {
        commit("fetchLoginError", data.errorMsg)
        return
      }
      await commit('login', data);

      if(data.user.isAdmin) 
        router.push('/admin')
      else
        router.push('/wallet')
    } 
    catch (err) {
      console.log("User cannot be authenticated. Error:", err)
      commit("fetchLoginError", {
        name: 'NetworkError',
        message: 'Cannot log to server',
        i18nKey: 'instances.unreachableNode'
      })
      commit('logout');
    } finally {
      commit('fetchLoginLoading', false);
    }
  },

  async register({ commit }, credentials) {
    try {
      commit('fetchRegisterLoading', true);
      const { data } = await axios.post('/auth/register', {
        email: credentials.email,
        password: credentials.password
      });

      if (data.error === true) {
        commit("fetchRegisterError", data.msg)
        return
      }
      commit("fetchRegisterError", null)
      commit('fetchRegisterSuccess')
    } catch (err) {
      console.log('ERROR: User cannot be registered. Error:', err)
    } finally {
      commit('fetchRegisterLoading', false)
    }
  },
  
  async logout({ commit }) {
    try {
      commit('logout')
      router.replace('/login');
    } catch (err) {
      console.error('CANNOT LOGOUT O-O')
    }
  },
  
  async setFocusWalletUid({ commit }, walletUid) {
    commit('setFocusWalletUid', walletUid)
  },

  async readConv({ commit }, convId){
    axios.get('/private/read-conversation/' + convId)
         .then((res)=>{
           console.log('/private/read-conversation/' + convId, 'OK', res)
           commit('readConv', res.data.conversation)
          })
  },

  async setReadConv({ commit }, conv){
    commit('readConv', conv)
  },

  async updateReadConv({ commit }, convId){
    commit('updateReadConv', convId)
  },

  async newMsgInConv({ commit }, data){
    commit('newMsgInConv', data)
  } 
  
}


// mutations
const mutations = {
  login(state, context) {
    state.user = context.user
    
    state.isLogin = true
    state.monyConvertValue = context.monyConvertValue

    if(context.token != null)
      localStorage.setItem("access_token", context.token)

    state.walletFocus = context.user.walletMain

    //calcul la liste de contact
    
    state.conversations = context.conversations
    console.log("state.user", state.user)
  },
  logout(state, data) {
    localStorage.removeItem("access_token")

    state.user = state.userInit
    state.isLogin = false

    if(data && data.loginErrorMsg != null)
      state.loginErrorMsg = data.loginErrorMsg

    this.dispatch('admin/clear')
  },


  fetchRegisterLoading(state, isLoading) {
    state.register.loading = isLoading;
  },
  fetchRegisterError(state, err) {
    state.register.error = err;
    state.register.success = false;
  },
  fetchRegisterSuccess(state) {
    state.register.error = null;
    state.register.success = true;
  },
  fetchLoginLoading(state, isLoading) {
    state.login.loading = isLoading;
  },
  fetchLoginError(state, err) {
    console.log("fetchLoginError", err)
    state.login.error = err;
    state.login.success = false;
    state.isLogin = false;
  },
  fetchLoginSuccess(state) {
    state.login.error = null;
    state.login.success = true;
    state.isLogin = true;
  },

  setFocusWalletUid(state, walletUid){
    state.walletFocusUid = walletUid

    if(state.walletFocusUid == state.user.walletMain.uid) 
      state.walletFocus = state.user.walletMain

    state.user.walletsDeposit.forEach((walletD) => {
      if(state.walletFocusUid == walletD.uid) 
        state.walletFocus = walletD
    })
  },
  readConv(state, newConv) {
    let convs = state.conversations
    let convFound = false
    state.conversations = []
    //console.log("readConv", convs, newConv)
    convs.forEach((conv, c)=>{
      //console.log("readConv", conv._id, newConv._id)
      if(conv._id == newConv._id){
        convs[c] = newConv
        convFound = true
        //console.log("readConv changed", newConv)
      }
    })
    state.conversations = convs
    if(!convFound) this.dispatch('auth/refreshUserData')
  },
  newMsgInConv(state, data){
    let convId = data.convId
    let convFound = false
    console.log("newMsgInConv", data)
    state.conversations.forEach((conv, c)=>{
      if(conv._id == convId){
        conv.dateLastRead.forEach((item, i)=>{
          if(item.userId == state.user._id){
            //state.conversations[c].dateLastRead[i].date = new Date()
            state.conversations[c].messages.push(data)
            convFound = true
            console.log("newMsgInConv new date", state.conversations[c].dateLastRead[i].date)
          }
        })
      }
    })
    //si la conversation nexiste pas encore dans le store (premier message d'une nouvelle conversation))
    //recharge les données user ( == recharge toutes les conversations)
    if(!convFound) this.dispatch('auth/refreshUserData')
  },
  updateReadConv(state, convId){
    let convs = state.conversations
    state.conversations = []
    //console.log("readConv", convs, newConv)
    convs.forEach((conv, c)=>{
      //console.log("readConv", conv._id, newConv._id)
      if(conv._id == convId){
        conv.dateLastRead.forEach((item, i)=>{
          if(item.userId == state.user._id){
            //state.conversations[c].dateLastRead[i].date = new Date()
            convs[c].dateLastRead[i].date = new Date()
          }
        })
      }
    })
    state.conversations = convs
  }
}


// getters
const getters = {
  isAdmin: (state) => { return state.user != null && state.user.isAdmin == true },
  amountHistory: (state) => { 
    if(state.walletFocus == null) return 0 

    let hist = [{ amount: 0, date: new Date(state.user.created) }]
    let stackAmount = 0
    let t = state.walletFocus.transactions
    let transs = JSON.parse(JSON.stringify(t)).reverse()
    transs.forEach((trans, i) => {
      if(i < 60){
        console.log("trans", state.walletFocus.type, trans)
        //si le wallet qui reçoit est mon compte : ajoute le montant
        if(state.walletFocus.type == "MAIN"){
          if(trans.toWallet == null || trans.toWallet.id == state.walletFocus._id)
              stackAmount += core.convertUnityMony(trans.amountUnity, state.monyConvertValue)
          else stackAmount -= core.convertUnityMony(trans.amountUnity, state.monyConvertValue) //sinon : soustrait le montant
        }else{
          if(trans.toWallet == null || trans.toWallet.id == state.walletFocus._id)
              stackAmount += trans.amountMony
          else stackAmount -= trans.amountMony
        }
        //enregistre l'historique
        hist.push({ amount: stackAmount,
                    date: new Date(trans.created) })
      }
    })
    return hist
  },
  amountTotalCurrent: (state) => { 
    let total = core.convertUnityMony(state.user.walletMain.amountUnity, state.monyConvertValue)
    state.user.walletsDeposit.forEach((wallet) => {
      total += wallet.amountMony
    })
    return total
  },
  amountCurrent: (state) => { 
    if(state.walletFocus == null) return 0 

    if(state.walletFocus.type == "MAIN"){
      let stackAmount = 0
      let transs = JSON.parse(JSON.stringify(state.walletFocus.transactions))
      transs.forEach((trans) => {
        //si le wallet qui reçoit est mon compte : ajoute le montant
        if(trans.toWallet == null || trans.toWallet.id == state.walletFocus._id)
            stackAmount += trans.amountUnity
        else stackAmount -= trans.amountUnity //sinon : soustrait le montant
      })
      return core.convertUnityMony(stackAmount, state.monyConvertValue)
    }
    else if(state.walletFocus.type == "DEPOSIT"){
      return state.walletFocus.amountMony
    }
  },
  amountCurrentEUR: (state) => { 
    if(state.walletFocus == null) return 0 
    
    let stackAmount = 0
    let transs = JSON.parse(JSON.stringify(state.walletFocus.transactions))
    transs.forEach((trans) => {
      //si le wallet qui reçoit est mon compte : ajoute le montant
      if(trans.toWallet == null || trans.toWallet.id == state.walletFocus._id)
           stackAmount += trans.amountUnity
      else stackAmount -= trans.amountUnity //sinon : soustrait le montant
    })
    return stackAmount * config.monyToEuro
  },
  totalDepositMony: (state) => { 
    if(state.user.walletsDeposit == null) return
    let total = 0
    state.user.walletsDeposit.forEach((wallet) => {
      total += wallet.amountUnity
    })
    return total + state.user.walletMain.amountUnity
  },
  myPropositionsReceived: (state) => {
    let listAll = state.user.offers.filter(offer => offer.propositions.length > 0)
      let listOffers = []
      listAll.forEach((offer) => {
        if(offer.status != "CLOSED" && offer.status != "PAID") {
          if(offer.propositions[offer.propositions.length-1].negos[offer.propositions[offer.propositions.length-1].negos.length-1].status != "REFUSED") 
            listOffers.push(offer)
        }
      })
      return listOffers
  },
  myPropositionsSent: (state) => {
    let listAll = state.user.propositionsSent.filter(proposition => proposition.offer.status != "PAID")
    return listAll
  },
  privateMsgNotRead : function(state){
    let nbMsgNotRead = 0
    state.conversations.forEach((conv) => {
      //console.log("#privateMsgNotRead conv.dateLastRead", conv.dateLastRead)
      let myLastDate = null
      conv.dateLastRead.forEach((date) => {
        //console.log("#privateMsgNotRead date", date.userId, state.user._id)
        if(date.userId == state.user._id) myLastDate = date.date
      })
      //console.log("#privateMsgNotRead myLastDate", myLastDate)
      if(myLastDate != null){
        conv.messages.forEach((msg) => {
          //console.log("#privateMsgNotRead msg", msg.created, '>', myLastDate.date)
          if(msg.created > myLastDate) nbMsgNotRead++
        })
      }
    })
    //console.log("#privateMsgNotRead nbMsgNotRead", nbMsgNotRead)
    return nbMsgNotRead
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}