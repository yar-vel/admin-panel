<script setup lang="ts">
import rolesApi from '~/components/entities/role/rolesApi'

const props = defineProps<{
  data: IRole
}>()
const emit = defineEmits<{
  delete: []
}>()

const { t, locale } = useI18n()
const rights = useRights(ROUTES.api.roles._)
const alertsStore = useAlertsStore()
const cachedData = ref<IRole>(props.data)
const updatedValues = ref<TRoleUpdate>({})
const {
  error: uError,
  execute: uExecute,
  status: uStatus,
} = rolesApi.update({
  id: props.data.id,
  fields: updatedValues,
})
const {
  error: dError,
  execute: dExecute,
  status: dStatus,
} = rolesApi.delete({ items: [props.data.id] })

function updateHandler(fields: TRoleUpdate) {
  updatedValues.value = getUpdatedValues<TRoleUpdate>(
    cachedData.value,
    fields,
  )

  if (Object.keys(updatedValues.value).length > 0) {
    uExecute()
  }
  else {
    alertsStore.addAlert({ type: 'warning', text: t('nothingToUpdate') })
  }
}

watch(uStatus, () => {
  if (uStatus.value === 'success') {
    alertsStore.addAlert({ type: 'success', text: t('success') })
    cachedData.value = { ...cachedData.value, ...updatedValues.value }
  }
})

watch(uError, () => {
  if (uError.value) {
    alertsStore.addAlert({
      type: 'error',
      text: getErrorText(uError.value, locale.value),
    })
  }
})

watch(dStatus, () => {
  if (dStatus.value === 'success') {
    alertsStore.addAlert({ type: 'success', text: t('success') })
    emit('delete')
  }
})

watch(dError, () => {
  if (dError.value) {
    alertsStore.addAlert({
      type: 'error',
      text: getErrorText(dError.value, locale.value),
    })
  }
})
</script>

<template>
  <RoleForm
    update-show
    delete-show
    :initial-data="data"
    :update-disabled="!rights.updating || data.default || dStatus === 'pending' || dStatus === 'success'"
    :update-loading="uStatus === 'pending'"
    :delete-disabled="!rights.deleting || dStatus === 'success' || data.default"
    :delete-loading="dStatus === 'pending'"
    @update="updateHandler($event)"
    @delete="dExecute()"
  />
</template>
