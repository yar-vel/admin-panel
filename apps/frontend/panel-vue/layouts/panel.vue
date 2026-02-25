<script setup lang="ts">
import '~/assets/styles.scss'
import authApi from '~/components/entities/auth/authApi'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const title = computed(() => route.meta.title ? t(String(route.meta.title)) : '?')
const description = computed(() => route.meta.description ? t(String(route.meta.description)) : '')
const name = computed(() => route.meta.name ? t(String(route.meta.name)) : '?')
const mainStore = useMainStore()
const loading = ref(false)
const { status, error, execute } = authApi.signOut()

router.beforeEach(() => loading.value = true)
router.afterEach(() => loading.value = false)

watch(
  [status, error],
  () => {
    if (status.value === 'success' || error.value?.statusCode === 401) {
      router.push(ROUTES.ui.signIn)
    }
  },
)
</script>

<template>
  <Head>
    <Title>{{ title }} - {{ $t('adminPanel') }}</Title>
    <Meta
      :content="description"
      name="description"
    />
  </Head>
  <v-card :loading="loading">
    <v-layout class="content">
      <ClientOnly>
        <Sidebar />
      </ClientOnly>
      <v-app-bar
        density="comfortable"
        :flat="true"
      >
        <template #prepend>
          <v-app-bar-nav-icon @click="mainStore.toggleSideBar(!mainStore.isSideBarOpened)" />
        </template>
        <template #append>
          <v-app-bar-nav-icon
            color="error"
            icon="mdi-logout"
            :loading="status === 'pending' || status === 'success'"
            :title="$t('signOut')"
            @click="execute()"
          />
        </template>
      </v-app-bar>
      <v-main class="d-flex flex-column">
        <v-divider class="divider" />
        <v-card-title
          class="px-6 pt-3 pb-6"
          tag="h1"
        >
          {{ name }}
        </v-card-title>
        <v-card-text class="px-6 py-0 d-flex flex-column">
          <slot />
        </v-card-text>
      </v-main>
    </v-layout>
    <LayoutAlerts />
  </v-card>
</template>

<style scoped lang="scss">
.content {
  min-height: 100vh;

  .divider {
    position: fixed;
    width: 100%;
  }
}
</style>
