<template>
<div>
  <v-btn block outlined class="" 
         color="teal"
         @click="showPopup = true">
         Recevoir</v-btn>
  
  <v-dialog v-model="showPopup" 
            max-width="600" :fullscreen="$vuetify.breakpoint.width < 600"
            content-class="dialog-large-bordered">
    <v-card id="dialog-send-mony">
      <v-col cols="12" class="px-5">
        <div style="width:100%;font-size:24px;" class="text-center mt-4">
          Recevoir de la monnaie<br>
          <small>sur votre compte courant</small>
        </div>

        <v-divider class="my-4"></v-divider> 
 
        Pour recevoir de la monnaie : 
        indiquez l'identifiant de votre compte courant à la personne qui souhaite vous envoyer des Oto : 
        
        <!-- <div style="width:100%;font-size:34px;" class="text-center">
          {{ $store.state.auth.user.walletMain.uid }}
        </div> -->

        <v-divider class="my-4"></v-divider>

        <v-card-actions class="pa-3">
          <v-spacer></v-spacer>
          <v-btn color="" outlined @click="showPopup = false">
            <v-icon small>mdi-check</v-icon> Ok
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

export default {
  name: 'auth',
  components: {  },
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
