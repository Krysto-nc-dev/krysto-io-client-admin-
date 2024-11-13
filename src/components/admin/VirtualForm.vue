<template>
<v-card class="mb-5 VirtualForm">
  
  <v-app-bar class="mb-4" color="" flat>

    <v-btn fab small class="mr-5" :to="'/admin/'+entityType">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    
    <h2 class="">
      <v-icon color="" class="mr-2">mdi-plus-circle</v-icon>
      <small>
        <span v-if="entityId == null">Créer nouveau : </span> 
        <span v-else>Editer : </span> 
      </small>
      <span style="text-transform:capitalize">{{ entityType }}</span>
    </h2>

    <v-spacer></v-spacer>
    
    <v-switch title="Afficher les champs de traduction" class="mt-5 ml-2"  v-if="isEntityTranslatable"
              @change="toogleAllTranslation" v-model="showAllTrans" color="secondary">
    </v-switch>
    <v-icon @click="showAllTrans=!showAllTrans;toogleAllTranslation();" class="mr-1" v-if="isEntityTranslatable"
            title="Afficher les champs de traduction" color="secondary">mdi-flag</v-icon>

  </v-app-bar>
  
  <v-col cols="12">
    <template v-for="(attr, k) in $store.state.admin.currentForm">
      <template v-if="useInForm(attr)">

        <template v-if="attr.type == 'text-field'">
          <v-text-field filled v-model="attr.value"
                        :label="attr.label"  :key="k"
                        :placeholder="attr.placeholder"
                        :error-messages="attr.error"
                        :hide-details="attr.error==null"
                        :append-icon="attr.translatable ? 'mdi-flag' : ''"
                        :class="attr.translatable ? 'main-input-text-translate' : ''"
                        @click:append="toogleTranslation(attr.name)"
                        >
                        <template v-slot:prepend-inner v-if="attr.translatable">
                          <img class="mr-1" height="20" 
                               :src="require(`../../assets/flag/${$store.state.app.langAvailables[0]}.png`)" >
                        </template>
          </v-text-field>

          <div class="mb-5" :key="k+'trans'">
            <v-card elevation="0" outlined class=""
                    style="margin-top:-3px;border-radius:0 0 5px 5px;" 
                    v-if="attr.translatable && showTrans(attr.name)">
              <v-row class="pa-4 pt-5">              
                <template v-for="lang in $store.state.app.langAvailables">
                  <v-col cols="12" md="6" :key="k+'-transimg-'+lang"
                         v-if="lang != $store.state.app.langAvailables[0]" class="px-3" >
                    <v-row v-if="translations[attr.name] != null && translations[attr.name][lang] != null">
                      <img class="pa-1 trans-lang-icon" :src="require(`../../assets/flag/${lang}.png`)" height="30" >
                      <v-text-field filled rounded :key="k+'-trans-'+lang"
                                    v-model="translations[attr.name][lang]"
                                    :placeholder="attr.label+' ('+lang+')'" dense
                                    hide-details class="mb-1 input-text-translate">
                      </v-text-field>
                    </v-row>
                  </v-col>
                </template>
              </v-row>
            </v-card>
          </div>
        </template>

        <template v-if="attr.type == 'textarea'">
          <v-textarea filled :key="k" v-model="attr.value"
                      :label="attr.label" :auto-grow="attr.rows == null"
                      :rows="attr.rows != null ? attr.rows : 4"
                      :placeholder="attr.placeholder"
                      :hide-details="attr.error==null"
                      :error-messages="attr.error"
                      :append-icon="attr.translatable ? 'mdi-flag' : ''"
                      @click:append="toogleTranslation(attr.name)"
                      spellcheck="false">
                      <template v-slot:prepend-inner v-if="attr.translatable">
                          <img class="mr-1" height="20" 
                               :src="require(`../../assets/flag/${$store.state.app.langAvailables[0]}.png`)" >
                        </template>
          </v-textarea>

          <div class="mb-5" :key="k+'trans'">
            <v-card elevation="0" outlined class=""
                    style="margin-top:0px;border-radius:0 0 5px 5px;" 
                    v-if="attr.translatable && showTrans(attr.name)">
              <v-row class="pa-3">
                <template v-for="lang in $store.state.app.langAvailables">
                  <v-col cols="12" :key="k+'-transimg-'+lang"
                         v-if="lang != $store.state.app.langAvailables[0]" class="px-3" >
                    <v-row v-if="translations[attr.name] != null && translations[attr.name][lang] != null">
                      <img class="pa-1 trans-lang-txtarea-icon" :src="require(`../../assets/flag/${lang}.png`)" height="30" >
                      <v-textarea filled :key="k+'-trans-'+lang" spellcheck="false"
                                    v-model="translations[attr.name][lang]" rows="3"
                                    :placeholder="attr.label+' ('+lang+')'" dense
                                    hide-details class="mb-0 input-text-translate txtarea">
                      </v-textarea>
                    </v-row>
                  </v-col>
                </template>
              </v-row>
            </v-card>
          </div>
        </template>

        <template v-if="attr.type == 'select'">
          <v-select :key="k" v-model="attr.value" :items="attr.values" :label="attr.label" :multiple="attr.multiple" filled></v-select>
        </template>

        <template v-if="attr.type == 'switch'">
          <v-switch :key="k" v-model="attr.value" color="admin_secondary" :label="attr.label"></v-switch>
          <v-alert :key="k" v-if="attr.error != null" outlined dense color="red">{{ attr.error }}</v-alert>
        </template>

        <template v-if="attr.type == 'slider'">
          <v-slider :key="k" v-model="attr.value" :max="attr.valueMax" :min="attr.valueMin" 
                    color="admin_secondary" class="mt-4"
                    :label="attr.label" :error-messages="attr.error"
                    thumb-label="always">
          </v-slider>
        </template>

        <template v-if="attr.type == 'range-slider'">
          <v-range-slider :key="k" v-model="attr.value" :max="attr.valueMax" :min="attr.valueMin" 
                    color="admin_secondary" class="mt-4"
                    :label="attr.label" :error-messages="attr.error"
                    thumb-label="always">
          </v-range-slider>
        </template>

        <template v-if="attr.type == 'radio'">
          <v-radio-group :key="k" v-model="attr.value">
            <label>{{ attr.label }}</label>
            <template v-for="(val, v) in attr.values">
              <v-radio :key="v" :label="val.label" :value="val.value"></v-radio>
            </template>
            <v-alert v-if="attr.error != null" outlined dense color="red">{{ attr.error }}</v-alert>
          </v-radio-group>
        </template>

        <template v-if="attr.type == 'file-upload-image'">
          <UploaderImage :key="attr.name" :attr="attr"></UploaderImage>
        </template>
        <template v-if="attr.type == 'file-upload-image-multi'">
          <UploaderImageMulti :key="attr.name" :attr="attr"></UploaderImageMulti>
        </template>
    
        <template v-if="attr.type == 'ENTITY'">
          <v-select :key="k" filled
              v-model="attr.value"
              :items="attr.values"
              :multiple="attr.multiple"
              :item-text="attr.attrLabelKey"
              :item-value="attr.attrValueKey"
              :label="attr.label"
              attach :error-messages="attr.error"
            ></v-select>
        </template>

      </template>
    </template>
  </v-col>
  
  <v-row class="">

    <v-col cols="12" class="px-5" v-if="showJsonFrame && virtualData != null">
      <v-card flat color="" class="ma-1">
        <pre class="col-12">Data: {{ virtualData }}<br>Translation: {{ translations }}</pre>
      </v-card>
    </v-col>

    <!-- <v-col cols="12" class="px-5 py-0 mt-4" v-if="!$store.state.admin.savingEntities">
      <v-alert v-for="(error, e) in $store.state.admin.currentFormErrors" :key="e" color="red lighten-2" dark dense>
        <v-icon small>mdi-alert</v-icon> Erreur : {{ error.message }}
      </v-alert>
      <v-alert dense v-if="$store.state.admin.currentFormErrors.length == 0"></v-alert>
    </v-col> -->
    

    <v-col cols="12" class="py-0">
      <v-app-bar flat color="">

        <v-btn elevation="0" outlined icon small title="récupérer l'état initiale du formulaire"  class="ml-2"
              @click="fetchForm">
          <v-icon small>mdi-refresh</v-icon>
        </v-btn>
        <v-btn elevation="0" small icon outlined class="ml-2" title="prévisualiser les données" 
              @click="showDataPopup">
          <v-icon small>mdi-eye</v-icon>
        </v-btn>

        <template v-if="$store.state.admin.savingEntities">
            <span class="pl-4 blue--text">
              <v-icon small color="blue" class="mdi-spin">mdi-loading</v-icon> 
              <span class="d-none d-md-inline">{{ $store.state.admin.savingMsg }}</span>
            </span>
        </template>

        <v-spacer></v-spacer>

        <v-btn title="quitter sans sauvegarder" elevation="0" class="ml-2" :to="'/admin/'+$route.params.entityType">
          <v-icon class="mr-1" small>mdi-arrow-left-circle</v-icon> <span class="d-none d-sm-inline">Annuler</span>
        </v-btn>

        
        <v-btn color="admin_secondary" elevation="0" dark @click="saveVirtualData(false)" 
              v-if="$route.params.entityId == null"
              title="Enregistrer et créer un autre" class="ml-2">
          <v-icon class="mr-1">mdi-content-save-all</v-icon> 
        </v-btn>      
        <v-btn color="admin_secondary" elevation="0" dark @click="saveVirtualData(false)" v-else
              title="Enregistrer les modifications" class="ml-2">
          <v-icon>mdi-content-save-edit-outline</v-icon> 
        </v-btn>

        <v-btn color="primary" elevation="0" dark @click="saveVirtualData(true)" 
              :loading="$store.getters['admin/savingEntityDone'] == 'loading'" 
              title="Enregistrer et quitter" class="ml-2">
          <v-icon class="mr-1">mdi-content-save-move</v-icon> 
          <span v-if="$route.params.entityId == null" class="d-none d-sm-inline">Enregistrer</span>
          <span v-else class="d-none d-sm-inline">Terminer</span>
        </v-btn>
      </v-app-bar>
    </v-col>
  </v-row>

  <v-dialog v-model="showPopupData" max-width="600">
    <v-card>
      <v-card flat color="">
        <pre class="col-12 pa-3 elevation-0">Data: {{ virtualData }}<br>Translation: {{ translations }}</pre>
      </v-card>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn color="" outlined @click="showPopupData = false" >
          <v-icon small>mdi-check</v-icon> Ok
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</v-card>
</template>

<script>

//import axios from 'axios'

import UploaderImage from '@/components/admin/inputs/UploaderImage.vue'
import UploaderImageMulti from '@/components/admin/inputs/UploaderImageMulti.vue'
import router from '../../router/router'

export default {
  name: 'virtual-form',
  components: { UploaderImage , UploaderImageMulti }, 
  props: [ 'entityType', 'entityId' ],
  data: () => ({
    virtualData: null,
    showJsonFrame: false,
    
    attrImg: null,
    attrImgUrl: null,

    attrImgs: [],
    attrImgUrls: [],

    currentLang: '',
    translations: {},
    showTranslation: {},
    showAllTrans: true,     

    showPopupData: false,
  }),
  async mounted(){
    //récupère la langue utilisée par l'utilisateur
    this.currentLang = localStorage.getItem("VueAppLanguage")
    
    //récupère les données du formulaire
    await this.fetchForm()

    this.$root.$off('fetchForm').$on('fetchForm', () => { 
      this.fetchForm()
    })
    this.$root.$off('langChanged').$on('langChanged', () => { 
      console.log("langChanged VirtualForm")
      this.fetchForm()
    })
  },
  methods: {
    initTranslation(){
      //pour chaque input du formulaire
      this.$store.state.admin.currentForm.forEach((input)=>{
        //si la traduction est activée
        if(input.translatable){
          //pour chaque langue disponible
          this.$store.state.app.langAvailables.forEach((lang)=>{
            //sauf la langue utilisée en front (choisie par l'utilisateur)
            if(lang != this.$store.state.app.langAvailables[0]){
              //si aucune traduction pour cet input
              if(this.translations[input.name] == null) 
                //initialise le tableau
                this.translations[input.name] = {}
              //initialise la translation sur une chaine vide
              this.translations[input.name][lang] = ""
              //construit en même temps le tableau pour afficher/masquer les input de traduction
              //initialisé à true (visibles par défaut)
              this.showTranslation[input.name] = true
            }
          })
        }
        this.$forceUpdate()
      })
        console.log("translations", this.translations, this.showTranslation)
    },
    toogleTranslation(attrName){
      console.log("toogleTranslation", attrName, this.showTranslation, this.showTranslation.length, this.showTranslation[attrName])
      this.showTranslation[attrName] = !this.showTranslation[attrName]
      this.$forceUpdate()
    },
    toogleAllTranslation(){
      this.$store.state.admin.currentForm.forEach((input)=>{
        console.log(input.tranlatable)
        if(input.translatable)
          this.showTranslation[input.name] = this.showAllTrans
        this.$forceUpdate()
      })      
    },
    async fetchForm(){
      //récupère la structure du formulaire, selon le type demandé : entityType
      //et rempli le form avec la donnée si on lui donne un ID : entityId
      await this.$store.dispatch("admin/fetchForm", {
        "entityId"   : this.$route.params.entityId,
        "entityType" : this.$route.params.entityType,
      })
      this.hydrateForm()
        
      //sil n'y a pas d'id : nouvelle donnée > il faut ré-initialiser les traduction
      //sil y a un id, les traductions seront initialisées via le watcher sur admin.currentTranslations
      if(this.$route.params.entityId == null)
        this.initTranslation()
    },
    async createVirtualData(){
      this.virtualData = {}
      this.$store.state.admin.currentForm.forEach(attr => {
        if(this.useInForm(attr) && attr.value != null) 
          this.virtualData[attr.name] = attr.value
      })
    },
    async saveVirtualData(exit){ console.log("exit", exit, this.$store.state.admin.currentFormErrors.length)
      await this.createVirtualData()
      
      let eId = await this.$store.dispatch("admin/saveEntity", {
                        "entityId"   : this.$route.params.entityId,
                        "entityType" : this.$route.params.entityType,
                        "entityData" : this.virtualData,
                        "translations":this.translations,
                })

      await this.$store.dispatch("admin/setCurrentExitAfterSave", exit)

      //s'il n'y a pas d'erreur suite à l'enregistrement de la donnée
      if(this.$store.state.admin.currentFormErrors.length == 0){
        //lance le chargement des images
        this.$root.$emit('startUploadFile', eId)
        this.$root.$emit('startUploadFiles', eId)
        //efface la donnée qui vient d'être enregistré
        this.virtualData = null
        //retourne vers la liste des données (tableau)
        if(this.$store.state.admin.imgFields == 0 && exit) {
          router.push('/admin/'+this.$route.params.entityType)
        } 
        else if (this.$store.state.admin.imgFields == 0 && !exit){
          setTimeout(()=>{
            this.fetchForm() //ou recharge simplement le formulaire
          }, 1000)
        }

        //cas de la création d'une nouvelle donnée, 
        //et exit==false => rester sur le formulaire pour créer une autre donnée du meme type
        if(!exit && this.$route.params.entityId == null){
          this.initTranslation()
          this.$vuetify.goTo(0)
        }
      }
    },
    hydrateForm(){
      if(this.$store.state.admin.currentEntity == null) return
      this.$store.state.admin.currentForm.forEach((attr, i)=>{
        if(this.$store.state.admin.currentEntity[attr.name] != null)
          this.$store.state.admin.currentForm[i].value = this.$store.state.admin.currentEntity[attr.name]
      })
    },

    showDataPopup(){
      this.createVirtualData()
      this.showPopupData = true
    },

    useInForm(attr){
      return     (attr.showInFormCreate == true && this.$route.params.entityId == null) 
              || (attr.showInFormEdit == true && this.$route.params.entityId != null)
    },

    previewImgMulti(){
      this.attrImgUrls = []
      console.log("this.attrImgs", this.attrImgs)
      this.attrImgs.forEach((img, x)=>{
        this.attrImgUrls[x] = URL.createObjectURL(img)
      })
    },
    showTrans(attrName){
      //console.log("showTrans", this.showTranslation[attrName])
      return this.showTranslation[attrName]
    }
  },
  computed: {
    isEntityTranslatable(){ 
      if(this.$store.state.admin.currentForm == null) return false
      let t = false
      this.$store.state.admin.currentForm.forEach((attr)=>{
        if(attr.translatable) t = true 
      })
      return t
    }
  }, //$store.state.admin.currentTranslations

}
</script>
