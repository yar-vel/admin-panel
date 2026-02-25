export const useMainStore = defineStore('main', () => {
  const isSideBarOpened = ref(true)
  function toggleSideBar(value: boolean) {
    isSideBarOpened.value = value
  }

  const language = ref<TLangList>('en')
  function setLanguage(newLang: TLangList) {
    language.value = newLang
  }

  const alerts = ref<IAlert[]>([])
  const alertCounter = ref(0)
  function addAlert(error: Omit<IAlert, 'id'>) {
    alerts.value = alerts.value.concat({ ...error, id: alertCounter.value++ })
  }
  function deleteAlert(id: number, delay?: number) {
    if (delay) {
      alerts.value = alerts.value.map((alert) => {
        if (alert.id === id) {
          alert.deleted = true
        }

        return alert
      })

      setTimeout(
        () => (alerts.value = alerts.value.filter(alert => alert.id !== id)),
        delay,
      )
    }
    else {
      alerts.value = alerts.value.filter(alert => alert.id !== id)
    }
  }

  const profile = ref<IUser | null>(null)
  function setProfile(payload: IUser | null) {
    profile.value = payload

    if (!payload) {
      alerts.value = []
    }
  }

  return {
    isSideBarOpened,
    toggleSideBar,
    language,
    setLanguage,
    alerts,
    addAlert,
    deleteAlert,
    profile,
    setProfile,
  }
})
