
import axios from "axios"
//import { i18n } from 'vue-lang-router';

const state = () => ({
  
  offers: [],

  requestParams: {
    offerType: "OFFER",
    search: "",
    amountMin: 0,
    amountMax: 50,
    radius: 500000,
    coordinates: [46.1591126, -1.1520434],
    categoryId: null,
    fetchLimit: 10
  },


  langAvailables : [],
});

const actions = {
  async setRequestParams({ commit }, params) {
    commit("setRequestParams", params)
  },
  async clearResults({ commit }) {
    commit("clearResults")
  },
  async fetchOffers({ commit, state }, params) {
    if(params == null) params = state.requestParams

    commit("setRequestParams", params)
    console.log("fetchOffers", params)

    const { data } = await axios.post('/market/search', params)
    if(!data.error){
      commit("setOffers", data.offers)
    }else{
      console.log("error fetching offers", data)
    }
  },

};

const mutations = {
  setRequestParams(state, params) {
    state.requestParams = params;
  },
  clearResults(state) {
    state.offers = [];
  },
  setOffers(state, offers) {
    state.offers = offers;
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
