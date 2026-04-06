<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import authApi from '~/components/entities/auth/authApi'

const { t, locale } = useI18n()
const name = ref('')
const nameIsValid = (value: string) =>
  testString(NAME_REGEX, value) || t('nameValidation')
const email = ref('')
const emailIsValid = (value: string) =>
  testString(EMAIL_REGEX, value) || t('emailValidationI18N')
const password = ref('')
const passwordIsValid = (value: string) =>
  testString(PASSWORD_REGEX, value) || t('passwordValidation')
const { data, error, execute, status } = authApi.signUp({ name, email, password })
const errorText = ref<string | null>(null)
const successModal = ref(false)
const router = useRouter()

async function handleSubmit(event: SubmitEventPromise) {
  const results = await event

  if (!results.valid) {
    return
  }

  execute()
}

function handleSuccess() {
  successModal.value = false
  router.push(ROUTES.ui.signIn)
}

watch(error, () => {
  switch (error.value?.statusCode) {
    case 409:
      errorText.value = t('userAlreadyExist')
      break
    case undefined:
      errorText.value = null
      break
    default:
      errorText.value = getErrorText(error.value, locale.value)
  }
})

watch(data, () => {
  if (data.value) {
    successModal.value = true
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
      v-model="name"
      :hint="$t('nameValidation')"
      :label="$t('name')"
      name="name"
      required
      :rules="[nameIsValid]"
    />
    <FormField
      v-model="email"
      :hint="$t('emailValidationI18N')"
      :label="$t('email')"
      name="email"
      required
      :rules="[emailIsValid]"
      type="email"
    />
    <FormPassword
      v-model="password"
      :hint="$t('passwordValidation')"
      :label="$t('password')"
      name="password"
      required
      :rules="[passwordIsValid]"
    />
    <FormButton
      block
      color="success"
      :loading="status === 'pending'"
      type="submit"
    >
      {{ $t('signUp') }}
    </FormButton>
    <FormLink
      :to="ROUTES.ui.signIn"
      :text="$t('signInText')"
    />
    <FormLink
      :to="ROUTES.ui.forgotPassword"
      :text="$t('forgotPasswordText')"
    />
    <CustomModal
      v-model="successModal"
      :title="$t('registration')"
    >
      <SignUpSuccessForm
        :email="email"
        @close="handleSuccess"
      />
    </CustomModal>
  </FormBase>
</template>
