<template>
  <v-col cols="12" sm="10" md="9" lg="7" class="mx-auto mt-5">
    <VirtualForm :entityType="$route.params.entityType" :entityId="$route.params.entityId"/>
  </v-col>
</template>

<style></style>

<script>

//import axios from 'axios'
//import router from '../router/router'
//import core from '../plugins/core.js'

import VirtualForm from '@/components/admin/VirtualForm.vue'

export default {
  name: 'admin-virtual-form',
  components: { VirtualForm },
  data: () => ({
    
  }),
  async mounted(){
    console.log("$route.params.uid", this.$route.params.entityId)
  },
  methods: { 
  },
  computed: {
  }
}
</script>
