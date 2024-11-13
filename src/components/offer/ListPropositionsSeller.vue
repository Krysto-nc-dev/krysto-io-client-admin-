<template>
<div>
  <v-row>
    <v-list three-line class="pb-0 px-5" color="transparent">
      <template v-for="(offer, o) in offerList">
        <template v-for="(proposition) in offer.propositions">
          <template v-if="proposition.negos[proposition.negos.length-1].status != 'REFUSED'">
            <v-list-item :key="proposition._id" class="pt-2" >

              <v-list-item-avatar>
                <v-img :src="baseUrl() + offer.gallery[0]" class="py-1"/>
              </v-list-item-avatar>

              <v-list-item-content>
                
                <div class="py-2 pl-1">
                  <b><i><v-icon x-small class="mb-1">mdi-circle</v-icon> {{ offer.title }}</i></b>
                </div>

                <div>
                  <v-gravatar height="20" class="mr-1" style="border-radius:50%;margin-bottom:-4px;"
                            :default-img="'retro'" :email="proposition.userCaller.name"/>
                  Proposition de <b>{{ proposition.userCaller.name }}</b> :
                  <b class="teal--text font-main">
                    {{ proposition.negos[proposition.negos.length-1].amount }} 
                    {{ config.monyUnity }}
                  </b>
                </div>

                <small class="pl-5 ml-2">Reçue
                  <time-ago :datetime="proposition.negos[proposition.negos.length-1].created" :refresh="60" long 
                            :locale="$vuetify.lang.current">
                  </time-ago>
                </small>

                <v-list-item-subtitle class="mt-1 mb-2">
                  <b>
                  <v-chip v-if="proposition.negos[proposition.negos.length-1].status == 'OPEN'" 
                          color="orange" dark class="">
                    <v-icon small color="" class="mr-1">mdi-bell</v-icon>
                    Vous n'avez pas encore répondu
                  </v-chip>
                  <v-chip v-if="proposition.negos[proposition.negos.length-1].status == 'ACCEPTED'" 
                          color="green" dark>
                    <v-icon small color="" class="mr-1">mdi-thumb-up</v-icon>
                    Vous avez accepté cette proposition
                  </v-chip>
                  <v-chip v-if="proposition.negos[proposition.negos.length-1].status == 'REFUSED'" 
                          color="red" outlined dark>
                    <v-icon small color="" class="mr-1">mdi-close</v-icon>
                    Vous avez refusé cette proposition
                  </v-chip>
                  </b>
                </v-list-item-subtitle>
                

                <v-list-item-subtitle>
                  <v-btn  small color="blue lighten-1" class="mt-2 mr-2" outlined :to="'/private/'+proposition.userCaller._id">
                    <v-icon small color="" class="pr-1">mdi-comment-account-outline</v-icon>
                    Contacter l'acheteur
                  </v-btn>
                  <v-btn small elevation="0" color="teal" class="mt-2" dark
                        v-if="proposition.negos[proposition.negos.length-1].status == 'OPEN'" 
                        @click="displayPopupAnswer(offer, proposition)">
                        <v-icon small color="" class="mr-1">mdi-reply mdi-rotate-180</v-icon> Répondre
                  </v-btn>
                </v-list-item-subtitle>

              </v-list-item-content>

            </v-list-item>
            <v-divider class="mt-3 mb-0" v-if="offerList.length > 1" :key="o+'-'+proposition._id"/>
          </template>
        </template>
      </template>
    </v-list>
  </v-row>

  <v-dialog v-model="showPopupAnswer" 
            v-if="currentProposition!=null" 
            content-class="dialog-large-bordered"
            :fullscreen="$vuetify.breakpoint.width < 600"
            max-width="700">
    <v-card>
      <v-card-title class="">
        <v-icon small class="mr-1">mdi-handshake</v-icon> 
        <small>Négociation</small><br>
        <!-- <small>Pour votre annonce : <i>{{ currentOffer.title }}</i></small> -->
      </v-card-title>

      <v-btn x-small outlined fab  style="float:right;margin:10px;" @click="showPopupAnswer=false">
        <v-icon small>mdi-close</v-icon>
      </v-btn>

      <v-divider class="mb-0"/>

        <p class="pt-1 px-5 ma-0">
          <v-icon x-small class="mr-1">mdi-circle</v-icon> 
          <b><i>{{ currentOffer.title }}</i></b>
        </p>
        <p class="pb-1 pl-5 ma-0">
          Au prix initial de : 
          <b><i class="teal--text">{{ currentOffer.amountMony }} Oto</i></b>
        </p>


      <v-divider class="mb-3"/>
      
      <template v-if="currentProposition.negos.length > 1">
        <small class="ml-5">
          <v-icon small class="mb-1 ml-1">mdi-clock</v-icon> 
          <v-icon x-small class="mb-1 ml-1">mdi-chevron-down</v-icon> 
          <b>Historique de la négociation</b>
        </small>
        <div class="mt-3">
          <v-card-subtitle class="pt-0"
              v-for="(nego, n) in currentProposition.negos" 
              v-if="n < currentProposition.negos.length - 1"  
              :key="nego._id">
            <b>
              <v-icon x-small class="">mdi-chevron-right</v-icon> 
              {{ currentProposition.userCaller.name }}
            </b> 
            vous a proposé
            <b class="teal--text">{{ nego.amount }} Oto</b>   
            <v-chip color="red" outlined small class="ml-2" dark>Vous avez refusé</v-chip>
            <br>
            <i class="px-3" v-if="nego.msgTxt">"{{ nego.msgTxt }}"</i>
            <v-divider class="mt-2"/>
          </v-card-subtitle>
        </div>

      </template>

      <v-card-title class="pl-4">
        <v-gravatar height="30" class="mr-2" style="border-radius:50%;margin-bottom:-5px;"
                        :default-img="'retro'" :email="currentProposition.userCaller.name"/>
        <b>{{ currentProposition.userCaller.name }}</b> 
        vous propose <template v-if="currentProposition.negos.length > 1">maintenant</template> :
        <b class="d-inline-block teal--text ml-2">
          {{ currentProposition.negos[currentProposition.negos.length-1].amount }} Oto
        </b>
        
      </v-card-title>

      <v-divider/>

      <template v-if="currentProposition.negos[currentProposition.negos.length-1].msgTxt">
        <v-card-title class="pb-0 px-5">
          <v-icon >mdi-comment-text-outline</v-icon>
          Son message :
        </v-card-title>

        <p class="px-5" v-html="nl2br(currentProposition.negos[currentProposition.negos.length-1].msgTxt)"></p>

        <v-divider/>
      </template>

      <v-card-text class="text-center mt-5 pb-0 px-2">
        
        <b>Acceptez-vous cette proposition ?</b>
        <v-textarea class="mt-4" outlined v-model="answerText"
                    label="Joindre un message..."></v-textarea>
      </v-card-text>


      <v-card-actions class="pa-3 pt-1 px-2 pb-2">
        <v-btn color="red" dark style="width:32%;margin:0 1% 0 0" @click="sendAnswer('REFUSED')" >
          <v-icon small>mdi-close</v-icon> Refuser
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="teal" dark style="width:32%;margin:0" @click="showPopupAnswer=false" >
          <v-icon small>mdi-clock</v-icon> Attendre
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="green" style="width:32%;margin:0 0 0 1%" dark @click="sendAnswer('ACCEPTED')">
          <v-icon small>mdi-check</v-icon> Accepter
        </v-btn>
      </v-card-actions>

      <v-col>
        <small class="red--text">
          Refuser : Tant que l'annonce est ouverte, {{ currentProposition.userCaller.name }} pourra vous faire d'autres propositions
        </small><br>
        <small class="teal--text">
          Attendre : Envoyer une réponse plus tard
        </small><br>
        <small class="green--text">
          Accepter : Attribuer l'annonce à {{ currentProposition.userCaller.name }} - aucune autre proposition ne pourra être faite
        </small>
      </v-col>
      
    </v-card>
  </v-dialog>
</div>
</template>


<script>

import axios from 'axios'
import core from '../../plugins/core.js'
import Gravatar from 'vue-gravatar'
import {TimeAgo} from "vue2-timeago"

const config = require('../../config/' + process.env.NODE_ENV)

export default {
  name: 'home',
  components: {
     'v-gravatar' : Gravatar, TimeAgo
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
        //ferme la popup
        this.showPopupAnswer = false
        //actualise les données du user
        this.$store.dispatch('auth/refreshUserData')

        let txt = (answerType == "REFUSED") 
                ? 'Proposition refusée'
                : 'Vous pouvez maintenant transmettre vos coordonnées à votre acheteur'
        //affiche la notif dans la snackbar
        this.$store.dispatch('app/openSnackbar', 
                          { show: true, color:'green', 
                            title: "Votre réponse a bien été envoyée",
                            text: txt })

      }else{
        console.log("error sending answer")
        //affiche la notif dans la snackbar
        this.$store.dispatch('app/openSnackbar', 
                          { show: true, color:'red', 
                            title: "Une erreur est survenue pendant l'envoi de votre réponse",
                            text: 'Désolé pour ce problème, merci de réessayer plus tard' })
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
    offerList(){
      return this.$store.getters['auth/myPropositionsReceived']
    },
    config(){ return config }
  },
  watch: {
      
  }, 
}
</script>