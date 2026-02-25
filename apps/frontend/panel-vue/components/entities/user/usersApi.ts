class UsersApi {
  create = (payload: TFetchPayload<TUserCreate>) =>
    useAPI<IUser>(ROUTES.api.users._, {
      immediate: false,
      watch: false,
      method: 'POST',
      credentials: 'include',
      body: payload,
    })

  getOne = (payload: TFetchPayload<IUser['id']>) =>
    useAPI<IUser>(() => ROUTES.api.users.user(unref(payload)), {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
    })

  getList = (payload?: TFetchPayload<TUserReqList>) =>
    useAPI<TUserResList>(ROUTES.api.users._, {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
      params: payload,
    })

  update = (payload: TFetchPayload<IFetchUpdate<TUserUpdate, IUser['id']>>) =>
    useAPI(() => ROUTES.api.users.user(unref(unref(payload).id)), {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: unref(payload).fields,
    })

  updateRoles = (payload: TFetchPayload<IFetchUpdate<IReqItems<IUsersRoles>, IUser['id']>>) =>
    useAPI(() => ROUTES.api.users.userRoles(unref(unref(payload).id)), {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: unref(payload).fields,
    })

  delete = (payload: TFetchPayload<IReqItems<IUser['id']>>) =>
    useAPI(ROUTES.api.users._, {
      immediate: false,
      watch: false,
      method: 'DELETE',
      credentials: 'include',
      body: payload,
    })
}

const usersApi = new UsersApi()
export default usersApi
