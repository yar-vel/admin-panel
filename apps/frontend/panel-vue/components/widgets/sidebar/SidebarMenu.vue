<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const profileRights = useRights(ROUTES.api.profile._)
const usersRights = useRights(ROUTES.api.users._)
const rolesRights = useRights(ROUTES.api.roles._)
const resourcesRights = useRights(ROUTES.api.resources._)

const menu: IMenuItem<string>[] = [{
  title: t('home'),
  icon: 'mdi-home',
  href: ROUTES.ui.home,
}]

if (profileRights.value.reading) {
  menu.push({
    title: t('profile'),
    icon: 'mdi-account-box',
    href: ROUTES.ui.profile,
  })
}

const mainMenu: IMenuItem<string> = {
  title: t('main'),
  icon: 'mdi-widgets',
  childs: [],
}

if (usersRights.value.reading) {
  mainMenu.childs!.push({
    title: t('users'),
    icon: 'mdi-account-group',
    href: ROUTES.ui.users,
  })
}

if (rolesRights.value.reading) {
  mainMenu.childs!.push({
    title: t('roles'),
    icon: 'mdi-account-supervisor-circle',
    href: ROUTES.ui.roles,
  })
}

if (resourcesRights.value.reading) {
  mainMenu.childs!.push({
    title: t('resources'),
    icon: 'mdi-api',
    href: ROUTES.ui.resources,
  })
}

if (mainMenu.childs!.length > 0) {
  menu.push(mainMenu)
}

const opened = computed(() => menu.find(value => checkActiveLink(route.path, { href: value.href, childs: value.childs })))
</script>

<template>
  <v-list
    :aria-label="$t('mainMenu')"
    density="compact"
    nav
    :opened="[opened ? `${opened.title}: ${opened.href}` : '']"
  >
    <SidebarMenuItem
      v-for="item of menu"
      :key="`sbmi:${item.title}:${item.href}`"
      v-bind="item"
    />
  </v-list>
</template>
