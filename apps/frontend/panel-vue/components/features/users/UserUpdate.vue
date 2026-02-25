<script setup lang="ts">
import usersApi from '~/components/entities/user/usersApi'

const props = defineProps<{
  data: IUser
}>()
const emit = defineEmits<{
  delete: []
}>()

const { t, locale } = useI18n()
const rights = useRights(ROUTES.api.users._)
const mainStore = useMainStore()
const cachedData = ref<IUser>(props.data)
const updatedValues = ref<TUserUpdate>({})
const {
  error: uError,
  execute: uExecute,
  status: uStatus,
} = usersApi.update({
  id: props.data.id,
  fields: updatedValues,
})
const {
  error: dError,
  execute: dExecute,
  status: dStatus,
} = usersApi.delete({ items: [props.data.id] })

function updateHandler(fields: TUserUpdate) {
  updatedValues.value = getUpdatedValues<TUserUpdate>(
    cachedData.value,
    fields,
  )

  if (Object.keys(updatedValues.value).length > 0) {
    uExecute()
  }
  else {
    mainStore.addAlert({ type: 'warning', text: t('nothingToUpdate') })
  }
}

watch(uStatus, () => {
  if (uStatus.value === 'success') {
    mainStore.addAlert({ type: 'success', text: t('success') })
    cachedData.value = { ...cachedData.value, ...updatedValues.value }
  }
})

watch(uError, () => {
  if (uError.value) {
    mainStore.addAlert({
      type: 'error',
      text: getErrorText(uError.value, locale.value),
    })
  }
})

watch(dStatus, () => {
  if (dStatus.value === 'success') {
    mainStore.addAlert({ type: 'success', text: t('success') })
    emit('delete')
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
  <UserForm
    update-show
    delete-show
    :initial-data="data"
    :update-disabled="!rights.updating || dStatus === 'pending' || dStatus === 'success'"
    :update-loading="uStatus === 'pending'"
    :delete-disabled="!rights.deleting || dStatus === 'success' || data.roles?.some((role) => role.admin)"
    :delete-loading="dStatus === 'pending'"
    @update="updateHandler($event)"
    @delete="dExecute()"
  />
</template>
