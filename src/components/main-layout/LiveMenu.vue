<template>
  <v-list class="drawerRight" >
    
    <v-list-item>
      <v-list-item-icon class="text-center mr-3">
        <v-icon color="blue">mdi-comment</v-icon>
      </v-list-item-icon>
      <v-list-item-content class="blue--text">
        <span class="font-main">
          <!-- <v-icon color="blue">mdi-chevron-down</v-icon>  -->
          Discussions privées
        </span>
      </v-list-item-content>
    </v-list-item>

    <v-divider/>
    <template v-if="$store.state.auth.conversations.length > 0">
      <template  v-for="(conv, p) in $store.state.auth.conversations" >
        <v-list-item class="px-2" :key="p" :to="'/private/'+(conv.user1._id != $store.state.auth.user._id ? conv.user1._id : conv.user2._id)">
          <v-list-item-icon class="mr-3">
            <v-badge color="blue" class="badge-nbMsg" small 
                    :content="nbMsgNotRead(conv._id)" 
                    :value="nbMsgNotRead(conv._id)">
            <v-gravatar :height="35" :width="35" class="ml-1" 
                          style="border-radius:50%;margin-bottom:-4px;"
                        :default-img="'retro'" :email="conv.user1._id != $store.state.auth.user._id ? conv.user1.name : conv.user2.name"/>
            </v-badge>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-if="conv.user1._id != $store.state.auth.user._id"><b>{{ conv.user1.name }}</b></v-list-item-title>
            <v-list-item-title v-else><b>{{ conv.user2.name }}</b></v-list-item-title>
            <v-list-item-subtitle v-if="conv.user1._id != $store.state.auth.user._id"><b>{{ conv.user1.city }}</b></v-list-item-subtitle>
            <v-list-item-subtitle v-else><b>{{ conv.user2.city }}</b></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </template>
    <template v-else>
      <v-list-item class="px-2">
        <v-list-item-icon class="mx-2"><v-icon>mdi-cancel</v-icon></v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title><b>Vous n'avez aucun contact</b></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

  </v-list>
</template>

<style>
  .badge-nbMsg .v-badge__badge{
    inset: auto auto calc(82% - 4px) calc(82% - 4px) !important;
    font-weight: bold;
  }
</style>
<script>

//import axios from 'axios'
//import router from '../router/router'
//import core from '../../plugins/core.js'
import Gravatar from 'vue-gravatar'

export default {
  name: 'drawer-right',
  props: [],
  components: { 'v-gravatar' : Gravatar },
  data:() => ({
   timer: null
  }),
  beforeDestroy () {
    if(this.timer != null){
      clearInterval(this.timer)
      this.timer = null
    } 
  },
  async mounted(){
    // if(this.timer != null){
    //   clearInterval(this.timer)
    //   this.timer = null
    // } 
    // this.timer = setInterval(()=>{
    //   this.$store.dispatch('live/whoIsOnline')
    // }, 120000)
  },

  methods: {

    nbMsgNotRead: function(convId){
      let nbMsgNotRead = 0
      this.$store.state.auth.conversations.forEach(conv => {
        if(convId == conv._id){
          let myLastDate = null
          conv.dateLastRead.forEach((date) => {
            if(date.userId == this.$store.state.auth.user._id) myLastDate = date.date
          })
          
          conv.messages.forEach(msg => {
            if(msg.created > myLastDate) nbMsgNotRead++
          });
        }
      })
      return nbMsgNotRead
    }

  }
}
</script>