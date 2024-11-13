<template>
  <v-list dense :height="$vuetify.breakpoint.height-50" class="pt-5" style="overflow-y:auto; backgground-color:white;">

    <v-subheader>Dashboard</v-subheader>
    <v-list-item-group
      color="primary"
    >
      <v-list-item to="/admin">
          <v-list-item-icon class="mr-1">
              <v-icon>mdi-account-cowboy-hat</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Accueil</v-list-item-title>
          </v-list-item-content>
      </v-list-item>
    </v-list-item-group>

    <v-subheader>Database</v-subheader>
    <v-list-item-group
      color="primary"
    >
      <template v-for="item in $store.state.admin.entityTypesAvailables" >
        <v-list-item :key="item" :to="'/admin/'+item">
            <v-list-item-icon class="mr-1">
                <v-icon>mdi-database</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.toUpperCase() }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
      </template>
    </v-list-item-group>
  </v-list>
</template>