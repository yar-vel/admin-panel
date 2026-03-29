<script setup lang="ts">
import usersApi from '~/components/entities/user/usersApi'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
})

const { t } = useI18n()

useHead({
  title: t('users'),
  meta: [
    { name: 'description', content: t('users') },
  ],
})

const router = useRouter()
const route = useRoute()
const params = userReqListSchema.parse({ ...route.query, reqCount: true })
const { data, execute } = usersApi.getList(params)

function handleUpdate(newMeta: IResListMeta<IUser>) {
  const newParams = createSearchParams({
    data: resListMetaToReq<IUser>(newMeta),
    exclude: ['reqCount'],
    searchParams: route.fullPath.split('?')[1],
  })
  router.push('?' + newParams.toString())
}

await execute()

if (data.value === null) {
  showError({
    statusCode: 404,
  })
}
</script>

<template>
  <PanelLayout :h1="$t('users')">
    <UserList
      :initial-rows="data?.rows"
      :initial-meta="data?.meta"
      @meta-update="handleUpdate($event)"
    />
  </PanelLayout>
</template>
