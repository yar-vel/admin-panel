<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import profileApi from '~/components/entities/profile/profileApi'

const { t, locale } = useI18n()
const rights = useRights(ROUTES.api.profile._)
const mainStore = useMainStore()
const newData = ref(mainStore.profile)
const updatedValues = ref<TUserUpdate>({})
const nameIsValid = (value = '') =>
  testString(NAME_REGEX, value) || t('nameValidation')
const { status, error, execute } = profileApi.updateProfile(updatedValues)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (!results.valid) {
    return
  }

  if (mainStore.profile && newData.value) {
    updatedValues.value = getUpdatedValues<IUser>(
      mainStore.profile,
      newData.value,
    )

    if (Object.keys(updatedValues.value).length > 0) {
      execute()
    }
    else {
      mainStore.addAlert({ type: 'warning', text: t('nothingToUpdate') })
    }
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
    if (mainStore.profile) {
      mainStore.setProfile({ ...mainStore.profile, ...newData.value })
    }

    mainStore.addAlert({ type: 'success', text: t('success') })
  }
})
</script>

<template>
  <FormBase @submit="submitHandler">
    <FormField
      v-if="mainStore.profile?.googleId"
      disabled
      :label="$t('googleId')"
      :model-value="mainStore.profile.googleId"
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
