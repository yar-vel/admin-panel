<script setup lang="ts">
import usersApi from '~/components/entities/user/usersApi'

const emit = defineEmits<{
  create: [value: IUser]
}>()

const { t, locale } = useI18n()
const newData = ref<TUserCreate>({
  email: '',
  password: '',
  name: '',
})
const { data, error, execute, status } = usersApi.create(newData)
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.users._)

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
  <UserForm
    create-show
    :create-disabled="!rights.creating"
    :create-loading="status === 'pending' || Boolean(data)"
    @create="(fields) => {
      newData = fields
      execute()
    }"
  />
</template>
