<template>
  <div>
    <!-- MAIN MENU -->
    <v-navigation-drawer v-model="$store.state.app.drawerOpen" 
                          app disable-resize-watcher color="background">
      <v-list dense>

        <!-- <router-link to="/"  class="ml-5 amber--text text--darken-3 font-main invisible-link" style="font-size:30px; font-weight:800 !important;">
          {{ $store.state.app.siteName }}
        </router-link> -->
        <v-list-item-group  color="primary">
          <v-list-item :href="clientUrl" target="_blank">
              <v-list-item-icon class="mr-1">
                  <v-icon>mdi-share</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Le site</v-list-item-title>
              </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <template v-if="$store.state.auth.isLogin">

        <v-subheader>Admin</v-subheader>
          
        <v-list-item-group  color="primary">
          <v-list-item to="/admin">
              <v-list-item-icon class="mr-1">
                  <v-icon>mdi-account-cowboy-hat</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Dashboard</v-list-item-title>
              </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <v-list-item-group  color="primary">
          <v-list-item to="/simulation">
              <v-list-item-icon class="mr-1">
                  <v-icon>mdi-play</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Simulation</v-list-item-title>
              </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <v-list-item-group  color="primary">
          <v-list-item to="/moderation">
              <v-list-item-icon class="mr-1">
                  <v-icon>mdi-shield-alert-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Modération</v-list-item-title>
              </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <v-list-item-group  color="primary">
          <v-list-item to="/blockchain">
              <v-list-item-icon class="mr-1">
                  <v-icon>mdi-link-lock</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Blockchain</v-list-item-title>
              </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <v-subheader>Database</v-subheader>

        <v-list-item-group color="primary">
          <template v-for="item in $store.state.admin.entityTypesAvailables" >
            <v-list-item :key="item" :to="'/admin/'+item">
                <v-list-item-icon class="mr-1">
                    <v-icon>mdi-database</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.toUpperCase() }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>

      </template>

        <!-- <template v-if="showMenuComplete">
          <template v-for="item in itemsDrawer" >
            <v-list-item v-if="item.auth == false || $store.state.auth.isLogin" :key="item.to" link :to="item.to">

              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item-content>
              
            </v-list-item>
          </template>
        </template> -->

        <v-list-item>

          <v-list-item-action>
            <v-icon>mdi-brightness-6</v-icon>
          </v-list-item-action>

          <v-list-item-content style="z-index:2">
            <v-switch @change="newThemeDark()" v-model="$vuetify.theme.dark"></v-switch>
          </v-list-item-content>
          
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

  </div>
</template>

<script>
  //import router from '../../router/router'
  const config = require('../../config/' + process.env.NODE_ENV)

  export default {
    name: 'main-menu',
    props: [ 'showMenuComplete' ],
    data: () => ({
      drawer: null,
      itemsDrawer: [
        { name: 'Dashboard',        to: '/',                            auth: true, icon: 'mdi-home' },
        { name: 'Mon profil',             to: '/profil',                auth: true,  icon: 'mdi-account-circle' },
      ]
    }),

    
    mounted: function(){
      //initialise le theme sur "sombre" ou "lumineux" (dark : true / false)
      setTimeout(()=>{
        let themeDark =  localStorage.getItem("themeDark")
        if(themeDark != null) this.$vuetify.theme.dark = (themeDark=="true")

        localStorage.setItem("themeDark", this.$vuetify.theme.dark)
      }, 100)
      
    },
    
    methods: {
      logout(){
        this.$store.dispatch('auth/logout')
      },
      newThemeDark(){
        localStorage.setItem("themeDark", this.$vuetify.theme.dark)
      }
    },
    computed:{
      clientUrl : function(){ return config.clientUrl }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    watch: {
    }, 
    
    
  };
</script>
