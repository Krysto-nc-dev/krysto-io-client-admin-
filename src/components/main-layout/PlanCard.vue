<template>
<v-card elevation="0" outlined class="text-center"
        v-if="plan.type != 'free' || ($store.state.app.nbUsersTotal < $store.state.app.limitForFreePlan)">
  <v-col>
    <v-card-title :class="plan.color+'--text'" class="font-large bold text--darken-2">
      <template v-if="plan.type == 'free'">Gratuit !</template>
      <template v-else>
        {{ plan.amount }}€ / 
        <template v-if="plan.type == 'month'">mois</template>
        <template v-if="plan.type == 'year'">an</template>
      </template>
    </v-card-title>
    <v-card-subtitle :class="plan.color+'--text'" class="bold text--darken-2 pb-2">Abonnement {{ plan.name }}</v-card-subtitle>

    <v-alert color="amber" dense outlined v-if="plan.type == 'free'"
            class=" amber--text text--darken-2 mt-2">
            {{ $store.state.app.limitForFreePlan - $store.state.app.nbUsersTotal }} comptes gratuits 
            <div class="d-inline-block">sont encore disponibles</div>
    </v-alert>

    <v-card-text :class="plan.type != 'free' ? 'mt-5' : ''"
                  class="d-none d-md-inline"
                  v-html="nl2br(plan.description)"/>

    <v-card-text>
      <v-icon small :color="plan.color + ' darken-2'">mdi-check</v-icon>
      <b :class="plan.color+'--text'" class="text--darken-2">Accès illimité à tous les services Òtomony.</b>
    </v-card-text>

    <v-alert :color="plan.color + ' lighten-1'" dense outlined v-if="plan.type != 'free'"
             class="text-left mx-auto mb-5" style="width:80%;">
      <v-icon small :color="plan.color + ' lighten-1'">mdi-check</v-icon> Gérer votre compte courant<br>
      <v-icon small :color="plan.color + ' lighten-1'">mdi-check</v-icon> Gérer votre compte de dépôts<br>
      <v-icon small :color="plan.color + ' lighten-1'">mdi-check</v-icon> Publier des annonces<br>
      <v-icon small :color="plan.color + ' lighten-1'">mdi-check</v-icon> Répondre aux annonces<br>
      <v-icon small :color="plan.color + ' lighten-1'">mdi-check</v-icon> Payer en òto<br>
      <v-icon small :color="plan.color + ' lighten-1'">mdi-check</v-icon> Echanger des òto<br>
    </v-alert>
    
    <v-btn block :color="plan.color + ' darken-2'" v-if="selected != true"
           elevation="0" :to="'/register/'+plan.key" class="white--text"
           :disabled="!planAvailable">
      <template v-if="plan.type =='free'">Créer mon compte gratuit</template>
      <template v-else>Choisir cette formule</template>
    </v-btn>
  </v-col>
</v-card>
</template>

<style></style>

<script>

//import axios from 'axios'
//import router from '../router/router'
//import core from '../plugins/core.js'

//import Post from '@/components/Post.vue'

export default {
  name: 'empty',
  props: [ 'plan' , 'selected' ],
  components: {  },
  data: () => ({
  }),
  async mounted(){
    console.log("A PLAN !", this.$store.state.app.data.instance)
  },
  methods: {
    

    nl2br: function(str, is_xhtml){
      var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'
      let newStr = (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
      return newStr
    },
  },
  computed: {
    planAvailable: function(){
      let nbLimit = this.$store.state.app.limitForFreePlan - this.$store.state.app.nbUsersTotal
      let res = (this.plan.type == "free" && (nbLimit > 0)) || this.plan.type != "free" && (nbLimit < 0)
      console.log("planAvailable?", this.plan.name, res)
      return res
    }
    
  }
}
</script>
