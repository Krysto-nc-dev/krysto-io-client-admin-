<template>
  <v-footer color="grey darken-4" dark min-height="300">
    <v-row
      justify="center"
      no-gutters
    >
    <v-col cols="12" md="8" class="text-center">
      <v-btn text rounded to="/">Accueil</v-btn>
      <v-btn text rounded to="/register">S'inscrire</v-btn>
      <v-btn text rounded to="/login">Se connecter</v-btn>
    </v-col>
      <v-col cols="12" class="text-center">
        <span class="font-main ml-5 pl-5" style="font-size:50px;font-weight:800!important;">{{ config.siteName }}</span>
      </v-col>

    </v-row>
  </v-footer>
</template>

<script>

//import router from '../../router/router'

const config = require('../../config/' + process.env.NODE_ENV)

export default {
  name: 'pix-footer',

  data: () => ({
  }),
  
  mounted: function(){
  },
  
  methods: {
  },

  computed:{
    config(){ return config }
  }
    
};
</script>
