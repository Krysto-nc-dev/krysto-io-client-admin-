<template>
  <v-col cols="12" sm="12">

    <DashboardHeader/>

    <v-row>
      <v-col md="7">
        <BlockStatVisitors/>
      </v-col>
      <v-col md="5">
        <BlockStatSystem/>
      </v-col>
      
      <v-col md="12">
        <TransactionBoard/>
      </v-col>
    </v-row>

  </v-col>
</template>

<style></style>

<script>
import axios from 'axios'
//import router from '../router/router'
//import core from '../plugins/core.js'

import DashboardHeader from '@/components/admin/DashboardHeader.vue'
import TransactionBoard from '@/components/admin/transaction/TransactionBoard.vue'
import BlockStatVisitors from '@/components/admin/BlockStatVisitors.vue'
import BlockStatSystem from '@/components/admin/BlockStatSystem.vue'
import Gravatar from 'vue-gravatar'

export default {
  name: 'admin-dashboard',
  components: { DashboardHeader, 'v-gravatar' : Gravatar, TransactionBoard, BlockStatVisitors, BlockStatSystem },
  data: () => ({
    adminList: [],
    dataSet: null
  }),
  async mounted(){
    this.fetchData()
    //this.loadAdmins()
  },
  methods: {    
    fetchData(){
      this.$store.dispatch("admin/fetchEntityTypesAvailables")
    },
    async loadAdmins(){
      let res = await axios.post('/admin/query-entities', {
                        entityType: "user",
                        query: { isAdmin: true }
                      })
      if(res.data.error == false){
        this.adminList = res.data.entities
      }
    },
  },
  computed: {    
  },
  filters: {
    
  },
  watch: {
     
  }, 
}
</script>
