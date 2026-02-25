class ProfileApi {
  getProfile = () =>
    useAPI<IUser>(ROUTES.api.profile._, {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
    })

  updateProfile = (payload: TFetchPayload<TUserUpdate>) =>
    useAPI(ROUTES.api.profile._, {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: payload,
    })

  updatePassword = (payload: TFetchPayload<IUpdatePassword>) =>
    useAPI(ROUTES.api.profile.updatePassword, {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: payload,
    })

  changeEmailRequest = (payload: TFetchPayload<IChangeEmailRequest>) =>
    useAPI(ROUTES.api.profile.changeEmail, {
      immediate: false,
      watch: false,
      method: 'POST',
      credentials: 'include',
      body: payload,
    })

  changeEmailConfirm = (payload: TFetchPayload<IChangeEmailConfirm>) =>
    useAPI(ROUTES.api.profile.changeEmail, {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: payload,
    })

  getSessions = () =>
    useAPI<TSessionExternal[]>(ROUTES.api.profile.sessions, {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
    })

  deleteSessions = (payload: TFetchPayload<IReqItems<TSessionExternal['id']>>) =>
    useAPI(ROUTES.api.profile.sessions, {
      immediate: false,
      watch: false,
      method: 'DELETE',
      credentials: 'include',
      body: payload,
    })
}

const profileApi = new ProfileApi()
export default profileApi
