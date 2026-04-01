<script setup lang="ts">
import resourcesApi from '~/components/entities/resource/resourcesApi'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
})

const { t } = useI18n()

useHead({
  title: t('resource'),
  meta: [
    { name: 'description', content: t('resource') },
  ],
})

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)
const { data, execute } = resourcesApi.getOne(id)

await execute()

if (data.value === null) {
  showError({
    statusCode: 404,
  })
}
</script>

<template>
  <PanelLayout :h1="$t('resource')">
    <ResourceUpdate
      v-if="data"
      :data="data"
      @delete="router.push(ROUTES.ui.resources)"
    />
  </PanelLayout>
</template>
