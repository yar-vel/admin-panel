<script setup lang="ts">
import { useDisplay } from 'vuetify'

const appStore = useAppStore()
const { mdAndUp } = useDisplay()
</script>

<template>
  <v-navigation-drawer
    :model-value="mdAndUp ? true : !appStore.isSideBarOpened"
    :temporary="!mdAndUp"
    :permanent="mdAndUp"
    :rail="mdAndUp ? !appStore.isSideBarOpened : null"
    @update:model-value="appStore.toggleSideBar(!appStore.isSideBarOpened)"
  >
    <v-list
      density="compact"
      nav
    >
      <v-list-item
        :active="false"
        prepend-icon="mdi-shield-account-variant"
        :title="$t('adminPanel')"
        @click="appStore.toggleSideBar(!appStore.isSideBarOpened)"
      />
    </v-list>
    <v-divider />
    <SidebarMenu />
  </v-navigation-drawer>
</template>
