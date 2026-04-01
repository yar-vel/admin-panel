<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import authApi from '~/components/entities/auth/authApi'

const props = defineProps<{
  email: string
}>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const { t, locale } = useI18n()
const code = ref('')
const codeIsValid = (value: string) =>
  value.length > 0 || `${t('codeFromEmail')} (${props.email})`
const { status, error, execute } = authApi.verifyUser({ email: props.email, code })

const errorText = ref<string | null>(null)

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
      errorText.value = t('wrongCode')
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
    emit('close')
    emit('success')
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
