<template>
  <v-card class="ma-3 px-3 pt-3" style="background-color:transparent!important; overflow-x:hidden;" 
          elevation="0" outlined >
    
    <v-toolbar elevation="0" color="transparent">
    <v-toolbar-title style="font-size:1.8em">
      <v-icon class="mb-3">mdi-chart-areaspline</v-icon>
      Stats système
    </v-toolbar-title>
      <v-spacer/>

      <v-btn small icon outlined class="mx-2 mb-3" @click="refreshChartVisitors()">
        <v-icon small>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>
  
      <ChartSystem :height="300" :width="100"/>
  
    
    <template v-if="dataSet != null">
      <br>
      <v-btn  small  color="white" light elevation="0"
              class="mb-2 mr-2 text-left" @click="showAllLine(true)">
              <v-icon small>mdi-asterisk</v-icon> Tous
      </v-btn>
      <v-btn  small  color="black" dark elevation="0"
              class="mb-2 mr-2 text-left" @click="showAllLine(false)">
              <v-icon class="mr-1" x-small>mdi-circle</v-icon> Aucun
      </v-btn>
    
      <template v-for="(line, l) in dataSet">
        <v-btn  :key="l" small :text="line.hidden" :outlined="!line.hidden"
                :color="line.pointBackgroundColor" 
                class="mb-2 mr-2 text-left" @click="showLine(l)">
                  {{ line.label }}
        </v-btn>
      </template>
    </template>
  
  </v-card>
</template>


<style></style>

<script>
//import axios from 'axios'
//import router from '../router/router'
//import core from '../plugins/core.js'

import ChartSystem from '@/components/admin/charts/ChartSystem.vue'

export default {
  name: 'admin-block-stat-system',
  components: { ChartSystem },
  data: () => ({
    adminList: [],
    dataSet: null
  }),
  async mounted(){
    this.$root.$off('initDataSetSystem').$on('initDataSetSystem', (data) => { 
        this.dataSet = data
    })
  },
  methods: {    
    refreshChartVisitors(){
      this.$root.$emit('refreshChartSystem')
    },
    showLine(line){
      this.$root.$emit('showLineSystem', line)
    },
    showAllLine(bool){
      this.$root.$emit('showAllLineSystem', bool)
    }
  },
  computed: {    
  },
  filters: {
  },
  watch: {
  }, 
}
</script>
