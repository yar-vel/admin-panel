<script setup lang="ts">
defineModel<number>('page')
defineModel<number>('limit')
defineModel<IResource['id'][]>('selected')
const props = defineProps<{
  rows?: IResource[]
  total?: number
  loading?: boolean
}>()

const { t } = useI18n()
const columns = [
  { title: t('edit'), key: 'edit', width: 50, sortable: false },
  { title: t('id'), key: 'id', width: '10%' },
  { title: t('name'), key: 'name', width: '30%' },
  { title: t('path'), key: 'path', width: '20%' },
  { title: t('description'), key: 'description', width: '60%' },
  { title: t('enabled'), key: 'enabled', width: 150 },
]
const items = computed(() => props.rows?.map(value => ({ ...value, selectable: !value.default })))
</script>

<template>
  <v-data-table-server
    class="full-page-table"
    hover
    item-selectable="selectable"
    show-select
    :page="page"
    :items-per-page="limit"
    :model-value="selected"
    :headers="columns"
    :items="items"
    :items-length="total ?? 25"
    :items-per-page-options="[25, 50, 100]"
    :loading="loading"
    @update:page="page = $event"
    @update:items-per-page="limit = $event"
    @update:model-value="selected = $event"
  >
    <template #item.edit="{ item }">
      <NuxtLink :href="item.default ? undefined : ROUTES.ui.resource(item.id)">
        <v-btn
          color="white"
          :disabled="item.default"
          icon="mdi-pencil"
          size="small"
          variant="text"
        />
      </NuxtLink>
    </template>
    <template #item.enabled="{ item }">
      <v-icon :icon="item.enabled ? 'mdi-check' : 'mdi-close'" />
    </template>
  </v-data-table-server>
</template>
