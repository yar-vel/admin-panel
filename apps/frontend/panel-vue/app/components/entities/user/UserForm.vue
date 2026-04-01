<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

const props = defineProps<{
  initialData?: IUser
  createShow?: boolean
  createDisabled?: boolean
  createLoading?: boolean
  updateShow?: boolean
  updateDisabled?: boolean
  updateLoading?: boolean
  deleteShow?: boolean
  deleteDisabled?: boolean
  deleteLoading?: boolean
}>()
const emit = defineEmits<{
  create: [value: TUserCreate]
  update: [value: TUserUpdate]
  delete: []
}>()

const data = reactive<IUser>(props.initialData ?? {
  id: '',
  email: '',
  password: '',
  name: '',
  verified: false,
  enabled: false,
})
const { t } = useI18n()
const emailIsValid = (value: string) =>
  testString(EMAIL_REGEX, value) || t('emailValidationI18N')
const nameIsValid = (value: string) =>
  testString(NAME_REGEX, value) || t('nameValidation')
const passwordIsValid = (value: string) =>
  testString(PASSWORD_REGEX, value) || t('passwordValidation')

async function handleSubmit(event: SubmitEventPromise) {
  const results = await event

  if (!results.valid) {
    return
  }

  if (props.createShow && data.email && data.password) {
    emit('create', {
      email: data.email,
      password: data.password,
      name: data.name,
      enabled: data.enabled,
    })
  }

  if (props.updateShow) {
    emit('update', {
      name: data.name,
      enabled: data.enabled,
    })
  }
}
</script>

<template>
  <FormBase @submit="handleSubmit">
    <FormField
      v-if="createShow"
      :hint="$t('emailValidationI18N')"
      :label="$t('email')"
      :model-value="data.email ?? ''"
      name="email"
      required
      :rules="[emailIsValid]"
      type="email"
      @update:model-value="data.email = $event ?? ''"
    />
    <FormField
      :label="$t('name')"
      :model-value="data.name"
      name="name"
      required
      :rules="[nameIsValid]"
      @update:model-value="data.name = $event ?? ''"
    />
    <FormPassword
      v-if="createShow"
      :hint="$t('passwordValidation')"
      :label="$t('password')"
      :model-value="data.password ?? ''"
      name="password"
      required
      :rules="[passwordIsValid]"
      @update:model-value="data.password = $event ?? ''"
    />
    <FormCheckbox
      :label="$t('enabled')"
      :model-value="data.enabled"
      :disabled="initialData?.roles?.some((role) => role.admin)"
      name="enabled"
      @update:model-value="data.enabled = Boolean($event)"
    />
    <FormButton
      v-if="createShow"
      :disabled="createDisabled"
      :loading="createLoading"
      color="info"
      prepand-icon="mdi-plus"
      type="submit"
    >
      {{ $t('create') }}
    </FormButton>
    <FormButton
      v-if="updateShow"
      :disabled="updateDisabled"
      :loading="updateLoading"
      color="success"
      prepand-icon="mdi-content-save"
      type="submit"
    >
      {{ $t('update') }}
    </FormButton>
    <FormButton
      v-if="deleteShow"
      :disabled="deleteDisabled"
      :loading="deleteLoading"
      color="error"
      prepand-icon="mdi-delete"
      type="button"
      @click="emit('delete')"
    >
      {{ $t('delete') }}
    </FormButton>
  </FormBase>
</template>
