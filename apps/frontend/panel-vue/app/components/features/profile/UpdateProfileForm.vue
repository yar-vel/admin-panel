<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import profileApi from '~/components/entities/profile/profileApi'

const { t, locale } = useI18n()
const rights = useRights(ROUTES.api.profile._)
const alertsStore = useAlertsStore()
const profileStore = useProfileStore()
const newData = ref(profileStore.profile)
const updatedValues = ref<TUserUpdate>({})
const nameIsValid = (value = '') =>
  testString(NAME_REGEX, value) || t('nameValidation')
const { status, error, execute } = profileApi.updateProfile(updatedValues)

async function handleSubmit(event: SubmitEventPromise) {
  const results = await event

  if (!results.valid) {
    return
  }

  if (profileStore.profile && newData.value) {
    updatedValues.value = getUpdatedValues<IUser>(
      profileStore.profile,
      newData.value,
    )

    if (Object.keys(updatedValues.value).length > 0) {
      execute()
    }
    else {
      alertsStore.addAlert({ type: 'warning', text: t('nothingToUpdate') })
    }
  }
}

watch(error, () => {
  if (!error.value) {
    return
  }

  alertsStore.addAlert({
    type: 'error',
    text: getErrorText(error.value, locale.value),
  })
})

watch(status, () => {
  if (status.value === 'success') {
    if (profileStore.profile) {
      profileStore.setProfile({ ...profileStore.profile, ...newData.value })
    }

    alertsStore.addAlert({ type: 'success', text: t('success') })
  }
})
</script>

<template>
  <FormBase @submit="handleSubmit">
    <FormField
      v-if="profileStore.profile?.googleId"
      disabled
      :label="$t('googleId')"
      :model-value="profileStore.profile.googleId"
      name="googleId"
    />
    <FormField
      :label="$t('name')"
      :model-value="newData?.name ?? ''"
      name="name"
      required
      :rules="[nameIsValid]"
      @update:model-value="newData && (newData = { ...newData, name: $event ?? '' })"
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
