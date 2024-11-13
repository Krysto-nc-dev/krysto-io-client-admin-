<template>
<div class="bg-brilliant">
  <div style="min-height:800px;">
    <v-col cols="12" sm="7" md="5" lg="4" 
          class="mx-auto" style="padding-top:80px;">
      <v-card elevation="0" outlined >

      <v-col cols="12">
        <v-card-title><v-icon class="mr-2">mdi-key</v-icon> Réinitialiser votre mot de passe</v-card-title> 

        <v-card-text>
          Merci d'indiquer l'adresse e-mail de votre compte, 
          afin que nous puissions vous envoyer le lien qui permettra de réinitialiser votre mot de passe.
        </v-card-text>
        <!-- <v-card-subtitle></v-card-subtitle> -->
        <v-form @submit.prevent="sendMail">

          <v-text-field outlined v-model="email" id="email" 
                        label="Adresse e-mail de votre compte"
          ></v-text-field>

          <v-alert v-if="formError == true" 
                   dense dark color="red" class="mt-3 text-center">
                   <v-icon small>mdi-alert</v-icon>
            Les mots de passe ne correspondent pas.
          </v-alert>

          <v-alert v-if="errorInitPassword != ''" 
                   dense dark color="red" class="mt-3 text-center">
            <v-icon small>mdi-alert</v-icon>
            <template v-if="errorInitPassword == 'USER_EMAIL_NOT_FOUND'">
              Erreur : cette adresse e-mail ne correspond à aucun compte
            </template>
          </v-alert>

          <v-btn color="green" @click="sendMail" :loading="loading"
                dark block :disabled="email.indexOf('@') == -1">
            <v-icon class="mr-1">mdi-email</v-icon> Envoyez-moi un e-mail
          </v-btn>

        </v-form>
      </v-col>

    </v-card>
    </v-col>
  </div>
  <v-col cols="12" class="pa-0">
    <Footer/>
  </v-col>
</div>
</template>

<script>

import router from '../../router/router'
import Footer from '@/components/main-layout/Footer.vue'
import axios from 'axios'

export default {
  name: 'reset-password',
  components: {
    Footer
  },
  data: () => ({
    email: '',
    resMsg: '',
    formError: false,
    errorInitPassword: '',
    loading: false,
   
  }),
  methods: {
    async sendMail(){
        console.log("sendMail")
        this.errorInitPassword = ''
        
        this.formError = false
        this.loading = true 

        console.log("try to reset password", this.email)
        axios.post('/user/get-token-password', { email: this.email, })
              .then((res)=>{
                this.loading = false 
                console.log("res /user/get-token-password", res)
                if(res.data.error == false){
                  console.log("USER INITED TOKEN PASSWORD WITH SUCCES", res.data)

                  this.$store.dispatch('app/openDialogMailDev', res.data.emailParams)
                  router.push('/login')

                  this.$store.dispatch('app/openSnackbar', 
                                { show: true, color:'green', 
                                  title: "Vérifiez votre boîte mail.",
                                  text: 'Un message vient de vous être envoyé pour réinitialiser votre mot de passe.',
                                  icon: 'thumb-up' })
                }else{
                  this.errorInitPassword = res.data.errorMsg
                }    
              })

    }
  }
}
</script>
