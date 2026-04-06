<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import authApi from '~/components/entities/auth/authApi'

const { t, locale } = useI18n()
const email = ref('')
const emailIsValid = (value: string) =>
  value.length > 0 || t('emailValidationI18N')
const { status, error, execute } = authApi.forgotPassword({ email })
const errorText = ref<string | null>(null)
const resetModal = ref(false)

async function handleSubmit(event: SubmitEventPromise) {
  const results = await event

  if (!results.valid) {
    return
  }

  execute()
}

watch(error, () => {
  switch (error.value?.statusCode) {
    case 404:
      errorText.value = t('wrongEmail')
      break
    case undefined:
      errorText.value = null
      break
    default:
      errorText.value = getErrorText(error.value, locale.value)
  }
})

watch(status, () => {
  if (status.value === 'success') {
    resetModal.value = true
  }
})
</script>

<template>
  <FormBase @submit="handleSubmit">
    <FormAlert
      v-if="errorText"
      :text="errorText"
      type="error"
    />
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
      block
      color="success"
      :loading="status === 'pending'"
      type="submit"
    >
      {{ $t('confirm') }}
    </FormButton>
    <FormLink
      :to="ROUTES.ui.signIn"
      :text="$t('signInText')"
    />
    <FormLink
      :to="ROUTES.ui.signUp"
      :text="$t('signUpText')"
    />
    <CustomModal
      v-model="resetModal"
      :title="$t('resetPassword')"
    >
      <ResetPasswordForm
        :email="email"
        @close="resetModal = false"
      />
    </CustomModal>
  </FormBase>
</template>
