<template>
  <v-col cols="12" sm="11" md="9" lg="9" class="mx-auto ">
    <v-card elevation="0" color="transparent">
      <v-col class="text-center" cols="12" v-if="offer != null && reportSuccess == false">
        
        <v-card-title class="red--text font-main">
          <v-icon x-large style="border:1px solid #F44336; border-radius:100%; padding:14px;" color="red">
            mdi-shield-alert-outline
          </v-icon>
          <br>Signaler une annonce
        </v-card-title>

        <v-divider/>

        <br>

        <v-row>
          <v-col cols="12" md="5" lg="4" class="text-left">
            <OfferCard :offer="offer"></OfferCard>
          </v-col>
          <v-col cols="12" md="7" lg="6">
            <v-card-text class="text-left">
              Les annonces qui ne respectent pas les 
              <router-link to="/cgu">conditions d'utilisations</router-link>
              de la plateforme peuvent être signalées aux modérateurs afin d'être bloquées.
              <br><br>
              Nous surveillons quotidiennement le contenu des annonces publiées, mais vos signalements peuvent nous aider à repérer des annonces qui auraient échappées.
              <br><br>
              <b><u>Motif du signalement</u>* :</b>
              <br>

              <v-radio-group v-model="flag">
                <v-radio v-for="(flag, f) in radioFlags"  :key="f" 
                        :label="flag.label" :value="flag.flag"
                ></v-radio>
              </v-radio-group>

              <v-textarea outlined label="Décrire votre signalement..." 
                          placeholder="Décrire votre signalement..." 
                          v-model="text">
              </v-textarea>

              <b>Souhaitez-vous vraiment signaler cette annonce <span class="d-inline-block">aux modérateurs ?</span></b>
              <br>
              Tout signalement abusif peut aussi faire l'objet de sanction à votre encontre.
            </v-card-text>
          </v-col>
        </v-row>
       
        <br>

        <v-divider/>

        <br>

        <v-toolbar color="transparent" elevation="0">
          <v-spacer/>
          <v-btn class="my-2 mr-2 mx-auto" elevation="0"
                 large @click="$router.back()">
            <b>Annuler</b>
          </v-btn>
          <v-btn class="my-2 mx-auto" elevation="0" :loading="loading" :disabled="flag==null" :dark="flag!=null"
                 large color="red"  @click="reportOffer">
            <b>Oui, signaler cette annonce</b>
            <v-icon class="ml-1">mdi-shield-alert-outline</v-icon> 
          </v-btn>
        </v-toolbar>

      </v-col>
      <v-col cols="12" class="text-center" v-else-if="reportSuccess == false">
        <v-btn icon :loading="true"><v-icon large>mdi-refresh</v-icon></v-btn> 
        Chargement en cours
      </v-col>
      <v-col cols="12" md="10" lg="8" class="mx-auto text-center mt-5" v-else-if="reportSuccess">
        <v-card class="px-4">
          <v-card-title class="green--text font-main">
            <v-icon x-large style="border:1px solid #4CAF50; border-radius:100%; padding:14px;" color="green">
              mdi-check
            </v-icon>
            <br>Votre signalement a bien été enregistré
          </v-card-title>
          <br>
          Merci de votre participation !<br>Nous vérifierons le contenu de cette annonce dès que possible.
          <br>
          <br>
          <v-btn elevation="0" color="blue" dark to="/moderation">
            Retour aux annonces
            <v-icon class="ml-1" small>mdi-arrow-right-circle</v-icon>
          </v-btn>
          <br>
          <br>
        </v-card>
      </v-col>
    </v-card>
  </v-col>
</template>

<script>
import axios from "axios"
import router from '../../router/router'
import OfferCard from '@/components/offer/OfferCardSM.vue'

export default {
  name: "confirm-email",
  components: {
    OfferCard
  },
  data: function () {
      return {
        offer: null,
        loading: false,
        reportSuccess: false,
        flag: null,
        text: '',
        radioFlags: [{ flag: "ILLEGAL", label: "Contenu illégal (drogue, arme, contre-façon, etc)" }, 
                     { flag: "VIOLENT", label: "Contenu violent ou pornographique" }, 
                     { flag: "ARNAQUE", label: "Arnaque, escroquerie" },
                     { flag: "AUTRE",   label: "Autres..." },]
      };
  },
  mounted: async function(){
    await this.$store.dispatch('app/fetchEntities', { entityType: 'offer', 
                                                      query : { "_id": this.$route.params.offerId } })
    
    this.offer = this.$store.state.app.data.offer[0]
    if(this.offer == null) router.push("/market")
  },
  methods: {

      async reportOffer(){
        if(this.flag == null) return 

        let params = {
          flag: this.flag,
          text: this.text,
          offerId: this.offer._id
        }

        this.loading = true
        console.log('Send /report/send')
        axios.post('/report/send', params)
             .then((res)=>{ 
                //console.log(res.data)
                if(res.data.error == false){
                  this.reportSuccess = true
                }else{
                  console.log('Error after /report/send')
                  router.push("/market")
                }
                this.loading = false
             })

      },

  },
  computed:{
    
  }
};
</script>
