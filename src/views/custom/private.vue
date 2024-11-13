<template>
<div id="private" v-if="conversation != null">
 
  <div class="col-discuss" :style="'min-height:'+($vuetify.breakpoint.height-65)+'px'">

    <v-col cols="12" class="mx-auto px-0" :refresh="refresh">

      <v-alert color="blue" outlined class="mx-3">
        <v-icon color="blue">mdi-comment-outline</v-icon>
        Début de votre conversation avec <b>{{ userDest.name }}</b>
      </v-alert>
      
      <template v-for="(message, m) in conversation.messages">
        <v-card :key="m" v-if="message.senderName != null" 
                :class="lastDate < message.created ? 'newmsg' : ''" 
                class="mt-1 private-msg" elevation="0" color="transparent">
          <v-col cols="12" class="py-2">
            <v-gravatar height="25" class="mr-2" style="border-radius:50%;margin-bottom:-5px;"
                            :default-img="'retro'" :email="message.senderName"/>

            <b>{{ message.senderName }}</b> 

            <small class="mx-1 grey--text">•</small>

            <time-ago :datetime="message.updated" style="font-size:11px !important;"
                      :refresh="60" long :locale="$vuetify.lang.current">
            </time-ago>

            <!-- <template v-if='lastDate < message.created'>Not read !</template> -->

            <template v-if="(editMsgInx == null || editMsgInx != m)">

              <template v-if="message.senderId == $store.state.auth.user._id">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn small class="ml-1" icon v-bind="attrs" v-on="on">
                      <v-icon small>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    
                    <v-list-item dense title="modifier ce message" @click="editMsgInx = m">
                      <v-icon small>mdi-pencil</v-icon>
                      <v-list-item-title>Modifier</v-list-item-title>
                    </v-list-item>
                    <v-list-item dense title="supprimer ce message" @click="deleteMsgInx = m">
                      <v-icon small>mdi-delete</v-icon>
                      <v-list-item-title>Supprimer</v-list-item-title>
                    </v-list-item>
                    
                  </v-list>
                </v-menu>
              </template>


              <div v-if="deleteMsgInx != null && deleteMsgInx == m" class="">
                <v-toolbar dense background-color="transparent" elevation="0" outlined class="mt-2 px-0 red--text">
                  <small><b>Supprimer ce message ?</b></small>
                  <v-spacer></v-spacer>
                  <v-btn color="" elevation="0" class="mr-1" small @click="deleteMsgInx = null">annuler</v-btn>
                  <v-btn color="red" elevation="0" class="ml-1" dark small @click="deleteMessage(m)">supprimer</v-btn>
                </v-toolbar>
              </div>

              <br>

              <p class="pl-5 ml-3 mb-0" v-html="nl2br(message.message)"></p>
            </template>

          </v-col>
        </v-card>
        
        
        <div :key="m+'txtarea'" v-if="editMsgInx != null && editMsgInx == m">
          <v-textarea outlined label="Modifier votre message..." v-model="conversation.messages[editMsgInx].message" 
                      @keyup.enter.exact="saveEditMessage()" rows="3" :loading="sending"
                      @click:append="saveEditMessage()" class="mt-2"
                      append-icon="mdi-check" 
                      auto-grow hide-details>
          </v-textarea>
          <v-toolbar dense elevation="0"  class="mb-5 py-0">
            <v-spacer></v-spacer>
            <v-btn color="" elevation="0" class="mx-1" small @click="editMsgInx = null">annuler</v-btn>
            <v-btn color="green" elevation="0" class="mx-1" dark small @click="saveEditMessage">enregistrer</v-btn>
          </v-toolbar>
        </div>


      </template>

      <!-- <template v-if="conversation.messages.length == 0">
        <v-alert color="blue" outlined>
          <v-icon color="blue">mdi-comment-outline</v-icon>
          Début de votre conversation avec <b>{{ userDest.name }}</b>
        </v-alert>
      </template> -->
    </v-col>

    <div class="main-live-textbar pr-3 pl-3 pl-md-0">
      <v-textarea outlined label="Votre message..." v-model="txtMsg" 
                  @keyup.enter.exact="sendMessage()" rows="3"
                  @click:append="sendMessage()" hide-details
                  append-icon="mdi-send" :loading="sending"
                  @click:prepend="showDialogCloseConv = true"
                  prepend-icon="mdi-delete" 
                  auto-grow>
      </v-textarea>
    </div>

  </div>



  <v-dialog v-model="showDialogCloseConv" max-width="600">
    <v-card>
      <v-card-title class="red--text">
        <v-icon color="red" class="mr-2">mdi-delete</v-icon> 
        Fermer cette conversation ?
      </v-card-title>

      <v-card-text class="red--text text--lighten-2">
        <b>Voulez-vous vraiment fermer cette conversation ?</b><br>
        L'ensemble des messages échangés avec <b>{{ userDest.name }}</b> seront supprimés.
      </v-card-text>
      

      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn color="" text @click="showDialogCloseConv=false" >
          <v-icon small>mdi-close</v-icon> Annuler
        </v-btn>
        <v-btn color="red" dark @click="closeConversation()" >
          <v-icon small>mdi-delete</v-icon> Oui, supprimer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</div>
</template>

<style>

  #private{
    
  }

  #private .main-live-textbar{
    padding-top:15px;
    padding-bottom:15px;
  }

  @media(min-width: 600px){
    #private .main-live-textbar{
      z-index: 2;
      position:fixed !important;
      bottom:0px !important;
      font-size: 14px;
      width:100%;
      max-width:680px;
    }
    .col-discuss{
      padding-bottom:100px;
      padding-top:0px;
      max-width: 700px;
      padding-left: 1%;
      padding-right: 1%;
      margin: auto;
    }
  }

  @media(max-width: 600px){
    #private .main-live-textbar{
      width:100%;
      position:absolute !important;
      bottom:0px !important;
      font-size: 14px;
      width:100%;
      max-width:680px;
      padding-left: 0%;
      padding-right: 0%;
    }
  }
  
      
  .col-discuss {
    background-color: #fff;
    padding-bottom:100px;
    padding-top:0px;
  }
  .theme--dark .col-discuss {
    background: rgb(41, 41, 41);
  }
  .theme--dark #private {
    background: rgb(31, 31, 31);
  }
  #private{
    /* margin-bottom:-12px; */
  }
  
  .theme--dark .main-live-textbar{
    background: rgb(41, 41, 41);
  }
  .theme--light .main-live-textbar{
    background: #fff;
  }

  .private-tool-btn{
    display: none;
    float: right;
    margin-top: -10px;
  }
  .private-msg:hover .private-tool-btn{
    display: block;
  }
  .private-msg.newmsg{
    border-top: 1px dashed #2196f3;
    border-radius: 0px;
  }

</style>

<script>

import axios from "axios"
import OfferPage from '@/components/offer/OfferPage.vue'
import Gravatar from 'vue-gravatar'
import {TimeAgo} from "vue2-timeago"

export default {
  name: 'private',
  components: {
    OfferPage, 'v-gravatar' : Gravatar, TimeAgo
  },
  data: () => ({
    conversation: null,
    txtMsg: "",
    sending: false,
    sendingEdit: false,
    sendingDelete: false,
    editMsgInx: null,
    deleteMsgInx: null,
    refresh: new Date(),
    lastDate: new Date(),
    showDialogCloseConv: false
  }),
  mounted: async function(){

    //this.initData()
    
    this.$root.$on('hot-private-message', (newMsg) => { 
      console.log('#WS hot-private-message', newMsg)
      this.conversation.messages.push(newMsg)
      this.$store.dispatch("auth/readConv", this.conversation._id)
      this.scrollBottom()
    })
    this.$root.$on('hot-edit-private-message', (data) => { 
      console.log('#WS hot-edit-private-message', data)
      this.conversation.messages[data.inx] = data.newMsg
      this.refresh = new Date()
    })
    this.$root.$on('hot-delete-private-message', (inx) => { 
      console.log('#WS hot-delete-private-message', inx)
      this.conversation.messages.splice(inx, 1)
      this.refresh = new Date()
    })
  },
  methods: {
    async initData(){
      const { data } = await axios.get('/private/get-conversation/'+ this.$route.params.userId)
      if(!data.error){
        this.conversation = data.conversation
        this.$store.dispatch('app/setCurrentPrivateConvUserName', this.userDest.name)
        this.$store.dispatch("auth/setReadConv", this.conversation)
        this.lastDate = data.lastDate
        this.scrollBottom()
      }else{
        console.log("error get-offer", data)
      }
    },
    async sendMessage(){
      if(this.txtMsg == "" || this.sending) return 

      const params = { message: this.txtMsg }
      this.txtMsg = ""
      this.sending = true
      const { data } = await axios.post('/private/send-message/'+ this.conversation._id, params)
      this.sending = false

      if(!data.error){
        await this.$store.dispatch("auth/updateReadConv", this.conversation._id)
        this.conversation.messages.push(data.message)     
        this.lastDate = new Date()
        this.scrollBottom()
      }else{
        console.log("error get-offer", data)
      }
    },
    async saveEditMessage(){
      const params = { inx: this.editMsgInx, 
                       message: this.conversation.messages[this.editMsgInx].message }

      this.sendingEdit = true
      const { data } = await axios.post('/private/edit-message/'+ this.conversation._id, params)
      this.sendingEdit = false

      if(!data.error){ this.editMsgInx = null }
      else{ console.log("error edit-message", data) }
    },
    async deleteMessage(inx){
      this.sendingDelete = true
      const { data } = await axios.post('/private/delete-message/'+ this.conversation._id, { inx: inx })
      this.sendingDelete = false
      
      if(!data.error){ 
        this.deleteMsgInx = null
        this.conversation.messages.splice(inx, 1)
        this.refresh = new Date()
      }else{ console.log("error delete-message", data) }
    },
    closeConversation: async function(){
      this.sending = true
      const { data } = await axios.post('/private/close-conversation/'+ this.conversation._id)
      this.sending = false
      if(!data.error){
        await this.$store.dispatch("auth/refreshUserData")
        this.$router.push('/wallet')
      }else{
        console.log("error get-offer", data)
      }
    },
    scrollBottom: function(){
      setTimeout(() => {
        document.getElementsByTagName('html')[0].scrollTop = 
          document.getElementsByTagName('html')[0].offsetHeight
      }, 1000)
    },
    nl2br: function(str, is_xhtml){
      var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'
      let newStr = (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
      return newStr
    },
    
  },
  
  computed: {
    userDest(){ 
      if(this.conversation == null) return {} 
      return (this.conversation.user1._id == this.$store.state.auth.user._id) ? this.conversation.user2 : this.conversation.user1 
    }
  },
  watch: {
      
      '$route.path': { immediate: true, 
          async handler (){ 
            //if(this.$store.state.market.requestParams.search == null) 
              this.initData()
          }
      },
  }, 
}
</script>
