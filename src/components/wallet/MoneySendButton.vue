<template>
<div>
  <v-btn block outlined class="" 
         color="secondary"
         @click="showPopup = true"
         :disabled="!$store.state.auth.user.isActive || !$store.state.auth.user.planPaid">
         Envoyer
  </v-btn>

  <v-dialog v-model="showPopup" transition="dialog-bottom-transition" :overflowed="true"
            max-width="600" :fullscreen="$vuetify.breakpoint.width < 600"
            content-class="dialog-large-bordered">
    <v-card id="dialog-send-mony">
      <v-col cols="12" class="px-5">
        <div style="width:100%;font-size:20px;" class="text-center mt-3">
          Envoyer de la monnaie<br>
          <small v-if="$store.state.auth.walletFocus.type=='MAIN'">depuis votre compte courant</small>
          <small v-if="$store.state.auth.walletFocus.type=='DEPOSIT'">depuis votre compte de dépot</small>
        </div>

        <v-divider class="my-4"></v-divider> 
        
        <v-list v-if="toWalletExistState!= true" rounded two-line>

          <v-list-item rounded class="my-2" @click="selectWallet('DEPOSIT')" v-if="$store.state.auth.walletFocus.type=='MAIN'"
                        :disabled="$store.state.auth.user.walletsDeposit.length == 0">
            <v-list-item-avatar><v-icon class="mr-2">mdi-wallet</v-icon></v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Vers votre compte de dépot</v-list-item-title>
              <v-list-item-subtitle>Transférez votre monnaie vers votre compte de dépots</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item rounded class="my-2" @click="selectWallet('MAIN')" v-if="$store.state.auth.walletFocus.type=='DEPOSIT'"
                        :disabled="$store.state.auth.user.walletsDeposit.length == 0">
            <v-list-item-avatar><v-icon class="mr-2">mdi-wallet</v-icon></v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Vers votre compte courant</v-list-item-title>
              <v-list-item-subtitle>Transférez votre monnaie vers votre compte courant</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item rounded class="my-2" @click="openPopupContact" 
                        :disabled="false">
            <v-list-item-avatar><v-icon class="mr-2">mdi-badge-account-horizontal-outline</v-icon></v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Vers un contact</v-list-item-title>
              <v-list-item-subtitle>Transférez votre monnaie vers le compte de l'un de vos contacts</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item rounded class="my-2"
                        :disabled="false">
            <v-list-item-avatar><v-icon class="mr-2">mdi-plus-circle</v-icon></v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Vers un nouveau compte</v-list-item-title>
              <v-list-item-subtitle>
                <v-icon small>mdi-chevron-down</v-icon> 
                Transférez votre monnaie vers un nouveau compte tiers
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

        </v-list>

        <v-list v-if="toWalletExistState!= true && typeWallet == 'deposit'" rounded two-line class="mb-2 px-5">
          <template v-for="(wallet, w) in $store.state.auth.user.walletsDeposit">
            <v-list-item rounded class="my-2" @click="typeWallet='deposit'" :key="w">
              <v-list-item-avatar><v-icon class="mr-2">mdi-wallet</v-icon></v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ wallet.name != "DEPOSIT" ? wallet.name : 'Compte de dépot' }} - {{ wallet.uid }}
                </v-list-item-title>
                <!-- <v-list-item-subtitle>Transférez votre monnaie vers l'un de vos compte de dépots</v-list-item-subtitle> -->
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>       



        <v-text-field :color="toWalletExist != false ? 'green' : 'secondary'" 
                      outlined rounded class="text-center toWalletUID"
                      :rules="[() => toWalletUID == null || toWalletUID.length <= 6 || 'Max 6 caractères']"
                      label="Indiquez le n° du compte à créditer" 
                      :loading="searchingWallet" clearable
                      placeholder="ABCD12" 
                      v-model="toWalletUID"
                      @keyup="checktoWalletUID"
                      @focusout="checktoWalletUID"
                      :hide-details="toWalletExist != false">
        </v-text-field>
        
        <v-alert outlined v-if="toWalletExistState != false" dense type="success" class="mt-3">
          <v-gravatar height="40" class="mt-1" style="border-radius:50%; float:right;"
                      :default-img="'retro'" :email="toWalletExist.owner.name"/>

          <b>Ce compte existe :</b> {{ toWalletExist.uid }}
          <br>
          <b>Propriétaire :</b> {{ toWalletExist.owner.name }}
          <!-- <v-divider class="mt-2 pt-2"></v-divider>
          <b>Type :</b> {{ toWalletExist.type == "MAIN" ? "Compte courant" : "Compte de dépot" }} -->
        </v-alert>
        <v-alert outlined v-if="lastUidSearch == toWalletUID && toWalletExistState == false && toWalletUID != null && toWalletUID.length == 6" dense type="error">
          {{ toWalletUID.toUpperCase() }} Ce compte n'existe pas
        </v-alert>
        <!-- <v-alert outlined v-if="toWalletExistState == 'MAIN' && toWalletUID != null && toWalletUID.length == 6" dense type="error">
          {{ toWalletUID.toUpperCase() }} Ceci est votre compte courant.<br>Vous ne pouvez pas vous envoyer de l'argent à vous même !<br>
          Indiquez le numéro de compte appartenant à la personne à qui vous souhaitez envoyer votre monnaie.
        </v-alert> -->
       
        
        <template v-if="toWalletExistState == true">
          <!-- <v-divider class="my-4"></v-divider> -->
          
          <div class="pb-4 text-center secondary--text">
            Vous disposez <span class="d-none d-sm-inline">actuellement</span> de <b>{{ $store.getters['auth/amountCurrent'].toFixed(4) }} oto</b>
          </div>

          <v-text-field outlined rounded :value="amoutToSend" 
                        class="toWalletUID mb-2" color="secondary"
                        :rules="[() => (parseFloat(amoutToSend) <= parseFloat($store.getters['auth/amountCurrent']) || amoutToSend == '' || amoutToSend == null) || 'vous ne pouvez pas envoyer plus de ' + $store.getters['auth/amountCurrent'].toFixed(4) + ' oto' ]"
                        placeholder=""  suffix="oto"
                        :label="'Montant à envoyer à ' + toWalletExist.owner.name"
                        @keydown="keydownAmount" clearable
                        v-model="amoutToSend">
          </v-text-field>

          <v-row class="mb-4 mx-0">
            <template v-for="i in [1,2,3,4,5,6,7,8,9]">
              <v-col cols="4" :key="i" class="pa-1" @click="addNumToAmount(i)">
                <v-btn block outlined color="secondary" class="btn-keyboard">{{ i }}</v-btn>
              </v-col>
            </template>

            <v-col cols="4" class="pa-1" @click="addNumToAmount(0)">
              <v-btn block outlined color="secondary" class="btn-keyboard">0</v-btn>
            </v-col>
            <v-col cols="4" class="pa-1">
              <v-btn block outlined color="grey" @click="addNumToAmount('.')" class="btn-keyboard">.</v-btn>
            </v-col>
            <v-col cols="4" class="pa-1">
              <v-btn block outlined color="grey" @click="removeNumToAmount()" class="btn-keyboard">
                <v-icon>mdi-backspace-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          
          <v-text-field outlined v-model="libelle" dense hide-details class="mb-3"
                        placeholder="Description courte de la transaction" 
                        label="Libellé (facultatif)">
          </v-text-field>

          <v-btn color="green" block elevation="0" dark @click="sendMoney"
                :disabled="parseFloat(amoutToSend) > parseFloat($store.getters['auth/amountCurrent']) || amoutToSend == '' || amoutToSend == null">
            Envoyer
          </v-btn>
        </template>

        <v-divider class="mt-4 mb-2"></v-divider>

        <v-card-actions class="">
          <v-spacer></v-spacer>
          <v-btn color="" outlined @click="cancelSending" >
            <v-icon small>mdi-cancel</v-icon> Annuler
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-card>
  </v-dialog>


  <v-dialog v-model="showPopupContact" transition="dialog-top-transition"
            max-width="600" :fullscreen="$vuetify.breakpoint.width < 600"
            content-class="dialog-large-bordered">
    <v-card id="dialog-send-mony">
      <v-col cols="12" class="px-5">
        <div style="width:100%;font-size:20px;" class="text-center mt-4">
          Sélectionnez parmis vos contacts
        </div>

        <v-divider class="my-4"></v-divider> 

        <v-list v-if="$store.state.auth.user.walletsContact.length > 0" rounded two-line>
          <template v-for="(contact, k) in $store.state.auth.user.walletsContact">
            <v-list-item rounded class="" @click="selectContact(contact)" :key="k">
              <v-list-item-avatar><v-icon class="mr-2">mdi-wallet</v-icon></v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title><b>{{ contact.ownerName }}</b><small class="ml-2">{{ contact.uid }}</small></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
        <template v-else>
          <b>Vous n'avez aucun contact pour l'instant.</b>
          <br><br>
          Lorsque vous envoyez ou recevez de la monnaie, le compte tiers avec lequel vous effectuez la transaction 
          est automatiquement ajouté à votre liste de contacts.
        </template>

        <v-divider class="my-4"></v-divider> 

        <v-card-actions class="pa-3">
          <v-spacer></v-spacer>
          <v-btn color="" outlined @click="cancelSelectContact" >
            <v-icon small>mdi-cancel</v-icon> Annuler
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-card>
  </v-dialog>
</div>
</template>

<style>
  .toWalletUID input{
    font-size: 31px;
    text-align: center;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  #dialog-send-mony .v-list-item__subtitle{
    white-space: initial !important;
  }
  .btn-keyboard{
    height:36px !important;
    font-size: 23px !important;
  }
  
</style>

<script>

import axios from 'axios'
import Gravatar from 'vue-gravatar'
//import router from '../router/router'

export default {
  name: 'auth',
  components: { 'v-gravatar' : Gravatar, },
  data: () => ({
    showPopup: false,
    toWalletUID: "",
    searchingWallet: false,
    lastUidSearch: "",
    toWalletExist: false,

    amoutToSend: "",
    oldAmount: "",
    libelle: "",
    
    showPopupContact: false,
    typeWallet: ""
  }),
  async mounted(){
  },
  methods: {

    keydownAmount(event){
      if(event.key.length > 1 || this.amoutToSend == null) return

      let ascii = event.key.charCodeAt(0)
      if((ascii < 48 || ascii > 57) //si ce n'est pas un nombre
      && (event.key != "." || this.amoutToSend.indexOf(".") > -1) //et que ce n'est pas un point, ni un 2eme point
      || this.amoutToSend.length >= parseFloat(this.amoutToSend).toFixed(4).length
      || this.amoutToSend.length >= 6) { //ou que le nombre de chiffre apres la virgule est de max 4
          event.preventDefault() //annule la frappe au clavier
      }
    },

    async checktoWalletUID(){

      if(this.toWalletUID == null || this.toWalletUID.length != 6) {
        this.searchingWallet = false
        this.toWalletExist = false
        return
      } 

      this.searchingWallet = true

      let res = await axios.get("/oto/wallet-exists/" + this.toWalletUID.toUpperCase())
      if(res.data.error == false){
        this.toWalletExist = res.data.wallet
      }else{
        this.toWalletExist = false
      }
      this.searchingWallet = false
      this.lastUidSearch = this.toWalletUID

      console.log("uid account", this.toWalletUID)
    },

    cancelSending(){
      this.typeWallet = ""
      this.amoutToSend = ""
      this.toWalletUID = ""
      this.toWalletExist = false
      this.showPopup = false
    },

    async sendMoney(){
      let params = {
        amount: parseFloat(this.amoutToSend),
        fromWalletUid: this.$store.state.auth.walletFocus.uid,
        fromWalletType: this.$store.state.auth.walletFocus.type,
        toWalletUid: this.toWalletExist.uid,
        toWalletType: this.toWalletExist.type,
        libelle: this.libelle
      }
      let res = await axios.post("/oto/send-mony", params)
      if(res.data.error == false){
        this.refreshWalletData()
        this.cancelSending()
      }else{
        this.toWalletExist = false
      }
    },

    async refreshWalletData(){
      await this.$store.dispatch('auth/refreshUserData')
      this.$root.$emit('rerenderChartWallet')
    },

    openPopupContact(){
      this.showPopup = false 
      this.showPopupContact = true
    },

    selectContact(contact){
      this.toWalletUID = contact.uid
      this.checktoWalletUID()
      this.showPopupContact = false 
      this.showPopup = true
    },

    addNumToAmount(num){
      if(num == "." && this.amoutToSend.indexOf(num) >= 0) return
      this.amoutToSend = this.amoutToSend + "" + num
    },
    removeNumToAmount(){
      this.amoutToSend = this.amoutToSend.substr(0, this.amoutToSend.length-1)
    },
    cancelSelectContact(){
      this.showPopupContact = false 
      this.showPopup = true
    },

    selectWallet(walletType){
      console.log("selectWallet", walletType)
      if(walletType == "MAIN") this.toWalletUID = this.$store.state.auth.user.walletMain.uid
      if(walletType == "DEPOSIT") this.toWalletUID = this.$store.state.auth.user.walletsDeposit[0].uid
      this.checktoWalletUID()

    }

  },
  computed: {
    toWalletExistState(){ 
      if(!this.toWalletExist) return false
      return this.toWalletExist.uid != this.$store.state.auth.walletFocus.uid
    },
    fromMyWallet(){ return this.transaction.fromWallet.id == this.$store.state.auth.user.walletMain._id }
  },

}
</script>
