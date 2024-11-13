<template>
  <div v-if="report != null && report.offer != null" class="report-card">
    <v-card elevation="0" class="mb-0">
      <v-row class="mx-0 my-0">
        <v-col cols="12" class="px-0">
          <v-toolbar color="transparent" elevation="0" dense height="20">
            <v-btn small outlined rounded 
                  :color="report.status == 'OPEN' ? 'red' : 'blue'" 
                  class="mx-2" @click="openDialogReport()" 
                  title="afficher les signalements">
              <b class="pr-1">{{ report.reporters ? report.reporters.length : 0 }}</b> reports
            </v-btn>
            
            <b class="pl-2" :class="report.offer.status == 'OPEN' ? 'red--text' : 'blue--text'">
              <v-icon :color="report.offer.status == 'OPEN' ? 'red' : 'blue'" class="mb-1" small>mdi-shield-alert-outline</v-icon>
              {{ report.status }}  
            </b>
            <b class="pl-2" :class="report.offer.status == 'OPEN' ? 'green--text' : 'red--text'">
              <v-icon :color="report.offer.status == 'OPEN' ? 'green' : 'red'" class="mb-1" small>mdi-basket</v-icon>
              {{ report.offer.status }}
            </b>
            
            <v-spacer/>
            <v-btn small icon outlined class="mx-1" @click="openDialogActions(report)"
                  title="gérer ce signalement">
              <v-icon small>mdi-cog</v-icon>
            </v-btn>
          </v-toolbar>
        </v-col>
      </v-row>
      <OfferCard :offer="report.offer"></OfferCard>
    </v-card>

    <v-dialog v-model="showDialogActions" transition="dialog-top-transition"
              max-width="500" :fullscreen="$vuetify.breakpoint.width < 960"
              content-class="dialog-large-bordered">
      <v-card>
        <v-toolbar elevation="0" color="transparent">
          <v-icon small color="">mdi-chevron-down</v-icon> 
          <b>Gérer ce signalement</b>
          <v-spacer/>
          <v-btn x-small outlined fab class=""
                @click="showDialogActions = false">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-col cols="12" v-if="objDialogActions != null && offerCreatorDialog != null">

          <v-card outlined class="mb-5">
            <div class="d-flex pt-3 ml-3 mb-2" style="font-size:20px;" v-if="offerCreatorDialog.name">
              <v-gravatar height="28" style="border-radius:50%;" class="mr-2"
                            :default-img="'retro'" :email="offerCreatorDialog.name"/>

              <b><v-icon>mdi-</v-icon> {{ offerCreatorDialog.name }}</b>
            </div>

            <v-divider/>

            <v-card-title class="pt-0">{{ objDialogActions.offer.title }}</v-card-title>
            <v-card-subtitle class="pt-0 pb-1">{{ objDialogActions.offer.text.substr(0, 100) }}</v-card-subtitle>
          </v-card>
          <v-btn block outlined color="purple" class="my-2" @click="banUser"
                title="banir l'auteur de l'annonce">
            <v-icon>mdi-account-cancel</v-icon> Bannir l'auteur
          </v-btn>
          <v-btn block outlined color="red" class="my-2" @click="lockOffer"
                title="bloquer cette annonce">
            <v-icon>mdi-delete</v-icon> Bloquer l'annonce
          </v-btn>
          <br>
          <v-divider/>
          <br>
          <v-btn block outlined color="green" class="my-2" @click="cancelReport"
                title="conserver cette annonce et lever le signalement">
            <v-icon>mdi-cancel</v-icon> Lever le signalement
          </v-btn>
        </v-col>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>

import axios from "axios"
import OfferCard from '@/components/offer/OfferCardSM.vue'
import Gravatar from 'vue-gravatar'

// import { i18n } from 'vue-lang-router';
import core from '../../plugins/core.js'
const config = require('../../config/' + process.env.NODE_ENV)

export default {
  name: 'offer-card-sm',
  components: {
    OfferCard, 'v-gravatar' : Gravatar
  },
  props: [ 'report' ],
  data: () => ({
    offer: null,
    showDialogReports: false,
    showDialogActions: false,
    objDialogReport: null,
    objDialogActions: null,
    loadingCancel: false,
    loadingLock: false,
    loadingBan: false,
    offerCreatorDialog: null
  }),
  mounted: async function(){
    //this.offer = this.report.offer
  },
  methods: {
    cancelReport: function(){
      this.loadingCancel = true
      axios.post('/report/cancel', { reportId: this.report._id })
           .then((res) => {
              this.$root.$emit('loadReports')
              this.loadingCancel = false
              if(res.data.error == false){
                this.$store.dispatch('app/openSnackbar', 
                                    { show: true, color:'green', 
                                      title: "Le signalement a été annulé",
                                      text: "" })
              }else{
                this.showSnackError(res.data.errorMsg)
              }
           })
           .catch(() => {
              this.loadingCancel = false
              this.showSnackError('Erreur inconnue')
           })
    },
    lockOffer: function(){this.loadingCancel = true
      axios.post('/report/lock-offer', { reportId: this.report._id })
           .then((res) => {
              this.$root.$emit('loadReports')
              this.loadingLock = false
              if(res.data.error == false){
                this.$store.dispatch('app/openSnackbar', 
                                    { show: true, color:'green', 
                                      title: "L'annonce a été bloquée'",
                                      text: "" })
              }else{
                this.showSnackError(res.data.errorMsg)
              }
           })
           .catch(() => {
              this.loadingLock = false
              this.showSnackError('Erreur inconnue')
           })
    },
    banUser: async function(){
      
      this.loadingBan = true
      let resBan = await this.$store.dispatch("admin/banUser", { "userId": this.report.offer.creator })
      this.loadingBan = false
      console.log("resBan", resBan)
      this.$root.$emit('loadReports')
      if(!resBan.error){
        this.$store.dispatch('app/openDialogMailDev', resBan.emailParams)
        this.$store.dispatch('app/openSnackbar', 
                            { show: true, color:'green', 
                              title: "L'auteur de cette annonce a été bloqué",
                              text: "" })
      }else{
        this.showSnackError("Une erreur est survenue")
      }
    },
    showSnackError: function(msg){
      this.$store.dispatch('app/openSnackbar', 
                            { show: true, color:'red', 
                              title: "Une erreur est survenue",
                              text: msg })
    },
    openDialogActions: async function(report){
      this.offerCreatorDialog = null
      this.showDialogActions = true 
      this.objDialogActions = report
      let res = await axios.post('/admin/query-entities', {
                        entityType: "user",
                        query: { _id: report.offer.creator }
                    })

      if(res.data.error == false)
        this.offerCreatorDialog = res.data.entities[0]

    },
    nl2br: function(str, is_xhtml){
      var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'
      let newStr = (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
      let maxLength = 150
      let p = newStr.length > maxLength ? '...' : ''
      newStr = newStr.substr(0, maxLength) + p
      return newStr
    },
    monyToEuro(amount){ return amount * config.monyToEuro },
    baseUrl(){ return core.baseUrl() },
    openDialogReport() { 
      this.$root.$emit("openDialogReport", this.report)
    }
  },
  computed: {
  },
}
</script>
