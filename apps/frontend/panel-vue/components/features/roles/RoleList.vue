<script setup lang="ts">
import rolesApi from '~/components/entities/role/rolesApi'

const props = defineProps<{
  initialRows?: IRole[]
  initialMeta?: IResListMeta<IRole>
}>()
const emit = defineEmits<{
  'meta-update': [value: IResListMeta<IRole>]
}>()

const { locale } = useI18n()
const rights = useRights(ROUTES.api.roles._)
const mainStore = useMainStore()
const rows = ref(props.initialRows)
const meta = ref(props.initialMeta)
const reqPage = ref(meta.value?.page)
const reqLimit = ref(meta.value?.limit)
const reqCount = ref(false)
const selectedRows = ref<IRole['id'][]>([])
const {
  data: glData,
  error: glError,
  execute: glExecute,
  status: glStatus,
} = rolesApi.getList({ reqPage, reqLimit, reqCount })
const {
  error: dError,
  execute: dExecute,
  status: dStatus,
} = rolesApi.delete({ items: selectedRows })

watch(
  rows,
  () => {
    if (!rows.value) {
      reqCount.value = true
      glExecute()
      reqCount.value = false
    }
  },
  { immediate: true },
)

watch([reqPage, reqLimit], () => {
  glExecute()
})

watch(glData, () => {
  if (glData.value) {
    rows.value = glData.value.rows

    if (glData.value.meta) {
      meta.value = { ...glData.value.meta, total: glData.value.meta.total ?? meta.value?.total }
      emit('meta-update', meta.value)
    }
  }
})

watch(glError, () => {
  if (glError.value) {
    mainStore.addAlert({
      type: 'error',
      text: getErrorText(glError.value, locale.value),
    })
  }
})

watch(dStatus, () => {
  if (dStatus.value === 'success') {
    reqCount.value = true
    glExecute()
    reqCount.value = false
  }
})

watch(dError, () => {
  if (dError.value) {
    mainStore.addAlert({
      type: 'error',
      text: getErrorText(dError.value, locale.value),
    })
  }
})
</script>

<template>
  <div class="mb-3">
    <NuxtLink :href="rights.creating ? ROUTES.ui.newRole : undefined">
      <v-btn
        class="me-2"
        color="info"
        :disabled="!rights.creating"
        prepend-icon="mdi-plus"
        variant="flat"
      >
        {{ $t('create') }}
      </v-btn>
    </NuxtLink>
    <v-btn
      color="error"
      :disabled="!rights.deleting || selectedRows.length === 0"
      :loading="dStatus === 'pending'"
      prepend-icon="mdi-delete"
      variant="flat"
      @click="dExecute"
    >
      {{ $t('delete') }}
    </v-btn>
  </div>
  <RoleTable
    v-model:page="reqPage"
    v-model:limit="reqLimit"
    v-model:selected="selectedRows"
    :total="meta?.total"
    :loading="glStatus === 'pending' || dStatus === 'pending'"
    :rows="rows"
  />
</template>
