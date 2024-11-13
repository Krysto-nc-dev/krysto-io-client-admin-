<template>
  <v-card outlined elevation="0">
    <v-col cols="12" class="">
      
      <v-card-title class="pt-0">n° {{ wallet.uid }}</v-card-title>
    
      <v-card-subtitle v-if="wallet.type=='MAIN'" class="pb-2">Compte courant</v-card-subtitle>
      <v-card-subtitle v-if="wallet.type=='DEPOSIT'" class="pb-2">
        <template v-if="wallet.name == 'DEPOSIT'">Compte de dépot</template>
        <template v-else>{{ wallet.name }}</template>
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text class="pl-2 pb-0 pt-2" v-if="wallet.type == 'MAIN'">
        <v-chip small color="secondary" class="mr-2 font-righteous"><b>{{ convertUnityMony(wallet.amountUnity).toFixed(4) }} {{ config.monyUnity }}</b></v-chip>
        ~{{ monyToEuro(convertUnityMony(wallet.amountUnity)).toFixed(2) }} €
      </v-card-text>
      <v-card-text class="pl-2 pb-0 pt-2" v-if="wallet.type == 'DEPOSIT'">
        <v-chip small color="secondary" class="mr-2 font-righteous"><b>{{ wallet.amountMony.toFixed(4) }} {{ config.monyUnity }}</b></v-chip>
        ~{{ monyToEuro(wallet.amountMony).toFixed(2) }} €
      </v-card-text>

    </v-col>
  </v-card>
</template>


<script>

// import axios from "axios"
// import { i18n } from 'vue-lang-router';
import core from '../../plugins/core.js'
const config = require('../../config/' + process.env.NODE_ENV)

export default {
  name: 'WalletCard',
  components: {
  },
  props:['wallet'],
  data: () => ({
    
  }),
  mounted: async function(){
    this.initData()
  },
  methods: {
    async initData(){
    },
    monyToEuro(amount){ return amount * config.monyToEuro },

    convertUnityMony(amountUnity){
      return core.convertUnityMony(amountUnity, this.$store.state.auth.monyConvertValue)
    },
    convertMonyUnity(amountMony){
      return core.convertMonyUnity(amountMony, this.$store.state.auth.monyConvertValue)
    },
    
  },
  computed: {
      config(){ return config }
  },
  watch: {
      
  }, 
}
</script>