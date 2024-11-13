<template>
<div class="bg-brilliant">
  <div style="min-height:800px;">
    <v-col cols="12" sm="9" md="6" lg="5" 
          class="mx-auto" style="padding-top:80px;padding-bottom:150px;max-width:500px;">

      <v-col cols="12" class="px-0">
        <v-btn outlined color="grey" small to="/profil">
          <v-icon small>mdi-arrow-left icon outlined</v-icon> Retour
        </v-btn>
      </v-col>

      <v-card elevation="0" outlined>

      <v-col cols="12">
        <v-card-title class="red--text"><v-icon class="mr-2" color="red">mdi-delete</v-icon> Supprimer votre compte ?</v-card-title> 

        <v-card-text>
          L'ensemble de vos données seront définitivement supprimées.
          <small>(compte courant, compte de dépôts, annonces, conversations, etc)</small><br><br>
          La monnaie présente sur vos comptes sera définitivement perdue.
          <br><br>
          <span class="red--text">Vous serez automatiquement déconnecté de la plateforme, et vous ne pourrez plus accéder à votre compte.</span>
          <br><br>
        </v-card-text>
        <!-- <v-card-subtitle></v-card-subtitle> -->
        <v-form @submit.prevent="saveNewPassword">

          <v-text-field outlined v-model="password" id="password" label="Votre mot de passe"
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

          <v-alert v-if="errorDeleteAccount != ''" 
                   dense dark color="red" class="mt-3 text-center">
            <v-icon small>mdi-alert</v-icon>
            <template v-if="errorDeleteAccount == 'USERID_NOT_FOUND'">
              Erreur : vous n'êtes pas authentifié pour effectuer cette opération
            </template>
            <template v-if="errorDeleteAccount == 'PWD_FAILED'">
              Erreur : mot de passe incorrect
            </template>
          </v-alert>

          <v-toolbar dense elevation="0" color="transparent">
            <v-spacer/>
            <v-btn to="/profil" :loading="loading" class="mr-2"
                  dark  :disabled="password == ''">
              Annuler
            </v-btn>

            <v-btn color="red" @click="deleteAccount" :loading="loading"
                  dark  :disabled="password == ''">
              <v-icon small>mdi-delete</v-icon> Effacer mon compte
            </v-btn>
          </v-toolbar>

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

//import router from '../../router/router'
import Footer from '@/components/main-layout/Footer.vue'
import Login from '@/components/main-layout/Login.vue'
import axios from 'axios'

export default {
  name: 'change-password',
  components: {
    Login, Footer
  },
  data: () => ({
    password: '',
    showpwd: false,
    errorDeleteAccount: '',
    loading: false,
    rules: {
      required: value => !!value || 'Champs obligatoire',
      min: v => v.length >= 8 || 'Min 8 caractères',
      minName: v => v.length >= 3 || 'Min 3 caractères',
    },
  }),
  methods: {
    async deleteAccount(){
        console.log("deleteAccount")
        this.errorDeleteAccount = ''
       
        this.loading = true 

        console.log("try to change password", this.name, this.email, this.password)
        axios.post('/user/delete-account', { password: this.password })
              .then((res)=>{
                this.loading = false 
                console.log("res /user/delete-account", res)
                if(res.data.error == false){
                  console.log("USER DELETED WITH SUCCES", res.data)
                  this.$store.dispatch('app/openSnackbar', 
                              { show: true, color:'green', 
                                title: "Votre compte a été supprimé",
                                text: '',
                                icon: 'thumb-up' })
                  this.$store.dispatch('auth/logout')
                }else{
                  this.errorDeleteAccount = res.data.errorMsg
                }    
              })

    }
  }
}
</script>
