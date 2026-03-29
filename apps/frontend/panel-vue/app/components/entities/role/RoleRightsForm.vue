<script setup lang="ts">
const { role, resources } = defineProps<{
  role: IRole
  resources: IResource[]
  disabled?: boolean
  loading?: boolean
}>()
const emit = defineEmits<{
  update: [value: IRights[]]
}>()

const updatedRights = ref<IRights[]>(role.rights ?? [])

function handleSubmit() {
  emit('update', updatedRights.value)
}

function updateRights(newRights: IRights) {
  const filteredRights = updatedRights.value.filter((value) => {
    if (
      newRights.roleId === value.roleId
      && newRights.resourceId === value.resourceId
    ) {
      return false
    }
    else {
      return true
    }
  })

  if (
    newRights.creating
    || newRights.reading
    || newRights.updating
    || newRights.deleting
  ) {
    filteredRights.push(newRights)
  }

  updatedRights.value = filteredRights
}
</script>

<template>
  <FormBase @submit="handleSubmit">
    <div class="d-flex flex-row">
      <ResourceRights
        v-for="resource of resources"
        :key="resource.id"
        :resource="resource"
        :rights="updatedRights.find((value) => value.resourceId === resource.id)"
        :role-id="role.id"
        @update="updateRights"
      />
    </div>
    <FormButton
      color="success"
      :disabled="disabled"
      :loading="loading"
      prepand-icon="mdi-content-save"
      type="submit"
    >
      {{ $t('update') }}
    </FormButton>
  </FormBase>
</template>
