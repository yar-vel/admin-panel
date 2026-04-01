class RolesApi {
  create = (payload: TFetchPayload<TRoleCreate>) =>
    useAPI<IRole>(ROUTES.api.roles._, {
      immediate: false,
      watch: false,
      method: 'POST',
      credentials: 'include',
      body: payload,
    })

  getOne = (payload: TFetchPayload<IRole['id']>) =>
    useAPI<IRole>(() => ROUTES.api.roles.role(unref(payload)), {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
    })

  getList = (payload?: TFetchPayload<TRoleReqList>) =>
    useAPI<TRoleResList>(ROUTES.api.roles._, {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
      params: payload,
    })

  update = (payload: TFetchPayload<IFetchUpdate<TRoleUpdate, IRole['id']>>) =>
    useAPI(() => ROUTES.api.roles.role(unref(unref(payload).id)), {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: unref(payload).fields,
    })

  updateRights = (payload: TFetchPayload<IFetchUpdate<IReqItems<IRights>, IRole['id']>>) =>
    useAPI(() => ROUTES.api.roles.roleRights(unref(unref(payload).id)), {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: unref(payload).fields,
    })

  delete = (payload: TFetchPayload<IReqItems<IRole['id']>>) =>
    useAPI(ROUTES.api.roles._, {
      immediate: false,
      watch: false,
      method: 'DELETE',
      credentials: 'include',
      body: payload,
    })
}

const rolesApi = new RolesApi()
export default rolesApi
