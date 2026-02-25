<script setup lang="ts">
import { UAParser } from 'ua-parser-js'

import authApi from '~/components/entities/auth/authApi'
import profileApi from '~/components/entities/profile/profileApi'

const props = defineProps<{
  session: TSessionExternal
}>()
const emit = defineEmits<{
  delete: []
}>()

const { t, locale } = useI18n()
const router = useRouter()
const rights = useRights(ROUTES.api.profile._)
const mainStore = useMainStore()
const userAgent = new UAParser(props.session.userAgent).getResult()
const updatedAt = getDateString(props.session.updatedAt)
const { status: dsStatus, error: dsError, execute: dsExecute } = profileApi.deleteSessions({ items: [props.session.id] })
const { status: soStatus, error: soError, execute: soExecute } = authApi.signOut()

async function submitHandler() {
  if (props.session.current) {
    soExecute()
  }
  else {
    dsExecute()
  }
}

watch(dsError, () => {
  if (!dsError.value) {
    return
  }

  mainStore.addAlert({
    type: 'error',
    text: getErrorText(dsError.value, locale.value),
  })
})

watch(dsStatus, () => {
  if (dsStatus.value === 'success') {
    mainStore.addAlert({ type: 'success', text: t('success') })
    emit('delete')
  }
})

watch(soError, () => {
  if (!soError.value) {
    return
  }

  if (soError.value.statusCode === 401) {
    router.push(ROUTES.ui.signIn)
  }
  else {
    mainStore.addAlert({
      type: 'error',
      text: getErrorText(soError.value, locale.value),
    })
  }
})

watch(soStatus, () => {
  if (soStatus.value === 'success') {
    router.push(ROUTES.ui.signIn)
  }
})
</script>

<template>
  <FormBase @submit="submitHandler">
    <v-card class="mb-1 d-flex flex-row">
      <v-card-text class="d-flex flex-row align-center">
        <template v-if="userAgent.device.vendor">
          <v-icon
            class="mr-1"
            icon="mdi-cellphone"
          />
          <span class="text-body-2">
            {{ userAgent.device.vendor }}{{ ' ' }} {{ userAgent.device.model
            }}{{ ',' }}&nbsp;
          </span>
        </template>
        <template v-else>
          <v-icon
            class="mr-1"
            icon="mdi-laptop"
          />
          <span class="text-body-2">
            {{ userAgent.os.name }} {{ userAgent.os.version }}{{ ',' }}&nbsp;
          </span>
        </template>
        <span class="text-body-2">
          {{ userAgent.browser.name }} {{ userAgent.browser.version
          }}{{ ',' }}&nbsp;
        </span>
        <span class="text-body-2 opacity-80">
          {{ session.ip }}{{ ',' }}&nbsp;
        </span>
        <span class="text-body-2 opacity-60 mr-2">
          {{ updatedAt }}
        </span>
        <v-chip
          v-if="session.current"
          color="success"
          variant="outlined"
        >
          {{
            $t('current')
          }}
        </v-chip>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          :disabled="!rights.updating || dsStatus === 'pending' || dsStatus === 'success'"
          icon="mdi-delete"
          type="submit"
          variant="text"
        />
      </v-card-actions>
    </v-card>
  </FormBase>
</template>
