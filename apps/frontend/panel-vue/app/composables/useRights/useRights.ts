const defaultRights = {
  creating: false,
  reading: false,
  updating: false,
  deleting: false,
}

export function useRights(path: string) {
  const route = path.startsWith('/') ? path.slice(1) : path
  const rights = ref(defaultRights)
  const profileStore = useProfileStore()

  watch(
    () => profileStore.profile,
    () => {
      if (profileStore.profile?.roles) {
        const roles = Array.isArray(profileStore.profile.roles)
          ? profileStore.profile.roles
          : [profileStore.profile.roles]

        const newRights = { ...defaultRights }

        for (const role of roles) {
          if (role.admin) {
            newRights.creating = true
            newRights.reading = true
            newRights.updating = true
            newRights.deleting = true
            break
          }

          if (role.rights) {
            for (const right of role.rights) {
              if (right.resource?.path !== route) {
                continue
              }

              newRights.creating = right.creating
              newRights.reading = right.reading
              newRights.updating = right.updating
              newRights.deleting = right.deleting
            }
          }
        }

        if (
          rights.value.creating !== newRights.creating
          || rights.value.reading !== newRights.reading
          || rights.value.updating !== newRights.updating
          || rights.value.deleting !== newRights.deleting
        ) {
          rights.value = newRights
        }
      }
      else {
        rights.value = defaultRights
      }
    },
    { immediate: true },
  )

  return rights
}
