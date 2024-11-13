<template>
<div>
<v-row class="row-bg-white-t pb-5">
  <v-col cols="12">

    <v-app-bar color="transparent" elevation="0">
      <v-toolbar-title style="font-size:1.8em">
        <v-icon>mdi-account-clock-outline</v-icon> Simulation 
        <small>({{ wallets.length }} wallets)</small>
      </v-toolbar-title>

    </v-app-bar>

    <v-app-bar color="transparent" elevation="0" height="30">

      <v-btn small color="secondary" @click="fetchWallets()"
              dark class="ml-2" outlined>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>

      <v-btn small color="secondary" @click="simulate1D()"
              dark class="ml-2" outlined>
        <v-icon>mdi-play-pause</v-icon> Sim 1D
      </v-btn>

      <v-btn small color="teal" @click="startSimulation()" v-if="!timerRunnin"
              dark class="ml-2" outlined>
        <v-icon>mdi-play</v-icon> Simuler
      </v-btn>

      <v-btn small color="teal" @click="stopSimulation()" v-else
              dark class="ml-2" outlined>
        <v-icon>mdi-stop</v-icon> Stop
      </v-btn>

      <v-btn small color="blue" @click="showPopupCreateUser = true"
              dark class="ml-2" outlined>
        <v-icon small class="mr-1">mdi-auto-fix</v-icon> Créer users
      </v-btn>
      
      <v-btn small color="red" @click="showPopupRAZ = true"
              dark class="ml-2" outlined>
        <v-icon small>mdi-delete</v-icon> RAZ
      </v-btn>

      <v-btn small color="purple" @click="showPopupRebase = true"
              dark class="ml-2" outlined>
        <v-icon small>mdi-chart-timeline-variant-shimmer</v-icon> Rebase
      </v-btn>
    </v-app-bar>
  </v-col>
</v-row>

<v-row class="row-bg-white-t">
  <v-col cols="10" sm="11" md="12">
    <v-row style="" class="py-3 px-3">
      <template v-for="(wallet, w) in wallets">
        <v-col cols="12" sm="6" lg="4" class="pa-1" :key="w" v-if="w < 30">
          <v-card class="pa-2" elevation="0" outlined>
            <b v-if="wallet.owner != null">{{ wallet.owner.name }}</b> | {{ wallet.uid }} | <b>
              {{ convertUnityMony(wallet.amountUnity).toFixed(6) }}</b> {{ config.monyUnity }}<br>
            <b>{{ wallet.amountUnity }}</b> ù
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-col>
</v-row>

<v-dialog v-model="showPopupRAZ" max-width="650">
  <v-card>
    <v-card-title class="red--text">
      <v-icon color="red" class="mr-2">mdi-delete</v-icon> 
      Voulez-vous vraiment réinitialiser le système ?
    </v-card-title>

    <v-card-text class="red--text text--lighten-2">
      (réinitialisation blockchain + mongo)<br>
      Si ça ne fonctionne pas, il est possible d'utiliser le script:
    </v-card-text>

    <pre>
      cd /var/www/NODE/krup/api/scripts
      sudo ./rebootbdd_prod.sh 
    </pre>

    <v-card-text class="red--text text--lighten-2">
      En cas d'erreur, vérifier que l'api est lancée en root (sudo), nécessaire pour effacer la multichain
    </v-card-text>

    <v-card-actions class="pa-3">
      <v-spacer></v-spacer>
      <v-btn color="" text @click="showPopupRAZ=false" >
        <v-icon small>mdi-close</v-icon> Annuler
      </v-btn>
      <v-btn color="red" dark @click="raz()" >
        <v-icon small>mdi-delete</v-icon> Oui, RAZ
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog v-model="showPopupRebase" max-width="650">
  <v-card>
    <v-card-title class="purple--text">
      <v-icon color="purple" class="mr-2">mdi-chart-timeline-variant-shimmer</v-icon> 
      Voulez-vous vraiment faire un rebase ?
    </v-card-title>

    <v-card-actions class="pa-3">
      <v-spacer></v-spacer>
      <v-btn color="" text @click="showPopupRebase=false" >
        <v-icon small>mdi-close</v-icon> Annuler
      </v-btn>
      <v-btn color="purple" dark @click="rebase()" >
        <v-icon small>mdi-chart-timeline-variant-shimmer</v-icon> Oui, REBASE
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog v-model="showPopupCreateUser" max-width="400">
  <v-card>
    <v-card-title class="blue--text">
      <v-icon color="blue" class="mr-2">mdi-plus-circle</v-icon> 
      Créer des utilisateurs
    </v-card-title>

    <v-card-text class="">
      Combien de Sims souhaitez-vous créer ?
    </v-card-text>

    <v-text-field v-model="nbUserToCreate" 
                  outlined rounded flat dense 
                  class="mx-5 ">
    </v-text-field>

    <v-card-actions class="pa-3">
      <v-spacer></v-spacer>
      <v-btn color="" text @click="showPopupCreateUser=false" >
        <v-icon small>mdi-close</v-icon> Annuler
      </v-btn>
      <v-btn color="blue" dark @click="createUsers()" >
        <v-icon small>mdi-delete</v-icon> Créer
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</div>
</template>


<script>
import axios from 'axios'
//import router from '../router/router'
import core from '../../plugins/core.js'

const config = require('../../config/' + process.env.NODE_ENV)

export default {
  name: 'admin-dashboard',
  components: { },
  data: () => ({
    adminList: [],
    timerRunnin: false,
    wallets: [],
    nbUserToCreate: 10,
    showPopupRAZ: false,
    showPopupRebase: false,
    showPopupCreateUser: false
  }),
  async mounted(){
    this.fetchWallets()
  },
  methods: {
    async fetchWallets(){
      await this.$store.dispatch('app/fetchEntities', { entityType: "walletMain", limit: 30, sort: { created: 1 } })
      this.wallets = this.$store.state.app.data.walletMain
      //this.wallets = this.wallets.reverse()
      await this.$store.dispatch('auth/refreshUserData')
      await this.$store.dispatch('admin/fetchDbstats')
    },
    async raz(){
      await axios.get('/oto/raz')
      //await this.simulate1D()
      this.showPopupRAZ = false
      setTimeout(()=>{ this.fetchWallets() }, 2000)
    },
    async rebase(){
      await axios.get('/oto/rebase')
      //await this.simulate1D()
      this.showPopupRebase = false
      setTimeout(()=>{ this.fetchWallets() }, 2000)
    },
    async stopSimulation(){
      this.timerRunnin = false
    },
    async startSimulation(){
      this.timerRunnin = true
      this.simulate1D()
    },
    async simulate1D(){
      let res = await axios.get('/oto/create-daily-mony')
      if(res.data.error == false){
        //console.log("res /oto/create-daily-mony", res.data)
        await this.fetchWallets()
        if(this.timerRunnin) setTimeout(()=>{ this.simulate1D() }, 1000)
      }
    },
    async createUsers(){
      let res = await axios.get('/oto/create-sim-users/' + this.nbUserToCreate)
      if(res.data.error == false){
        //console.log("res /oto/create-daily-mony", res.data)
        await this.fetchWallets()
        this.showPopupCreateUser = false
      }
      
    },
    convertUnityMony(amountUnity){
      return core.convertUnityMony(amountUnity, this.$store.state.auth.monyConvertValue)
    },
    convertMonyUnity(amountMony){
      return core.convertMonyUnity(amountMony, this.$store.state.auth.monyConvertValue)
    }
  },
  computed: {
    
    config(){ return config }
  },
  filters: {
    
  },
  watch: {
    
  }, 
}
</script>
