<script setup lang="ts">
import rolesApi from '~/components/entities/role/rolesApi'
import usersApi from '~/components/entities/user/usersApi'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
})

const { t } = useI18n()

useHead({
  title: t('user'),
  meta: [
    { name: 'description', content: t('user') },
  ],
})

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)
const { data: ugoData, execute: ugoExecute } = usersApi.getOne(id)
const { data: rglData, execute: rglExecute } = rolesApi.getList()

await ugoExecute()

if (ugoData.value === null) {
  showError({
    statusCode: 404,
  })
}

await rglExecute()
</script>

<template>
  <PanelLayout :h1="$t('user')">
    <UserUpdate
      v-if="ugoData"
      :data="ugoData"
      @delete="router.push(ROUTES.ui.users)"
    />
    <v-card-title
      v-if="ugoData && rglData"
      class="px-0 py-3"
    >
      {{ $t('roles') }}
    </v-card-title>
    <UserRolesUpdate
      v-if="ugoData && rglData"
      :user="ugoData"
      :roles="rglData.rows"
    />
  </PanelLayout>
</template>
