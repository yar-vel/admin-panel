export const useAlertsStore = defineStore('alerts', () => {
  const alerts = ref<IAlert[]>([])
  function addAlert(alert: Omit<IAlert, 'id'>) {
    alerts.value = [...alerts.value, { ...alert, id: crypto.randomUUID() }]
  }
  function removeAlert(id: IAlert['id']) {
    alerts.value = alerts.value.filter(alert => alert.id !== id)
  }

  return {
    alerts,
    addAlert,
    removeAlert,
  }
})
