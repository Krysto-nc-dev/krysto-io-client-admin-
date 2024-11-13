<template>
<div class="bg-brilliant">
  <div style="min-height:800px;">
    <v-col cols="12" sm="7" md="5" lg="4" 
          class="mx-auto" style="padding-top:80px;">
      <v-card elevation="0" outlined>

      <v-col cols="12">
        <v-card-title><v-icon class="mr-2">mdi-key</v-icon> Réinitialiser votre mot de passe</v-card-title> 
        <!-- <v-card-subtitle></v-card-subtitle> -->
        <v-form @submit.prevent="resetPassword">

          <v-text-field outlined v-model="password1" id="password" label="Nouveau mot de passe"
                        @click:append="showpwd = !showpwd"
                        :append-icon="showpwd ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showpwd ? 'text' : 'password'"
                        :rules="[rules.required, rules.min]" 
          ></v-text-field>
          <v-text-field outlined v-model="password2" id="password" label="Confirmer le nouveau mot de passe"
                        @click:append="showpwd = !showpwd"
                        :append-icon="showpwd ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showpwd ? 'text' : 'password'"
                        :rules="[rules.required, rules.min]" 
          ></v-text-field>

          <v-alert v-if="formError == true" 
                   dense dark color="red" class="mt-3 text-center">
                   <v-icon small>mdi-alert</v-icon>
            Les mots de passe ne correspondent pas.
          </v-alert>

          <v-alert v-if="errorResetPassword != ''" 
                   dense dark color="red" class="mt-3 text-center">
            <v-icon small>mdi-alert</v-icon>
            <template v-if="errorResetPassword == 'USERID_NOT_FOUND'">
              Erreur : vous n'êtes pas authentifié pour effectuer cette opération
            </template>
            <template v-if="errorResetPassword == 'PWD_TOKEN_NOT_FOUND'">
              Erreur : identité non vérifiable
            </template>
          </v-alert>

          <v-btn color="green" @click="resetPassword" :loading="loading"
                dark block :disabled="password1 == '' || password2 == ''">
            <v-icon>mdi-content-save-check</v-icon> Enregistrer
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
    password1: '',
    password2: '',
    resColor: '',
    resMsg: '',
    showpwd: false,
    formError: false,
    errorResetPassword: '',
    loading: false,
    rules: {
          required: value => !!value || 'Champs obligatoire',
          min: v => v.length >= 8 || 'Min 8 caractères',
          minName: v => v.length >= 3 || 'Min 3 caractères',
        },
  }),
  methods: {
    async resetPassword(){
        console.log("resetPassword")
        this.errorResetPassword = ''
        
        if(this.password1 != this.password2){
          this.formError = true
          return 
        }

        this.formError = false
        this.loading = true 

        console.log("try to reset password", this.name, this.email, this.password)
        axios.post('/user/reset-password', 
                    { newPassword: this.password1,
                      userId: this.$route.params.userId,
                      pwdToken: this.$route.params.pwdToken
                    })
              .then((res)=>{
                this.loading = false 
                console.log("res /user/reset-password", res)
                if(res.data.error == false){
                  console.log("USER RESETED PASSWORD WITH SUCCESS", res.data)
                  router.push('/login')
                  this.$store.dispatch('app/openSnackbar', 
                                { show: true, color:'green', 
                                  title: "Votre mot de passe a été réinitialisé.",
                                  text: 'Vous pouvez à nouveau vous connecter, en utilisant ce nouveau mot de passe.',
                                  icon: 'thumb-up' })
                }else{
                  this.errorResetPassword = res.data.errorMsg
                }    
              })

    }
  }
}
</script>
