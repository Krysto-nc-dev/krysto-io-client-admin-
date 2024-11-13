<template>
<v-col cols="12" class="">
  <v-row class="mx-0">
    <v-col cols="12" sm="6" md="6" lg="4" class="mx-auto col-form-register" style="">
      <h1 class="text-center secondary--text text--darken-1">{{ config.siteName }}</h1>
      <br>
      <Register></Register>
    </v-col>
  </v-row>
  <v-row class="mx-0">
    <v-col cols="12" md="6" class="mt-5 mx-auto text-center" style="padding-bottom: 100px;">
      <v-divider/><br>
      Vous avez déjà un compte ?<br>
      <v-btn class="mt-3" outlined color="secondary" to="/login">
        <v-icon>mdi-login</v-icon> Connectez-vous
      </v-btn>
    </v-col>
  </v-row>
</v-col>
</template>

<script>

import '@/assets/css/home.css';

import router from '../router/router'
import axios from 'axios'

const config = require('../config/' + process.env.NODE_ENV)
import Register from '@/components/main-layout/Register.vue'

export default {
  name: 'register',
  components: {
    Register
  },
  data: () => ({
    name: '',
    email: '',
    password: '',
    showpwd: false,
    errorRegister: false,
    rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 caractères',
          minName: v => v.length >= 3 || 'Min 3 caractères',
        },
  }),
  mounted: function(){
    //TOP
    console.log("config.enableRegisterAdmin", config, config.enableRegisterAdmin)
    if(config.enableRegisterUser == false) 
      router.push('/login')
    

    this.$store.dispatch('app/fetchNbUsersTotal')
    this.$store.dispatch('app/fetchEntities', { entityType: 'plan', 
                                                query : { "isActive": true },
                                                sort: { position: 1 } 
                                              })
  },
  methods: {
    async register(){
      console.log("try to register", this.name, this.email, this.password)
      const res = await axios.post('/auth/register', 
                                    { name: this.name,
                                      email: this.email,
                                      password: this.password
                                    })
      console.log("res /auth/register", res)
      if(res.data.error == false){
        console.log("USER SAVED WITH SUCCES", res.data)
        this.errorRegister = false
        router.push('/login');
      }else{
        this.errorRegister = res.data.msg
      }
    }
  },
  computed: {
    planKeyIsValid: function(){ 
      if(this.$store.state.app.data.plan.length == 0) return true 

      let planExist = false
      this.$store.state.app.data.plan.forEach(plan => {
        if(this.$route.params.planKey == plan.key) planExist = true
      })
      return planExist
    },
    config(){ return config }
  }
}
</script>
