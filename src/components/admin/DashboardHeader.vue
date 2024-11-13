<template>

  <v-row class="row-bg-lightblue-t pt-5">
    <v-col cols="12" md="12" class="">
          <v-btn v-if="$route.params.entityType!=null"
                 @click="$router.back()" icon class="mr-2" >
            <v-icon color="grey darken-2">mdi-arrow-left</v-icon>
          </v-btn>
          
          <v-icon color="grey darken-2" class="mb-2 mr-2">mdi-account-cowboy-hat</v-icon>

          <v-btn @click="updateHeader()" 
                 icon class="mb-2 mr-1" outlined color="grey darken-2">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>

        <v-chip color="blue" dark class="font-main mx-1 mb-2" style="font-size:1.3em">
          <b class="pr-1">1 {{ config.monyUnity }} =</b> {{ ($store.state.auth.monyConvertValue).toFixed(8) }} ù
        </v-chip>

        <v-chip color="blue" dark class="font-main mx-1 mb-2">
          {{ $store.state.admin.dbstats.walletMain }} <v-icon>mdi-account</v-icon>
        </v-chip>

        <v-chip color="blue" dark class="font-main mx-1 mb-2"
                title="quantité de monnaie en circulation (équivalent en €)">
          {{ convertUnityMony($store.state.admin.dbstats.unityTotal).toFixed(2) }} €
        </v-chip>
       
        <v-chip color="blue" dark class="font-main mx-1 mb-2">
          {{ convertUnityMony($store.state.admin.dbstats.unityTotal/$store.state.admin.dbstats.user).toFixed(2) }} €/p
        </v-chip>
       
        
        <!-- <v-chip color="blue" outlined dark class="font-main mx-1 mb-2"
                title="nombre de compte courant">
          {{ $store.state.admin.dbstats.walletMain }} WM
        </v-chip>

        <v-chip color="blue" outlined dark class="font-main mx-1 mb-2"
                title="nombre de compte de dépots">
          {{ $store.state.admin.dbstats.walletDeposit }} WD
        </v-chip> -->

        <v-chip color="orange" outlined dark class="font-main mx-1 mb-2">
          {{ $store.state.admin.dbstats.offer }} annonces
        </v-chip>

        <v-chip color="teal" outlined dark class="font-main mx-1 mb-2">
          {{ $store.state.admin.dbstats.proposition }} propositions
        </v-chip>
      

        <v-chip color="teal" outlined dark class="font-main mx-1 mb-2">
          {{ $store.state.admin.dbstats.nego }} negos
        </v-chip>
      
    </v-col>

    <v-col cols="12" class="mb-5 py-0">
      <v-app-bar color="transparent" elevation="0">
        <v-toolbar-title class="mr-3"><v-icon>mdi-tools</v-icon></v-toolbar-title>
        <v-btn @click="deletePastPremium" color="">
          <v-icon class="mr-1">mdi-clock-outline</v-icon>
          Nettoyer les comptes PREMIUM 
          <template v-if="nbDeletedPastPrem != null"> - {{ nbDeletedPastPrem }}</template>
        </v-btn>
        <v-btn @click="inverseCoords" color="" class="ml-2">
          <v-icon class="mr-1">mdi-map-marker</v-icon>
          Inverse coords
          <template v-if="nbDeletedPastPrem != null"> - {{ nbDeletedPastPrem }}</template>
        </v-btn>
        <v-spacer></v-spacer>
        
      </v-app-bar>
    </v-col>

  </v-row>

</template>

<script>
  import axios from 'axios'
  import '@/assets/css/home.css'
  import core from '../../plugins/core.js'

  const config = require('../../config/' + process.env.NODE_ENV)

  export default {
    data: () => ({
      dataSet: null,
      nbDeletedPastPrem: null,
    }),
    async mounted(){
      this.$store.dispatch('admin/fetchDbstats')
    },

    methods: {
      deletePastPremium(){
        axios.post('/admin/delete-past-premium')
            .then((res)=>{
              this.nbDeletedPastPrem = res.data.nbDeleted
              this.updateHeader()
            })
      },
      inverseCoords(){
        axios.get('/admin/inverse-coords-offer')
      },
      updateHeader(){
        this.$store.dispatch('admin/fetchDbstats')
        this.$store.dispatch('auth/refreshUserData')
      },
      convertUnityMony(amountUnity){
        return core.convertUnityMony(amountUnity, this.$store.state.auth.monyConvertValue)
      },
      convertMonyUnity(amountMony){
        return core.convertMonyUnity(amountMony, this.$store.state.auth.monyConvertValue)
      },
      monyToEuro(){
        return config.monyToEuro
      }
    },
    computed: {
      config(){ return config }
    },
  }
</script>
    