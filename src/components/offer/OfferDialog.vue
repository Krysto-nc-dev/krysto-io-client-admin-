<template>
<div>
  <v-dialog v-model="showDialog" transition="dialog-top-transition"
            max-width="1100" :fullscreen="$vuetify.breakpoint.width < 960"
            content-class="dialog-large-bordered">
    <OfferPage :offer="offer" :inDialog="true"></OfferPage>
  </v-dialog>
</div>
</template>


<script>
import OfferPage from '@/components/offer/OfferPage.vue'

export default {
  name: 'home',
  props: [],
  components: {
    OfferPage
  },
  data: () => ({
    showDialog: false,
    offer: null
  }),
  mounted: async function(){

    this.$root.$off('openDialogOffer').$on('openDialogOffer', (offer) => { 
      this.showDialog = true
      this.offer = offer
      this.amountProposal = offer.amountMony
  
          
      setTimeout(()=>{ 
          if(this.$refs.map != null)
          this.$refs.map.mapObject.invalidateSize();
          //this.showMap = false
        }, 500)
    })

    this.$root.$off('closeDialogOffer').$on('closeDialogOffer', () => { 
      this.showDialog = false
      setTimeout(()=>{ this.offer = null }, 1000)
    })
  },
  methods: {
    
  },
  
}
</script>
