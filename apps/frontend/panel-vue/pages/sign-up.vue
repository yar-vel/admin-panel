<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
  name: 'signUp',
  title: 'signUp',
  description: 'signUp',
})
</script>

<template>
  <SignUpForm />
</template>
