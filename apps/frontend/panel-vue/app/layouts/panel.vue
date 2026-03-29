<script setup lang="ts">
import '~/assets/styles.scss'
import authApi from '~/components/entities/auth/authApi'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const loading = ref(false)
const { status, error, execute } = authApi.signOut()

router.beforeEach(() => loading.value = true)
router.afterEach(() => loading.value = false)

watch(
  [status, error],
  () => {
    if (status.value === 'success' || error.value?.statusCode === 401) {
      router.push({ path: ROUTES.ui.signIn, query: { return: encodeURIComponent(route.path) } })
    }
  },
)
</script>

<template>
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
          <v-app-bar-nav-icon @click="appStore.toggleSideBar(!appStore.isSideBarOpened)" />
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
        <slot />
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
