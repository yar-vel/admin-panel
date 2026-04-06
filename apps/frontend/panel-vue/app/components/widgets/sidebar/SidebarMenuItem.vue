<script setup lang="ts">
defineProps<{
  title?: string
  href?: string
  icon?: string
  childs?: IMenuItem<string>[]
}>()
</script>

<template>
  <v-list-group
    v-if="childs?.length"
    :fluid="true"
    :value="`${title}: ${href}`"
  >
    <template #activator="{ props: activatorProps }">
      <v-list-item
        v-bind="activatorProps"
        :prepend-icon="icon"
        :title="title"
      />
    </template>
    <v-divider />
    <SidebarMenuItem
      v-for="child of childs"
      :key="`sbmi:${child.title}:${child.href}`"
      v-bind="child"
    />
  </v-list-group>
  <v-list-item
    v-else
    :to="href"
    :prepend-icon="icon"
    :title="title"
    link
  />
</template>
