<template>
  <v-dialog v-model="$store.state.app.showDialogMailDev" max-width="700">
    <v-card outlined v-if="$store.state.app.dialogMailDev != null">
      <v-toolbar color="transparent" elevation="0">
        <v-icon>mdi-check</v-icon> Email généré
        <v-spacer/>
        <v-btn fab outlined small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-col cols="12">
        <v-card-subtitle class="pb-0"><b>to</b> : {{ $store.state.app.dialogMailDev.to }}</v-card-subtitle>
        <v-card-subtitle><b>objet</b> : {{ $store.state.app.dialogMailDev.subject }}</v-card-subtitle>
        <v-card-text class="px-3 pt-5" style="border:1px solid #AAA" 
                    v-html="$store.state.app.dialogMailDev.html">
        </v-card-text>
      </v-col>
      <v-toolbar color="transparent" elevation="0">
        <v-spacer/>
        <v-btn @click="close()">OK</v-btn>
      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<style></style>

<script>

export default {
  name: 'DialogMailDev',
  props: [],
  components: {  },
  data: () => ({
    
  }),
  async mounted(){
  },
  methods: {
    close(){
      this.$store.dispatch('app/closeDialogMailDev')
      this.$root.$emit('reloadCommandes')
      this.$root.$emit('reloadResa')
    }

  },
  computed: {
    
    
  }
}
</script>
