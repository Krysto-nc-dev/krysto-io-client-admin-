<template>

<v-row class="pa-3">
  <v-col>
    <v-card outlined class="pa-3" style="background-color:transparent!important;" >
      <v-row>
        <v-app-bar color="transparent" elevation="0">

          <v-toolbar-title style="font-size:1.8em">
            <v-icon>mdi-swap-horizontal</v-icon> Transactions 
            ({{ $store.state.admin.blockchain.transactions.length }} / {{ $store.state.admin.blockchain.countFrom }})
          </v-toolbar-title>

          <v-spacer/>

          <v-btn v-if="timerHear == null" small
                  icon outlined @click="startHearing()" 
                  class="mr-4" color="teal" title="écouter toutes les 10 secondes">
            <v-icon small>mdi-ear-hearing</v-icon>
          </v-btn>
          <v-btn v-if="timerHear != null" small
                  icon outlined @click="stopHearing()" 
                  class="mr-4" color="red" title="stop">
            <v-icon>mdi-ear-hearing-off</v-icon>
          </v-btn>

          <v-btn icon small outlined @click="fetchData()" class="mr-4">
            <v-icon small>mdi-refresh</v-icon>
          </v-btn>

        </v-app-bar>
      </v-row>

      <v-row style="min-height:510px;max-height:510px;overflow-y:auto;">
        <v-col cols="10" sm="11" md="12">
          <v-row>
            <template v-for="(transaction, t) in $store.state.admin.blockchain.transactions">
              <v-col cols="12" :key="t" class="py-1">
                <v-card class="pa-2" outlined elevation="0" style="background-color:transparent!important;">
                  <v-icon v-if="transaction.t1.id == transaction.t2.id" color="green" class="mr-2">mdi-link-lock</v-icon>
                  <v-icon v-if="transaction.t1.id != transaction.t2.id" color="red" class="mr-2">mdi-link-lock</v-icon>
                  <b>{{ transaction.t1.fromWallet.ownerName }}</b>
                  <small class="pl-1">{{ transaction.t1.fromWallet.uid }}</small>
                  a envoyé 
                  <b>{{ transaction.t1.amountMony }} òto</b> à 
                  <b>{{ transaction.t1.toWallet.ownerName }}</b>
                  <small class="pl-1">{{ transaction.t1.toWallet.uid }} </small>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</v-row>

</template>

<style></style>

<script>

//import axios from 'axios'
//import router from '../router/router'
//import core from '../plugins/core.js'

//import Post from '@/components/Post.vue'

export default {
  name: 'transactionboard',
  components: {  },
  data: () => ({
    timerHear: null
    
  }),
  async mounted(){
    this.fetchData()
  },
  methods: {
    
    fetchData(){
      this.$store.dispatch("admin/fetchTransactions")
    },
    startHearing(){
      this.stopHearing()
      this.timerHear = setInterval(()=>{ this.fetchData() }, 4000)
    },
    stopHearing(){
      if(this.timerHear != null) clearInterval(this.timerHear)
      this.timerHear = null
    }
  },
  computed: {
    
    
  }
}
</script>
