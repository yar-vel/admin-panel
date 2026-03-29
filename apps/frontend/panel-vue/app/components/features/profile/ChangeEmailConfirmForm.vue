<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import profileApi from '~/components/entities/profile/profileApi'

const props = defineProps<{
  email: string
}>()
const emit = defineEmits<{
  close: []
}>()

const { t, locale } = useI18n()
const alertsStore = useAlertsStore()
const profileStore = useProfileStore()
const code = ref('')
const codeIsValid = (value: string) =>
  value.length > 0 || `${t('codeFromEmail')} (${props.email})`
const { status, error, execute } = profileApi.changeEmailConfirm({ code })
const rights = useRights(ROUTES.api.profile._)

async function handleSubmit(event: SubmitEventPromise) {
  const results = await event

  if (!results.valid) {
    return
  }

  execute()
}

watch(error, () => {
  if (!error.value) {
    return
  }

  switch (error.value.statusCode) {
    case 404:
      alertsStore.addAlert({ type: 'error', text: t('wrongEmailOrCode') })
      break
    default:
      alertsStore.addAlert({
        type: 'error',
        text: getErrorText(error.value, locale.value),
      })
  }
})

watch(status, () => {
  if (status.value === 'success') {
    if (profileStore.profile) {
      profileStore.setProfile({ ...profileStore.profile, email: props.email })
    }

    alertsStore.addAlert({ type: 'success', text: t('success') })
    emit('close')
  }
})
</script>

<template>
  <FormBase @submit="handleSubmit">
    <FormField
      v-model="code"
      :hint="`${$t('codeFromEmail')} (${email})`"
      :label="$t('code')"
      name="code"
      required
      :rules="[codeIsValid]"
    />
    <FormButton
      block
      color="success"
      :disabled="!rights.updating"
      :loading="status === 'pending' || status === 'success'"
      type="submit"
    >
      {{ $t('confirm') }}
    </FormButton>
    <FormButton
      block
      color="error"
      type="button"
      @click="$emit('close')"
    >
      {{ $t('close') }}
    </FormButton>
  </FormBase>
</template>
