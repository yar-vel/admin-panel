<script setup lang="ts">
import authApi from '~/components/entities/auth/authApi'

const { t, locale } = useI18n()
const errorText = ref<string | null>(null)
const hash = new URLSearchParams(location?.hash.slice(1) || '')
const { data, error, execute } = authApi.signInGoogle({ googleAccessToken: hash.get('access_token')! })

const handleMessage = (event: MessageEvent<IWindowMessage<string>>) => {
  if (event.data.type !== ROUTES.ui.signInGoogle || !data.value) {
    return
  }

  if (event.data.payload === hash.get('state')) {
    const message: IWindowMessage<IUser> = {
      type: ROUTES.ui.signInGoogle,
      payload: toRaw(data.value),
    }

    event.source?.postMessage(message)
    window.removeEventListener('message', handleMessage)
  }

  window.close()
}

onMounted(() => {
  if (hash.has('access_token')) {
    execute()
  }
  else {
    errorText.value = t('error')
  }

  window.addEventListener('message', handleMessage)
})

watch(error, () => {
  switch (error.value?.statusCode) {
    case 410:
      errorText.value = t('userDeleted')
      break
    default:
      errorText.value = getErrorText(error.value, locale.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <FormBase>
    <FormAlert
      v-if="errorText"
      :text="errorText"
      type="error"
    />
    <v-card-text
      v-else
      class="text-center py-3"
    >
      {{ $t('loading') }}...
    </v-card-text>
  </formbase>
</template>
