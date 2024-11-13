<template>
  <v-col cols="12" sm="12">
    <SimBoard></SimBoard> 
  </v-col>
</template>

<style></style>

<script>

import SimBoard from '@/components/admin/SimBoard.vue'

export default {
  name: 'admin-dashboard',
  components: { SimBoard },
  data: () => ({
  }),
  async mounted(){
  },
  methods: {
  },
  computed: {    
  },
  watch: {
     
  }, 
}
</script>
