<template>
  <div>
    <!-- TOP BAR -->
    <v-app-bar app :hide-on-scroll="false" elevation="0" color="background" id="top-bar">
        <v-app-bar-nav-icon color="secondary"
        @click.stop="$store.dispatch('app/setDrawerOpen', !$store.state.app.drawerOpen)" />

        <v-btn text elevation="0" icon to="/" title="Accueil">
          <v-img src="../../assets/img/krup_logo_small.png" width="20" class="ma-1"/>
        </v-btn>
        
        <v-btn text elevation="0" to="/"  title="Accueil"
                 class="font-main secondary--text main-logo-topbar px-1 mr-1 d-none d-sm-inline" 
                :class="$store.state.auth.isLogin ? '' : ''">
          {{ config.siteName }}
        </v-btn>
        <v-btn text elevation="0" to="/" style="min-width:unset;" title="Accueil"
                 class="font-main amber--text main-logo-topbar text--darken-3 px-1 mr-1 d-sm-none" 
                :class="$store.state.auth.isLogin ? '' : ''">
                <v-icon small>mdi-home</v-icon>
          {{ config.monyUnity }}
        </v-btn>

        <template v-if="showMenuComplete && !$store.state.auth.isLogin">
          <template v-for="(item) in itemsMenu">
            <v-btn :key="item.name" 
                    v-if="item.side == 'left'" 
                    :to="item.to" class="ml-1 d-none d-md-flex"
                    text rounded>
                    <v-icon small>{{ item.icon }}</v-icon>
                    {{ item.label }}
            </v-btn>
          </template>
        </template>

        <v-spacer/> 

        <template v-if="showMenuComplete && !$store.state.auth.isLogin">
            <template v-for="(item) in itemsMenu">
              <v-btn  :key="item.label" v-if="item.side == 'right'" 
                      :to="item.to" text class="mr-2">
                      <!-- <v-icon small>{{ item.icon }}</v-icon> -->
                      {{ item.label }}
              </v-btn>
          </template>
        </template>

        <!-- Total : {{ (convertUnityMony($store.getters['auth/totalDepositMony'] * monyToEuro())).toFixed(2) }} €
        ~{{ ($store.getters['auth/amountCurrent'] * monyToEuro()).toFixed(2) }} € -->
        <v-btn v-if="$store.state.auth.isLogin" 
              @click="$store.dispatch('app/setLiveMenuOpen', true)"
              small class="mr-3" elevation="0" icon fab 
              :outlined="$store.getters['auth/privateMsgNotRead'] > 0"
              :color="$store.getters['auth/privateMsgNotRead'] > 0 ? 'blue' : 'blue'">
          <v-badge color="blue" :content="$store.getters['auth/privateMsgNotRead']" :value="$store.getters['auth/privateMsgNotRead']">
            <v-icon>mdi-comment</v-icon>
          </v-badge>
        </v-btn>


        <template v-if ="!$store.state.auth.isLogin && enableRegisterUser">
          <!-- <v-btn class="mr-2" text to="/register">
              <v-icon>mdi-account-plus</v-icon> S'inscrire
          </v-btn> -->
          <v-btn class="mr-0 d-md-none" icon to="/login">
              <v-icon>mdi-login</v-icon>
          </v-btn>
          <v-btn class="mr-0 d-none d-md-flex" text to="/login">
              <v-icon>mdi-login</v-icon><span> Se connecter</span>
          </v-btn>
        </template>

        <!-- <v-toolbar-title class="mr-5 font-righteous">PIX-LR</v-toolbar-title> -->
        <localized-link  to="/admin" class="d-none d-md-inline">
        <v-btn v-if="$store.state.auth.isLogin && $store.getters['auth/isAdmin']" 
               icon class="mr-1" small
               color="secondary lighten-1">
          <v-icon small>mdi-account-cowboy-hat</v-icon>
        </v-btn>
        </localized-link>


        <v-menu v-if="$store.state.auth.isLogin" open-on-hover  
              offset-y right :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-if="$store.state.auth.isLogin" rounded small text
                    class="d-none d-sm-inline-flex mr-2 pl-1" v-on="on" v-bind="attrs">
              <v-gravatar height="22" style="border-radius:50%;"
                          :default-img="'retro'" :email="$store.state.auth.user.name"/>
              <span class="ml-1">{{ $store.state.auth.user.name }}</span>
            </v-btn>
            <v-btn v-if="$store.state.auth.isLogin" rounded small icon class="d-sm-none mr-2" v-on="on" v-bind="attrs">
              <v-gravatar height="28" style="border-radius:50%;"
                          :default-img="'retro'" :email="$store.state.auth.user.name"/>
            </v-btn>
          </template>

          <v-list dense>
              <v-list-item to="/profil">
                <v-gravatar height="22" style="border-radius:50%; margin-left:-3px;"
                            :default-img="'retro'" :email="$store.state.auth.user.name"/>
                <span class="ml-1">Mon profil - <b>{{ $store.state.auth.user.name }}</b></span>
              </v-list-item>
              <v-divider/>
              <!-- <v-list-item icon to="/market" class="">
                  <v-icon class="mr-2" small>mdi-magnify</v-icon> Rechercher
              </v-list-item>
              <v-list-item icon to="/wallet" class="">
                  <v-icon class="mr-2" small>mdi-wallet</v-icon> Mes comptes
              </v-list-item>
              <v-list-item icon to="/publish-offer" class="">
                  <v-icon class="mr-2" small>mdi-plus</v-icon> Publier une annonce
              </v-list-item>
              <v-list-item icon to="/propositions/buyer" class="">
                  <v-icon class="mr-2" small>mdi-chevron-double-right</v-icon> Propositions envoyées
              </v-list-item>
              <v-list-item icon to="/propositions/seller" class="">
                  <v-icon class="mr-2" small>mdi-chevron-double-left</v-icon> Propositions reçues
              </v-list-item>
              <v-divider/> -->
              <v-list-item icon @click="logout" class="">
                  <v-icon class="mr-2" small>mdi-logout</v-icon> Déconnexion
              </v-list-item>
          </v-list>
        </v-menu>



        <v-menu offset-y v-if="false">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-on="on" v-bind="attrs"
              elevation="0" height="32px" 
              class="mx-1 pa-3 rounded-lg font-weight-bold d-none d-md-flex"
            >
              <img class="mr-2" :src="currentLanguage.flagUrl" height="20px" /> 
              <!-- <span style="text-transform:uppercase;font-weight:700;">
                {{ currentLanguage.code }}
              </span> -->
              <v-icon small class="ml-">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list dense>

            <language-switcher v-slot="{ links }">
              <v-list-item :to="link.url" v-for="link in links" @click="changeLocale()" :key="link.langIndex">
                <img :src="require(`@/assets/flag/${link.langIndex}.png`)" alt="" class="mr-3" height="20px"/>
                <span>{{ link.langName }}</span>
              </v-list-item>
            </language-switcher>

          </v-list>
        </v-menu>


    <template 
      v-slot:extension
      elevation="0"
      v-if="showMenuExt"
    >
      <v-tabs 
        class="tab-wallets" elevation="0" centered
        color="secondary"
        :show-arrows="$route.path.indexOf('market') == -1"
        hide-slider
        align-with-title
        center-active 
      >


      </v-tabs>
    </template>


    </v-app-bar>
  </div>
</template>

<style>
#top-bar{
  border-bottom:1px solid #8e8e8e42 !important;
}
#top-bar .v-toolbar__extension{
  border-top:1px solid #8e8e8e42 !important;
}
.main-logo-topbar .v-btn__content{
  font-size: 27px!important;
  font-weight:800!important;
  margin-top:-3px;
}
.text-search-offer {
    max-width: 56.5% !important;
    /* padding-left: 33.5% !important; */
    margin-top: 5px !important;
    margin-bottom: 4px !important;
    margin-left: 6px !important;
    margin-right: 6px !important;
}
@media (max-width: 1275px) {
  .text-search-offer {    
      /* max-width: 90% !important;
      padding-left: 34% !important; */
      margin-top: 5px !important;
      margin-bottom: 4px !important;
  }
}
@media (max-width: 960px) {
  .text-search-offer {
      max-width: 96%!important;
      padding: 0 !important;
      margin-top: 5px !important;
      margin-bottom: 4px !important;
  }
  .main-logo-topbar .v-btn__content{
    font-size: 18px !important;
    padding-bottom: 3px;
    margin-top:0px;
  }
}
</style>

<script>

import core from '../../plugins/core.js'
import router from '../../router/router'
import Gravatar from 'vue-gravatar'

const config = require('../../config/' + process.env.NODE_ENV)

export default {
  name: 'top-bar',
  components: {
    'v-gravatar' : Gravatar,
  },
  props: [ 'showMenuComplete' ],
  data: () => ({
    itemsMenu: [
      //{ side: 'left',  label: 'Concept',          to: '/concept',     icon: 'mdi-lightbulb'     },
      //{ side: 'left',  label: 'Mony',             to: '/mony',        icon: 'mdi-wallet'        },
      //{ side: 'left',  label: 'FAQ',              to: '/faq',         icon: 'mdi-cloud-question' },

      //{ name: 'Admin',        side: 'right', label: 'Admin',     to: '/admin',   icon: 'mdi-account-cowboy-hat' },
    ],
    languages : [
      { label: "Fr", value: "fr" },
      { label: "En", value: "en" },
      { label: "Es", value: "es" },
    ],
    currentLang: 'fr',
    searchOfferTxt: "",
    menuExtRoutAllowed: ["market", "wallet"]
  }),
  
  mounted: function(){
    this.$vuetify.lang.current = 'fr'
  },
  
  methods: {
    logout(){
      this.$store.dispatch('auth/logout')
    },
    onClickLogo(){ 
      if(this.$store.state.auth.isLogin) router.push('/market') 
      else router.push('/') 
    },
    changeLocale () {
      // if(lang!=null) this.local = lang
      // this.$vuetify.lang.current = this.local
      // localStorage.setItem("lang", this.local)

      this.$root.$emit('langChanged')
      
    },
    convertUnityMony(amountUnity){
      return core.convertUnityMony(amountUnity, this.$store.state.auth.monyConvertValue)
    },
    convertMonyUnity(amountMony){
      return core.convertMonyUnity(amountMony, this.$store.state.auth.monyConvertValue)
    },
    monyToEuro(){
      return config.monyToEuro
    }
  },
  computed:{
    enableRegisterUser() { return config.enableRegisterUser },
    currentLanguage() {
      return {
        code: this.$i18n.locale,
        flagUrl: require(`../../assets/flag/${this.$i18n.locale}.png`)
      }
    },
    nbNotifSeller(){
      if(this.$store.state.auth.isLogin == false) return
      let listAll = this.$store.getters['auth/myPropositionsReceived']
      console.log("nbNotifSeller", listAll.length)
      return listAll.length
    },
    nbNotifBuyer(){
      if(this.$store.state.auth.isLogin == false) return
      let listAll = this.$store.getters['auth/myPropositionsSent']
      return listAll.length
      
    },
    showMenuExt(){
      let show = false 
      this.menuExtRoutAllowed.forEach((route)=>{
        if(this.$route.path.indexOf(route) > -1) show = true
      })
      return show
    },
    config(){ return config }
  },
  
  watch: {
    
      
      '$store.state.market.requestParams.search': { immediate: true, 
          async handler (){ 
            //if(this.$store.state.market.requestParams.search == null) 
              this.searchOfferTxt = this.$store.state.market.requestParams.search
          }
      },
      'searchOfferTxt': { immediate: true, 
          async handler (){ 
            if(this.searchOfferTxt == null) this.searchOfferTxt = ""
          }
      },
  }, 
  
};
</script>
