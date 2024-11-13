<template>
<v-row class="">
  <v-list three-line class="pb-0 px-5 mb-5" color="transparent">
    <template v-for="(proposition, px) in propositionList">
      <v-list-item :key="px" v-if="proposition.offer != null" class="mt-2">

        <v-list-item-avatar>
          <v-img :src="baseUrl() + proposition.offer.gallery[0]" class="py-1"/>
        </v-list-item-avatar>

        <v-list-item-content>
          
          <div>
            <b><i><v-icon x-small class="mb-1">mdi-circle</v-icon> {{ proposition.offer.title }}</i></b>
          </div>

          <v-list-item-title>
            Vous avez proposé
            <b class="ml-1 teal--text">
              {{ proposition.negos[proposition.negos.length-1].amount }} 
              {{ config.monyUnity }}
            </b>
          </v-list-item-title>

          <v-list-item-subtitle>
            <b>
              <v-chip v-if="proposition.negos[proposition.negos.length-1].status == 'OPEN'"
                      dark color="orange" class="mt-1">
                En attente de réponse
              </v-chip>
              <v-chip v-if="proposition.negos[proposition.negos.length-1].status == 'ACCEPTED'"
                      dark color="green" class="mt-1">
                Votre proposition a été acceptée
              </v-chip>
              <v-chip v-if="proposition.negos[proposition.negos.length-1].status == 'REFUSED'"
                      dark color="red" class="mt-1">
                Votre proposition a été refusée
              </v-chip>
              <br>                
            </b>
          </v-list-item-subtitle>


          <v-btn  small  color="blue lighten-1" class="mr-2 mt-2" 
                  outlined :to="'/private/'+proposition.offer.creator._id">
            <v-icon small color="" class="pr-1">mdi-comment-account-outline</v-icon>
            Contacter le vendeur
          </v-btn>
          <v-btn  small  color="teal lighten-1" class="mr-2 mt-2" 
                  v-if="proposition.negos[proposition.negos.length-1].status == 'ACCEPTED'"
                  dark elevation="0" :to="'/payment/'+proposition.offer._id">
            <v-icon small color="" class="pr-1">mdi-credit-card-outline</v-icon>
            Effectuer le paiement
          </v-btn>

          <v-card class="pa-3 mt-2 " outlined elevation="0"
                   v-if="proposition.negos[proposition.negos.length-1].msgTxt || proposition.negos[proposition.negos.length-1].answerTxt">
            <div class="d-inline-block mb-2" v-if="proposition.negos[proposition.negos.length-1].msgTxt">
              <v-gravatar height="20" class="mr-1" style="border-radius:50%;margin-bottom:-4px;"
                            :default-img="'retro'" :email="$store.state.auth.user.name"/>
              <b>Votre message</b>
              <br>
              <div class="px-5 py-0 pt-1 ml-1" v-html="nl2br(proposition.negos[proposition.negos.length-1].msgTxt)"></div>
            </div>
            <div class="d-inline-block mb-2" v-if="proposition.negos[proposition.negos.length-1].answerTxt">
              <v-gravatar height="20" class="mr-1" style="border-radius:50%;margin-bottom:-4px;"
                            :default-img="'retro'" :email="proposition.offer.creator.name"/>
              <b>Réponse de {{ proposition.offer.creator.name }}</b>
              <br>
              <div class="px-5 py-0 pt-1 ml-1" v-html="nl2br(proposition.negos[proposition.negos.length-1].answerTxt)"></div>
            </div>
          </v-card>

          <div class="mt-2">
          <DialogProposition v-if="proposition.negos[proposition.negos.length-1].status == 'REFUSED'" 
                              :offer="proposition.offer" :inDialog="false">
          </DialogProposition>
          </div>

        </v-list-item-content>


      </v-list-item>

      <v-divider class="mt-3" :key="'0'+px"/>

    </template>
  </v-list>

</v-row>
</template>


<script>

import axios from 'axios'
import core from '../../plugins/core.js'
import Gravatar from 'vue-gravatar'

import DialogProposition from '@/components/offer/DialogProposition.vue'

const config = require('../../config/' + process.env.NODE_ENV)

export default {
  name: 'home',
  components: {
     'v-gravatar' : Gravatar, DialogProposition
  },
  data: () => ({
    showPopupAnswer: false,
    currentProposition: null,
    currentOffer: null,

    answerText: ""
  }),
  mounted: async function(){
    

  },
  methods: {
    async sendAnswer(answerType){
      let params = {  type: answerType, 
                      text: this.answerText,
                      propositionId: this.currentProposition._id 
                   }

      let res = await axios.post("/market/send-answer", params)
      if(res.data.error == false){
        this.showPopupAnswer = false
        this.$store.dispatch('auth/refreshUserData')
      }else{
        console.log("error sending answer")
      }
      this.answerText = ""
    },
    async displayPopupAnswer(offer, proposition){
      this.currentProposition = proposition
      this.currentOffer = offer
      this.showPopupAnswer = true
    },
    baseUrl(){ return core.baseUrl() },
    nl2br: function(str, is_xhtml){
      var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'
      let newStr = (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
      //let maxLength = 150
      // let p = newStr.length > maxLength ? '...' : ''
      // newStr = newStr.substr(0, maxLength) + p
      return newStr
    },
  },
  computed: {
    propositionList(){
      return this.$store.getters['auth/myPropositionsSent']
      // let listAll = this.$store.state.auth.user.propositionsSent
      // console.log("listAll", listAll)
      // return listAll
    },
    config(){ return config }
  },
  watch: {
      
  }, 
}
</script>