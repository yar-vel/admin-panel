<script setup lang="ts">
defineModel<number>('page')
defineModel<number>('limit')
defineModel<IUser['id'][]>('selected')
const props = defineProps<{
  rows?: IUser[]
  total?: number
  loading?: boolean
}>()

const { t } = useI18n()
const columns = [
  { title: t('edit'), key: 'edit', width: 50, sortable: false },
  { title: t('id'), key: 'id', width: '10%' },
  { title: t('email'), key: 'email', width: '30%' },
  { title: t('name'), key: 'name', width: '30%' },
  { title: t('roles'), key: 'roles', width: '30%' },
  { title: t('verified'), key: 'verified', width: 150 },
  { title: t('enabled'), key: 'enabled', width: 150 },
]
const items = computed(() => props.rows?.map(value => ({ ...value, selectable: !value.roles?.some(role => role.admin) })))
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
      <NuxtLink :href="ROUTES.ui.user(item.id)">
        <v-btn
          color="white"
          icon="mdi-pencil"
          size="small"
          variant="text"
        />
      </NuxtLink>
    </template>
    <template #item.roles="{ item }">
      {{ item.roles?.map((role: IRole) => role.name).join(', ') }}
    </template>
    <template #item.verified="{ item }">
      <v-icon :icon="item.verified ? 'mdi-check' : 'mdi-close'" />
    </template>
    <template #item.enabled="{ item }">
      <v-icon :icon="item.enabled ? 'mdi-check' : 'mdi-close'" />
    </template>
  </v-data-table-server>
</template>
