import profileApi from '~/components/entities/profile/profileApi'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.client) {
    return
  }

  const accessToken = useCookie('accessToken')
  const refreshToken = useCookie('refreshToken')
  const profileStore = useProfileStore()
  const isAuthRoute
    = to.path === ROUTES.ui.signIn
      || to.path === ROUTES.ui.signInGoogle
      || to.path === ROUTES.ui.signUp
      || to.path === ROUTES.ui.forgotPassword

  if (accessToken.value || refreshToken.value) {
    const { data, execute } = profileApi.getProfile()
    await execute()
    profileStore.setProfile(data.value)
  }

  if (profileStore.profile) {
    if (isAuthRoute) {
      return navigateTo(
        {
          path: to.query.return
            ? decodeURIComponent(String(to.query.return))
            : ROUTES.ui.home,
        },
        { redirectCode: 302 },
      )
    }
  }
  else {
    if (!isAuthRoute) {
      return navigateTo(
        {
          path: ROUTES.ui.signIn,
          query: { return: encodeURIComponent(to.path) },
        },
        { redirectCode: 302 },
      )
    }
  }
})
