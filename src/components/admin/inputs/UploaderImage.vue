<template>
  <v-row :key="attr.name" class="text-left">

    <v-col cols="10" sm="10" md="8">
      <v-file-input filled v-model="attrImg" accept="image/*" @change="previewImg()"
                color="admin_secondary" class="py-0 mt-4" ref="fileimg" dense
                :label="attr.label" :error-messages="attr.error"
                :show-size="1000" chips hide-details prepend-icon="" append-icon="mdi-file-image-outline">
      </v-file-input> 
    </v-col>

    <v-col cols="2" sm="2" md="4" class="py-0 text-center" v-if="attrImgUrl != null && attrImgUrl != ''">
      <img :key="attr.type" :src="attrImgUrl" class="img-upload-admin"><br>
      <v-btn x-small fab @click="cancelNewImg()" class="btn-tool-img" title="annuler">
        <v-icon color="darken-3">mdi-close-circle-outline</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="2" sm="2" md="4" class="py-0 text-center" v-else-if="attr.value != null && attr.value != ''">
      <img :key="attr.value" :src="urlImg(attr.value)" class="img-upload-admin"><br>
      <v-btn x-small :loading="loading" fab @click="startDeleteImg(attr)" class="btn-tool-img" title="supprimer l'image">
        <v-icon color="red darken-3">mdi-delete-circle-outline</v-icon>
      </v-btn>
    </v-col>

    <v-dialog v-model="showPopupDelete" v-if="imgToDelete!=null" max-width="600">
      <v-card>
        <v-card-title class="red--text">
          <v-icon color="red" class="mr-2">mdi-delete</v-icon> 
          Supprimer l'image
        </v-card-title>

        <v-card-text class="red--text text--lighten-2">
          Voulez-vous vraiment supprimer cette image ?
        </v-card-text>

        <img :src="urlImg(imgToDelete.value)" class="" width="100%">

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

  </v-row>
</template>


<script>

import axios from 'axios'
const config = require('../../../config/' + process.env.NODE_ENV)

export default {
  name: 'uploader-image',
  components: { }, 
  props: [ 'attr' ],
  data: () => ({
    attrImg: null,
    attrImgUrl: null,

    loading: false,
    showPopupDelete: false,

    imgToDelete: null,
  }),
  async mounted(){
    //reference le champ d'upload dans le store
    //pour pouvoir attendre la fin de l'upload avant de revenir a la page précédente
    await this.$store.dispatch("admin/addImgField", this.attr.name )
    //console.log("startUploadFile-event-alone mounted")
    this.$root.$on('startUploadFile', (entityId) => { 
      //console.log("startUploadFile-event-alone", entityId)
      this.startUploadFile(entityId)
    })
  },
  methods: {
    
    async startUploadFile(entityId){
      //console.log("startUploadFile", this.attrImg)
      if(this.attrImg == null) {
        await this.$store.dispatch("admin/imgUploaded", 
              { attrName: this.attr.name, 
                entityType : this.$route.params.entityType })
        return
      }

      const formData = new FormData();
      formData.append("image", this.attrImg)
      formData.append("attrName", this.attr.name)
      formData.append("entityId", entityId)
      formData.append("entityType", this.$route.params.entityType)

      console.log("axios /admin/upload-file", formData)
      this.loading = true
      this.$store.dispatch('admin/setSavingEntities', { val: true, msg: 'Téléchargement de l\'image "' + this.attr.name + '"' })
      
      //setTimeout(async () => {
        let res = await axios.post('/admin/upload-file', formData)
        this.loading = false

        this.attrImg = null
        this.attrImgUrl = null

        await this.$store.dispatch("admin/imgUploaded", { attrName: this.attr.name, entityType : this.$route.params.entityType})

        console.log("res /admin/upload-file", res.data)
      //}, 1000)
    },

    previewImg(){
      console.log("this.attrImg", this.attrImg)
      if(this.attrImg != null)
      this.attrImgUrl = URL.createObjectURL(this.attrImg);
    },

    startDeleteImg(value){
      this.imgToDelete = value
      this.showPopupDelete = true
    },

    async deleteImg(){
      if(this.$route.params.entityId == null) return
      this.loading = true
      let res = await axios.post('/admin/delete-image', { entityId: this.$route.params.entityId,
                                                          entityType: this.$route.params.entityType,
                                                          attrName: this.imgToDelete.name,
                                                        })
      if(res.data.error == false){
        this.showPopupDelete = false
        this.imgToDelete = null
        this.attrImgUrl = null
        this.attrImg = null
        setTimeout(async () => {
          this.$root.$emit('fetchForm')
          this.loading = false
        }, 1000)
      }else{ this.loading = false }
    },

    cancelNewImg(){
      this.attrImg = null
      this.attrImgUrl = null
    },

    urlImg(url){ return config.root_node.url + ":" + config.root_node.port + "/" + url }
    
  },
}
</script>
