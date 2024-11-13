<template>
  <v-col cols="12" sm="12">

    <v-toolbar class="" elevation="0" color="transparent">
      <v-toolbar-title style="font-size:1.8em">
        <v-icon>mdi-link-lock</v-icon> 
        Blockchain 
        <!-- ({{ reportList.length }}) -->
      </v-toolbar-title>
      <v-btn outlined icon :loading="loading" @click="fetchData()" class="mx-2">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-spacer/>
      <template v-for="(sName, s) in streamNamesList">
        <v-btn :outlined="streamName != sName" :key="s"
                :color="streamName == sName ? 'teal' : ''" 
                small @click="loadData(sName)" class="mx-2">
          <v-icon small class="mr-1">mdi-link-lock</v-icon> {{ sName }}
        </v-btn>
      </template>
      <v-spacer/>
      <v-btn outlined icon v-if="nodeEnv == 'development'" color="red"
            :loading="loading" @click="restore()" class="mx-2">
        <v-icon>mdi-restore-alert</v-icon>
      </v-btn>
    </v-toolbar>

    <v-toolbar dense class="mb-5" elevation="0" color="transparent">

      <v-spacer/>
      <template v-for="(sName, s) in streamNamesList2">
        <v-btn :outlined="streamName != sName" :key="s"
                :color="streamName == sName ? 'teal' : ''" 
                small @click="loadData(sName)" class="mx-2">
          <v-icon small class="mr-1">mdi-link-lock</v-icon> {{ sName }}
        </v-btn>
      </template>

      <v-spacer/>
    </v-toolbar>

    <v-row class="mx-0 my-0 px-5 pt-5">
      <template v-for="(data, d) in datas">
        <v-col cols="12" sm="6" md="4" :key="d">
          <v-card outlined>
            <pre style="max-height:200px;">{{ data.data.json }}</pre>
          </v-card>
        </v-col>
      </template>
    </v-row>

  </v-col>
</template>

<style></style>

<script>
import axios from 'axios'
//const config = require('../../config/' + process.env.NODE_ENV)
//import router from '../router/router'
//import core from '../plugins/core.js'

// import DashboardHeader from '@/components/admin/DashboardHeader.vue'
// import TransactionBoard from '@/components/admin/transaction/TransactionBoard.vue'
// import BlockStatVisitors from '@/components/admin/BlockStatVisitors.vue'
// import BlockStatSystem from '@/components/admin/BlockStatSystem.vue'
import Gravatar from 'vue-gravatar'

export default {
  name: 'admin-dashboard',
  components: { 'v-gravatar' : Gravatar, 
                 //TransactionBoard, BlockStatVisitors, BlockStatSystem 
              },
  data: () => ({
    streamNamesList: ['user', 'offer', 'walletMain', 'walletDeposit', 'transactionFrom', 'transactionTo'],
    streamNamesList2: ['stateHistory', 'conversation', 'proposition', 'report', 'userDeleted', 'userBanned'],
    streamName: 'user',
    datas: [],
    loading: false,
    nodeEnv: process.env.NODE_ENV
  }),
  async mounted(){
    //this.nodeEnv = config.env
    this.fetchData(this.streamName)
    //this.loadAdmins()
  },
  methods: {
    loadData(streamName){
      this.streamName = streamName
      this.fetchData()
    },
    async fetchData(){
      let res = await axios.post('/admin/query-blockchain', {
                        streamName: this.streamName,
                        query: { },
                        limit: 30
                      })
      if(res.data.error == false){
        this.datas = res.data.entities
      }
    },
    async restore(){
      let res = await axios.post('/admin/restore-from-blockchain')
      if(res.data.error == false){
        console.log("RESTORE OK", res.data)
      }else{
        console.log("RESTORE ERROR", res.data)
      }
    },
  },
  computed: {
    //nodeEnv(){ return process.env.NODE_ENV }
  },
  filters: {
    
  },
  watch: {
     
  }, 
}
</script>
