<template>
  <div v-if="offer != null" class="offer-card">
    <v-card elevation="0" class="mb-5 offer-card-main-ctn">
      <v-row class="mx-0 my-0">
        <v-col :cols="staticInline ? 4 : 12" sm="4" md="5" class="pa-0 text-center">

          <v-carousel v-if="offer.gallery != null && offer.gallery[0] != null" :height="180" 
                      hide-delimiter-background show-arrows-on-hover>
            <v-carousel-item v-for="(image,i) in offer.gallery" :key="i">
            <v-img class="col-offer-clickable"
                   :src="baseUrl() + image" :height="180" 
                   @click="showDialogOffer()"></v-img>
            </v-carousel-item>
          </v-carousel>

          <v-card v-else outlined :height="140" class="ma-2" @click="showDialogOffer()">
            <v-icon x-large color="grey" style="margin-top:50px;">mdi-image-off-outline</v-icon>
          </v-card>
        </v-col>

        <v-col :cols="staticInline ? 8 : 12" sm="8" md="7" class="pt-0 col-offer-clickable" @click="showDialogOffer()">

          <div style="font-weight:700" class="mt-2 secondary--text">
            <b>{{ offer.amountMony.toFixed(2) }} </b><small>oto</small>
            <span class="grey--text ml-2" style="font-weight:300;">
              <small><i>~ {{ monyToEuro(offer.amountMony.toFixed(2)) }}€</i></small>
            </span>
          </div>
          <v-card-title class="font-main px-0 pb-0 pt-0">{{ offer.title }}</v-card-title>
          
          <v-card-text class="px-0 pt-0 pb-0 card-text-offer" 
                        v-html="nl2br(offer.text)"></v-card-text>

          <small class="green--text" v-if="offer.propositions.length > 0">
            {{ offer.propositions.length }} 
            offre<template v-if="offer.propositions.length>1">s</template> 
            reçue<template v-if="offer.propositions.length>1">s</template>
          </small>
          <small class="green--text" v-else>aucune offre</small>

        </v-col>
      </v-row>

      <v-toolbar color="" elevation="0" dense height="36">
          
        <small>
          <v-icon x-small color="grey" class="pl-2 py-0">mdi-map-marker</v-icon> 
          <span class="d-none d-sm-inline">
          | Publié par 
          </span>
          <b>{{ offer.creator.name }}</b>
          à 
          <b class="pr-2">{{ offer.city }}</b> 
          <time-ago :datetime="offer.updated" :refresh="60" long 
                    :locale="$vuetify.lang.current">
          </time-ago>
        </small>
        <v-spacer/>
        <v-btn small text color="primary" elevation="0" @click="showDialogOffer()">
          Lire l'annonce
        </v-btn>
      </v-toolbar>
    </v-card>
  </div>
</template>

<style>
  .card-text-offer{
    line-height: 1.5;
    font-size:15px;
  }
  .offer-card .v-toolbar__content{
    padding-left:0px !important;
    padding-right:5px !important;
  }
  .offer-card .v-toolbar__content .v-btn{
    font-weight:300!important;
  }
  .col-offer-clickable{
    cursor:pointer;
  }
  .offer-card-main-ctn{
    border: transparent 1px solid;
  }
  .offer-card-main-ctn:hover{
    border: #dbdbdb 1px solid;
    background: #f8f8f8;
  }
  .theme--dark .offer-card-main-ctn:hover{
    border: #222222 1px solid;
    background: #222222;
  }
</style>

<script>

// import axios from "axios"
// import Rules from '@/components/home/Rules.vue'

// import { i18n } from 'vue-lang-router';
import core from '../../plugins/core.js'
import {TimeAgo} from "vue2-timeago"

const config = require('../../config/' + process.env.NODE_ENV)

export default {
  name: 'home',
  components: {
    TimeAgo
  },
  props: [ 'offer', 'staticInline' ],
  data: () => ({
  }),
  mounted: async function(){
    
  },
  methods: {
    nl2br: function(str, is_xhtml){
      var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'
      let newStr = (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
      let maxLength = 150
      let p = newStr.length > maxLength ? '...' : ''
      newStr = newStr.substr(0, maxLength) + p
      return newStr
    },
    monyToEuro(amount){ return amount * config.monyToEuro },
    baseUrl(){ return core.baseUrl() },
    showDialogOffer() { 
      this.$root.$emit("openDialogOffer", this.offer)
     }
  },
  computed: {
  },
}
</script>
