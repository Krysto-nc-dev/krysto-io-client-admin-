<template> 
  <v-card v-if="offer != null" elevation="0" >

    <!-- TOOLBAR -->
    <v-toolbar color="" elevation="0" >
      <small class="d-none d-md-inline mr-2">
        <!-- <v-icon x-small color="grey" class="pl-2 py-0">mdi-map-marker</v-icon> 2 km | -->
        <span class="d-none d-sm-inline">
        Publié par <b>{{ offer.creator.name }}</b>
        </span>
        à 
        <b class="pr-2">{{ offer.city }}</b>
        <time-ago :datetime="offer.updated" :refresh="60" long 
                  :locale="$vuetify.lang.current">
        </time-ago>
      </small>
      
      <v-btn small class=""  color=""  elevation="0" 
            v-if="inDialog" :to="'/offer/' + offer._id">
        <v-icon x-small color="" class="pr-1">mdi-link</v-icon> <small>Lien de l'annonce</small>
      </v-btn>
      <v-spacer/>

      <v-btn small outlined fab class="ml-2"
             @click="$root.$emit('closeDialogOffer')" v-if="inDialog">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- CARD -->
    <v-card elevation="0" style="border-radius:0px;">
      <v-row class="mx-0 my-0">
        <v-col cols="12" sm="12" class="pt-2 pb-2 pl-4">

          <v-btn  small color="blue lighten-1" class="mr-2 mt-2" outlined 
                  :disabled="!$store.state.auth.isLogin || !$store.state.auth.user.isActive || $store.state.auth.user._id == offer.creator._id || !$store.state.auth.user.planPaid || !$store.getters['auth/accountReady']"
                  :to="'/private/'+offer.creator._id + '/' + offer._id"
                  @click="$root.$emit('closeDialogOffer')">
            <v-icon small color="" class="pr-1">mdi-comment-account-outline</v-icon>
            Contacter le vendeur
          </v-btn>
      
          <div class="d-inline-block">
            <DialogProposition :offer="offer" :inDialog="inDialog"></DialogProposition>
          </div>
        </v-col>
        
        <v-col cols="12" sm="12" md="5" class="pa-4 pb-0 pb-md-4" 
                v-if="offer.gallery != null && offer.gallery[0] != null">
          <v-carousel :height="300" class="mb-3" style="border-radius:4px !important;"
                      hide-delimiter-background show-arrows-on-hover>
            <v-carousel-item v-for="(image,i) in offer.gallery" :key="i">
              <v-img :src="baseUrl() + image" :height="300"></v-img>
            </v-carousel-item>
          </v-carousel>
        </v-col>

        <v-col cols="12" sm="12" md="6" class="pt-0 pt-md-4">
          
          <small class="d-md-none">
            <!-- <v-icon x-small color="grey" class="pl-2 py-0">mdi-map-marker</v-icon> 2 km |  -->
            <span class="">
            Publié par <b>{{ offer.creator.name }}</b>
            </span>
            à 
            <b class="pr-2">{{ offer.city }}</b> 
            
            <time-ago :datetime="offer.updated" :refresh="60" long 
                      :locale="$vuetify.lang.current">
            </time-ago>
          </small>

          <div style="font-weight:700" class="mt-4 secondary--text">
            <b>{{ offer.amountMony.toFixed(2) }} </b><small>oto</small>
            <small class="grey--text ml-2" style="font-weight:300;">
              <small><i>~ {{ monyToEuro(offer.amountMony.toFixed(2)) }}€</i></small>
            </small>
          </div>
          <v-card-title class="font-main px-0 pb-0 pt-0">{{ offer.title }}</v-card-title>
          
          <v-card-text class="px-0 pt-0 pb-0 mb-4 card-text-offer" 
                        v-html="nl2br(offer.text)"></v-card-text>

          <b class="green--text" v-if="offer.propositions.length > 0">
            {{ offer.propositions.length }} 
            offre<template v-if="offer.propositions.length>1">s</template> 
            reçue<template v-if="offer.propositions.length>1">s</template>
          </b>
          <b class="green--text" v-else>aucune offre</b>
          
          <br><br>

          <v-btn color="primary" @click="openMap()" elevation="0">
            <v-icon small class="pr-1">mdi-map-marker</v-icon>
            Afficher sur la carte
          </v-btn>

          <div class="flex orange--text mt-3" v-if="!$store.state.auth.isLogin">
          <v-btn  outlined to="/login" class="orange--text">
            <v-icon small>mdi-login</v-icon> Se connecter
          </v-btn><br>
            Connectez-vous pour répondre à cette annonce.
          </div>
          <br><br>
          
          
          <template v-if="$store.state.auth.isLogin && offer.creator._id == $store.state.auth.user._id">
            <v-divider class="my-5"/>
            <v-btn small class=" mr-2" color="orange"
                  text elevation="0" :to="'/edit-offer/' + offer._id">
              <v-icon x-small color="orange" class="pr-1">mdi-pencil</v-icon> Modifier mon annonce
            </v-btn>
          </template>
          <template v-if="$store.state.auth.isLogin">
            <v-divider class="my-5"/>
            <v-btn small class=" mr-2" color="orange" style="font-weight:300 !important;"
                  text elevation="0" :to="'/report-offer/' + offer._id">
              <v-icon x-small color="orange" class="pr-1">mdi-shield-alert-outline</v-icon> Signaler cette annonce
            </v-btn>
          </template>
        </v-col>

        <v-col cols="12" class="pa-0" v-show="showMap">
          <v-card  elevation="0" class="pa-5" style="border-radius:0px;">
            <l-map 
              ref="map"  
              :options="{scrollWheelZoom:false}"
              :zoom="zoom"  
              :maxZoom="11"
              :minZoom="7"
              :center="offer.coordinates"  
              id="map-container"
              style="width:100%;height:400px;" 
            >
              <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
              <l-marker color="red" :icon="marker"
                        :lat-lng="offer.coordinates"
                        ref="markerToOpenPopup">
              </l-marker>
            </l-map>
          </v-card>
        </v-col>

      </v-row>

    </v-card>


  </v-card>
</template>

<style>
  @import "~leaflet/dist/leaflet.css";
</style>


<script>

import axios from "axios"

// import { i18n } from 'vue-lang-router';
import core from '../../plugins/core.js'
const config = require('../../config/' + process.env.NODE_ENV)

import L from 'leaflet';
import {LMap, LTileLayer, LMarker, LPopup} from 'vue2-leaflet'
import DialogProposition from '@/components/offer/DialogProposition.vue'
import {TimeAgo} from "vue2-timeago"

export default {
  name: 'home',
  props: ['offer', 'inDialog'],
  components: {
    LMap, LTileLayer, LMarker, LPopup, DialogProposition, TimeAgo
  },
  data: () => ({
    showDialogProposal: false,

    zoom:9,
    mapCenter: L.latLng(47.413220, -1.219482),
    url : config.mapTilesUrl,
    attribution:'', //&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    popupContent: "ok",

    amountProposal: 0,

    showMap: false,

    message: ""
  }),
  mounted: async function(){
    this.amountProposal = this.offer.amountMony
    setTimeout(()=>{
        if(this.$refs.map.mapObject != null)
        this.$refs.map.mapObject.invalidateSize()
    }, 100)
  },
  methods: {
    async sendProposition(){
      let params = { offerId: this.offer._id,
                     amount: this.amountProposal,
                     msgTxt: this.message
                   }
      await axios.post('/market/send-proposition', params)
      // if(res.data.error === true){
      // }else{
      // }
    },
    monyToEuro(amount){ return amount * config.monyToEuro },
    nl2br: function(str, is_xhtml){
      var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'
      let newStr = (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
      //let maxLength = 150
      // let p = newStr.length > maxLength ? '...' : ''
      // newStr = newStr.substr(0, maxLength) + p
      return newStr
    },
    baseUrl(){ return core.baseUrl() },
    openMap(){
      this.showMap = !this.showMap
      setTimeout(()=>{
        this.$refs.map.mapObject.invalidateSize()
    }, 100)
    }
  },
  computed: {
    marker(){ 
      let color = "orange"
      return L.icon({
        iconUrl: '/marker/marker-'+color+'.png',
        shadowUrl: '/marker/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    },
  },
  watch: {
  }, 
}
</script>
