<script setup lang="ts">
import resourcesApi from '~/components/entities/resource/resourcesApi'

const emit = defineEmits<{
  create: [value: IResource]
}>()

const { t, locale } = useI18n()
const newData = ref<TResourceCreate>({
  name: '',
  path: '',
  description: '',
  enabled: false,
})
const { data, error, execute, status } = resourcesApi.create(newData)
const alertsStore = useAlertsStore()
const rights = useRights(ROUTES.api.resources._)

watch(data, () => {
  if (data.value) {
    alertsStore.addAlert({ type: 'success', text: t('success') })
    emit('create', data.value)
  }
})

watch(error, () => {
  if (error.value) {
    alertsStore.addAlert({
      type: 'error',
      text: getErrorText(error.value, locale.value),
    })
  }
})
</script>

<template>
  <ResourceForm
    create-show
    :create-disabled="!rights.creating"
    :create-loading="status === 'pending' || Boolean(data)"
    @create="(fields) => {
      newData = fields
      execute()
    }"
  />
</template>
