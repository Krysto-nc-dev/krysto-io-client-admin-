<template>
<div>

  <v-row :key="attr.name" class="text-left">
    <v-col cols="12">
      <v-file-input outlined v-model="attrImgs" accept="image/*" @change="previewImg()"
                    color="admin_secondary" class="py-0 mt-4" ref="fileimg" 
                    :label="attr.label" :error-messages="attr.error" multiple
                    :show-size="1000" chips hide-details prepend-icon="" 
                    append-icon="mdi-file-image-outline">
      </v-file-input> 
    </v-col>
  </v-row>

  <v-row class="text-center">
    <!-- images déjà enregistrés et téléchargées -->
    <v-col v-if="parentAttr.value" v-for="(img, i) in parentAttr.value" cols="6" sm="4" md="4" :key="i">
      <v-img :src="urlImg(img)" class="img-upload-public"></v-img>
      <v-btn x-small fab @click="startDeleteImg(attr, i)" class="btn-tool-img">
        <v-icon color="red darken-3">mdi-delete-circle-outline</v-icon>
      </v-btn>
    </v-col>

    <!-- nouvelles images, pas encore enregistrées/téléchargées -->
    <v-col v-for="(img, i) in attrImgs" cols="6" sm="4" md="4" :key="'new'+i">
      <v-img :src="attrImgUrls[i]" class="img-upload-public img-new"></v-img>
      <v-btn :loading="loading" x-small fab @click="cancelNewImg(i)" class="btn-tool-img">
        <v-icon color="dark darken-3">mdi-close-circle-outline</v-icon>
      </v-btn>
    </v-col>
  </v-row>

  <v-dialog v-model="showPopupDelete" v-if="imgToDelete!=null" max-width="600">
    <v-card>
      <v-card-title class="red--text">
        <v-icon color="red" class="mr-2">mdi-delete</v-icon> 
        Supprimer l'image
      </v-card-title>

      <v-card-text class="red--text text--lighten-2">
        Voulez-vous vraiment supprimer cette image ?
      </v-card-text>
      
      <img :src="urlImg(imgToDelete.value[inxToDelete])" class="" width="100%">

      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn color="" text @click="showPopupDelete=false" >
          <v-icon small>mdi-close</v-icon> Annuler
        </v-btn>
        <v-btn color="red" dark @click="deleteImg()" >
          <v-icon small>mdi-delete</v-icon> Oui, supprimer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</div>
</template>


<script>

import axios from 'axios'
const config = require('../../config/' + process.env.NODE_ENV)

export default {
  name: 'uploader-image-multi',
  components: { }, 
  props: [ 'attr', 'entityId' ],
  data: () => ({
    attrImgs: [],
    attrImgUrls: [],

    parentAttr: null,

    loading: false,

    showPopupDelete: false,

    imgToDelete: null,
    inxToDelete: null,
  }),
  async mounted(){
    //await this.$store.dispatch("admin/addImgField", this.attr.name )
    this.parentAttr = this.attr
    this.$root.$off('startUploadFiles').$on('startUploadFiles', (entityId) => { 
      //console.log("startUploadFiles-event-multi", this.attrImgs)
      this.startUploadFiles(entityId)
    })
  },
  methods: {
    
    async startUploadFiles(entityId){
      //console.log("startUploadFiles", this.attrImgs)
      // if(this.attrImgs.length == 0){
      //   await this.$store.dispatch("admin/imgUploaded", { attrName: this.attr.name, entityType : this.$route.params.entityType})
      //   return
      // }

      const formData = new FormData();
      this.attrImgs.forEach(async (img)=>{
        console.log("img", img)
        formData.append("images", img)
      })
      
      //formData.append("attrName", 'gallery')
      formData.append("entityId", entityId)
      //formData.append("entityType", 'offer')

      console.log("axios /admin/upload-file-multi", formData)
      this.loading = true
      //this.$store.dispatch('admin/setSavingEntities', { val: true, msg: 'Téléchargement des images "' + this.attr.name + '"' })
     
      setTimeout(async ()=>{
        let res = await axios.post('/market/upload-file-multi', formData)
        this.loading = false

        this.attrImgs = []
        this.attrImgUrls = []
        
        this.$root.$emit('onImgLoaded')
        console.log("res /market/upload-file-multi", res.data)
      }, 1000)
    },
    previewImg(){
      this.attrImgUrls = []
      this.attrImgs.forEach((img, x)=>{
        this.attrImgUrls[x] = URL.createObjectURL(img)
      })
    },

    urlImg(url){ return config.root_node.url + ":" + config.root_node.port + "/" + url },
    
    cancelNewImg(inx){
      this.attrImgs.splice(inx, 1)
      this.attrImgUrls.splice(inx, 1)
    },

    startDeleteImg(value, inx){
      this.imgToDelete = value
      this.inxToDelete = inx
      this.showPopupDelete = true
    },
    async deleteImg(){
      if(this.entityId == null) return
      let res = await axios.post('/market/delete-image-multi', 
                        { entityId: this.entityId,
                          inx: this.inxToDelete
                        })
      if(res.data.error == false){
        this.showPopupDelete = false
        this.imgToDelete = null
        console.log("parentAttr", this.parentAttr.value)
        this.parentAttr.value.splice(this.inxToDelete, 1)
        this.inxToDelete = null
      }
    }
    
  },
  
  watch: {
    'attr': { immediate: true, 
        async handler () {
          console.log("attr changed", this.attr)
          this.parentAttr = this.attr
        }
    },
  }, 
}
</script>
