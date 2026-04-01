<script setup lang="ts">
import resourcesApi from '~/components/entities/resource/resourcesApi'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
})

const { t } = useI18n()

useHead({
  title: t('resources'),
  meta: [
    { name: 'description', content: t('resources') },
  ],
})

const router = useRouter()
const route = useRoute()
const params = resourceReqListSchema.parse({ ...route.query, reqCount: true })
const { data, execute } = resourcesApi.getList(params)

function handleUpdate(newMeta: IResListMeta<IResource>) {
  const newParams = createSearchParams({
    data: resListMetaToReq<IResource>(newMeta),
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
  <PanelLayout :h1="$t('resources')">
    <ResourceList
      :initial-rows="data?.rows"
      :initial-meta="data?.meta"
      @meta-update="handleUpdate($event)"
    />
  </PanelLayout>
</template>
