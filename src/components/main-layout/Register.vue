<template>
<div>
    <v-card elevation="0" outlined style="border:2px solid #5c6bc0;">
        
      <v-col cols="12">
        <v-card-title>
          <v-icon class="mr-2">mdi-account-plus</v-icon> 
          S'inscrire
        </v-card-title> 
        <v-card-subtitle></v-card-subtitle>

        <v-form @submit.prevent="register">

          <v-text-field outlined v-model="name" id="name" label="Nom d'utilisateur" 
                        :rules="[rules.required, rules.minName]" 
                        :error="errorRegister == 'USERNAME_EXISTS'"></v-text-field>

          <v-text-field outlined v-model="email" id="email" label="E-mail" 
                        :rules="[rules.required]"
                        :error="errorRegister == 'EMAIL_EXISTS'"></v-text-field>

          <v-text-field outlined v-model="password" id="password" label="Mot de passe" 
                        :append-icon="showpwd ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="showpwd ? 'text' : 'password'"
                        hint="Au moins 8 caractères"
                        counter
                        @click:append="showpwd = !showpwd"
          ></v-text-field>
          
          <v-alert v-if="errorRegister != false" 
                   dense dark color="red" class="mt-3 mb-0 text-center">
            <v-icon small>mdi-alert</v-icon>
            <template v-if="errorRegister == 'ACCOUNT_DELETED'">Cette adresse e-mail a déjà été utilisée</template>
            <template v-if="errorRegister == 'EMAIL_EXISTS'">Cette adresse e-mail est déjà utilisée</template>
            <template v-if="errorRegister == 'USERNAME_EXISTS'">Ce nom d'utilisateur est déjà utilisé</template>
            <template v-if="errorRegister == 'CAPTCHA_FAILED'">Captcha invalide</template>
          </v-alert>

        </v-form>
      </v-col>
          
      <v-card-actions>
        <v-spacer/>
          <v-btn class="white--text" :loading="$store.state.auth.register.loading" color="secondary" @click="showDialogCaptcha()" block>
            <v-icon>mdi-login</v-icon> Créer mon compte
          </v-btn>
      </v-card-actions>
    </v-card>


    <DialogCaptcha :actionSuccess="register"/>

</div>
</template>

<script>

import router from '../../router/router'
import axios from 'axios'

const config = require('../../config/' + process.env.NODE_ENV)

import DialogCaptcha from '@/components/main-layout/DialogCaptcha.vue'

export default {
  name: 'register',
  components: {
    DialogCaptcha
  },
  data: () => ({
    name: '',
    email: '',
    password: '',
    showpwd: false,
    errorRegister: false,
    rules: {
          required: value => !!value || 'Champs obligatoire',
          min: v => v.length >= 8 || 'Min 8 caractères',
          minName: v => v.length >= 3 || 'Min 3 caractères',
        },
  }),
  mounted: function(){
    //TOP
    console.log("config.enableRegisterAdmin", config, config.enableRegisterAdmin)
    if(config.enableRegisterUser == false) 
      router.push('/login')

    let planExist = false
    this.$store.state.app.data.plan.forEach(plan => {
      if(this.$route.params.planKey == plan.key) planExist = true
    })
    //si le plan indiqué dans l'url n'existe pas, et qu'il n'est pas vide : retourne sur l'acueil
    if(!planExist && this.$route.params.planKey != null) 
      router.push('/')
  },
  methods: {
    showDialogCaptcha(){
      //if(this.$refs.formContact.validate())
      this.$store.dispatch('captcha/setShowDialog', true)
    },
    async register(answerCaptcha){
      console.log("try to register", this.name, this.email, this.password)
      const res = await axios.post('/auth/register', 
                                    { name: this.name,
                                      email: this.email,
                                      password: this.password,
                                      planKey: 'premium',
                                      captcha: {
                                        answer: answerCaptcha,
                                        sessionid: this.$store.state.captcha.session.sessionid
                                      }
                                    })
      console.log("res /auth/register", res)
      if(res.data.error == false){
        console.log("USER SAVED WITH SUCCES", res.data)
        this.errorRegister = false
        this.$store.dispatch('app/openDialogMailDev', res.data.emailParams)
        router.push('/confirm-register');
      }else{
        this.errorRegister = res.data.msg
      }
    },
  }
}
</script>
