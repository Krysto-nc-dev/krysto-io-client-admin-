<template>
<div>
  <v-btn v-if="canSendProposal && hasSentProposal && $store.state.auth.user.isActive" 
          @click="showDialogProposal = true"
          elevation="0" color="teal" class="" dark>
          <v-icon x-small color="" class="pr-1">mdi-plus-circle</v-icon>  Nouvelle proposition
  </v-btn>
  <v-btn v-if="!canSendProposal && !$store.state.auth.isLogin" to="/register"
          elevation="0" color="orange" outlined class="" dark>
          <v-icon x-small color="" class="pr-1">mdi-plus-circle</v-icon>  Créer mon compte
  </v-btn>
  <v-alert v-if="canSendProposal && !$store.state.auth.user.isActive"
           color="orange" outlined dense class="mt-4" dark
           title="Votre compte sera validé dans les 24h qui suivent votre inscription">
          <v-icon color="orange" class="pr-1">mdi-lock</v-icon>  En attente de validation
  </v-alert>
  
  <!-- DIALOG PROPOSITION -->
  <v-dialog v-model="showDialogProposal" transition="dialog-top-transition"
            max-width="500" :fullscreen="$vuetify.breakpoint.width < 600"
            v-if="offer != null" style="z-index:2000"
            content-class="dialog-large-bordered">
      <v-card elevation="0" style="border-radius:0;">

        <v-toolbar color="" elevation="1" dense>
          <v-icon small color="green" class="pr-1">mdi-basket</v-icon> 
          <b class="green--text">Faire une offre</b>
          <v-spacer></v-spacer>
          <v-btn x-small fab outlined elevation="0" @click="showDialogProposal = false">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-col cols="12">
          <v-card-title>
            <small>Le prix de cette annonce est de</small> 
            <span class="teal--text">{{ offer.amountMony }} {{ config.monyUnity }}</span>
          </v-card-title>

          <v-divider class="mt-2"></v-divider>

          <v-card-title class="pb-0">
            <v-icon small color="" class="pr-1">mdi-chevron-down</v-icon> Faire une offre
          </v-card-title>

          <v-card-text color="teal">
            Vous pouvez proposer au vendeur un montant inférieur ou suppérieur au prix annoncé.
            Le vendeur pourra accepter ou refuser votre proposition, en fonction des autres offres qu'il recevra.
          </v-card-text>

          <v-text-field v-model.number="amountProposal"
                        color="green" class="mb-4"
                        @keydown="keydownAmount" type="number"
                        hide-details outlined :suffix="config.monyUnity" rounded>
          </v-text-field>

          <v-textarea v-model="message" color="green" 
                      outlined label="Laisser un message...">
          </v-textarea>

          <v-btn block color="green" elevation="0" dark @click="sendProposition()">
            <v-icon small color="" class="pr-1">mdi-handshake</v-icon>
            Envoyer ma proposition
          </v-btn>
        </v-col>
      </v-card>
  </v-dialog>
</div>
</template>


<script>

import axios from "axios"

const config = require('../../config/' + process.env.NODE_ENV)

export default {
  name: 'home',
  props: ['offer', 'inDialog'],
  components: {
    
  },
  data: () => ({
    showDialogProposal: false,
    amountProposal: 0,
    message: ""
  }),
  mounted: async function(){
    this.amountProposal = this.offer.amountMony
  },
  methods: {
    async sendProposition(){
      let params = { offerId: this.offer._id,
                     amount: this.amountProposal,
                     msgTxt: this.message
                   }
      let { data } = await axios.post('/market/send-proposition', params)
      if(data.error === true){
        this.$store.dispatch('app/openSnackbar', 
                                { show: true, color:'red', 
                                  title: "Une erreur est survenue.",
                                  text: data.msg })
      }else{
        this.showDialogProposal = false
        this.$store.dispatch('auth/refreshUserData')
        this.$store.dispatch('app/openSnackbar', 
                                { show: true, color:'green', 
                                  title: "Proposition envoyée.",
                                  text: "Votre proposition a bien été envoyée au vendeur." })

      }
    },

    keydownAmount(event){
      if(event.key.length > 1 || this.amountProposal == null) return

      //transforme le "0" en chaine vide, sauf si on rajoute un point
      if(this.amountProposal == "0" && event.key != ".") this.amountProposal = ""
      
      //si le montant tapé fait déjà 4 caractère 
      if(this.amountProposal.length >= 4 &&  this.amountProposal.indexOf(".") == -1) 
        event.preventDefault()

      //si le nombre de chiffre apres la virgule est déjà de 4
      if(this.amountProposal.length >= 4 
      && this.amountProposal.indexOf(".") > 0
      && this.amountProposal.length >= parseFloat(this.amountProposal).toFixed(4).length) 
        event.preventDefault()

      let ascii = event.key.charCodeAt(0)
      if((ascii < 48 || ascii > 57) //si ce n'est pas un nombre
      && (event.key != "." || this.amountProposal.indexOf(".") > -1) //et que ce n'est pas un point, ni un 2eme point
      ) {
          event.preventDefault() //annule la frappe au clavier
      }
    },
  },
  computed: {
    canSendProposal(){
      if(!this.$store.state.auth.isLogin) return false

      let canSend = true
      let props = this.$store.state.auth.user.propositionsSent
      props.forEach((prop) => {
        if(prop.offer == this.offer._id){
          if(props.nego[props.nego.length - 1].status != "REFUSED") canSend = false
        }
      })
      return canSend && (this.$store.state.auth.user._id != this.offer.creator._id)
    },
    hasSentProposal(){
      let sent = false
      let props = this.$store.state.auth.user.propositionsSent
      props.forEach((prop) => {
        if(prop.offer._id == this.offer._id) sent = true
      })
      return sent
    },
    errorAmount(){
      let amountMax = this.offer.amountMony * 1.5
      let errorAmount = 'Proposition max autorisée : ' + amountMax
      console.log("errorAmount", this.amountProposal, '>', amountMax, (this.amountProposal > amountMax))
      if(this.amountProposal > amountMax) return errorAmount
      else return false
    },
    config(){ return config }
  },
  watch: {
  }, 
}
</script>
