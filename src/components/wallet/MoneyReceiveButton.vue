<template>
<div>
  <v-btn block outlined class="" 
         color="teal"
         @click="showPopup = true"
         :disabled="!$store.state.auth.user.isActive || !$store.state.auth.user.planPaid">
         Recevoir</v-btn>
  
  <v-dialog v-model="showPopup" 
            max-width="500" :fullscreen="$vuetify.breakpoint.width < 600"
            content-class="dialog-large-bordered">
    <v-card id="dialog-send-mony">
      <v-col cols="12" class="px-5">
        <div style="width:100%;font-size:24px;" class="text-center mt-4">
          Recevoir de la monnaie
          <!-- <br>
          <small>sur votre compte courant</small> -->
        </div>

        <v-divider class="my-4"></v-divider> 

        <b>Pour recevoir de la monnaie :</b><br>
        Donnez le numéro du compte sur lequel vous souhaitez recevoir de la monnaie, à la personne qui souhaite vous en envoyer : 
        
        <br><br>
        
        <v-icon small class="m">mdi-chevron-down</v-icon> Liste de vos comptes :
        <v-row class="mt-0">
          <v-col cols="12" md="12" class="">
            <WalletCard :wallet="$store.state.auth.user.walletMain"></WalletCard>
          </v-col>
          <v-col cols="12" v-for="wallet in $store.state.auth.user.walletsDeposit" :key="wallet._id"
                md="12" class="">
            <WalletCard :wallet="wallet"></WalletCard>
          </v-col>
        </v-row>


        <v-divider class="my-4"></v-divider>

        <v-card-actions class="pa-3">
          <v-spacer></v-spacer>
          <v-btn color="" outlined @click="showPopup = false">
            <v-icon small>mdi-check</v-icon> OK
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-card>
  </v-dialog>
</div>
</template>


<script>

//import axios from 'axios'
//import router from '../router/router'
import WalletCard from '@/components/wallet/WalletCard.vue'

export default {
  name: 'auth',
  components: { WalletCard },
  data: () => ({
    showPopup: false,
  }),
  async mounted(){
  },
  methods: {

    async refreshData(){
      
    }
  }
}
</script>
