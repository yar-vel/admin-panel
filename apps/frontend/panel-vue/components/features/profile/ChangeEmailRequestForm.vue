<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import profileApi from '~/components/entities/profile/profileApi'

const { t, locale } = useI18n()
const mainStore = useMainStore()
const email = ref(mainStore.profile?.email || '')
const emailIsValid = (value: string) =>
  value.length > 0 || t('emailValidationI18N')
const { status, error, execute } = profileApi.changeEmailRequest({ newEmail: email })
const confirmModal = ref(false)
const rights = useRights(ROUTES.api.profile._)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (!results.valid) {
    return
  }

  if (email.value === mainStore.profile?.email) {
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
    confirmModal.value = true
  }
})
</script>

<template>
  <FormBase @submit="submitHandler">
    <FormField
      v-model="email"
      :hint="$t('emailValidationI18N')"
      :label="$t('email')"
      name="email"
      required
      :rules="[emailIsValid]"
      type="email"
      :disabled="status === 'pending'"
    />
    <FormButton
      color="success"
      :disabled="!rights.updating"
      :loading="status === 'pending'"
      type="submit"
    >
      {{ $t('change') }}
    </FormButton>
    <CustomModal
      v-model="confirmModal"
      :title="$t('resetPassword')"
    >
      <ChangeEmailConfirmForm
        :email="email"
        @close="confirmModal = false"
      />
    </CustomModal>
  </FormBase>
</template>
