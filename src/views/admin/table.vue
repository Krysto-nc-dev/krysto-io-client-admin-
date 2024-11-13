<template>
<div>

  <v-col cols="12" sm="12">

    <DashboardHeader></DashboardHeader>

    <v-row>

      <v-col cols="12" class="pa-0"
            style="border-radius:0px;">
        <v-card color="transparent" elevation="0" class="no-radius">

          <v-app-bar elevation="0">
            <v-toolbar-title>
              <v-icon class="mr-1">mdi-chevron-down</v-icon> 
              <small class="grey--text">Liste des </small>
              <span class="secondary--text text--lighten-2">
                {{ $store.state.admin.currentEntityType|capitalize }}
                ({{ $store.state.admin.entities.length }})
              </span>
            </v-toolbar-title>


            <v-spacer></v-spacer>
            
            <v-text-field v-model="searchInData" outlined dense hide-details 
                          class="d-none d-md-flex" elevation="0"
                          placeholder="rechercher" clearable>
            </v-text-field>

            <v-btn text  class="ml-2 d-none d-sm-flex" 
                    title="actualiser les données" 
                    @click="fetchEntities()">
              <span class="d-none d-md-flex" v-if="searchInData == '' || searchInData == null">
                <v-icon small class="mr-1">mdi-refresh</v-icon> Actualiser
              </span>
              <span class="d-none d-md-flex" v-else>+ de résultats</span>
            </v-btn>
            <v-btn  x-small class="ml-2 d-sm-none" 
                    color=""  fab
                    title="actualiser les données" 
                    @click="fetchEntities()">
              <v-icon small>mdi-refresh</v-icon>
            </v-btn>
            
            <v-spacer></v-spacer>

            <v-btn class="ml-4 d-none d-sm-flex" outlined color="red" dark 
                    v-if="itemSelected.length > 0"
                    @click="showPopupDeleteMulti = true">
              <v-icon small class="mr-1">mdi-delete</v-icon> Supprimer
            </v-btn>
            <v-btn small class="ml-4 d-sm-none" color="red" dark 
                    v-if="itemSelected.length > 0"
                    @click="showPopupDeleteMulti = true">
              <v-icon small>mdi-delete</v-icon>
            </v-btn>

            <v-btn class="ml-4 d-none d-sm-flex" elevation="0" color="admin_primary" dark 
                    :to="'/admin/create-entity/'+$store.state.admin.currentEntityType">
              <v-icon small class="mr-1">mdi-plus-circle</v-icon> Créer un nouveau
            </v-btn>
            <v-btn small class="ml-4 d-sm-none" color="admin_primary" dark 
                    :to="'/admin/create-entity/'+$store.state.admin.currentEntityType">
              <v-icon small>mdi-plus-circle</v-icon>
            </v-btn>

            
          </v-app-bar>

          <v-app-bar elevation="0" class="d-md-none">
            <v-text-field v-model="searchInData" dense outlined hide-details placeholder="rechercher"></v-text-field>
            <v-btn class="ml-3" color="admin_secondary" dark large><v-icon>mdi-database-search</v-icon></v-btn>
          </v-app-bar>
          
          <v-data-table 
            color="blue" item-key="_id" class="elevation-0 table-admin" height="100%"
            :headers="headers" 
            :items="$store.state.admin.entities"
            :search="searchInData"
            :loading="$store.state.admin.loadingEntities"
            loading-text="Chargement des données... Merci de patienter quelques instants..."
            no-data-text="Aucune données à afficher"
            no-results-text="Aucun résultat"
            :items-per-page="13"
            :show-select="true"
            v-model="itemSelected"
          >
            <template v-slot:item.isDeleted="{ item }">
              <v-icon v-if="item.isDeleted == 'true'" small color="red">mdi-delete</v-icon>
              <v-icon v-else small color="">mdi-cancel</v-icon>
            </template>
            <template v-slot:item.isAdmin="{ item }">
              <v-icon v-if="item.isAdmin == 'true'" small color="">mdi-check</v-icon>
              <v-icon v-else small color="red">mdi-cancel</v-icon>
            </template>
            <template v-slot:item.isActive="{ item }">
              <v-icon v-if="item.isActive == 'true'" small color="">mdi-check</v-icon>
              <v-icon v-else small color="red">mdi-cancel</v-icon>
            </template>
            <template v-slot:item.isLocked="{ item }">
              <template v-if="item.isLocked=='true'">
                               <v-icon small color="red" title="cet élément est bloqué">mdi-lock</v-icon></template>
              <template v-else><v-icon small title="cet élément n'est pas bloqué">mdi-cancel</v-icon></template>
            </template>
            <template v-slot:item.emailChecked="{ item }">
              <v-icon v-if="item.emailChecked == 'true'" small color="">mdi-check</v-icon>
              <v-icon v-else small color="red">mdi-cancel</v-icon>
            </template>
            <template v-slot:item.planPaid="{ item }">
              <v-icon v-if="item.planPaid == 'true'" small color="">mdi-check</v-icon>
              <v-icon v-else small color="red">mdi-cancel</v-icon>
            </template>
            <template v-slot:item.walletMain="{ item }">
               <template v-if="item.walletMain != null && item.walletMain!=null">
                               <v-icon small color="">mdi-check</v-icon></template>
              <template v-else><v-icon small color="red">mdi-cancel</v-icon></template>
            </template>
            <template v-slot:item.walletsDeposit="{ item }">
               <template v-if="item.walletsDeposit != null && item.walletsDeposit.length > 0">
                               <v-icon small color="">mdi-check</v-icon></template>
              <template v-else><v-icon small color="red">mdi-cancel</v-icon></template>
            </template>
            <template v-slot:item.created="{ item }">
              <small>{{ item.created }}</small>
            </template>


            <template v-slot:item.image="{ item }">
              <SlotImg :itemImg="item.image"></SlotImg>
            </template>
            <template v-slot:item.imageProfile="{ item }">
              <SlotImg :itemImg="item.imageProfile"></SlotImg>
            </template>
            <template v-slot:item.imageBanner="{ item }">
              <SlotImg :itemImg="item.imageBanner"></SlotImg>
            </template>
            <template v-slot:item.gallery="{ item }">
              <div class="d-flex">
              <template v-for="img in item.gallery">
                <SlotImg :itemImg="img" :key="img"></SlotImg>
              </template>
              </div>
            </template>

            

            <template v-if="$route.params.entityType == 'user'" v-slot:item.actionEmailValidation="{ item }">
              <v-btn icon @click="resendEmailValidation(item)" elevation="0" 
                    :color="(item.emailChecked=='true' ? 'green' : 'orange') + ' ligthen-4'"
                    :title="item.emailChecked=='true' ? 'email validé' : 'E-mail non-validé. Cliquer pour renvoyer le mail de validation'"
                    outlined small >
                <v-icon small>mdi-mail</v-icon>
              </v-btn>
            </template>

            <template v-slot:item.actionShow="{ item }">
              <v-btn icon @click="showItem(item)" elevation="0" outlined small title="afficher">
                <v-icon small>mdi-eye</v-icon>
              </v-btn>
            </template>
            
            <template v-slot:item.actionEdit="{ item }">
              <v-btn icon @click="editItem(item)" color="primary" elevation="0" outlined small title="éditer">
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </template>
            
            <template v-slot:item.actionDelete="{ item }" v-if="$route.params.entityType != 'user'">
              <v-btn icon @click="showPopupDeleteItem(item)" color="red" elevation="0" 
                     outlined small title="supprimer">
                <v-icon color="red" small>mdi-delete</v-icon>
              </v-btn>
            </template>
            <template v-slot:item.actionDelete="{ item }" v-else>
              <v-btn icon @click="showPopupBanUser(item)" color="red" elevation="0" 
                     outlined small title="bloquer l'utilisateur">
                <v-icon color="red" small>mdi-lock</v-icon>
              </v-btn>
            </template>
          </v-data-table>

        </v-card>

      </v-col>
      
    </v-row>

  </v-col>

  <v-dialog v-model="showPopupDelete" max-width="600">
    <v-card>
      <v-card-title class="red--text">
        <v-icon color="red" class="mr-2">mdi-delete</v-icon> Supprimer définitivement
      </v-card-title>

      <v-card-text class="red--text text--lighten-2">
        Voulez-vous vraiment supprimer cette donnée ?
      </v-card-text>

      <!-- <code class="col-12">{{ itemToDelete }}</code> -->
      <v-card flat color="">
        <pre class="col-12">{{ itemToDelete }}</pre>
      </v-card>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn color="" text @click="showPopupDelete = false" >
          <v-icon small>mdi-cancel</v-icon> Annuler
        </v-btn>
        <v-btn color="red" dark @click="deleteItem()" elevation="0">
          <v-icon small>mdi-delete</v-icon> Oui, supprimer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>



  <v-dialog v-model="showPopupBan" max-width="600">
    <v-card>
      <v-card-title class="red--text">
        <v-icon color="red" class="mr-2">mdi-delete</v-icon> Bannir/Bloquer définitivement
      </v-card-title>

      <v-card-text class="">
        <span class="red--text text--lighten-2">Voulez-vous vraiment bloquer cet utilisateur ?</span>
        <br>
        <small>Toutes ses données seront supprimées, ainsi que ses comptes et sa monnaie.</small>
        <br>
        <small>Son adresse e-mail ne pourra pas être réutilisée pour créer un autre compte.
        </small>
      </v-card-text>

      <v-card flat color="">
        <pre class="col-12">{{ itemToBan }}</pre>
      </v-card>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn color="" text @click="showPopupBan = false" >
          <v-icon small>mdi-cancel</v-icon> Annuler
        </v-btn>
        <v-btn color="red" dark @click="banUser()" elevation="0">
          <v-icon small>mdi-lock</v-icon> Oui, bloquer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showPopupDeleteMulti" max-width="600">
    <v-card>
      <v-card-title class="red--text">
        <v-icon color="red" class="mr-2">mdi-delete</v-icon> Supprimer définitivement
      </v-card-title>

      <v-card-text class="red--text text--lighten-2">
        Voulez-vous vraiment supprimer les {{ itemSelected.length }} éléments sélectionnés ?
        <v-btn small class="mt-3" rounded @click="showDataSelected = !showDataSelected">Afficher les données à supprimer</v-btn><br><br>
        
      </v-card-text>

        <v-card flat>
          <pre class="col-12" v-if="showDataSelected">{{ itemSelected }}</pre>
        </v-card>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn color="" text @click="showPopupDeleteMulti = false" >
          <v-icon small>mdi-cancel</v-icon> Annuler
        </v-btn>
        <v-btn color="red" dark @click="deleteItemMulti()">
          <v-icon small>mdi-delete</v-icon> Oui, supprimer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showPopupItem" v-if="itemToShow!=null" max-width="600">
    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-eye</v-icon> 
        {{ $store.state.admin.currentEntityType|capitalize }} 
        <template v-if="itemToShow.name != null">
          - {{ itemToShow.name }}
        </template>
        - <small class="pl-2">{{ itemToShow._id }}</small>
      </v-card-title>

      <v-card flat>
        <pre class="col-12 pa-3 elevation-0">{{ itemToShow }}</pre>
      </v-card>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn color="" outlined @click="showPopupItem = false" >
          <v-icon small>mdi-check</v-icon> Ok
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</div>
</template>

<style></style>

<script>

import axios from 'axios'
//import router from '../router/router'
//import core from '../../plugins/core.js'

import DashboardHeader from '@/components/admin/DashboardHeader.vue'
import DashboardMenu from '@/components/admin/DashboardMenu.vue'
import SlotImg from '@/components/admin/tableslot/SlotImg.vue'

export default {
  name: 'admin-table',
  components: { DashboardHeader, DashboardMenu, SlotImg },
  data: () => ({
    headers: [],
    searchInData: "",
    fetchLimit: 100,

    itemToDelete: null,
    showPopupDelete: false,

    itemToShow: null,
    showPopupItem: false,

    itemToBan: null,
    showPopupBan: false,

    itemSelected: [],
    showPopupDeleteMulti: false,
    showDataSelected: false,

  }),
  async mounted(){
    this.fetchData()
  },
  methods: {
    fetchData(){
      this.fetchEntityTypeAvailables()
      this.fetchEntities()
    },
    async fetchEntityTypeAvailables(){
      this.$store.dispatch("admin/fetchEntityTypesAvailables")
    },
    async fetchEntities(){
      this.itemSelected = []
      await this.$store.dispatch("admin/fetchEntities", {
        "entityType" : this.$route.params.entityType,
        "search" : this.searchInData != "" ? this.searchInData : null,
        "limit": this.fetchLimit
      })
      this.genTableHeader()
    },
    genTableHeader(){
      this.headers = []
      this.$store.state.admin.currentForm.forEach((attr) => {
        if(attr.showInTable)
          this.headers.push({
            text: attr.label, value: attr.name
          })
      })

      if(this.$route.params.entityType == "user"){
        this.headers.push({ text: "", value: "actionEmailValidation" })
      }

      this.headers.push({ text: "", value: "actionShow" })
      this.headers.push({ text: "", value: "actionEdit" })
      this.headers.push({ text: "", value: "actionDelete" })
    },
    async editItem(item){
      this.$router.push("/admin/create-entity/" + this.$store.state.admin.currentEntityType + "/" + item._id)
    },
    async showPopupDeleteItem(item){
      this.itemToDelete = item
      this.showPopupDelete = true
    },
    async showPopupBanUser(item){
      this.itemToBan = item
      this.showPopupBan = true
    },
    
    async deleteItem(){
      let del = await this.$store.dispatch("admin/deleteEntity", {
        "entityType" : this.$route.params.entityType,
        "id": this.itemToDelete._id
      })
      this.showPopupDelete = !del
      if(del) this.fetchEntities()
    },

    async banUser(){
      let resBan = await this.$store.dispatch("admin/banUser", {
        "userId": this.itemToBan._id
      })
      this.showPopupBan = resBan.error
      if(resBan.error) this.fetchEntities()
      if(resBan.emailParams != null) 
        this.$store.dispatch('app/openDialogMailDev', resBan.emailParams)
    },
    
    async deleteItemMulti(){
      let resAllDel = true
      await Promise.all(this.itemSelected.map(async (item) => {
        let del = await this.$store.dispatch("admin/deleteEntity", {
          "entityType" : this.$route.params.entityType,
          "id": item._id
        })
        if(del == false) resAllDel = false
      }))

      this.showPopupDeleteMulti = !resAllDel
      if(resAllDel) this.fetchEntities()
    },
    async resendEmailValidation(item){
      axios.post('/admin/resend-email-validation', { userId: item._id })
            .then((res)=>{ 
              //console.log(res.data)
              if(res.data.error == false){
                this.$store.dispatch('app/openSnackbar', 
                                  { show: true, color:'green', 
                                    title: "Le mail de validation de <b>"+item.name+"</b> a bien été renvoyé",
                                    text: "",
                                    icon: 'check',
                                    path: null })
              }else{
                console.log('Error after /report/send')
                this.$store.dispatch('app/openSnackbar', 
                                  { show: true, color:'red', 
                                    title: "Une erreur est survenue",
                                    text: "Le mail de validation de <b>"+item.name+"</b> n'a pas été renvoyé",
                                    icon: 'cancel',
                                    path: null })
              }
              this.loading = false
            })

    },
    showItem(item){
      this.itemToShow = item
      this.showPopupItem = true
    },

    filterData (value, search) {
      return  value != null &&
              search != null &&
              typeof value === 'string' &&
              value.toString().toLocaleUpperCase().indexOf(search) !== -1
    },
  },
  computed: {
    
    
  },
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  watch: {
      '$route.path': { immediate: true, 
          async handler () {
              this.fetchData()
          }
      },
  }, 
}
</script>
