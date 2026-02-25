<script setup lang="ts">
import rolesApi from '~/components/entities/role/rolesApi'

const emit = defineEmits<{
  create: [value: IRole]
}>()

const { t, locale } = useI18n()
const newData = ref<TRoleCreate>({
  name: '',
  description: '',
  enabled: false,
})
const { data, error, execute, status } = rolesApi.create(newData)
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.roles._)

watch(data, () => {
  if (data.value) {
    mainStore.addAlert({ type: 'success', text: t('success') })
    emit('create', data.value)
  }
})

watch(error, () => {
  if (error.value) {
    mainStore.addAlert({
      type: 'error',
      text: getErrorText(error.value, locale.value),
    })
  }
})
</script>

<template>
  <RoleForm
    create-show
    :create-disabled="!rights.creating"
    :create-loading="status === 'pending' || Boolean(data)"
    @create="(fields) => {
      newData = fields
      execute()
    }"
  />
</template>
