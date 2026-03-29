export const useAppStore = defineStore('app', () => {
  const isSideBarOpened = ref(true)
  function toggleSideBar(value: boolean) {
    isSideBarOpened.value = value
  }

  return {
    isSideBarOpened,
    toggleSideBar,
  }
})
