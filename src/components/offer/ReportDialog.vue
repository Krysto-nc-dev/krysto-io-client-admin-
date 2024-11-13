<template>
<div>
  <v-dialog v-model="showDialog" transition="dialog-top-transition"
            max-width="600" :fullscreen="$vuetify.breakpoint.width < 960"
            content-class="dialog-large-bordered">
    <v-card v-if="report.offer != null">
      <v-toolbar elevation="0" color="transparent">
        <v-icon small color="red">mdi-chevron-down</v-icon> 
        <span class="red--text">Liste des signalements</span>
        <v-spacer/>
        <v-btn x-small outlined fab class="ml-2"
              @click="$root.$emit('closeDialogReport')">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-col cols="12" class="pt-0">
        <v-card-title class="pt-0 pl-5"><v-icon small>mdi-circle</v-icon> {{ report.offer.title }}</v-card-title>
        <template v-for="(reporter, r) in report.reporters">
          <v-card outlined class="mb-3" :key="r">
            <v-toolbar height="34" elevation="0" color="transparent">
              <v-gravatar height="22" style="border-radius:50%;" class="mr-2"
                            :default-img="'retro'" :email="reporter.userName"/>
              <b class="mr-1">{{ reporter.userName }}</b> -
              <small class="ml-1">
                <time-ago :datetime="reporter.created" :refresh="60" long 
                          :locale="$vuetify.lang.current">
                </time-ago>
              </small>
              <v-spacer/>
              <v-icon small>mdi-flag</v-icon> {{ reporter.flag }}
            </v-toolbar>

            

            <v-card-text class="pt-0 pb-1"><i>{{ reporter.text }}</i></v-card-text>
          </v-card>
        </template>
      </v-col>
    </v-card>
  </v-dialog>
</div>
</template>


<script>
import Gravatar from 'vue-gravatar'
import {TimeAgo} from "vue2-timeago"

export default {
  name: 'home',
  props: [],
  components: {
    'v-gravatar' : Gravatar, TimeAgo
  },
  data: () => ({
    showDialog: false,
    report: {}
  }),
  mounted: async function(){

    this.$root.$off('openDialogReport').$on('openDialogReport', (report) => { 
      this.showDialog = true
      this.report = report
    })

    this.$root.$off('closeDialogReport').$on('closeDialogReport', () => { 
      this.showDialog = false
      setTimeout(()=>{ this.report = null }, 1000)
    })
  },
  methods: {
    
  },
  
}
</script>
