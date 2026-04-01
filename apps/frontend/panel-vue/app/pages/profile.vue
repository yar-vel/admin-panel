<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
})

const { t } = useI18n()

useHead({
  title: t('profile'),
  meta: [
    { name: 'description', content: t('profile') },
  ],
})
</script>

<template>
  <PanelLayout :h1="$t('profile')">
    <UpdateProfileForm />
    <v-card-title class="px-0 py-3">
      {{ $t('roles') }}
    </v-card-title>
    <ProfileRoles />
    <v-card-title class="px-0 py-3">
      {{ $t('changeEmail') }}
    </v-card-title>
    <ChangeEmailRequestForm />
    <v-card-title class="px-0 py-3">
      {{ $t('updatePassword') }}
    </v-card-title>
    <UpdatePasswordForm />
    <v-card-title class="px-0 py-3">
      {{ $t('sessions') }}
    </v-card-title>
    <ProfileSessions />
  </PanelLayout>
</template>
