<script setup lang="ts">
const { user } = defineProps<{
  user: IUser
  roles: IRole[]
  disabled?: boolean
  loading?: boolean
}>()
const emit = defineEmits<{
  update: [value: IUsersRoles[]]
}>()

const updatedRoles = ref<IUsersRoles[]>(
  user.roles?.map(role => ({ roleId: role.id, userId: user.id })) ?? [],
)

function handleSubmit() {
  emit('update', updatedRoles.value)
}

function setRoles(newRole: IUsersRoles) {
  let find = false

  const filtered = updatedRoles.value.filter((value) => {
    if (newRole.userId === value.userId && newRole.roleId === value.roleId) {
      find = true
      return false
    }
    else {
      return true
    }
  })

  if (!find) {
    filtered.push(newRole)
  }

  updatedRoles.value = filtered
}
</script>

<template>
  <FormBase @submit="handleSubmit">
    <div class="d-flex flex-row">
      <span
        v-for="role of roles"
        :key="role.id"
        class="mr-6"
      >
        <FormCheckbox
          :label="role.name"
          :model-value="updatedRoles.some((value) => value.roleId === role.id)"
          :name="`${role.name}.${role.id}`"
          :disabled="role.admin"
          @update:model-value="setRoles({ roleId: role.id, userId: user.id })"
        />
      </span>
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
