<script setup lang="ts">
import rolesApi from '~/components/entities/role/rolesApi'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
})

const { t } = useI18n()

useHead({
  title: t('roles'),
  meta: [
    { name: 'description', content: t('roles') },
  ],
})

const router = useRouter()
const route = useRoute()
const params = roleReqListSchema.parse({ ...route.query, reqCount: true })
const { data, execute } = rolesApi.getList(params)

function handleUpdate(newMeta: IResListMeta<IRole>) {
  const newParams = createSearchParams({
    data: resListMetaToReq<IRole>(newMeta),
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
  <PanelLayout :h1="$t('roles')">
    <RoleList
      :initial-rows="data?.rows"
      :initial-meta="data?.meta"
      @meta-update="handleUpdate($event)"
    />
  </PanelLayout>
</template>
