<template>
  <v-app app id="inspire">
    
    <MainMenu :showMenuComplete="showMenuComplete"/>
    <TopBar :showMenuComplete="showMenuComplete"/>

    <v-navigation-drawer v-model="$store.state.app.liveMenuOpen" app temporary right>
      <LiveMenu></LiveMenu>
    </v-navigation-drawer>

    <v-main>
      <v-container class="pa-0" id="main-container" fluid>

        <router-view/>

      </v-container>
    </v-main>

    <Snackbar></Snackbar>
    <DialogMailDev></DialogMailDev>

  </v-app>
</template>

<script>

import LiveMenu from '@/components/main-layout/LiveMenu.vue'
import MainMenu from '@/components/main-layout/MainMenu.vue'
import TopBar from '@/components/main-layout/TopBar.vue'
import Snackbar from '@/components/main-layout/Snackbar.vue'
import DialogMailDev from '@/components/admin/DialogMailDev.vue'

import router from "@/router/router"
import io from 'socket.io-client';

const config = require('./config/' + process.env.NODE_ENV)

import '@/assets/css/font.css';
import '@/assets/css/app.css';

let socket = null

export default {
  name: 'App',
  
  components: {
    MainMenu, TopBar, Snackbar, LiveMenu, DialogMailDev
  },

  mounted: function(){
    this.$store.dispatch('app/initLang')
    //if(this.lastLang == '')
    let vueLang = localStorage.getItem("VueAppLanguage")
    if(vueLang == null) vueLang = 'fr' 
    localStorage.setItem("VueAppLanguage", vueLang)
    
    this.lastLang = vueLang ? vueLang : this.currentLangInRoute()
    setTimeout(()=>{
      if(router.currentRoute.fullPath == "/")
        router.push('/'+this.$i18n.locale)
    }, 3000)
    
    if(this.$store.state.auth.user._id != null)
      this.socketIdUser = this.$store.state.auth.user._id
  },

  data: () => ({
    showMenuComplete: true, 
    lastLang: '',
    socketIdUser: null,
  }),

  methods: {
    currentLangInRoute : function(){
      //let l = router.currentRoute.path.substr(1,2)
      return router.currentRoute.path.substr(1,2)
    },
    initSocket : function(){

      if(socket != null){
        console.log("#WS INIT BEFORE UNLOAD")
        window.onbeforeunload = function(){
          console.log('emit LEAVE', this.socketIdUser)
          if(socket != null) 
            socket.emit('leave', { UID: this.socketIdUser })
        }

        socket.on('conf-connexion', (data) => {
          console.log("#WS connected to the socket server", data)
          if(this.socketIdUser != null){
            console.log("#WS join as", this.socketIdUser)
            socket.emit('join', { UID: this.socketIdUser })
          }
        })

        socket.on('count-connected', (data) => {
            console.log("#WS : nb connected", data)
            this.countConnected = data.count
        })

        socket.on('new-private-msg', async (data) => {
          console.log('#WS new-private-msg', data)
          console.log('#WS new-private-msg', '/private/' + data.newMsg.senderId, this.$route.path)

          if(this.$route.path == '/private/' + data.newMsg.senderId)
            this.$root.$emit('hot-private-message', data.newMsg)
          else{
            this.$store.dispatch('auth/newMsgInConv', data.newMsg) 
            this.$store.dispatch('app/openSnackbar', 
                                  { show: true, color:'blue', 
                                    title: "Nouveau message de <b>"+data.newMsg.senderName+"</b>",
                                    text: data.newMsg.message,
                                    icon: 'comment',
                                    path: '/private/' + data.newMsg.senderId })
          }
        })

        socket.on('edited-private-msg', async (data) => {
          console.log('#WS edited-private-msg', data)
          console.log('#WS edited-private-msg', '/private/' + data.newMsg.senderId, this.$route.path)

          if(this.$route.path == '/private/' + data.newMsg.senderId)
            this.$root.$emit('hot-edit-private-message', data)
        })

        socket.on('deleted-private-msg', async (data) => {
          console.log('#WS deleted-private-msg', data)
          console.log('#WS deleted-private-msg', '/private/' + data.senderId, this.$route.path)

          if(this.$route.path == '/private/' + data.senderId)
            this.$root.$emit('hot-delete-private-message', data.inx)
        })

        socket.on('new-offer-paid', async (data) => {
          console.log('#WS new-offer-paid', data)

          this.$store.dispatch('auth/refreshUserData')
          this.$store.dispatch('app/openSnackbar', 
                                { show: true, color:'green', 
                                  title: "Paiement reçu",
                                  text: data.message,
                                  icon: 'thumb-up' })
        })

        socket.on('new-proposition', async (data) => {
          console.log('#WS proposition', data)

          this.$store.dispatch('auth/refreshUserData')
          this.$store.dispatch('app/openSnackbar', 
                                { show: true, color:'amber', 
                                  title: "Nouvelle proposition reçue",
                                  text: '',
                                  path: '/propositions/seller',
                                  icon: 'thumb-up' })
        })


        socket.on('new-answer', async (data) => {
          console.log('#WS new-answer', data)

          this.$store.dispatch('auth/refreshUserData')
          this.$store.dispatch('app/openSnackbar', 
                                { show: true, color:'green', 
                                  title: "Nouvelle réponse reçue",
                                  text: '',
                                  path: '/propositions/buyer',
                                  icon: 'thumb-up' })
        })

        socket.on('deleted-conversation', async (data) => {
          console.log('#WS deleted-conversation', data)
          this.$store.dispatch('auth/refreshUserData')
          if(this.$route.path.indexOf("/private/"+data.convId)){
            console.log('#WS deleted-conversation redirect /market')
            this.$router.push("/market")
            this.$store.dispatch('app/openSnackbar', 
                                  { show: true, color:'red', 
                                    title: "La conversation a été fermée par votre interlocuteur",
                                    text: '',
                                    path: '/market',
                                    icon: 'comment-remove-outline' })
          }
        })


        //récupérer le nombre d'utilisateurs connectés aux sockets
        this.$root.$on('get-count', () => { 
          console.log('#WS get-count')
          socket.emit('get-count')
        })
      }
    },
    testSocket : function(){
      console.log("testSocket")
      socket.emit('join', { UID: this.$store.state.auth.user._id })
    }
  },

  computed: {
  },

  watch: {
    '$route.path': { immediate: true, 
        async handler () {
            this.showFooter = router.currentRoute.fullPath.indexOf('/admin') == -1 
            this.showMenuComplete = router.currentRoute.fullPath.indexOf('/admin') == -1 

            if(this.lastLang != '' && this.lastLang != this.currentLangInRoute()){
              //this.lastLang = this.currentLangInRoute()
              //router.go()
            }
        }
    },
    '$store.state.auth.isLogin': { immediate: true, 
        handler (val) {
            //SOCKET INITIALIZATION AFTER LOGIN CHANGE
            // console.log("#WS -- isLogin", val, 
            //                     "socketExists", socket != null, 
            //                     "auth.user._id", this.$store.state.auth.user._id)

            //user is connected
            if(val === true){
              if(socket == null){
                console.log("#WS init connexion", config.websocketUrl)
                //memorize the user id used to join
                this.socketIdUser = this.$store.state.auth.user._id

                socket = io(config.websocketUrl)
                this.initSocket()
              }           
            }else{ //user has logout
              if(socket != null && this.socketIdUser != null){
                console.log("#WS leave connexion", this.socketIdUser)
                socket.emit('leave', { UID: this.socketIdUser })
                this.socketIdUser = null
              }
            }
            
        }
    },
  }, 

};
</script>
