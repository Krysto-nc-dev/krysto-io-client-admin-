<template>
<div>

  <DashboardHeader></DashboardHeader>

  <v-row>
    <v-col cols="12" class="pa-0">
      <v-card color="transparent" elevation="0" class="no-radius">

        <v-app-bar elevation="1">
          <v-toolbar-title>
            <v-icon class="mr-1">mdi-chevron-down</v-icon> 
            <small class="grey--text">Importer des </small>
            <span class="secondary--text text--lighten-2">
              {{ $route.params.entityType|capitalize }}
            </span>
          </v-toolbar-title>


          <v-spacer></v-spacer>
          
          <v-text-field v-model="searchInData" outlined dense hide-details 
                        class="d-none d-md-flex" elevation="0"
                        placeholder="rechercher">
          </v-text-field>
          
          <v-spacer></v-spacer>


          <v-btn class="ml-4 d-none d-sm-flex" outlined color="red" dark 
                  v-if="itemsImportSelected.length > 0"
                  @click="showPopupDeleteMulti = true">
            <v-icon small class="mr-1">mdi-delete</v-icon> Supprimer
          </v-btn>
          <v-btn small class="ml-4 d-sm-none" color="red" dark 
                  v-if="itemsImportSelected.length > 0"
                  @click="showPopupDeleteMulti = true">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
          
        </v-app-bar>

        <v-app-bar elevation="0" class="d-md-none">
          <v-text-field v-model="searchInData" dense outlined hide-details placeholder="rechercher"></v-text-field>
          <v-btn class="ml-3" color="admin_secondary" dark large><v-icon>mdi-database-search</v-icon></v-btn>
        </v-app-bar>
        
        <v-row class="" style="margin-top:-11px;">
          <v-col cols="12" md="6" class="pr-0">
            <v-app-bar elevation="1" height="80">
              <span class="blue--text" dark>
                <v-icon color="blue">mdi-database-export</v-icon> 
                Données disponibles ({{ importDatas.length }})
                <br><small class="grey--text">@{{ importHostUrl }}</small>
              </span>
              <v-spacer></v-spacer>

              <v-btn elevation="0" fab small
                    color="admin_primary" dark title="actualiser les données disponibles"
                    @click="fetchEntities()">
                <v-icon >mdi-database-refresh</v-icon>
              </v-btn>
              <!-- <v-text-field dense outlined hide-details @change="fetchEntities()"
                            label="Nom de la table équivalente"
                            v-model="entityTpeNameTranslate"></v-text-field> -->
            </v-app-bar>

            <v-data-table 
              color="blue" item-key="id" class="elevation-1" height="100%"
              :headers="headersImport" 
              :items="importDatas"
              :search="searchInData"
              :loading="loading"
              loading-text="Chargement des données... Merci de patienter quelques instants..."
              no-data-text="Aucune données à afficher"
              no-results-text="Aucun résultat"
              :items-per-page="100"
              :show-select="true"
              v-model="itemsImportSelected"
            >
              <template v-slot:item.isAdmin="{ item }">
                <template v-if="item.isAdmin=='true'">
                                <v-icon small color="green">mdi-check</v-icon></template>
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
              <!-- <template v-slot:item.actionShow="{ item }">
                <v-btn icon @click="showItem(item)" elevation="0" outlined small title="afficher">
                  <v-icon small>mdi-eye</v-icon>
                </v-btn>
              </template>
              
              <template v-slot:item.actionEdit="{ item }">
                <v-btn icon @click="editItem(item)" color="primary" elevation="0" outlined small title="éditer">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </template>
              
              <template v-slot:item.actionDelete="{ item }">
                <v-btn icon @click="showPopupDeleteItem(item)" color="red" elevation="0" outlined small title="supprimer">
                  <v-icon color="red" small>mdi-delete</v-icon>
                </v-btn>
              </template> -->
            </v-data-table>
          </v-col>

          <v-col cols="12" md="6" class="pl-0">
            
            <v-app-bar elevation="1" height="80">
              <span class="green--text" dark>
                <v-icon color="green">mdi-cable-data</v-icon> 
                Données converties ({{ saveDatas.length }})
                <br><small class="grey--text">> Prêtes à injecter dans la bdd locale</small>
              </span>

              <v-spacer></v-spacer>

              <v-switch color="red" 
                        class="mt-5" 
                        @change="showOnlyStatusError ? searchInData = 'error' : searchInData = ''" 
                        v-model="showOnlyStatusError">
              </v-switch>

              <v-btn color="red" dark elevation="0" 
                      class="mr-2"
                      v-if="importErrors.length > 0" 
                      @click="showPopupError = true">
                <v-icon small>mdi-bug</v-icon> {{ importErrors.length }} 
              </v-btn>

              <v-btn elevation="0" 
                    color="green" dark title="enregistrer les données"
                    @click="saveEntities()">
                <v-icon >mdi-database-import</v-icon> Enregistrer
              </v-btn>
            </v-app-bar>

            <v-data-table 
              color="blue" item-key="_id" class="elevation-1" height="100%"
              :headers="headersSave" 
              :items="saveDatas"
              :search="searchInData"
              :loading="loading"
              loading-text="Chargement des données... Merci de patienter quelques instants..."
              no-data-text="Aucune données à afficher"
              no-results-text="Aucun résultat"
              :items-per-page="100"
              :show-select="true"
              v-model="itemsSaveSelected"
            >
              <template v-slot:item.isAdmin="{ item }">
                <template v-if="item.isAdmin=='true'">
                                <v-icon small color="green">mdi-check</v-icon></template>
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


              <template v-slot:item.status="{ item }">
                <v-icon :color="item.status == 'loading' ? 'blue' : 
                                item.status == 'error' ? 'red' : 
                                item.status == 'done' ? 'green' : 'grey'"

                        :title="item.status == 'loading' ? 'enregistrement en cours' : 
                                item.status == 'error' ? 'erreur' : 
                                item.status == 'done' ? 'importation réussi' : 'en attente'">
                    
                    mdi-circle
                </v-icon>
              </template>
              <!-- 
              <template v-slot:item.actionEdit="{ item }">
                <v-btn icon @click="editItem(item)" color="primary" elevation="0" outlined small title="éditer">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </template>
              
              <template v-slot:item.actionDelete="{ item }">
                <v-btn icon @click="showPopupDeleteItem(item)" color="red" elevation="0" outlined small title="supprimer">
                  <v-icon color="red" small>mdi-delete</v-icon>
                </v-btn>
              </template> -->
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <v-dialog v-model="showPopupError" max-width="600">
    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-bug</v-icon> 
        Erreurs
      </v-card-title>

      <v-card flat class="pa-4">
        <v-alert color="red lighten-2" dark dense v-for="(error, e) in importErrors" :key="e">
          <span><v-icon small>mdi-alert</v-icon> Erreur : {{ error.message }}</span>
        </v-alert>
      </v-card>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn color="" outlined @click="showPopupError = false" >
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

export default {
  name: 'admin-table',
  components: { DashboardHeader },
  data: () => ({
    headersImport: [],
    headersSave: [],
    searchInData: "",
    
    importDatas: [],
    saveDatas: [],
    
    itemsImportSelected: [],
    itemsSaveSelected: [],

    loading:false,

    entityTpeNameTranslate: "",
    schema: null,

    importHostUrl: "", 
    importErrors: [],

    showPopupError: false,
    showOnlyStatusError: false,

  }),
  async mounted(){
    //this.fetchData()
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
      // this.entityTpeNameTranslate = 
      //   (this.entityTpeNameTranslate != "") ? this.entityTpeNameTranslate : this.$route.params.entityType
      
      await this.$store.dispatch("admin/fetchEntities", {
        "entityType" : this.$route.params.entityType,
        "limit": 1
      })

      this.loading = true
      let res = await axios.get("import/"+this.$route.params.entityType)
      this.loading = false

      if(res.data.datas != null)
        this.importDatas = res.data.datas
      
      this.schema = res.data.schema
      this.entityTpeNameTranslate = this.schema.tableName
      this.importHostUrl = res.data.hostUrl

      //this.importDatas = res.data.datas
      this.genTableHeader()
      this.genSaveData()
    },
    genTableHeader(){
      if(this.schema == null) return 
      this.headersImport = []
      this.importErrors = []
      
      this.schema.schema.forEach((attr) => {
          if(attr.showInTable)
          this.headersImport.push({
            text: attr.host, value: attr.host
          })
      })
    },
    genSaveData(){ 
      if(this.schema == null) return 
      this.saveDatas = []
      this.headersSave = []
      this.headersSave.push({ text: 'status', value: 'status' })

      this.importDatas.forEach((data)=>{
        let newData = {}
        //console.log("genSaveData ***", data.name)
        this.schema.schema.forEach((attr) => {
            newData[attr.local] = data[attr.host]
            if(attr.showInTable && attr.local != "-"){ 
              if(!this.headersSaveExists(attr))
                this.headersSave.push({ text: attr.local, value: attr.local })
              //console.log("genSaveData", attr.local, attr.host)
            }
        })
        newData["status"] = 'pending'

        //console.log("newData", newData)
        this.saveDatas.push(newData)
        //console.log("genSaveData", newData["name"])
      })
    },
    headersSaveExists(attr){
      let exist = false
      this.headersSave.forEach((header)=>{
        if(header.text == attr.local) exist = true 
      })
      return exist
    },
    async saveEntities(){      
      this.importErrors = []
      this.loading = true
      await Promise.all(this.saveDatas.map(async (entity, i) => {
        if(i<1000) {
          console.log("call saveEntity", i)
          this.saveDatas[i].status = "loading"
          await this.saveEntity(entity)
        }
      }))
      this.loading = false
    },
    async saveEntity(entity){

      let ent = entity
      delete ent['status']

      let res = await axios.post("/import/save-entity", {
                        "entityType" : this.$route.params.entityType,
                        "entityData" : ent,
                        "lang" : localStorage.getItem('VueAppLanguage')
      })
      if(res.data.error) {
        this.importErrors = this.importErrors.concat(res.data.validateErrors.details)
        entity.status = "error"
      }else{ 
        entity.status = "done" 
      }
      //else this.importErrors = []
      //console.log("res", res.data)
    }
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
