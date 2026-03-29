<script setup lang="ts">
import { UAParser } from 'ua-parser-js'

import profileApi from '~/components/entities/profile/profileApi'

const props = defineProps<{
  session: TSessionExternal
}>()
const emit = defineEmits<{
  delete: []
}>()

const { t, locale } = useI18n()
const rights = useRights(ROUTES.api.profile._)
const alertsStore = useAlertsStore()
const userAgent = new UAParser(props.session.userAgent).getResult()
const updatedAt = getDateString(props.session.updatedAt)
const { status, error, execute } = profileApi.deleteSessions({ items: [props.session.id] })

function handleSubmit() {
  execute()
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
    alertsStore.addAlert({ type: 'success', text: t('success') })
    emit('delete')
  }
})
</script>

<template>
  <FormBase @submit="handleSubmit">
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
          :disabled="!rights.updating || status === 'pending' || status === 'success' || session.current"
          icon="mdi-delete"
          type="submit"
          variant="text"
        />
      </v-card-actions>
    </v-card>
  </FormBase>
</template>
