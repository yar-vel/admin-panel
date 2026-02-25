<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import profileApi from '~/components/entities/profile/profileApi'

const { t, locale } = useI18n()
const rights = useRights(ROUTES.api.profile._)
const mainStore = useMainStore()
const oldPassword = ref('')
const newPassword = ref('')
const passwordIsValid = (value: string) =>
  testString(PASSWORD_REGEX, value) || t('passwordValidation')
const { status, error, execute } = profileApi.updatePassword({
  oldPassword,
  newPassword,
})

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (!results.valid) {
    return
  }

  if (oldPassword.value === newPassword.value) {
    mainStore.addAlert({ type: 'warning', text: t('nothingToUpdate') })
  }
  else {
    execute()
  }
}

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
  <FormBase @submit="submitHandler">
    <FormPassword
      v-model="oldPassword"
      :label="$t('oldPassword')"
      name="old-password"
    />
    <FormPassword
      v-model="newPassword"
      :hint="$t('passwordValidation')"
      :label="$t('newPassword')"
      name="new-password"
      required
      :rules="[passwordIsValid]"
    />
    <FormButton
      color="success"
      :disabled="!rights.updating"
      :loading="status === 'pending'"
      prepand-icon="mdi-content-save"
      type="submit"
    >
      {{ $t('update') }}
    </FormButton>
  </FormBase>
</template>
