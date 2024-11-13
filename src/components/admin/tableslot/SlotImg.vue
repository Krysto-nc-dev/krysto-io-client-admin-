<template>
  <div style="width:100%;text-align:center;">
    <img :src="core.baseUrl() + itemImg" 
          v-if="itemImg != null && itemImg != ''"
          style="max-height:50px;" 
          class="mt-1 img-upload-admin">
  </div>
</template>

<script>
  import core from '../../../plugins/core.js'
  export default {
    name: 'slot-img',
    components: {},
    props: [ 'itemImg' ],
    data: () => ({ core }),
    async mounted(){},
    methods: {},
  }
</script>
