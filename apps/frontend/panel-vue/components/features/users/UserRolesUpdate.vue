<script setup lang="ts">
import usersApi from '~/components/entities/user/usersApi'

const { user } = defineProps<{
  user: IUser
  roles: IRole[]
}>()

const updatedRoles = ref<IUsersRoles[]>(
  user.roles?.map(role => ({ roleId: role.id, userId: user.id })) ?? [],
)
const { t, locale } = useI18n()
const { status, error, execute } = usersApi.updateRoles({
  id: user.id,
  fields: { items: updatedRoles },
})
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.users._)

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
  <UserRolesForm
    :user="user"
    :roles="roles"
    :disabled="!rights.updating"
    :loading="status === 'pending'"
    @update="(newUserRoles) => {
      updatedRoles = newUserRoles
      execute()
    }"
  />
</template>
