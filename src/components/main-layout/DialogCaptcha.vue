<template>
  <v-dialog  :fullscreen="$vuetify.breakpoint.width < 600"
    v-model="$store.state.captcha.showDialog"
    max-width="500"
    >
    <v-card id="dialogCaptcha">
      <v-toolbar elevation="1">
        <v-icon small class="mr-1">mdi-lock</v-icon> <small>Captcha - Sécurité contre les robots</small>
        
        <v-icon small class="ml-2 mx-1" color="red">mdi-robot-off-outline</v-icon> 
        <v-icon small class="mx-1" color="green">mdi-emoticon-excited-outline</v-icon> 
        <v-spacer/>
        <v-btn @click="$store.dispatch('captcha/setShowDialog', false)" 
                outlined icon small class="mr-0">
                <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <template v-if="$store.state.captcha.locked == false">

        <v-col cols="12" class="text-center pb-0" style="position:absolute; top:60px;">
          <v-card  class="mb-1 red--text" elevation="0" color="transparent">
            <small style="line-height:10px;">
            Merci de prouver que vous êtes bien un être humain,<br> en répondant à cette petite question :
            </small>
            </v-card>
          <small><b>Combien de cubes tournent sur eux-mêmes ?</b></small><br>
          <v-chip small class="mx-2 mt-1"  dark color="green">Succès : <b class="pl-1">{{ $store.state.captcha.nbSuccess }}/3</b></v-chip>
          <v-chip small class="mx-2 mt-1"  dark color="red">Échecs : <b class="pl-1">{{ $store.state.captcha.nbEchec }}/3</b></v-chip>
        </v-col>

        <v-col cols="12">
          <CaptchaScene :actionSuccess="actionSuccess"/>
        </v-col>

        <v-col cols="12" class="pa-5" style="position:absolute; bottom:0px;">
          <v-row>
          <v-col cols="12" class="pa-1 pt-0">
            <v-btn block elevation="0" text @click="$root.$emit('restartCaptcha')"  class="mb-1">
              <v-icon small class="mr-1">mdi-refresh</v-icon> 
              Nouveau captcha
            </v-btn>
            <v-btn @click="$root.$emit('tryAnswerCaptcha', 0)" class="btn-anwser-captcha"
                  block :outlined="!$vuetify.theme.dark" style="font-size:18px!important;" elevation="0">0</v-btn>
          </v-col>
          <template v-for="(number, n) in 0, 9">
            <v-col cols="4" :key="n" class="pa-1 pt-1">
              <v-btn  @click="$root.$emit('tryAnswerCaptcha', number)" class="btn-anwser-captcha" 
                      block :outlined="!$vuetify.theme.dark" style="font-size:18px!important;" elevation="0" >
                      {{ number }}
                </v-btn>
            </v-col>
          </template>
          </v-row>
        </v-col>

      </template>
      <template v-else>
        <v-col cols="12" class="pa-5 text-center">
          <v-icon x-large color="orange">mdi-lock</v-icon>
          <v-icon large class="ml-2 mx-1" color="red">mdi-robot-off-outline</v-icon> <br>
          Désolé, vous vous êtes trompé 3 fois.<br>
          Ça fait beaucoup pour un humain !<br><br>
          <v-divider/>
          <p class="text-left">
          <br>
          <i>La probabilité pour que vous soyez un robot ou un humanoide génétiquement modifié est de 87,89%
          selon notre méthode de calcul simplifiée de la probabilité captchatique.</i>
          <br><br>
          Pour des raisons de sécurité, et pour éviter de recevoir des spams, nous ne pouvons donner suite à votre requête.
          <br><br>

          <v-divider/><br>
          <small>
            <b>Traduction pour robot</b> : 
            001011 011010 11001110 011010 0110010 01 01 100011100 01100111100 10011010 0110 
            00001 10100110 01 01 1000 11100 0111010 000011 00111 100 1010101110 00111.<br><br>
            00 0011010 0110 01 01 100011100 01100111100 10011010 0000110100110 01 01 100011100 01100111100 1010101110 00111.<br>
          </small>
          </p>
        </v-col>
      </template>

    </v-card>
  </v-dialog>
</template>

<script>
import CaptchaScene from '@/components/main-layout/captcha/CaptchaScene.vue'

export default {
  name: 'ThreeTest',
  components: { CaptchaScene },
  props: ['actionSuccess', 'actionEchec'],
  data() {
    return {
      
    }
  },
  methods: {

  }
}
</script>
