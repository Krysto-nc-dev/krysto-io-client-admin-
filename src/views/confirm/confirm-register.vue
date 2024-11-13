<template>
  <v-col cols="12" sm="8" md="6" lg="4" class="mx-auto text-center font-main">
    <v-card elevation="0" outlined class="mt-5">
      <v-col class="text-center" cols="12">
        
        <v-card-title class="green--text">
          <v-icon x-large style="border:1px solid #4CAF50; border-radius:100%; padding:14px;" color="green">mdi-check</v-icon>
          <br>Nouveau compte créé
        </v-card-title>

        <v-divider/>

        <v-card-subtitle class="orange--text">
          <v-icon color="orange">mdi-at</v-icon> e-mail : 
          en attente de validation
        </v-card-subtitle>

        <v-row>
          <v-col cols="12" class="mx-auto">
            <v-card-text class="font-flower text-left">
              Merci de procéder à la <b>vérification de votre adresse e-mail</b>, en cliquant sur le lien de validation que vous avez reçu par e-mail.
              <br><br>
              Vous pourrez vous connecter à votre compte dès que votre adresse sera vérifiée.<br>
            </v-card-text>
          </v-col>
        </v-row>
       

        <br>

        <v-divider/>

        <br>
        <v-toolbar color="transparent" elevation="0">
          <v-spacer/>
          <v-btn class="my-2 mx-auto"
                 large color="blue" dark to="/login">
            <b>Se connecter</b>
            <v-icon class="ml-1">mdi-login</v-icon> 
          </v-btn>
        </v-toolbar>

      </v-col>
    </v-card>
  </v-col>
</template>

<script>

export default {
  name: "confirm-email",
  components: {
    
  },
  data: function () {
      return {
        user: null,
        loading: true
      };
  },
  mounted: async function(){
    //this.$store.dispatch('app/fetchNbUsersTotal')
    //await this.confirmEmail()
  },
  methods: {

  },
  computed:{
    
  }
};
</script>
