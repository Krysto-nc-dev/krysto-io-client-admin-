<template>
  <v-row class="mx-0 my-0 px-5 pt-5">
    <v-col cols="12">
      <v-toolbar class="mb-5" elevation="0" color="transparent">
        <v-toolbar-title style="font-size:1.8em">
          <v-icon>mdi-shield-alert-outline</v-icon> 
          Modération des annonces ({{ reportList.length }})
        </v-toolbar-title>
        <v-spacer/>
        <v-btn text small @click="invertSort" class="mx-2">
          <template v-if="sort>0"><v-icon>mdi-chevron-down</v-icon> Les plus anciennes</template>
          <template v-else><v-icon>mdi-chevron-up</v-icon> Les plus récentes</template>
        </v-btn>
        <v-btn outlined :loading="loading" small @click="loadReports()" class="mx-2">
          <v-icon>mdi-refresh</v-icon> actualiser
        </v-btn>
        <v-switch class="d-inline-block px-4 mt-5" v-model="reported" 
                  @change="loadReports()" label="Signalées">
        </v-switch>
        <v-switch class="d-inline-block px-4 mt-5" v-model="status" 
                  @change="loadReports()" :label="status ? 'OPEN' : 'CLOSED'">
        </v-switch>
      </v-toolbar>
      <v-row v-if="reportList.length > 0">
        <template v-for="(report, o) in reportList">
          <v-col cols="12" sm="6" md="4" lg="4" :key="o">
            <ReportCard v-if="reported" :report="report"></ReportCard>
            <OfferCard v-if="!reported" :offer="report"></OfferCard>
          </v-col>
        </template>
      </v-row>
    </v-col>

    <OfferDialog></OfferDialog>
    <ReportDialog></ReportDialog>

  </v-row>
</template>

<style></style>

<script>
import axios from 'axios'
//import router from '../router/router'
//import core from '../plugins/core.js'

import ReportCard from '@/components/report/ReportCard.vue'
import OfferCard from '@/components/offer/OfferCardSM.vue'
import OfferDialog from '@/components/offer/OfferDialog.vue'
import ReportDialog from '@/components/offer/ReportDialog.vue'

export default {
  name: 'admin-dashboard',
  components: { ReportCard, OfferDialog, ReportDialog, OfferCard },
  data: () => ({
    reportList: [],
    loading: false,
    sort: false,
    status: true,
    reported: true
  }),
  async mounted(){
    this.loadReports(false)


    this.$root.$off('loadReports').$on('loadReports', () => { 
      this.loadReports()
    })
  },
  methods: {
    //reported == false : afficher toutes les annonces
    //reported == true : afficher seulement les annonces signalées
    async loadReports(){ 
      this.loading = true
      //let query = this.reported == false ? {} : { reports: { $exists: true, $ne: [] } }

      if(this.reported == true){
        let res = await axios.post('/admin/query-entities', {
                          entityType: "report",
                          query: { status: this.status ? "OPEN" : "CLOSED" },
                          sort: { "created": (this.sort ? 1 : -1) },
                          limit: 50
                        })
        if(res.data.error == false){
          this.reportList = res.data.entities
        }
      }else{
        let res = await axios.post('/admin/query-entities', {
                          entityType: "offer",
                          query: { status: this.status ? "OPEN" : "CLOSED" },
                          sort: { "created": (this.sort ? 1 : -1) },
                          limit: 50
                        })
        if(res.data.error == false){
          this.reportList = res.data.entities
        }
      }
      this.loading = false
    },
    invertSort(){
      this.sort = !this.sort
      this.loadReports()
    }
  },
  computed: {    
  },
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  watch: {
      '$route.path': { immediate: true, 
          async handler (val, oldVal) {
              if(window.isDev) { console.log("#MAIN -- route.name changed", val, oldVal) }
              //this.fetchData()
          }
      },
  }, 
}
</script>
