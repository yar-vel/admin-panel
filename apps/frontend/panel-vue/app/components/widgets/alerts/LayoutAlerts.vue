<script setup lang="ts">
const alertsStore = useAlertsStore()
const closedAlerts = ref(new Set<IAlert['id']>())

function handleClose(id: IAlert['id']) {
  closedAlerts.value.add(id)
}

function handleDelete(id: IAlert['id']) {
  if (closedAlerts.value.has(id)) {
    alertsStore.removeAlert(id)
    closedAlerts.value.delete(id)
  }
}
</script>

<template>
  <div class="alerts">
    <v-snackbar
      v-for="alert of alertsStore.alerts"
      :key="alert.id"
      class="alerts__item"
      :color="alert.type"
      contained
      content-class="alerts__content"
      location="bottom right"
      :model-value="!closedAlerts.has(alert.id)"
      multi-line
      :timeout="5000"
    >
      <template #actions>
        <v-btn
          variant="text"
          @click="handleClose(alert.id)"
          @vue:unmounted="handleDelete(alert.id)"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
      {{ alert.text }}
    </v-snackbar>
  </div>
</template>

<style scoped lang="scss">
.alerts {
  position: fixed;
  bottom: 0;
  right: 0;
  max-width: 100%;

  &__item {
    position: relative;
    max-width: 100%;

    :global(.alerts__content) {
      position: relative;
      min-width: unset;
      width: 300px;
    }
  }
}
</style>
