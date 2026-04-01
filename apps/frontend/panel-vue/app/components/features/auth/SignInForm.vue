<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import authApi from '~/components/entities/auth/authApi'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const email = ref('')
const emailIsValid = (value: string) => value.length > 0
const password = ref('')
const passwordIsValid = (value: string) => value.length > 0
const rememberMe = ref(false)
const profileStore = useProfileStore()
const { data, error, execute, status } = authApi.signIn({
  username: email,
  password,
  rememberMe,
})
const errorText = ref<string | null>(null)
const verifyModal = ref(false)

async function handleSubmit(event?: SubmitEventPromise) {
  const results = await event

  if (results && !results.valid) {
    return
  }

  execute()
}

watch(error, () => {
  switch (error.value?.statusCode) {
    case 410:
      errorText.value = t('userDeleted')
      break
    case 403:
      errorText.value = null
      verifyModal.value = true
      break
    case 401:
      errorText.value = t('wrongEmailOrPassword')
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
    profileStore.setProfile(data.value)
    router.push(
      route.query.return
        ? decodeURIComponent(String(route.query.return))
        : ROUTES.ui.home,
    )
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
      :label="$t('email')"
      name="email"
      required
      :rules="[emailIsValid]"
      type="email"
      :disabled="status === 'pending' || Boolean(data)"
    />
    <FormPassword
      v-model="password"
      :label="$t('password')"
      name="password"
      required
      :rules="[passwordIsValid]"
      :disabled="status === 'pending' || Boolean(data)"
    />
    <FormCheckbox
      v-model="rememberMe"
      :label="$t('rememberMe')"
      name="rememberMe"
      :disabled="status === 'pending' || Boolean(data)"
    />
    <FormButton
      block
      color="info"
      :loading="status === 'pending' || Boolean(data)"
      type="submit"
    >
      {{ $t('signIn') }}
    </FormButton>
    <FormLink
      :href="ROUTES.ui.signUp"
      :text="$t('signUpText')"
    />
    <FormLink
      :href="ROUTES.ui.forgotPassword"
      :text="$t('forgotPasswordText')"
    />
    <SignInGoogleLink />
  </FormBase>
  <CustomModal
    v-model="verifyModal"
    :title="$t('verification')"
  >
    <VerifyUserForm
      :email="email"
      @close="verifyModal = false"
      @success="handleSubmit"
    />
  </CustomModal>
</template>
