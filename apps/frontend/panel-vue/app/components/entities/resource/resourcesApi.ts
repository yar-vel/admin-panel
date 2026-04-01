class ResourcesApi {
  create = (payload: TFetchPayload<TResourceCreate>) =>
    useAPI<IResource>(ROUTES.api.resources._, {
      immediate: false,
      watch: false,
      method: 'POST',
      credentials: 'include',
      body: payload,
    })

  getOne = (payload: TFetchPayload<IResource['id']>) =>
    useAPI<IResource>(() => ROUTES.api.resources.resource(unref(payload)), {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
    })

  getList = (payload?: TFetchPayload<TResourceReqList>) =>
    useAPI<TResourceResList>(ROUTES.api.resources._, {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
      params: payload,
    })

  update = (payload: TFetchPayload<IFetchUpdate<TResourceUpdate, IResource['id']>>) =>
    useAPI(() => ROUTES.api.resources.resource(unref(unref(payload).id)), {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: unref(payload).fields,
    })

  delete = (payload: TFetchPayload<IReqItems<IResource['id']>>) =>
    useAPI(ROUTES.api.resources._, {
      immediate: false,
      watch: false,
      method: 'DELETE',
      credentials: 'include',
      body: payload,
    })
}

const resourcesApi = new ResourcesApi()
export default resourcesApi
