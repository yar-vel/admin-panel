<script setup lang="ts">
defineEmits<{
  close: []
}>()
</script>

<template>
  <FormBase @submit="$emit('close')">
    <FormAlert
      :text="$t('registrationSuccessText')"
      type="success"
    />
    <FormButton
      block
      color="info"
      type="submit"
    >
      {{ $t('signIn') }}
    </FormButton>
  </FormBase>
</template>
