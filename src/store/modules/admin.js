import axios from 'axios'
import router from "../../router/router";

const state = () => ({
  entities: [],
  loadingEntities: false,
  savingEntities: false,
  savingMsg: false,

  entityTypesAvailables: [],
  
  currentEntityType: '',
  currentForm: null,
  currentEntity: null,
  currentTranslations: null,
  currentExitAfterSave: null,

  currentFormErrors: [],

  deleteError: false,
  
  uploaderAttrImg: null,
  uploaderAttrImgUrl: null,

  imgFields: [],
  
  blockchain: {
    transactions: [],
    countFrom: 0,
    countTo: 0
  },


  dbstats: {},

});

const actions = {
  async saveEntity({ commit }, params) {
    commit('setSavingEntities', { val: true, msg: 'Enregistrement des données' })
    let res = await axios.post('/admin/save-entity', params)
    if(res.data.error === true){
      console.log("error /admin/save-entity", params.entityType, res.data)
      commit('setCurrentFormErrors', res.data.validateErrors.details)
      commit('setSavingEntities', { val: false, msg: '' })
    }else{
      console.log("success /admin/save-entity", params.entityType)
      commit('setCurrentFormErrors', [])
      return res.data.entityId
    }
  },
  async deleteEntity({ commit }, params) {
    let res = await axios.post('/admin/delete-entity', params)
    console.log("error /admin/delete-entity", params.entityType, res.data)
    commit('setDeleteErrors', res.data.error) 
    return !res.data.error
  },
  async banUser({ commit }, params) {
    let res = await axios.post('/admin/ban-user', params)
    console.log("res /admin/ban-user", params.userId)
    commit('setDeleteErrors', res.data.error) 
    return res.data
  },
  async fetchEntities({ commit }, params) {
    if(params.entityType == null) return
    
    commit('setLoadingEntities', true)

    let res = await axios.post('/admin/get-entities/'+localStorage.getItem('VueAppLanguage')+'/'+params.entityType+'/'+params.limit, params)
    
    if(res.data.error){
      console.log("error /admin/get-entities/"+params.entityType+'/'+params.limit)
    }else{
      console.log("success /admin/get-entities/"+params.entityType+'/'+params.limit)
      commit('setEntities', res.data.entities)
      commit('setCurrentEntityType', params.entityType)

      let res2 = await axios.get('/admin/get-form-json/'+localStorage.getItem('VueAppLanguage')+'/'+params.entityType, params)
      commit('setCurrentForm', res2.data.formJson)

      commit('setLoadingEntities', false)
    }
  },
  async fetchForm({ commit }, params) {
    let id = params.entityId != null ? '/'+params.entityId : ''
    let res = await axios.get('/admin/get-form-json/'+localStorage.getItem('VueAppLanguage')+'/'+params.entityType + id, params)

    if(res.data.error){
      console.log("error /admin/get-form-json/"+params.entityType)
    }else{
      console.log("success /admin/get-form-json/"+params.entityType, res.data)
      await commit('setCurrentForm', res.data.formJson)

      if(res.data.entity != null)
           await commit('setCurrentEntity', res.data.entity)
      else await commit('setCurrentEntity', null)

      if(res.data.translations != null)
           await commit('setCurrentTranslations', res.data.translations)
      else await commit('setCurrentTranslations', null)
    }
    commit('setCurrentFormErrors', [])
    commit('setSavingEntities', { val: false, msg: '' })
  },
  async fetchEntityTypesAvailables({ commit }, params) {
    let res = await axios.get('/admin/entity-types-availables/', params)
    if(res.data.error){
      console.log("error /admin/entity-types-availables/")
    }else{
      console.log("success /admin/entity-types-availables/")
      commit('setEntityTypeAvailables', res.data.entityTypesAvailables)
    }
  },

  async addImgField({ commit }, attrName){
    commit('addImgField', attrName)
  } ,
  async imgUploaded({ commit }, attrName){
    commit('setImgUploaded', attrName)
  } ,
  async setSavingEntities({ commit }, data){
    commit('setSavingEntities', data)
  } ,
  async setCurrentExitAfterSave({ commit }, exit){
    commit('setCurrentExitAfterSave', exit)
  } ,
  
  async fetchTransactions({ commit }){
    let url = '/blockchain/get-last-transactions/'
    let res = await axios.get(url)

    console.log(res.data.error ? "error" : "success" , url)
    if(!res.data.error){
      commit('setBlockchainTransactions', res.data)
    }
  },

  async fetchDbstats({ commit }) {
    const { data } = await axios.get('/admin/get-db-stats')
    commit('setDbstats', data.stats)
  },
  clear({ commit }) {
    commit("clear")
  },
};

const mutations = {
  setEntities(state, entities) {
    state.entities = entities
  },
  setCurrentEntityType(state, entityType) {
    state.currentEntityType = entityType
  },
  setEntityTypeAvailables(state, entityTypesAvailables) {
    state.entityTypesAvailables = entityTypesAvailables
  },
  setCurrentForm(state, currentForm) {
    state.currentForm = currentForm
  },
  setCurrentEntity(state, currentEntity) {
    state.currentEntity = currentEntity
  },
  setLoadingEntities(state, loadingEntities) {
    state.loadingEntities = loadingEntities;
  },
  setCurrentFormErrors(state, currentFormErrors) {
    state.currentFormErrors = currentFormErrors

    //clear all error in all attributs of the form
    state.currentForm.forEach((att, a)=>{
      state.currentForm[a].error = null
    })

    state.currentFormErrors.forEach((error)=>{
      state.currentForm.forEach((att, a)=>{
        if(error.path[0] == att.name)
        state.currentForm[a].error = error.message
      })
    })
  },
  setDeleteErrors(state, error) {
    state.deleteError = error;
  },

  setSavingEntities(state, data) {
    state.savingEntities = data.val
    state.savingMsg = data.msg
  },

  addImgField(state, attrName) {
    if(state.imgFields.indexOf(attrName) == -1)
      state.imgFields.push(attrName)
  },
  setImgUploaded(state, data) { console.log("state.imgFields", state.imgFields, data.attrName)
    state.imgFields.splice(state.imgFields.indexOf(data.attrName), 1)
    if(state.imgFields == 0) {
      state.savingEntities = false
      if(state.currentExitAfterSave)
        router.push('/admin/'+data.entityType)
      //else
      //this.$root.$emit('fetchForm')
    }
  },
  setCurrentTranslations(state, translations){
    state.currentTranslations = translations
  },
  setCurrentExitAfterSave(state, exit){
    state.currentExitAfterSave = exit
  },
  setDbstats(state, stats){
    state.dbstats = stats
  },

  setBlockchainTransactions(state, data){
    state.blockchain.transactions = data.transactions
    state.blockchain.countFrom = data.countFrom
    state.blockchain.countTo = data.countTo
  },
  clear(state) {
    state.entities = []
    state.entityTypesAvailables = []
  },
};

const getters = {
  savingEntityDone : function(state){
    if(!state.savingEntities) return false 
    if(state.savingEntities && state.imgFields.length > 0) return "loading"
    if(state.savingEntities && state.imgFields.length == 0) return true
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}