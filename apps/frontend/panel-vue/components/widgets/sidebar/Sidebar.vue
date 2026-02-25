<script setup lang="ts">
import { useDisplay } from 'vuetify'

const mainStore = useMainStore()
const { mdAndUp } = useDisplay()
</script>

<template>
  <v-navigation-drawer
    :model-value="mdAndUp ? true : !mainStore.isSideBarOpened"
    :temporary="!mdAndUp"
    :permanent="mdAndUp"
    :rail="mdAndUp ? !mainStore.isSideBarOpened : null"
    @update:model-value="mainStore.toggleSideBar(!mainStore.isSideBarOpened)"
  >
    <v-list
      density="compact"
      nav
    >
      <v-list-item
        :active="false"
        prepend-icon="mdi-shield-account-variant"
        :title="$t('adminPanel')"
        @click="mainStore.toggleSideBar(!mainStore.isSideBarOpened)"
      />
    </v-list>
    <v-divider />
    <SidebarMenu />
  </v-navigation-drawer>
</template>
