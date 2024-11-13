<template>
<div>
  <v-toolbar elevation="0" :height="isDaily || transaction.libelle == '' ? 30 : 60" v-if="!isDaily || showDaily"
             outlined class="item-transaction-wallet">

        <small style="" class="pr-3 d-sm-none"><small>{{ dateTransactionShort }}</small></small>
        <small style="" class="pr-3 d-none d-sm-inline-block"><small>{{ dateTransaction }}</small></small>
      <div>

        <div class="d-inline-block">
          <small v-if="fromMyWallet">
            <v-icon x-small color="rgba(113,113,113,0.7)">mdi-chevron-right</v-icon> 
            Envoyé à 
            <b>{{ transaction.toWallet.ownerName }}</b>
            - <small class="mr-2">{{ transaction.toWallet.uid }}</small>
          </small>
          <small v-else-if="!isDaily">
            <v-icon x-small color="rgba(113,113,113,0.7)">mdi-chevron-right</v-icon> 
            Envoyé par 
            <b>{{ transaction.fromWallet.ownerName }}</b>
            - <small class="mr-2">{{ transaction.fromWallet.uid }}</small>
          </small>
            
          <small class="d-md-none" v-if="!isDaily && transaction.libelle != ''">
            <br><i class="ml-3 mr-2">"{{ transaction.libelle.substr(0, 30) }}{{ transaction.libelle.length > 30 ? '...' : '' }}"</i>
          </small>
          <small class="d-none d-md-inline d-lg-none" v-if="!isDaily && transaction.libelle != ''">
            <br><i class="ml-3 mr-2">"{{ transaction.libelle.substr(0, 50) }}{{ transaction.libelle.length > 50 ? '...' : '' }}"</i>
          </small>
          <small class="d-none d-lg-inline" v-if="!isDaily && transaction.libelle != ''">
            <br><i class="ml-3 mr-2">"{{ transaction.libelle.substr(0, 70) }}{{ transaction.libelle.length > 70 ? '...' : '' }}"</i>
          </small>
          <small class="" v-else-if="transaction.libelle != ''">
            <v-icon x-small class="ml-1 mr-1" color="rgba(113,113,113,0.7)">mdi-wallet</v-icon> Création monétaire
          </small>
        </div>
      </div>

      <v-spacer></v-spacer>
      
      <small class="mr-3 d-none d-sm-flex" :class="fromMyWallet ? 'secondary--text' : isDaily ? 'daily-text-color' : 'teal--text'">
          <small>{{ isDaily || transaction.toWallet.uid == $store.state.auth.walletFocus.uid ? '+' : '-' }}
          {{ transaction.amountUnity.toFixed(10) }} ù</small>
      </small>

      <small class="font-righteous text-right" style="min-width:80px;" :class="fromMyWallet ? 'secondary--text' : isDaily ? 'daily-text-color' : 'teal--text'">
        {{ isDaily || transaction.toWallet.uid == $store.state.auth.walletFocus.uid ? '+' : '-' }}
        {{ transaction.amountMony.toFixed(2) }} {{ $store.state.app.monyUnity }}
      </small>

  </v-toolbar>

  <v-toolbar elevation="0" outlined height="3" v-else>
  </v-toolbar>
</div>
</template>

<script>

//import axios from 'axios'
//import router from '../../router/router'

export default {
  name: 'virtual-form',
  components: { }, 
  props: [ 'transaction', 'showDaily' ],
  data: () => ({
    
  }),
  async mounted(){
    
  },
  methods: {
    
  },
  computed: {
    dateTransaction(){ 
      let date = new Date(this.transaction.created)
      let day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate() 
      let month = date.getMonth() < 9 ? '0'+(date.getMonth()+1) : (date.getMonth()+1)
      return day + "/" + 
             month + "/" + 
             date.getFullYear() + " " +
             date.getHours() + "h" + 
             date.getMinutes()
    },
    dateTransactionShort(){ 
      let date = new Date(this.transaction.created)
      let day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate() 
      let month = date.getMonth() < 10 ? '0'+date.getMonth() : date.getMonth() 
      return day + "/" + month
    },
    fromMyWallet(){ 
      return this.transaction.fromWallet != null && this.transaction.fromWallet.uid == this.$store.state.auth.walletFocus.uid 
    },
    isDaily(){ return this.transaction.type == 'create'}
  },

  watch: {
    
  }, 
}
</script>
