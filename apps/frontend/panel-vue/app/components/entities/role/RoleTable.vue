<script setup lang="ts">
const page = defineModel<number>('page', { default: REQ_LIST_DEFAULT_PAGE })
const limit = defineModel<number>('limit', { default: REQ_LIST_DEFAULT_LIMIT })
const selected = defineModel<IRole['id'][]>('selected', { default: () => [] })

const props = defineProps<{
  rows?: IRole[]
  total?: number
  loading?: boolean
}>()

const { t } = useI18n()
const columns = [
  { title: t('edit'), key: 'edit', width: 50, sortable: false },
  { title: t('id'), key: 'id', width: '10%' },
  { title: t('name'), key: 'name', width: '40%' },
  { title: t('description'), key: 'description', width: '50%' },
  { title: t('enabled'), key: 'enabled', width: 150 },
]
const items = computed(() => props.rows?.map(value => ({ ...value, selectable: !value.default })))
</script>

<template>
  <ClientOnly>
    <v-data-table-server
      v-model:page="page"
      v-model:items-per-page="limit"
      v-model="selected"
      class="full-page-table"
      hover
      item-selectable="selectable"
      show-select
      :headers="columns"
      :items="items"
      :items-length="total ?? items?.length ?? 0"
      :items-per-page-options="[25, 50, 100]"
      :loading="loading"
    >
      <template #item.edit="{ item }">
        <NuxtLink :href="item.default ? undefined : ROUTES.ui.role(item.id)">
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
    <template #fallback>
      <v-skeleton-loader type="table-thead, table-tbody" />
    </template>
  </ClientOnly>
</template>
