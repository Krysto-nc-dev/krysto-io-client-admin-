<template>
  <v-snackbar
    v-model="$store.state.app.snackbar.show"
    timeout="7000"
    :multi-line="multiLine"
    :color="$store.state.app.snackbar.color"
    dark class="snackbar-notif" left
  >
    <v-icon v-if="$store.state.app.snackbar.icon != null" class="mr-1">
      mdi-{{ $store.state.app.snackbar.icon }}
    </v-icon>

    <span v-html="$store.state.app.snackbar.title"></span><br>
    <small v-html="nl2br($store.state.app.snackbar.text)"></small>

    <template v-slot:action="{ attrs }">
      <v-btn x-small fab outlined v-bind="attrs" v-if="$store.state.app.snackbar.path == null"
            @click="$store.dispatch('app/openSnackbar', { show: false })">
        <v-icon>mdi-check</v-icon>
      </v-btn>
      <v-btn x-small fab outlined v-bind="attrs" v-else @click="goto">
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
  export default {
    data: () => ({
      multiLine: true,
      snackbar: true,
      text: `I'm a multi-line snackbar.`,
    }),
    methods: {
      goto(){
        console.log("goto", this.$store.state.app.snackbar)
        if(this.$store.state.app.snackbar.path != null) {
          this.$router.push(this.$store.state.app.snackbar.path)
          this.$store.dispatch('app/openSnackbar', { show: false })
        }
      },
      nl2br: function(str, is_xhtml){
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'
        let newStr = (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
        return newStr
      },
    },
  }
</script>