<template>
  <v-col cols="12" sm="11" md="8" lg="6" class="mx-auto text-center font-main">
    <v-card elevation="0" outlined>
      <v-col class="text-center" cols="12" v-if="user != null">
        
        <v-card-title class="green--text">
          <v-icon x-large style="border:1px solid #4CAF50; border-radius:100%; padding:14px;" color="green">mdi-check</v-icon>
          <br>E-mail validé
        </v-card-title>

        <v-divider/>

        <br>

        <v-row>
          <template v-if="user.planPaid == false">
            <v-col cols="12" md="6">
              <v-card-text class="font-flower text-left">
                Merci <b>{{ user.name }}</b>,
                votre adresse e-mail a bien été validée.
                <br><br>
                Pour activer totalement votre compte, et accéder à tous les services, merci de procéder au règlement de votre abonnement.
              </v-card-text>
            </v-col>
            <v-col cols="12" md="6">
              <PlanCard :plan="user.plan" :selected="true"></PlanCard>
            </v-col>
          </template>
          <template v-else>
            <v-col cols="12" class="px-0">
              <v-card-text class="font-flower text-left">
                Merci <b>{{ user.name }}</b>,
                votre adresse e-mail a bien été validée.
                <br><br>
                Votre compte courant a été créé. <br>
                Il sera mis en service dès demain matin (4h), lors de la prochaine mise à jour du système.<br>
                Vous pourrez alors accéder à tous les services Òtomony.
                <br><br>
                En attendant, vous pouvez vous connecter à votre compte, et faire vos premiers pas sur la plateforme !
                <br><br>
                Bienvenue parmi nous !
              </v-card-text>
            </v-col>
          </template>
        </v-row>
       

        <br>

        <v-divider/>

        <br>
        <v-toolbar color="transparent" elevation="0">
          <v-spacer/>
          <v-btn class="my-2 mx-auto" v-if="user.planPaid == true" 
                 large color="blue" dark to="/login">
            <b>Se connecter</b>
            <v-icon class="ml-1">mdi-login</v-icon> 
          </v-btn>
          <v-btn class="my-2 mx-auto" v-else 
                 large color="blue" dark to="/login">
            <v-icon class="mr-1">mdi-credit-card-fast-outline</v-icon> 
            <b>Payer mon abonnement</b>
          </v-btn>
        </v-toolbar>

      </v-col>
      <v-col cols="12" v-else>
        <v-btn icon :loading="loading" @click="confirmEmail"><v-icon large>mdi-refresh</v-icon></v-btn> 
        Chargement en cours
      </v-col>
    </v-card>
  </v-col>
</template>

<script>
import axios from "axios"
import router from '../../router/router'
import PlanCard from '@/components/main-layout/PlanCard.vue'

export default {
  name: "confirm-email",
  components: {
    PlanCard
  },
  data: function () {
      return {
        user: null,
        loading: true
      };
  },
  mounted: async function(){
    this.$store.dispatch('app/fetchNbUsersTotal')
    await this.confirmEmail()
  },
  methods: {

      async confirmEmail(){
        //if(user != null) return 
        this.loading = true
        console.log('Send /auth/confirm-email/' + this.$route.params.userId + '/' + this.$route.params.emailToken)
        axios.post('/auth/confirm-email/' + this.$route.params.userId + '/' + this.$route.params.emailToken)
             .then((res)=>{ 
                //console.log(res.data)
                if(res.data.error == false){
                  this.user = res.data.user
                }else{
                  console.log('Error after /auth/confirm-email/' + this.$route.params.userId + '/' + this.$route.params.emailToken)
                  this.user = res.data.user
                  router.push("/login")
                }
                this.loading = false
             })

      },

  },
  computed:{
    
  }
};
</script>
