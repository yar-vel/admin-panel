<script setup lang="ts">
import rolesApi from '~/components/entities/role/rolesApi'

const { role, resources } = defineProps<{
  role: IRole
  resources: IResource[]
}>()

const { t, locale } = useI18n()
const rights = useRights(ROUTES.api.roles._)
const mainStore = useMainStore()
const updatedRights = ref<IRights[]>(role.rights ?? [])
const { status, error, execute } = rolesApi.updateRights({
  id: role.id,
  fields: { items: updatedRights },
})

watch(error, () => {
  if (!error.value) {
    return
  }

  mainStore.addAlert({
    type: 'error',
    text: getErrorText(error.value, locale.value),
  })
})

watch(status, () => {
  if (status.value === 'success') {
    mainStore.addAlert({ type: 'success', text: t('success') })
  }
})
</script>

<template>
  <RoleRightsForm
    :role="role"
    :resources="resources"
    :disabled="!rights.updating || role.default"
    :loading="status === 'pending'"
    @update="(newRights) => {
      updatedRights = newRights
      execute()
    }"
  />
</template>
