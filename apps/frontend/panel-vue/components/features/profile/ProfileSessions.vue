<script setup lang="ts">
import profileApi from '~/components/entities/profile/profileApi'

const { locale } = useI18n()
const alertsStore = useAlertsStore()
const sessions = ref<TSessionExternal[] | null>(null)
const { data, error, execute, status } = profileApi.getSessions()

watch(data, () => {
  sessions.value = data.value && Array.from(data.value).sort((a, b) => (!a.current && b.current ? 1 : -1))
})

watch(error, () => {
  if (!error.value) {
    return
  }

  alertsStore.addAlert({
    type: 'error',
    text: getErrorText(error.value, locale.value),
  })
})

onMounted(() => {
  execute()
})
</script>

<template>
  <v-skeleton-loader
    v-if="status === 'pending'"
    height="68"
  />
  <SessionForm
    v-for="session of sessions"
    :key="session.id"
    :session="session"
    @delete="
      sessions = sessions?.filter((item) => item.id !== session.id) || null
    "
  />
</template>
