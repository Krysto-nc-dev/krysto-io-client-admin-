<template>
<div>
    <v-card elevation="0" outlined style="border:2px solid #5c6bc0;">

      <v-col cols="12">
        <v-card-title><v-icon class="mr-2">mdi-login</v-icon> Se connecter</v-card-title> 
        <!-- <v-card-subtitle></v-card-subtitle> -->
        <v-form @submit.prevent="login">

          <v-text-field outlined v-model="email" id="email" label="E-mail"></v-text-field>
          <v-text-field outlined v-model="password" id="password" label="Mot de passe"
                        :append-icon="showpwd ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showpwd ? 'text' : 'password'"
                        @click:append="showpwd = !showpwd"
          ></v-text-field>
          <v-alert v-if="$store.state.auth.login.error != null" 
                   dense dark color="red" class="mt-3 text-center">
                   <v-icon small>mdi-alert</v-icon>
            {{ errorMsg[$store.state.auth.login.error] }}
          </v-alert>

          <v-btn class="white--text" color="secondary" @click="login" block>
            <v-icon>mdi-login</v-icon> Se connecter
          </v-btn>

        </v-form>
      </v-col>

    </v-card>

    <br>
    <v-col cols="12" class="text-center">
      <v-btn to="/reset-password" style="text-transform:none;" text  class="mb-3" >
        Mot de passe oublié ?
      </v-btn>
      <v-divider class="mb-3"/>
      Vous n'êtes pas encore inscrit ?<br>
      <v-btn class="mt-3" outlined color="secondary" to="/register">
        <v-icon>mdi-account-plus</v-icon> Inscrivez-vous
      </v-btn>
    </v-col>

</div>
</template>

<script>

//import router from '../router/router'

export default {
  name: 'Login',
  components: {
  },
  data: () => ({
    email: '',
    password: '',
    resColor: '',
    resMsg: '',
    showpwd: false,
    errorMsg: {
      "PWD_FAILED"        : "Mot de passe incorrect",
      "EMAIL_NOT_FOUND"   : "Adresse e-mail inconnue",
      "EMAIL_NOT_CHECKED" : "Adresse e-mail non vérifiée. Veuillez consulter votre boîte mail, et cliquer sur le lien de validation que nous vous avons envoyé. Merci",
      "LOGIN_ERROR"       : "Compte introuvable"
    }
  }),
  methods: {
    async login(){
      try{
        console.log("login")
        await this.$store.dispatch('auth/login', {
          email: this.email,
          password: this.password
        })        
      } catch(err) {
          console.log('Cannot login user. Error:', err)       
      }

    }
  },
}
</script>
