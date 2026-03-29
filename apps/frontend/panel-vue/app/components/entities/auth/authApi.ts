class AuthApi {
  signUp = (payload: TFetchPayload<TSignUp>) =>
    useAPI<IUser>(ROUTES.api.auth.sighUp, {
      immediate: false,
      watch: false,
      method: 'POST',
      body: payload,
    })

  forgotPassword = (payload: TFetchPayload<IForgotPassword>) =>
    useAPI(ROUTES.api.auth.forgotPassword, {
      immediate: false,
      watch: false,
      method: 'POST',
      body: payload,
    })

  resetPassword = (payload: TFetchPayload<IResetPassword>) =>
    useAPI(ROUTES.api.auth.resetPassword, {
      immediate: false,
      watch: false,
      method: 'POST',
      body: payload,
    })

  verifyUser = (payload: TFetchPayload<IVerifyUser>) =>
    useAPI(ROUTES.api.auth.verifyUser, {
      immediate: false,
      watch: false,
      method: 'POST',
      body: payload,
    })

  signIn = (payload: TFetchPayload<ISignIn>) =>
    useAPI<IUser>(ROUTES.api.auth.signIn, {
      immediate: false,
      watch: false,
      method: 'POST',
      credentials: 'include',
      body: payload,
    })

  signInGoogle = (payload: TFetchPayload<ISignInGoogle>) =>
    useAPI<IUser>(ROUTES.api.auth.signInGoogle, {
      immediate: false,
      watch: false,
      method: 'POST',
      credentials: 'include',
      body: payload,
    })

  signOut = () =>
    useAPI(ROUTES.api.auth.signOut, {
      immediate: false,
      watch: false,
      method: 'DELETE',
      credentials: 'include',
    })
}

const authApi = new AuthApi()
export default authApi
