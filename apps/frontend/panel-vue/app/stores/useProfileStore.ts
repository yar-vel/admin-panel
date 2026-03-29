export const useProfileStore = defineStore('profile', () => {
  const profile = ref<IUser | null>(null)
  function setProfile(payload: IUser | null) {
    profile.value = payload
  }

  return {
    profile,
    setProfile,
  }
})
