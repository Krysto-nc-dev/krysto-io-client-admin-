<template>
<div>
  <v-btn block outlined class="" 
         color="grey darken-1"
         @click="showPopup = true">
         Déposer</v-btn>
  
  <v-dialog v-model="showPopup" 
            max-width="800" :fullscreen="$vuetify.breakpoint.width < 600"
            content-class="dialog-large-bordered">
    <v-card id="dialog-send-mony">
      <v-col cols="12" class="px-5">
        <div style="width:100%;font-size:24px;" class="text-center mt-4">
          Déposer de la monnaie<br>
          <small>sur votre compte de dépot</small>
        </div>

        <v-divider class="my-4"></v-divider> 

        Les comptes de dépots gèlent la valeur des Oto qu'ils contiennent, pour pouvoir les utiliser plus tard.
        

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
