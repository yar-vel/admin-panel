import type { UseFetchOptions } from '#app'

export function useAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const nuxtApp = useNuxtApp()
  const event = useRequestEvent()
  const config = useRuntimeConfig()
  const cookie = useRequestHeader('cookie')
  const userAgent = useRequestHeader('user-agent')
  const baseURL = import.meta.server
    ? config.public.apiHostInternal
    : config.public.apiHostExternal
  const timeout = 5000
  const mainStore = useMainStore()

  return useFetch(url, {
    ...options,
    mode: 'cors',
    baseURL,
    timeout,
    retry: 1,
    retryDelay: 0,
    retryStatusCodes: [401],
    onRequest({ options }) {
      if (import.meta.client) {
        return
      }

      if (cookie) {
        options.headers.set('cookie', cookie)
      }

      if (userAgent) {
        options.headers.set('user-agent', userAgent)
      }
    },
    async onResponseError({ response, options }) {
      if (response.status === 401) {
        try {
          const refresh = await $fetch.raw<boolean>(ROUTES.api.auth.refresh, {
            baseURL,
            method: 'GET',
            headers: options.headers,
            mode: 'cors',
            credentials: 'include',
            timeout,
          })
          const newCookies = refresh.headers.get('set-cookie')

          if (import.meta.server && event && newCookies) {
            newCookies
              .split(', ')
              .map(cookie =>
                event.node.res.appendHeader('set-cookie', cookie),
              )
          }
        }
        catch (error) {
          if (
            error instanceof Object
            && 'statusCode' in error
            && error.statusCode === 401
          ) {
            mainStore.setProfile(null)
          }

          if (
            !nuxtApp._route.path.includes(ROUTES.ui.signUp)
            && !nuxtApp._route.path.includes(ROUTES.ui.signIn)
            && !nuxtApp._route.path.includes(ROUTES.ui.signInGoogle)
            && !nuxtApp._route.path.includes(ROUTES.ui.forgotPassword)
          ) {
            navigateTo(
              {
                path: ROUTES.ui.signIn,
                query: { return: encodeURIComponent(nuxtApp._route.path) },
              },
              { redirectCode: 302 },
            )
          }
        }
      }
    },
  })
}
