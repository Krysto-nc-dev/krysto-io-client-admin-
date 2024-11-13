<template>
<div class="bg-brilliant">
  <div style="min-height:800px;">
    <v-col cols="12" sm="7" md="5" lg="4" 
          class="mx-auto" style="padding-top:80px;">

      <v-col cols="12" class="px-0">
        <v-btn outlined color="grey" small to="/profil">
          <v-icon small>mdi-arrow-left icon outlined</v-icon> Retour
        </v-btn>
      </v-col>

      <v-card elevation="0" outlined>

      <v-col cols="12">
        <v-card-title><v-icon class="mr-2">mdi-key</v-icon> Changer votre mot de passe</v-card-title> 
        <!-- <v-card-subtitle></v-card-subtitle> -->
        <v-form @submit.prevent="saveNewPassword">

          <v-text-field outlined v-model="password1" id="password" label="Mot de passe actuel"
                        @click:append="showpwd = !showpwd"
                        :append-icon="showpwd ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showpwd ? 'text' : 'password'"
                        :rules="[rules.required, rules.min]" 
          ></v-text-field>
          <v-text-field outlined v-model="password2" id="password" label="Nouveau mot de passe"
                        @click:append="showpwd = !showpwd"
                        :append-icon="showpwd ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showpwd ? 'text' : 'password'"
                        :rules="[rules.required, rules.min]" 
          ></v-text-field>
          <v-text-field outlined v-model="password3" id="password" label="Confirmation du nouveau mot de passe"
                        @click:append="showpwd = !showpwd"
                        :append-icon="showpwd ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showpwd ? 'text' : 'password'"
                        :rules="[rules.required, rules.min]" 
          ></v-text-field>
          <v-alert v-if="$store.state.auth.login.error != null" 
                   dense dark color="red" class="mt-3 text-center">
                   <v-icon small>mdi-alert</v-icon>
            {{ errorMsg[$store.state.auth.login.error] }}
          </v-alert>

          <v-alert v-if="formError == true" 
                   dense dark color="red" class="mt-3 text-center">
                   <v-icon small>mdi-alert</v-icon>
            Les mots de passe ne correspondent pas.
          </v-alert>

          <v-alert v-if="errorSavePassword != ''" 
                   dense dark color="red" class="mt-3 text-center">
            <v-icon small>mdi-alert</v-icon>
            <template v-if="errorSavePassword == 'USERID_NOT_FOUND'">
              Erreur : vous n'êtes pas authentifié pour effectuer cette opération
            </template>
            <template v-if="errorSavePassword == 'PWD_FAILED'">
              Erreur : votre mot de passe actuel est incorrect
            </template>
          </v-alert>

          <v-btn color="green" @click="saveNewPassword" :loading="loading"
                dark block :disabled="password1 == '' || password2 == '' || password3 == ''">
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
import Login from '@/components/main-layout/Login.vue'
import axios from 'axios'

export default {
  name: 'change-password',
  components: {
    Login, Footer
  },
  data: () => ({
    password1: '',
    password2: '',
    password3: '',
    resColor: '',
    resMsg: '',
    showpwd: false,
    formError: false,
    errorSavePassword: '',
    loading: false,
    rules: {
          required: value => !!value || 'Champs obligatoire',
          min: v => v.length >= 8 || 'Min 8 caractères',
          minName: v => v.length >= 3 || 'Min 3 caractères',
        },
  }),
  methods: {
    async saveNewPassword(){
        console.log("saveNewPassword")
        this.errorSavePassword = ''
        
        if(this.password2 != this.password3){
          this.formError = true
          return 
        }

        this.formError = false
        this.loading = true 

        console.log("try to change password", this.name, this.email, this.password)
        axios.post('/user/save-new-password', 
                    { password1: this.password1,
                      password2: this.password2
                    })
              .then((res)=>{
                this.loading = false 
                console.log("res /user/save-new-password", res)
                if(res.data.error == false){
                  console.log("USER SAVED NEW PASSWORD WITH SUCCES", res.data)
                  router.push('/profil')
                   this.$store.dispatch('app/openSnackbar', 
                                { show: true, color:'green', 
                                  title: "Votre nouveau mot de passe a été enregistré",
                                  text: '',
                                  icon: 'thumb-up' })
                }else{
                  this.errorSavePassword = res.data.errorMsg
                }    
              })

    }
  }
}
</script>
